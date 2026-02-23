import { Recipient } from '@/domain/entities/recipient';

export class RecipientPresenter {
  static toHTTP(recipient: Recipient) {
    return {
      name: recipient.name,
      cpf: recipient.cpf,
    };
  }
}
