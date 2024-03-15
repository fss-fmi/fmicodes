import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
// TODO: Fix circular dependency
// eslint-disable-next-line import/no-cycle
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
