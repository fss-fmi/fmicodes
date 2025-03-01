import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
  Version,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { MentorsService } from '@fmicodes/fmicodes-services/mentors/mentors.service';
import MentorResponseBodyDto from '@fmicodes/fmicodes-services/mentors/dto/mentor-response-body.dto';
import { User } from '@prisma/client';
import JwtAuthGuard from '@fmicodes/fmicodes-services/auth/guards/jwt-auth.guard';
import { UserAuth } from '../users/user-auth.decorator';

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
  async get() {
    return this.mentorsService.getAll();
  }

  @Patch(':id/assign-team/:teamId')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Assign a team to a mentor',
    description: 'Endpoint for assigning a team to a mentor.',
  })
  @ApiOkResponse({
    description: 'Team assigned to mentor successfully.',
  })
  async assignTeam(
    @UserAuth() user: User,
    @Param('id') id: string,
    @Param('teamId') teamId: string,
  ) {
    return this.mentorsService.assignTeam(
      user,
      parseInt(id, 10),
      parseInt(teamId, 10),
    );
  }
}
