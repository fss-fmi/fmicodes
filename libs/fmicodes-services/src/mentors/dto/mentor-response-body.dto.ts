import { IsDateString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { i18nValidationMessage } from 'nestjs-i18n';
import { MentorBaseDto } from './mentor-base.dto';

export class MentorResponseBodyDto extends MentorBaseDto {
  @ApiProperty({
    description: 'Mentor id.',
    example: 1,
  })
  @IsNotEmpty({
    message: i18nValidationMessage('validation.isNotEmpty'),
  })
  id!: number;

  @ApiProperty({
    description: 'Mentor creation date',
  })
  @IsDateString(
    {},
    {
      message: i18nValidationMessage('validation.isDateString'),
    },
  )
  createdAt!: Date;

  @ApiProperty({
    description: 'Mentor last update date',
  })
  @IsDateString(
    {},
    { message: i18nValidationMessage('validation.isDateString') },
  )
  updatedAt!: Date;
}

export default MentorResponseBodyDto;
