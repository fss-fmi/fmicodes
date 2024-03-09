import { HttpException, HttpStatus } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';

export class TeamsNotCapitanException extends HttpException {
  constructor() {
    const i18n = I18nContext.current();
    if (!i18n) {
      super('You are not captain of this team.', HttpStatus.FORBIDDEN);
    } else {
      super(i18n.t('errors.teams.notCaptain'), HttpStatus.FORBIDDEN);
    }
  }
}
