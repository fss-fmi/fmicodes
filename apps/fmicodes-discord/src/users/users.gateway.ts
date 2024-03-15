import { Injectable, Logger } from '@nestjs/common';
import { Client, GuildMember } from 'discord.js';
import PrismaService from '@fmicodes/fmicodes-services/prisma/prisma.service';
import { InjectDiscordClient, On } from '@discord-nestjs/core';
import { TeamsService } from '@fmicodes/fmicodes-services/teams/teams.service';
import UsersService from '@fmicodes/fmicodes-services/users/users.service';

@Injectable()
export class UsersGateway {
  private readonly logger = new Logger(UsersGateway.name);

  constructor(
    @InjectDiscordClient()
    private readonly client: Client,
    private readonly prisma: PrismaService,
    private readonly teamsService: TeamsService,
    private readonly usersService: UsersService,
  ) {}

  @On('guildMemberAdd')
  async onGuildMemberAdd(member: GuildMember) {
    console.log(member.user.tag);
    const mentor = await this.prisma.mentor.findFirst({
      where: {
        discordId: member.user.tag,
      },
    });

    const role = await member.guild.roles.fetch('1212836073852375109');

    if (mentor) {
      await member.roles.add(role);
      await member.setNickname(mentor.name);
    }
  }
}
