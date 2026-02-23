import { Recipient } from '../entities/recipient';

export abstract class RecipientsRepository {
  abstract findByCpf(cpf: string): Promise<Recipient | null>;
  abstract findById(recipientId: string): Promise<Recipient | null>;
  abstract create(user: Recipient): Promise<void>;
  abstract delete(recipient: Recipient): Promise<void>;
  abstract fetchListOfRecipients(page: number): Promise<Recipient[]>;
  abstract save(recipient: Recipient): Promise<void>;
}
