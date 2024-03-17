import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Color } from '@prisma/client';
import { i18nValidationMessage } from 'nestjs-i18n';
import { libConfig } from '../../config/lib.config';

export class TeamEditDto {
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

  @ApiProperty({
    description: 'Project name.',
    example: 'Example Project Name',
  })
  @IsString({
    message: i18nValidationMessage('validation.isString'),
  })
  @MaxLength(libConfig.team.projectName.maxLength, {
    message: i18nValidationMessage('validation.maxLength'),
  })
  projectName!: string;

  @ApiProperty({
    description: 'Project description.',
    example: 'Example Project Description',
  })
  @IsString({
    message: i18nValidationMessage('validation.isString'),
  })
  @MaxLength(libConfig.team.projectDescription.maxLength, {
    message: i18nValidationMessage('validation.maxLength'),
  })
  projectDescription!: string;

  @ApiProperty({
    description: 'Project repositories.',
    example: 'Example Project Repositories',
  })
  @IsString({
    message: i18nValidationMessage('validation.isString'),
  })
  @MaxLength(libConfig.team.projectRepositories.maxLength, {
    message: i18nValidationMessage('validation.maxLength'),
  })
  projectRepositories!: string;

  @ApiProperty({
    description: 'Project website.',
    example: 'Example Project Website',
  })
  @IsString({
    message: i18nValidationMessage('validation.isString'),
  })
  @MaxLength(libConfig.team.projectWebsite.maxLength, {
    message: i18nValidationMessage('validation.maxLength'),
  })
  projectWebsite!: string;
}
