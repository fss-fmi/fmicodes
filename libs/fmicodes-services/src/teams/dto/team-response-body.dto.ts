import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { UserResponseBodyDto } from '../../users/dto/user-response-body.dto';
import { TeamsBaseDto } from './teams-base.dto';

export class TeamResponseBodyDto extends TeamsBaseDto {
  @ApiProperty({
    description: 'Team id.',
  })
  @IsNotEmpty({
    message: i18nValidationMessage('validation.isNotEmpty'),
  })
  id!: number;

  @ApiProperty({
    description: 'Project name.',
  })
  projectName!: string;

  @ApiProperty({
    description: 'Project description.',
  })
  projectDescription!: string;

  @ApiProperty({
    description: 'Project repositories.',
  })
  projectRepositories!: string[];

  @ApiProperty({
    description: 'Project website.',
  })
  projectWebsite!: string;

  @ApiProperty({
    description: 'Total points',
  })
  totalPoints!: number;

  @ApiProperty({
    description: 'Team members.',
    type: UserResponseBodyDto,
  })
  members!: UserResponseBodyDto; // TODO: Adjust type

  @ApiProperty({
    description: 'Team capitan id.',
  })
  capitanId!: string;

  @ApiProperty({
    description: 'Mentor',
  })
  mentors!: [string];

  @ApiProperty({
    description: 'Team creation date',
  })
  @IsDateString(
    {},
    {
      message: i18nValidationMessage('validation.isDateString'),
    },
  )
  createdAt!: Date;

  @ApiProperty({
    description: 'Team last update date.',
  })
  @IsDateString(
    {},
    { message: i18nValidationMessage('validation.isDateString') },
  )
  updatedAt!: Date;
}
