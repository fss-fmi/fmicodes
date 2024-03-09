import { Module } from '@nestjs/common';
import { PrismaService } from '@fmicodes/fmicodes-services/prisma/prisma.service';
import { SponsorsService } from '@fmicodes/fmicodes-services/sponsors/sponsors.service';
import { SponsorsController } from './sponsors.controller';

@Module({
  controllers: [SponsorsController],
  providers: [SponsorsService, PrismaService],
})
export class SponsorsModule {}
