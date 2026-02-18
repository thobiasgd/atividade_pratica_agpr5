import { Recipient } from '../entities/recipient';

export abstract class RecipientsRepository {
  abstract findByCpf(cpf: string): Promise<Recipient | null>;
  abstract create(user: Recipient): Promise<void>;
}
