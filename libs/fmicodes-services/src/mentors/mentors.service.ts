import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@songkeys/nestjs-redis';
import Redis from 'ioredis';
import { User } from '@prisma/client';
import UsersService from '@fmicodes/fmicodes-services/users/users.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MentorsService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectRedis() private readonly redis: Redis,
    private readonly usersService: UsersService,
  ) {}

  getAll() {
    return this.prisma.mentor.findMany({
      select: {
        id: true,
        name: true,
        pictureUrl: true,
        company: true,
        jobTitle: true,
        availability: true,
        technologies: true,
        team: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async assignTeam(user: User, id: number, teamId: number) {
    // Find the mentor and their linked mentors
    const mentor = await this.prisma.mentor.findUnique({
      where: {
        id,
      },
      include: {
        mentorALinks: true,
        mentorBLinks: true,
      },
    });

    if (!mentor) {
      throw new Error('Mentor not found');
    }

    if (mentor.teamId) {
      throw new Error('Mentor already has a team');
    }

    // Get user team mentor by user id
    const userById = await this.usersService.getById(user.id);

    // If user's team has a mentor, throw
    if (!userById) {
      throw Error('How?');
    }
    if (userById.team && userById.team.mentors.length > 0) {
      throw new Error('Team already has a mentor.');
    }

    // Update the mentor's team
    await this.prisma.mentor.update({
      where: {
        id,
      },
      data: {
        team: {
          connect: {
            id: teamId,
          },
        },
      },
    });

    // Update linked mentors' teams
    // TODO: This is disgusting, please refactor
    const updatePromisesAA = mentor.mentorALinks.map(async (linkedMentor) => {
      await this.prisma.mentor.update({
        where: {
          id: linkedMentor.mentorAId,
        },
        data: {
          team: {
            connect: {
              id: teamId,
            },
          },
        },
      });
    });

    const updatePromisesAB = mentor.mentorALinks.map(async (linkedMentor) => {
      await this.prisma.mentor.update({
        where: {
          id: linkedMentor.mentorAId,
        },
        data: {
          team: {
            connect: {
              id: teamId,
            },
          },
        },
      });
    });

    const updatePromisesBA = mentor.mentorBLinks.map(async (linkedMentor) => {
      await this.prisma.mentor.update({
        where: {
          id: linkedMentor.mentorBId,
        },
        data: {
          team: {
            connect: {
              id: teamId,
            },
          },
        },
      });
    });

    const updatePromisesBB = mentor.mentorBLinks.map(async (linkedMentor) => {
      await this.prisma.mentor.update({
        where: {
          id: linkedMentor.mentorBId,
        },
        data: {
          team: {
            connect: {
              id: teamId,
            },
          },
        },
      });
    });

    // Wait for all updates to complete
    await Promise.all([
      ...updatePromisesAA,
      ...updatePromisesAB,
      ...updatePromisesBA,
      ...updatePromisesBB,
    ]);
  }
}
