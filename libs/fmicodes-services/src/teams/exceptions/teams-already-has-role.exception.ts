import { HttpException, HttpStatus } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';

export class TeamsAlreadyHasRoleException extends HttpException {
  constructor() {
    const i18n = I18nContext.current();
    if (!i18n) {
      super('The user already has a role.', HttpStatus.CONFLICT);
    } else {
      super(i18n.t('errors.teams.alreadyHasRole'), HttpStatus.CONFLICT);
    }
  }
}
