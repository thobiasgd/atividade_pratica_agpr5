import { Either, left, right } from '@/core/either';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Recipient } from '../../entities/recipient';
import { RecipientsRepository } from '../../repositories/recipient-repository';

interface EditRecipientUseCaseRequest {
  recipientId: string;
  newRecipientCpf: string;
  newRecipientName: string;
}

type EditRecipientUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    recipient: Recipient;
  }
>;

@Injectable()
export class EditRecipientUseCase {
  constructor(private recipientsRepository: RecipientsRepository) {}

  async execute({
    recipientId,
    newRecipientCpf,
    newRecipientName,
  }: EditRecipientUseCaseRequest): Promise<EditRecipientUseCaseResponse> {
    //console.log('PASSO 01');
    //console.log(`Recipient Id: ${recipientId}`);
    const recipient = await this.recipientsRepository.findById(recipientId);
    //console.log('FIMMMM');

    if (!recipient) {
      return left(new BadRequestException('Recipient not found.'));
    }

    //console.log(recipient);

    recipient.cpf = newRecipientCpf;
    recipient.name = newRecipientName;

    await this.recipientsRepository.save(recipient);

    return right({
      recipient,
    });
  }
}
