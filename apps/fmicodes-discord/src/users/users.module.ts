import { Module } from '@nestjs/common';
import { DiscordModule } from '@discord-nestjs/core';
import { UsersService } from '@fmicodes/fmicodes-services/users/users.service';
import { PrismaService } from '@fmicodes/fmicodes-services/prisma/prisma.service';
import { TeamsService } from '@fmicodes/fmicodes-services//teams/teams.service';
import { UsersController } from './users.controller';
import { UsersGateway } from './users.gateway';

@Module({
  imports: [DiscordModule.forFeature()],
  controllers: [UsersController],
  providers: [UsersService, UsersGateway, PrismaService, TeamsService],
})
export class UsersModule {}
