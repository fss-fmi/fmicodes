import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Version,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MentorsService } from '@fmicodes/fmicodes-services/mentors/mentors.service';
import MentorResponseBodyDto from '@fmicodes/fmicodes-services/mentors/dto/mentor-response-body.dto';

@Controller('mentors')
@ApiTags('Mentors API')
export class MentorsController {
  constructor(private readonly mentorsService: MentorsService) {}

  @Get()
  @Version(['1'])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get all mentors',
    description: 'Endpoint for getting all mentors.',
  })
  @ApiOkResponse({
    description: 'Mentors retrieved successfully.',
    type: [MentorResponseBodyDto],
  })
  async getV1() {
    return this.mentorsService.getAll();
  }

  @Post()
  async createAll() {
    return this.mentorsService.createAll();
  }
}
