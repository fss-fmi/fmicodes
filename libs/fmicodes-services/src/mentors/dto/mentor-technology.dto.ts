import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { i18nValidationMessage } from 'nestjs-i18n';

export class MentorTechnologyDto {
  @ApiProperty({
    description: 'Technology name',
    example: 'Technology name',
  })
  @IsNotEmpty({
    message: i18nValidationMessage('validation.isNotEmpty'),
  })
  name!: string;

  @ApiProperty({
    description: 'Technology color',
    example: '#000000',
  })
  @IsNotEmpty({
    message: i18nValidationMessage('validation.isNotEmpty'),
  })
  color!: string;
}
