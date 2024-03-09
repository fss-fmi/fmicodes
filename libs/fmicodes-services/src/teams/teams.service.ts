import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { User } from '@prisma/client';
import Redis from 'ioredis';
import { InjectRedis } from '@songkeys/nestjs-redis';
import { CategoryChannel, ChannelType, Client, Guild, Role } from 'discord.js';
import { TeamsUserNotInTeamException } from './exceptions/teams-user-not-in-team.exception';
import { TeamsCaptainCanNotLeaveException } from './exceptions/teams-captain-can-not-leave.exception';
import { UsersNoDiscordAccountLinkedException } from '../users/exceptions/users-no-discord-account-linked.exception';
import { TeamsBaseDto } from './dto/teams-base.dto';
import { PrismaService } from '../prisma/prisma.service';
import { TeamsNameAlreadyExistsException } from './exceptions/teams-name-already-exists.exception';
import { TeamsAlreadyInTeamException } from './exceptions/teams-already-in-team.exception';
import { UsersService } from '../users/users.service';
import { TeamsNoSuchTeamException } from './exceptions/teams-no-such-team.exception';
import { TeamsAlreadyRequestedToJoinTeamException } from './exceptions/teams-already-requested-to-join-team.exception';
import { TeamsNotCapitanException } from './exceptions/teams-not-capitan.exception';
import { TeamsNoSuchJoinRequestException } from './exceptions/teams-no-such-join-request.exception';
import { TeamsTeamIsFullException } from './exceptions/teams-team-is-full.exception';
import { libConfig } from '../config/lib.config';
import { TeamsNoSuchDiscordGuildRoleException } from './exceptions/teams-no-discord-guild-role.exception';

