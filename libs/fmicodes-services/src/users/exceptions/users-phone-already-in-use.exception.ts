import { HttpException, HttpStatus } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';

export class UsersPhoneAlreadyInUseException extends HttpException {
  constructor() {
    const i18n = I18nContext.current();
    if (!i18n) {
      super('This phone number is already in use.', HttpStatus.CONFLICT);
    } else {
      super(i18n.t('errors.users.phoneAlreadyInUse'), HttpStatus.CONFLICT);
    }
  }
}
