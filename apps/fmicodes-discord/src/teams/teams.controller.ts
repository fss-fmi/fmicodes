import { Controller } from '@nestjs/common';
import { TeamsService } from '@fmicodes/fmicodes-services//teams/teams.service';
import { InjectDiscordClient } from '@discord-nestjs/core';
import { Client } from 'discord.js';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Team } from '@prisma/client';

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
}