@Injectable()
export class TeamsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async getById(id: number) {
    return this.prisma.team.findUnique({
      where: {
        id,
      },
      include: {
        members: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            nickname: true,
            avatarUrl: true,
          },
        },
      },
    });
  }

  async getByIdOrThrow(id: number) {
    const team = await this.getById(id);

    if (!team) {
      throw new TeamsNoSuchTeamException();
    }

    return team;
  }

  getAll() {
    return this.prisma.team.findMany({
      include: {
        members: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            nickname: true,
            avatarUrl: true,
          },
        },
      },
    });
  }

  async create(createTeamDto: TeamsBaseDto, capitanId: string) {
    // Check if team name is already taken
    const teamNameExists = await this.prisma.team.findFirst({
      where: {
        name: createTeamDto.name,
      },
    });

    if (teamNameExists) {
      throw new TeamsNameAlreadyExistsException();
    }

    // Check if user is already in a team
    const teamsCaptainIsPartOf = await this.prisma.team.findMany({
      where: {
        OR: [{ capitanId }, { members: { some: { id: capitanId } } }],
      },
    });

    if (teamsCaptainIsPartOf.length > 0) {
      throw new TeamsAlreadyInTeamException();
    }

    // Create the team
    const createdTeam = await this.prisma.team.create({
      data: {
        name: createTeamDto.name,
        color: createTeamDto.color,
        capitanId,
        members: {
          connect: {
            id: capitanId,
          },
        },
      },
    });

    await this.redis.publish('teams:team-created', JSON.stringify(createdTeam));

    return createdTeam;
  }

  async getInvitationsSent(teamId: number, user: Omit<User, 'passwordHash'>) {
    // Validate that the user exists
    await this.usersService.getByIdOrThrow(user.id);

    // Validate that the team exists/the user is the captain of the team
    const team = await this.getByIdOrThrow(teamId);

    if (team.capitanId !== user.id) {
      throw new TeamsNotCapitanException();
    }

    // Get the invitations
    return this.prisma.teamInvitation.findMany({
      where: {
        teamId,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            nickname: true,
          },
        },
      },
    });
  }

  async getJoinRequests(teamId: number, user: Omit<User, 'passwordHash'>) {
    // Validate that the user exists
    await this.usersService.getByIdOrThrow(user.id);

    // Validate that the team exists/the user is the captain of the team
    const team = await this.getByIdOrThrow(teamId);

    if (team.capitanId !== user.id) {
      throw new TeamsNotCapitanException();
    }

    // Get the requests
    return this.prisma.teamRequest.findMany({
      where: {
        teamId,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            nickname: true,
          },
        },
      },
    });
  }

  async createJoinRequest(teamId: number, user: Omit<User, 'passwordHash'>) {
    // Validate that the user exists
    await this.usersService.getByIdOrThrow(user.id);

    // Validate that the team exists
    await this.getByIdOrThrow(teamId);

    // Validate that the user is not already a part of the team
    const existingTeam = await this.prisma.team.findFirst({
      where: {
        members: { some: { id: user.id } },
      },
    });

    if (existingTeam) {
      throw new TeamsAlreadyInTeamException();
    }

    // Validate that the user does not already have a pending request
    const existingRequest = await this.prisma.teamRequest.findFirst({
      where: {
        userId: user.id,
      },
    });

    if (existingRequest) {
      throw new TeamsAlreadyRequestedToJoinTeamException();
    }

    // Create the request
    return this.prisma.teamRequest.create({
      data: {
        teamId,
        userId: user.id,
      },
    });
  }

  async respondToJoinRequest(
    response: 'ACCEPT' | 'DECLINE',
    teamId: number,
    requestId: number,
    user: Omit<User, 'passwordHash'>,
  ) {
    // Validate that the user exists
    await this.usersService.getByIdOrThrow(user.id);

    // Validate that the team exists
    const team = await this.getByIdOrThrow(teamId);

    // Validate that the user is the captain of the team
    if (team.capitanId !== user.id) {
      throw new TeamsNotCapitanException();
    }

    // Validate that the request exists/request is for the specified team
    const request = await this.prisma.teamRequest.findFirst({
      where: {
        id: requestId,
      },
    });

    if (!request || request.teamId !== teamId) {
      throw new TeamsNoSuchJoinRequestException();
    }

    // Validate that the requesting user exists
    const requestUser = await this.usersService.getByIdOrThrow(request.userId);

    // On accept, validate that the user is not already a part of the team
    if (response === 'ACCEPT') {
      const existingTeam = await this.prisma.team.findFirst({
        where: {
          members: { some: { id: request.userId } },
        },
      });

      if (existingTeam) {
        throw new TeamsAlreadyInTeamException();
      }
    }

    // Delete the request
    await this.prisma.teamRequest.delete({
      where: {
        id: requestId,
      },
    });

    // On decline, return early
    const i18n = I18nContext.current();
    if (response === 'DECLINE') {
      return { message: i18n?.t('responses.teams.joinRequestDeclined') };
    }

    // Validate that the team is not full
    if (team.members.length >= libConfig.team.members.max) {
      throw new TeamsTeamIsFullException();
    }

    // Add the user to the team
    await this.prisma.team.update({
      where: {
        id: teamId,
      },
      data: {
        members: {
          connect: {
            id: requestUser.id,
          },
        },
      },
    });

    return { message: i18n?.t('responses.teams.joinRequestAccepted') };
  }

  async createDiscordRoleForTeam(
    teamName: string,
    guild: Guild,
    category: CategoryChannel,
  ) {
    // Create a role for the team
    const newRole = await guild.roles.create({
      name: `🐔 Отбор ${teamName} 🐔`,
      color: 'Orange',
    });

    // Find the @everyone role
    const everyone = guild.roles.cache.find(
      (role) => role.name === '@everyone',
    );

    if (!everyone) {
      throw new TeamsNoSuchDiscordGuildRoleException();
    }

    // Set for @everyone role to not be able to view the category
    await category.permissionOverwrites.create(everyone, {
      ViewChannel: false,
    });

    // Set the new role to be able to view the category
    await category.permissionOverwrites.create(newRole, {
      ViewChannel: true,
    });

    return newRole;
  }

  async createDiscordCategoryForTeam(guild: Guild, teamName: string) {
    // Create a category for the team
    return guild.channels.create({
      name: `🐔 Отбор ${teamName} 🐔`,
      type: ChannelType.GuildCategory,
    });
  }

  async createDiscordTeamChannels(
    name: string,
    guild: Guild,
    category: CategoryChannel,
  ) {
    // Create a text channel for the team
    const textChannel = await guild.channels.create({
      name: `💬︱Отбор-${name}`,
      type: ChannelType.GuildText,
      parent: category,
    });

    // Send a welcome message to the text channel
    await textChannel.send(
      `Welcome to the ${name} team! Please make sure to read the rules and have fun!`,
    );

    // Create a voice channel for the team
    await guild.channels.create({
      name: `🔊︱Отбор-${name}`,
      type: ChannelType.GuildVoice,
      parent: category,
    });
  }

  async assignRoleToMember(
    discordClient: Client,
    memberId: string,
    guild: Guild,
    role: Role,
  ) {
    // Validate that the user exists
    const user = await this.usersService.getByIdOrThrow(memberId);

    // Validate that the user has a discord account linked
    if (!user.discord) {
      throw new UsersNoDiscordAccountLinkedException();
    }

    // Get the discord user
    const discordUser = await discordClient.users.fetch(user.discord.discordId);

    // Get the discord guild member
    const guildMember = await guild.members.fetch(discordUser);

    // Add the role to the user
    return guildMember.roles.add(role);
  }

  async removeRoleFromMember(
    discordClient: Client,
    memberId: string,
    guild: Guild,
    role: Role,
  ) {
    // Validate that the user exists
    const user = await this.usersService.getByIdOrThrow(memberId);

    // Validate that the user has a discord account linked
    if (!user.discord) {
      throw new UsersNoDiscordAccountLinkedException();
    }

    // Get the discord user
    const discordUser = await discordClient.users.fetch(user.discord.discordId);

    // Get the discord guild member
    const guildMember = await guild.members.fetch(discordUser);

    // Add the role to the user
    return guildMember.roles.remove(role);
  }

  async removeMember(
    teamId: number,
    userId: string,
    user: Omit<User, 'passwordHash'>,
  ) {
    // Validate that the user exists
    await this.usersService.getByIdOrThrow(user.id);

    // Validate that the team exists
    const team = await this.getByIdOrThrow(teamId);

    // Validate that the user exists
    const userToRemove = await this.usersService.getByIdOrThrow(userId);

    // Validate that the user is part of the team
    const userIsPartOfTeam = team.members.some(
      (member) => member.id === userId,
    );
    if (!userIsPartOfTeam) {
      throw new TeamsUserNotInTeamException();
    }

    // Validate that the user is the captain of the team, or they are removing themselves
    if (team.capitanId !== user.id && userId !== user.id) {
      throw new TeamsCaptainCanNotLeaveException();
    }

    // Validate that the capitan is not removing themselves if there are other members
    if (
      team.capitanId === user.id &&
      userId === user.id &&
      team.members.length > 1
    ) {
      throw new TeamsNotCapitanException(); // TODO: Replace with proper exception
    }

    // Notify the discord microservice
    await this.redis.publish(
      'users:team_left',
      JSON.stringify({ discordAccount: userToRemove.discord?.discordId }),
    );

    // Remove the team if the capitan is leaving
    if (team.members.length === 1) {
      // Remove the team
      return this.prisma.team.delete({
        where: {
          id: teamId,
        },
      });
    }

    // Otherwise, only remove the user from the team
    return this.prisma.team.update({
      where: {
        id: teamId,
      },
      data: {
        members: {
          disconnect: {
            id: userId,
          },
        },
      },
    });
  }
}
