import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { i18nValidationMessage } from 'nestjs-i18n';
import { MentorTechnologyDto } from './mentor-technology.dto';
import { TeamResponseBodyDto } from '../../teams/dto/team-response-body.dto';

export class MentorBaseDto {
  @ApiProperty({
    description: 'Mentor name',
    example: 'Mentor name',
  })
  @IsNotEmpty({
    message: i18nValidationMessage('validation.isNotEmpty'),
  })
  name!: string;

  @ApiProperty({
    description: 'Mentor picture URL',
    example: '/assets/images/mentors/Mentor_name.jpg',
  })
  @IsNotEmpty({
    message: i18nValidationMessage('validation.isNotEmpty'),
  })
  pictureUrl!: string;

  @ApiProperty({
    description: 'Mentor company',
    example: 'Mentor company',
  })
  @IsNotEmpty({
    message: i18nValidationMessage('validation.isNotEmpty'),
  })
  company!: string;

  @ApiProperty({
    description: 'Mentor job title',
    example: 'Mentor job title',
  })
  @IsNotEmpty({
    message: i18nValidationMessage('validation.isNotEmpty'),
  })
  jobTitle!: string;

  @ApiProperty({
    description: 'Mentor availability',
    example: ['Неделя 10:00 - 13:00', 'Неделя 13:00 - 16:00'],
  })
  @IsNotEmpty({
    message: i18nValidationMessage('validation.isNotEmpty'),
  })
  availability!: string[];

  @ApiProperty({
    description: 'Mentor technologies',
    example: ['Уеб програмиране', 'DevOps'],
    type: [MentorTechnologyDto],
  })
  @IsNotEmpty({
    message: i18nValidationMessage('validation.isNotEmpty'),
  })
  technologies!: MentorTechnologyDto[];

  @ApiProperty({
    description: 'Mentor team',
    example: 'Mentor team',
  })
  @IsNotEmpty({
    message: i18nValidationMessage('validation.isNotEmpty'),
  })
  team!: TeamResponseBodyDto | null;
}

export default MentorBaseDto;
