import { Module } from '@nestjs/common';
import { PrismaService } from '@fmicodes/fmicodes-services/prisma/prisma.service';
import { MentorsService } from '@fmicodes/fmicodes-services/mentors/mentors.service';
import { UsersService } from '@fmicodes/fmicodes-services/users/users.service';
import { MentorsController } from './mentors.controller';

@Module({
  controllers: [MentorsController],
  providers: [MentorsService, PrismaService, UsersService],
})
export class MentorsModule {}
