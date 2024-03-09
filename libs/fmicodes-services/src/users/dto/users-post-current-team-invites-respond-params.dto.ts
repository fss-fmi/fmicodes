import { IsInt } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { Type } from 'class-transformer';

export class UsersPostCurrentTeamInvitesRespondParamsDto {
  @IsInt({
    message: i18nValidationMessage('validation.isInt'),
  })
  @Type(() => Number)
  inviteId!: number;
}
