import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
  Version,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { User } from '@prisma/client';
import { TeamsService } from '@fmicodes/fmicodes-services//teams/teams.service';
import { JwtAuthGuard } from '@fmicodes/fmicodes-services/auth/guards/jwt-auth.guard';
import { TeamsBaseDto } from '@fmicodes/fmicodes-services//teams/dto/teams-base.dto';
import { TeamsPostJoinRequestsDto } from '@fmicodes/fmicodes-services//teams/dto/teams-post-join-requests.dto';
import { TeamsPostJoinRequestsRespondRequestBodyDto } from '@fmicodes/fmicodes-services//teams/dto/teams-post-join-requests-respond-request-body.dto';
import { TeamsPostJoinRequestsRespondParamsDto } from '@fmicodes/fmicodes-services//teams/dto/teams-post-join-requests-respond-params.dto';
import { TeamsPostJoinRequestsParamsDto } from '@fmicodes/fmicodes-services//teams/dto/teams-post-join-requests-params.dto';
import { TeamResponseBodyDto } from '@fmicodes/fmicodes-services//teams/dto/team-response-body.dto';
import { TeamMemberMembershipState } from 'discord.js';
import { UserAuth } from '../users/user-auth.decorator';

@Controller('teams')
@ApiTags('Teams API')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Get()
  @Version(['1'])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get all teams',
    description: 'Endpoint for getting all teams.',
  })
  @ApiOkResponse({
    description: 'teams retrieved successfully.',
    type: [TeamResponseBodyDto],
  })
  async getV1() {
    return this.teamsService.getAll();
  }

  @Post()
  @Version(['1'])
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a new team',
    description: 'Endpoint for creating new teams.',
  })
  @ApiBody({ type: TeamsBaseDto })
  @ApiCreatedResponse({
    description: 'team created successfully.',
  })
  @ApiUnauthorizedResponse({ description: 'Invalid user credentials.' })
  @ApiConflictResponse({
    schema: {
      anyOf: [
        {
          description: 'A team with the same name already exists.',
        },
        {
          description: 'The user is already a part of another team.',
        },
      ],
    },
  })
  async postV1(
    @Body() createTeamDto: TeamsBaseDto,
    @UserAuth() user: Omit<User, 'passwordHash'>,
  ) {
    return this.teamsService.create(createTeamDto, user.id);
  }

  @Get(':teamId')
  @Version(['1'])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get a specific team',
    description: 'Endpoint for getting a specific team by id.',
  })
  @ApiOkResponse({
    description: 'team retrieved successfully.',
    type: TeamResponseBodyDto,
  })
  @ApiNotFoundResponse({ description: 'The team specified does not exist.' })
  async getTeamV1(@Param('teamId') teamId: string) {
    return this.teamsService.getById(parseInt(teamId, 10)); // TODO: better way to handle this
  }

  @Get('current/invitations-sent')
  @Version(['1'])
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all team invitations sent',
    description:
      'Endpoint for team captains to get all sent invitations from their team.',
  })
  @ApiOkResponse({
    description: 'team invitations sent retrieved successfully.',
  })
  @ApiUnauthorizedResponse({ description: 'Invalid user credentials.' })
  @ApiNotFoundResponse({
    schema: {
      anyOf: [
        { description: 'The user no longer exists.' },
        { description: 'The team specified does not exist.' },
      ],
    },
  })
  @ApiForbiddenResponse({
    description: 'The user is not the captain of the team.',
  })
  async getInvitationsSentV1(@UserAuth() user: Omit<User, 'passwordHash'>) {
    return this.teamsService.getInvitationsSent(user.teamId, user);
  }

  @Get('current/join-requests')
  @Version(['1'])
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all team join requests',
    description: 'Endpoint for team captains to get all join requests.',
  })
  @ApiOkResponse({
    description: 'team join requests retrieved successfully.',
  })
  @ApiUnauthorizedResponse({ description: 'Invalid user credentials.' })
  @ApiNotFoundResponse({
    schema: {
      anyOf: [
        { description: 'The user no longer exists.' },
        { description: 'The team specified does not exist.' },
      ],
    },
  })
  @ApiForbiddenResponse({
    description: 'The user is not the captain of the team.',
  })
  async getJoinRequestsV1(@UserAuth() user: Omit<User, 'passwordHash'>) {
    return this.teamsService.getJoinRequests(user.teamId, user);
  }

  @Post(':teamId/join-requests')
  @Version(['1'])
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a new team join request',
    description: 'Endpoint for users to request to join a specific team.',
  })
  @ApiBody({ type: TeamsPostJoinRequestsDto })
  @ApiCreatedResponse({
    description: 'team join request created successfully.',
  })
  @ApiUnauthorizedResponse({ description: 'Invalid user credentials.' })
  @ApiNotFoundResponse({
    schema: {
      anyOf: [
        { description: 'The user no longer exists.' },
        { description: 'The team specified does not exist.' },
      ],
    },
  })
  @ApiConflictResponse({
    description: 'The user is already part of the specified team.',
  })
  async postJoinRequestV1(
    @Param() params: TeamsPostJoinRequestsParamsDto,
    @UserAuth() user: Omit<User, 'passwordHash'>,
  ) {
    return this.teamsService.createJoinRequest(params.teamId, user);
  }

  @Post(':teamId/join-requests/:requestId/respond')
  @Version(['1'])
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Respond to a team join request',
    description:
      'Endpoint for team captains to accept or decline join requests.',
  })
  @ApiBody({ type: TeamsPostJoinRequestsRespondRequestBodyDto })
  @ApiOkResponse({
    description: 'team join request accepted or declined successfully.',
  })
  @ApiUnauthorizedResponse({ description: 'Invalid user credentials.' })
  @ApiNotFoundResponse({
    schema: {
      anyOf: [
        { description: 'The user no longer exists.' },
        { description: 'The team specified does not exist.' },
        { description: 'The join request specified does not exist.' },
      ],
    },
  })
  @ApiForbiddenResponse({
    description: 'The user is not the captain of the team.',
  })
  @ApiConflictResponse({
    description: 'The user, you are trying to add, is already part of a team.',
  })
  async postJoinRequestsRespondV1(
    @Param() params: TeamsPostJoinRequestsRespondParamsDto,
    @Body() requestBody: TeamsPostJoinRequestsRespondRequestBodyDto,
    @UserAuth() user: Omit<User, 'passwordHash'>,
  ) {
    return this.teamsService.respondToJoinRequest(
      requestBody.response,
      params.teamId,
      params.requestId,
      user,
    );
  }

  @Delete(':teamId/members/:userId')
  @Version(['1'])
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Remove a user from a team',
    description: 'Endpoint for team captains to remove a user from their team.',
  })
  @ApiOkResponse({
    description: 'User removed from the team successfully.',
  })
  @ApiUnauthorizedResponse({ description: 'Invalid user credentials.' })
  @ApiNotFoundResponse({
    schema: {
      anyOf: [
        { description: 'The user no longer exists.' },
        { description: 'The team specified does not exist.' },
      ],
    },
  })
  @ApiForbiddenResponse({
    description: 'The user is not the captain of the team.',
  })
  async deleteMemberV1(
    @Param('teamId') teamId: string,
    @Param('userId') userId: string,
    @UserAuth() user: Omit<User, 'passwordHash'>,
  ) {
    return this.teamsService.removeMember(parseInt(teamId, 10), userId, user);
  }
}
