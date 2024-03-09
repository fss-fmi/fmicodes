import { Module } from '@nestjs/common';
import { TeamsService } from '@fmicodes/fmicodes-services//teams/teams.service';
import { UsersService } from '@fmicodes/fmicodes-services/users/users.service';
import { PrismaService } from '@fmicodes/fmicodes-services/prisma/prisma.service';
import { TeamsController } from './teams.controller';

@Module({
  controllers: [TeamsController],
  providers: [TeamsService, UsersService, PrismaService],
})
export class TeamsModule {}
