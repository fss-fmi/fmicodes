import { HttpException, HttpStatus } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';

export class TeamsTeamIsFullException extends HttpException {
  constructor() {
    const i18n = I18nContext.current();
    if (!i18n) {
      super('The team is already full.', HttpStatus.FORBIDDEN);
    } else {
      super(i18n.t('errors.teams.teamIsFull'), HttpStatus.FORBIDDEN);
    }
  }
}
