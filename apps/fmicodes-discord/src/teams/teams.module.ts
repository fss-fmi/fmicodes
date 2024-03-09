import { Module } from '@nestjs/common';
import { DiscordModule } from '@discord-nestjs/core';
import { PrismaService } from '@fmicodes/fmicodes-services/prisma/prisma.service';
import { TeamsService } from '@fmicodes/fmicodes-services//teams/teams.service';
import { UsersService } from '@fmicodes/fmicodes-services/users/users.service';
import { TeamsController } from './teams.controller';

@Module({
  imports: [DiscordModule.forFeature()],
  controllers: [TeamsController],
  providers: [TeamsService, PrismaService, UsersService],
})
export class TeamsModule {}
