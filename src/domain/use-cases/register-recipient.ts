import { Either, left, right } from '@/core/either';
import { RecipientAlreadyExistsError } from './errors/recipient-already-exists';
import { Recipient } from '../entities/recipient';
import { Injectable } from '@nestjs/common';
import { HashGenerator } from '../cryptography/hash-generator';
import { RecipientsRepository } from '../repositories/recipient-repository';

interface RegisterRecipientUseCaseRequest {
  name: string;
  cpf: string;
}

type RegisterRecipientUseCaseResponse = Either<
  RecipientAlreadyExistsError,
  {
    recipient: Recipient;
  }
>;

@Injectable()
export class RegisterRecipientUseCase {
  constructor(private recipientRepository: RecipientsRepository) {}

  async execute({
    name,
    cpf,
  }: RegisterRecipientUseCaseRequest): Promise<RegisterRecipientUseCaseResponse> {
    const recipientWithSameCpf = await this.recipientRepository.findByCpf(cpf);

    if (recipientWithSameCpf) {
      return left(new RecipientAlreadyExistsError(cpf));
    }

    const recipient = Recipient.create({
      name,
      cpf,
    });

    await this.recipientRepository.create(recipient);

    return right({
      recipient,
    });
  }
}
