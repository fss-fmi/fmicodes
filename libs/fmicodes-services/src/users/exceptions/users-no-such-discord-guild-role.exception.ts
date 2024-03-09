import { HttpException, HttpStatus } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';

export class UsersNoSuchDiscordGuildRoleException extends HttpException {
  constructor() {
    const i18n = I18nContext.current();
    if (!i18n) {
      super(
        'No such Discord server role exists.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } else {
      super(
        i18n.t('errors.users.noSuchDiscordGuildRole'),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
