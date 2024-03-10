import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Res,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  Version,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { User } from '@prisma/client';
import { UserRequestBodyDto } from '@fmicodes/fmicodes-services/users/dto/user-request-body.dto';
import { UsersService } from '@fmicodes/fmicodes-services/users/users.service';
import { JwtAuthGuard } from '@fmicodes/fmicodes-services/auth/guards/jwt-auth.guard';
import { UserResponseBodyDto } from '@fmicodes/fmicodes-services/users/dto/user-response-body.dto';
import { UsersPostCurrentTeamInvitesRespondRequestBodyDto } from '@fmicodes/fmicodes-services/users/dto/users-post-current-team-invites-respond-request-body.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import libConfig from '@fmicodes/fmicodes-services/config/lib.config';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UserAuth } from './user-auth.decorator';
import { appConfig } from '../app/app.config';

@Controller('users')
@ApiTags('Users API')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Version(['1'])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get all users',
    description: 'Endpoint for getting all users.',
  })
  @ApiOkResponse({
    description: 'Users returned successfully.',
    type: [UserResponseBodyDto], // TODO: Refactor to use correct DTO
  })
  getAllV1() {
    return this.usersService.getAllUsers();
  }

  @Post()
  @Version(['1'])
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FilesInterceptor(
      'universityProofImages',
      libConfig.user.universityProofImages.max,
      {
        storage: diskStorage({
          destination: `${appConfig.multer.destination}/university-proof-images`,
          filename: (req, file, cb) => {
            const name = file.originalname.split('.')[0];
            const extension = extname(file.originalname);
            const randomName = Array(32)
              .fill(null)
              .map(() => Math.round(Math.random() * 16).toString(16))
              .join('');
            cb(null, `${randomName}-${name}${extension}`);
          },
        }),
      },
    ),
  )
  @ApiOperation({
    summary: 'Register a new user',
    description: 'Endpoint for registering a new user.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UserRequestBodyDto })
  @ApiCreatedResponse({
    description: 'User registered successfully.',
  })
  @ApiConflictResponse({
    schema: {
      anyOf: [
        {
          description: 'The email is already in use.',
        },
        {
          description: 'The nickname is already in use.',
        },
      ],
    },
  })
  async postUsersV1(
    @Body() user: UserRequestBodyDto,
    @UploadedFiles() universityProofImages: Array<Express.Multer.File>,
  ) {
    // const registrationStartDate = '2024/03/10 18:00:00';
    // if (Date.now() < new Date(registrationStartDate).getTime()) {
    //   throw new ImATeapotException('Nice try :) but not yet!');
    // }
    return this.usersService.registerUser(user, universityProofImages);
  }

  @Get('current')
  @Version(['1'])
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Current user information',
    description: 'Endpoint for gathering current user information.',
  })
  @ApiOkResponse({
    description: 'The user is authenticated and user information is returned.',
    type: UserResponseBodyDto,
  })
  @ApiUnauthorizedResponse({ description: 'Invalid authentication token.' })
  getCurrentV1(@UserAuth() user: Omit<User, 'passwordHash'>) {
    return user;
  }

  @Patch('current/onboarding')
  @Version(['1'])
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Complete onboarding',
    description:
      'Endpoint for marking the user as having completed onboarding.',
  })
  @ApiOkResponse({
    description:
      'The user is authenticated and onboarding is marked as complete.',
  })
  @ApiUnauthorizedResponse({ description: 'Invalid authentication token.' })
  patchCurrentOnboardingV1(@UserAuth() user: Omit<User, 'passwordHash'>) {
    return this.usersService.completeOnboarding(user);
  }

  @Get('avatars/:filename')
  @Version(['1'])
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get user avatar file',
    description: 'Endpoint for getting the user avatar file.',
  })
  @ApiOkResponse({
    description: 'User avatar returned successfully.',
  })
  @ApiNotFoundResponse({
    description: 'The image does not exist.',
  })
  getAvatarFileV1(@Param('filename') filename: string, @Res() res) {
    return res.sendFile(filename, {
      root: `${appConfig.multer.destination}/avatars`,
    });
  }

  @Patch('current/avatar')
  @Version(['1'])
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: `${appConfig.multer.destination}/avatars`,
        filename: (req, file, cb) => {
          const extension = extname(file.originalname);
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extension}`);
        },
      }),
    }),
  )
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update user avatar',
    description: 'Endpoint for updating the user avatar.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({
    description: 'User avatar updated successfully.',
  })
  async patchCurrentAvatarV1(
    @UserAuth() user: Omit<User, 'passwordHash'>,
    @UploadedFile() avatar: Express.Multer.File,
  ) {
    return this.usersService.updateAvatar(user, avatar);
  }

  @Get('current/team-invites')
  @Version(['1'])
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get user team invitations',
    description: 'Endpoint for getting user team invitations.',
  })
  @ApiOkResponse({
    description: 'User team invitations returned successfully.',
  })
  @ApiUnauthorizedResponse({ description: 'Invalid authentication token.' })
  @ApiNotFoundResponse({
    description: 'The user does not exist.',
  })
  getUserTeamInvitesV1(@UserAuth() user: Omit<User, 'passwordHash'>) {
    return this.usersService.getUserTeamInvites(user);
  }

  @Post(':inviteeId/team-invites')
  @Version(['1'])
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Invite a user to a team',
    description: 'Endpoint for creating user team invitations.',
  })
  @ApiCreatedResponse({
    description: 'team invitation created successfully.',
  })
  @ApiUnauthorizedResponse({ description: 'Invalid authentication token.' })
  @ApiForbiddenResponse({
    schema: {
      anyOf: [
        {
          description: 'The user cannot invite themselves.',
        },
        {
          description: 'The user is not a member of a team.',
        },
        {
          description: 'Only the captain of the team can invite users.',
        },
      ],
    },
  })
  @ApiNotFoundResponse({
    description: 'The user to invite does not exist.',
  })
  postTeamInviteV1(
    @Param('inviteeId') inviteeId: string,
    @UserAuth() user: Omit<User, 'passwordHash'>,
  ) {
    return this.usersService.createTeamInvitation(user, inviteeId);
  }

  @Post('current/team-invites/:inviteId/respond')
  @Version(['1'])
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Respond to a team invitation',
    description: 'Endpoint for users to accept or decline team invitations.',
  })
  @ApiBody({ type: UsersPostCurrentTeamInvitesRespondRequestBodyDto })
  @ApiOkResponse({
    description: 'team invitation accepted or declined successfully.',
  })
  @ApiUnauthorizedResponse({ description: 'Invalid authentication token.' })
  @ApiNotFoundResponse({
    schema: {
      anyOf: [
        { description: 'The team does not exist.' },
        { description: 'The invitation does not exist.' },
      ],
    },
  })
  @ApiForbiddenResponse({
    description: 'The user is not the invitee of the invitation.',
  })
  @ApiConflictResponse({
    description: 'The user is already part of a team.',
  })
  async postCurrentTeamInvitesRespondV1(
    // @Param() params: UsersPostCurrentTeamInvitesRespondParamsDto,
    @Param('inviteId') inviteId: string,
    @UserAuth() user: Omit<User, 'passwordHash'>,
    @Body() requestBody: UsersPostCurrentTeamInvitesRespondRequestBodyDto,
  ) {
    return this.usersService.respondToTeamInvite(
      requestBody.response,
      parseInt(inviteId, 10),
      user,
    );
  }

  // TODO: Move team member removal here
}

export default UsersController;
