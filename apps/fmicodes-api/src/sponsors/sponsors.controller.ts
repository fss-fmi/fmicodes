import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Version,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SponsorsService } from '@fmicodes/fmicodes-services/sponsors/sponsors.service';
import { SponsorResponseBodyDto } from '@fmicodes/fmicodes-services/sponsors/dto/sponsor-response-body.dto';
import { SponsorType } from '@prisma/client';

@Controller('sponsors')
@ApiTags('Sponsors API')
export class SponsorsController {
  constructor(private readonly sponsorsService: SponsorsService) {}

  @Get(':type')
  @Version(['1'])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get all sponsors of a specified type',
    description: 'Endpoint for getting all sponsors of a specified type.',
  })
  @ApiOkResponse({
    description: 'Sponsors retrieved successfully.',
    type: [SponsorResponseBodyDto],
  })
  async get(@Param('type') type: string) {
    return this.sponsorsService.getAllFromType(type as SponsorType);
  }
}
