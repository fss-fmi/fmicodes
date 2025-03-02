import { Controller } from '@nestjs/common';
import { TeamsService } from '@fmicodes/fmicodes-services//teams/teams.service';
import { InjectDiscordClient } from '@discord-nestjs/core';
import { Client } from 'discord.js';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Team } from '@prisma/client';
import { TeamsNoSuchTeamException } from '@fmicodes/fmicodes-services/teams/exceptions/teams-no-such-team.exception';

@Controller()
export class TeamsController {
  constructor(
    @InjectDiscordClient() private readonly discordClient: Client,
    private readonly teamsService: TeamsService,
  ) {}

  @MessagePattern('teams:team-created')
  async handleTeamCreatedEvent(@Payload() createdTeam: Team) {
    // Get the first guild
    const guild = await this.discordClient.guilds.cache.first();
    // Create the team category and channels
    const category = await this.teamsService.createDiscordCategoryForTeam(
      guild,
      createdTeam.name,
    );

    const role = await this.teamsService.createDiscordRoleForTeam(
      createdTeam.name,
      guild,
      category,
    );

    await this.teamsService.createDiscordTeamChannels(
      createdTeam.name,
      guild,
      category,
    );

    await this.teamsService.assignRoleToMember(
      this.discordClient,
      createdTeam.capitanId,
      guild,
      role,
    );
  }

  @MessagePattern('teams:team-joined')
  async handleTeamJoinEvent(team: Team) {
    // Validate that the team exists
    const existingTeam = await this.teamsService.getByIdOrThrow(team.id);

    if (!existingTeam) {
      throw new TeamsNoSuchTeamException();
    }

    const guild = await this.discordClient.guilds.cache.first();
    const role = await this.teamsService.getDiscordRoleForTeam(
      guild,
      team.name,
    );

    // For all members of the team, check if they have the discord role, and if not, assign it to them
    for (const member of existingTeam.members) {
      const discordUser = await this.discordClient.users.fetch(member.id);
      const discordMember = await guild.members.fetch(discordUser);
      const hasRole = discordMember.roles.cache.some((r) => r.id === role.id);

      if (!hasRole) {
        await discordMember.roles.add(role);
      }
    }
  }
}
