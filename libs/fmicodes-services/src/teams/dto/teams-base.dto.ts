import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Color } from '@prisma/client';
import { i18nValidationMessage } from 'nestjs-i18n';
import { libConfig } from '../../config/lib.config';

export class TeamsBaseDto {
  @ApiProperty({
    description: 'Team name.',
    example: 'Example Team Name',
  })
  @IsNotEmpty({
    message: i18nValidationMessage('validation.isNotEmpty'),
  })
  @IsString({
    message: i18nValidationMessage('validation.isString'),
  })
  @MinLength(libConfig.team.name.minLength, {
    message: i18nValidationMessage('validation.minLength'),
  })
  @MaxLength(libConfig.team.name.maxLength, {
    message: i18nValidationMessage('validation.maxLength'),
  })
  name!: string;

  @ApiProperty({
    description: 'Team color.',
    type: 'string',
  })
  @IsNotEmpty({
    message: i18nValidationMessage('validation.required'),
  })
  @IsEnum(Color, {
    message: i18nValidationMessage('validation.isEnum', {
      enum: Object.values(Color).join(', '),
    }),
  })
  color!: Color;
}
