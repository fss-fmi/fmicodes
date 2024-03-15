import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@songkeys/nestjs-redis';
import Redis from 'ioredis';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MentorsService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectRedis() private readonly redis: Redis,
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

  createAll() {
    return this.prisma.mentor.create({
      data: {
        name: 'Мартин Димитров Несторов',
        pictureUrl: '/assets/images/mentors/Martin_Nestorov.jpg',
        discordId: 'anarcroth#6344',
        company: {
          connect: {
            name: 'ROITI',
          },
        },
        jobTitle: 'Senior Cloud Software Engineer',
        availability: [
          'Събота 10:00 - 13:00',
          'Събота 13:00 - 16:00',
          'Събота 16:00 - 19:00',
          'Неделя 10:00 - 13:00',
          'Неделя 13:00 - 16:00',
        ],
        technologies: {
          connect: [
            {
              name: 'Уеб програмиране',
            },
            {
              name: 'DevOps',
            },
            {
              name: 'Python',
            },
            {
              name: 'Java',
            },
            {
              name: 'JavaScript',
            },
            {
              name: 'TypeScript',
            },
            {
              name: 'Bash',
            },
            {
              name: 'HTML/CSS',
            },
            {
              name: 'React',
            },
            {
              name: 'jQuery',
            },
            {
              name: 'WebSockets',
            },
            {
              name: 'Electron',
            },
            {
              name: 'Node.js',
            },
            {
              name: 'Express',
            },
            {
              name: 'Flask',
            },
            {
              name: 'Spring Boot',
            },
            {
              name: 'REST',
            },
            {
              name: 'JWT',
            },
            {
              name: 'RabbitMQ',
            },
            {
              name: 'Apache Kafka',
            },
            {
              name: 'SQL (MySQL, PostgreSQL, etc.)',
            },
            {
              name: 'NoSQL (MongoDB, Cassandra, etc.)',
            },
            {
              name: 'Redis (Key-Value store)',
            },
            {
              name: 'InfluxDB (Time Series Database)',
            },
            {
              name: 'Grafana',
            },
            {
              name: 'Elasticsearch',
            },
            {
              name: 'Amazon Web Services',
            },
            {
              name: 'Heroku',
            },
            {
              name: 'Git',
            },
            {
              name: 'GitHub',
            },
            {
              name: 'GitLab',
            },
            {
              name: 'Bitbucket',
            },
            {
              name: 'Docker',
            },
            {
              name: 'Kubernetes',
            },
          ],
        },
      },
    });
  }

  async assignTeam(id: number, teamId: number) {
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
