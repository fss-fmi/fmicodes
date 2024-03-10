import { Injectable } from '@nestjs/common';
import { SponsorType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SponsorsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllFromType(type: SponsorType) {
    return this.prisma.sponsor.findMany({
      where: {
        type,
      },
    });
  }
}

export default SponsorsService;
