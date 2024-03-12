import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { I18nContext } from 'nestjs-i18n';
import { User } from '@prisma/client';
import { Client } from 'discord.js';
import { UsersUniversityFacultyNumberAlreadyInUseException } from './exceptions/users-university-faculty-number-already-in-use.exception';
import { UsersNoSuchDiscordGuildException } from './exceptions/users-no-such-discord-guild.exception';
import { UsersNoSuchMemberOfDiscordGuildException } from './exceptions/users-no-such-member-of-discord-guild.exception';
import { PrismaService } from '../prisma/prisma.service';
import { UsersCannotInviteSelfException } from './exceptions/users-cannot-invite-self.exception';
import { UsersNotMemberOfTeamException } from './exceptions/users-not-member-of-team.exception';
import { UsersOnlyCaptainCanInviteException } from './exceptions/users-only-captain-can-invite.exception';
import { UsersNoSuchUserException } from './exceptions/users-no-such-user.exception';
import { UsersInviteAlreadyPendingException } from './exceptions/users-invite-already-pending.exception';
import { UsersNoSuchTeamException } from './exceptions/users-no-such-team.exception';
import { UsersNoSuchInviteException } from './exceptions/users-no-such-invite.exception';
import { UsersAlreadyInTeamException } from './exceptions/users-already-in-team.exception';
import { UsersNotInviteeOfInviteException } from './exceptions/users-not-invitee-of-invite.exception';
import { UsersEmailAlreadyInUseException } from './exceptions/users-email-already-in-use.exception';
import { UsersNicknameAlreadyInUseException } from './exceptions/users-nickname-already-in-use.exception';
import { UsersTeamIsFullException } from './exceptions/users-team-is-full.exception';
import { UsersDiscordAccountAlreadyLinkedException } from './exceptions/users-discord-account-already-linked.exception';
import { UserRequestBodyDto } from './dto/user-request-body.dto';
import { libConfig } from '../config/lib.config';
import { UsersNoDiscordAccountLinkedException } from './exceptions/users-no-discord-account-linked.exception';
import { UsersNoSuchDiscordGuildRoleException } from './exceptions/users-no-such-discord-guild-role.exception';
import { UsersPhoneAlreadyInUseException } from './exceptions/users-phone-already-in-use.exception';
import { InjectRedis } from '@songkeys/nestjs-redis';
import Redis from 'ioredis';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService,
    @InjectRedis() private readonly redis: Redis,) {}

  async getById(id: string) {
    // Get user information from the database
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        discord: true,
      },
    });

    // Return null if the user does not exist
    if (!user) {
      return null;
    }

    // Remove the password hash and return the user
    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async getByIdOrThrow(id: string) {
    const user = await this.getById(id);

    if (!user) {
      throw new UsersNoSuchUserException();
    }

    return user;
  }

  async getAllUsers() {
    // Get all users from the database
    return this.prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        nickname: true,
        avatarUrl: true,
        university: true,
        team: true,
      },
    });
  }

  async getByEmail(email: string) {
    // Get user information from the database
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        discord: true,
      },
    });

    // Return null if the user does not exist
    if (!user) {
      return null;
    }

    // Remove the password hash and return the user
    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async getByEmailOrThrow(email: string) {
    const user = await this.getByEmail(email);

    if (!user) {
      throw new UsersNoSuchUserException();
    }

    return user;
  }

  async getByDiscordId(discordId: string) {
    // Get user information from the database
    const user = await this.prisma.user.findFirst({
      where: {
        discord: {
          discordId,
        },
      },
      include: {
        discord: true,
      },
    });

    // Return null if the user does not exist
    if (!user) {
      return null;
    }

    // Remove the password hash and return the user
    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async getByDiscordIdOrThrow(discordId: string) {
    const user = await this.getByDiscordId(discordId);

    if (!user) {
      throw new UsersNoSuchUserException();
    }

    return user;
  }

  async linkDiscordAccount(
    userId: string,
    discordId: string,
    accessToken: string,
    refreshToken: string,
  ) {
    // Validate that the user exists
    const user = await this.getByIdOrThrow(userId);

    // Check if the user already has a discord account linked or the discord account is already linked to another user
    const existingDiscordAccount = await this.prisma.discordAccount.findFirst({
      where: {
        OR: [
          {
            userId: user.id,
          },
          {
            discordId,
          },
        ],
      },
    });

    if (existingDiscordAccount) {
      throw new UsersDiscordAccountAlreadyLinkedException();
    }

    // Create the discord account
    return this.prisma.discordAccount.create({
      data: {
        discordId,
        accessToken,
        refreshToken,
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });
  }

  async joinDiscordServer(
    discordClient: Client,
    userId: string,
    discordGuildId: string,
  ) {
    // Validate that the user exists
    const user = await this.getByIdOrThrow(userId);

    // Validate that the user has a discord account linked
    if (!user.discord) {
      throw new UsersNoDiscordAccountLinkedException();
    }

    // Get the discord user and their access token
    const { accessToken } = user.discord;
    const discordUser = await discordClient.users.fetch(user.discord.discordId);

    // Get the discord guild
    const guild = await discordClient.guilds.fetch(discordGuildId);
    if (!guild) {
      throw new UsersNoSuchDiscordGuildException();
    }

    // Add the user to the guild
    return guild.members.add(discordUser, {
      accessToken,
    });
  }

  async updateDiscordServerNickname(
    discordClient: Client,
    userId: string,
    guildId: string,
  ) {
    // Validate that the user exists
    const user = await this.getByIdOrThrow(userId);

    // Validate that the user has a discord account linked
    if (!user.discord) {
      throw new UsersNoDiscordAccountLinkedException();
    }

    // Get the discord user
    const discordUser = await discordClient.users.fetch(user.discord.discordId);

    // Get the discord guild
    const guild = await discordClient.guilds.fetch(guildId);
    if (!guild) {
      throw new UsersNoSuchDiscordGuildException();
    }

    // Get the discord guild member
    const guildMember = await guild.members.fetch(discordUser);
    if (!guildMember) {
      throw new UsersNoSuchMemberOfDiscordGuildException();
    }

    // Update the nickname
    return guildMember.setNickname(`${user.firstName} ${user.lastName}`);
  }

  async addDiscordServerRoleById(
    discordClient: Client,
    userId: string,
    roleId: string,
    guildId: string,
  ) {
    // Validate that the user exists
    const user = await this.getByIdOrThrow(userId);

    // Validate that the user has a discord account linked
    if (!user.discord) {
      throw new UsersNoDiscordAccountLinkedException();
    }

    // Get the discord guild
    const guild = await discordClient.guilds.fetch(guildId);
    if (!guild) {
      throw new UsersNoSuchDiscordGuildException();
    }

    // Get the discord role
    const role = await guild.roles.fetch(roleId);
    if (!role) {
      throw new UsersNoSuchDiscordGuildRoleException();
    }

    // Get the discord user
    const discordUser = await discordClient.users.fetch(user.discord.discordId);

    // Get the discord guild member
    const guildMember = await guild.members.fetch(discordUser);

    // Add the role to the user
    return guildMember.roles.add(role);
  }

  async removeDiscordServerRoleById(
    discordClient: Client,
    userId: string,
    roleId: string,
    guildId: string,
  ) {
    // Validate that the user exists
    const user = await this.getByIdOrThrow(userId);

    // Validate that the user has a discord account linked
    if (!user.discord) {
      throw new UsersNoDiscordAccountLinkedException();
    }

    // Get the discord guild
    const guild = await discordClient.guilds.fetch(guildId);
    if (!guild) {
      throw new UsersNoSuchDiscordGuildException();
    }

    // Get the discord role
    const role = await guild.roles.fetch(roleId);
    if (!role) {
      throw new UsersNoSuchDiscordGuildRoleException();
    }

    // Get the discord user
    const discordUser = await discordClient.users.fetch(user.discord.discordId);

    // Get the discord guild member
    const guildMember = await guild.members.fetch(discordUser);

    // Remove the role from the user
    return guildMember.roles.remove(role);
  }

  async verifyCredentials(email: string, password: string) {
    // Get user information (with password) from the database
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    // Return false if the user does not exist or the password hash is not set
    if (!user || !user.passwordHash) {
      return false;
    }

    // Validate that the user exists and that the passwords are matching
    return bcrypt.compare(password, user.passwordHash);
  }

  async getUserTeamInvites(user: Omit<User, 'passwordHash'>) {
    // Validate that the user exists
    await this.getByIdOrThrow(user.id);

    // Get all the team invitations for the user
    return this.prisma.teamInvitation.findMany({
      where: {
        userId: user.id,
      },
      include: {
        team: {
          select: {
            id: true,
            name: true,
            capitanId: true,
            members: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                nickname: true,
              },
            },
          },
        },
      },
    });
  }

  async createTeamInvitation(
    inviter: Omit<User, 'passwordHash'>,
    inviteeId: string,
  ) {
    // Check if the inviter is the same as the invitee
    if (inviter.id === inviteeId) {
      throw new UsersCannotInviteSelfException();
    }

    // Check if the inviter is a member of a team
    const inviterTeam = await this.prisma.team.findFirst({
      where: {
        members: { some: { id: inviter.id } },
      },
    });

    if (!inviterTeam) {
      throw new UsersNotMemberOfTeamException();
    }

    // Check if the inviter is the captain of the team
    if (inviterTeam.capitanId !== inviter.id) {
      throw new UsersOnlyCaptainCanInviteException();
    }

    // Check if the invitee exists
    const invitee = await this.prisma.user.findUnique({
      where: {
        id: inviteeId,
      },
    });

    if (!invitee) {
      throw new UsersNoSuchUserException();
    }

    // Check if the invitee is already invited to the team
    const existingInvitation = await this.prisma.teamInvitation.findFirst({
      where: {
        userId: invitee.id,
      },
    });
    if (existingInvitation) {
      throw new UsersInviteAlreadyPendingException();
    }

    // Create the invitation
    return this.prisma.teamInvitation.create({
      data: {
        teamId: inviterTeam.id,
        userId: invitee.id,
      },
    });
  }

  async respondToTeamInvite(
    response: 'ACCEPT' | 'DECLINE',
    inviteId: number,
    user: Omit<User, 'passwordHash'>,
  ) {
    // Validate that the user exists
    await this.getByIdOrThrow(user.id);

    // Validate that the invite exists
    const invite = await this.prisma.teamInvitation.findUnique({
      where: {
        id: inviteId,
      },
    });

    if (!invite) {
      throw new UsersNoSuchInviteException();
    }

    // Validate that the team exists
    const team = await this.prisma.team.findUnique({
      where: {
        id: invite.teamId,
      },
      include: {
        members: true,
      },
    });

    if (!team) {
      throw new UsersNoSuchTeamException();
    }

    // Validate that the user is the invitee of the invite
    if (invite.userId !== user.id) {
      throw new UsersNotInviteeOfInviteException();
    }

    // On accept, validate that the user is not already part of a team
    const existingTeam = await this.prisma.team.findFirst({
      where: {
        members: { some: { id: user.id } },
      },
    });

    if (existingTeam && response === 'ACCEPT') {
      throw new UsersAlreadyInTeamException();
    }

    // Delete the invitation
    await this.prisma.teamInvitation.delete({
      where: {
        id: inviteId,
      },
    });

    // On decline, return early
    const i18n = I18nContext.current();
    if (response === 'DECLINE') {
      return { message: i18n?.t('responses.users.teamInviteDeclined') };
    }

    // Validate that the team is not full
    if (team.members.length >= libConfig.team.members.max) {
      throw new UsersTeamIsFullException();
    }

    // Add the user to the team
    await this.prisma.team.update({
      where: {
        id: team.id,
      },
      data: {
        members: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    // Notify the discord microservice
    await this.redis.publish('teams:team-joined',JSON.stringify(team),);

    return { message: i18n?.t('responses.users.teamInviteAccepted') };
  }

  async registerUser(
    userToBeCreated: UserRequestBodyDto,
    universityProofImages: Array<Express.Multer.File>,
  ) {
    // Check if the email is already in use
    const existingUser = await this.prisma.user.findUnique({
      where: { email: userToBeCreated.email },
    });

    if (existingUser) {
      throw new UsersEmailAlreadyInUseException();
    }

    // Check if nickname is already in use
    const existingNickname = await this.prisma.user.findUnique({
      where: { nickname: userToBeCreated.nickname },
    });

    if (existingNickname) {
      throw new UsersNicknameAlreadyInUseException();
    }

    // Check if the phone number is already in use
    const existingPhone = await this.prisma.user.findUnique({
      where: { phone: userToBeCreated.phone },
    });

    if (existingPhone) {
      throw new UsersPhoneAlreadyInUseException();
    }

    // Check if the university faculty number is already in use
    const existingFacultyNumber = await this.prisma.user.findUnique({
      where: {
        universityFacultyNumber: userToBeCreated.universityFacultyNumber,
      },
    });

    if (existingFacultyNumber) {
      throw new UsersUniversityFacultyNumberAlreadyInUseException();
    }

    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(userToBeCreated.password, 10);

    // Create the user
    const {
      password,
      universityProofImages: unused,
      ...userToBeCreatedWithoutPassword
    } = userToBeCreated;

    const newUser = await this.prisma.user.create({
      data: {
        passwordHash: hashedPassword,
        universityProofImages: {
          create: universityProofImages.map((image) => ({
            url: image.filename,
          })),
        },
        ...userToBeCreatedWithoutPassword,
      },
    });

    // Remove the password hash and return the user
    const { passwordHash, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  async completeOnboarding(user: Omit<User, 'passwordHash'>) {
    // Validate that the user exists
    await this.getByIdOrThrow(user.id);

    // Update the user
    return this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        isOnboardingCompleted: true,
      },
    });
  }

  async updateAvatar(
    user: Omit<User, 'passwordHash'>,
    avatar: Express.Multer.File,
  ) {
    // Validate that the user exists
    await this.getByIdOrThrow(user.id);

    // Update the user avatar
    return this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        avatarUrl: `${libConfig.apiBase}/api/v1/users/avatars/${avatar.filename}`,
      },
    });
  }
}

export default UsersService;
