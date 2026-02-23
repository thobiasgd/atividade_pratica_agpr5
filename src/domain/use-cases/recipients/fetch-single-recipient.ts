import { Either, left, right } from '@/core/either';
import { Recipient } from '@/domain/entities/recipient';
import { RecipientsRepository } from '@/domain/repositories/recipient-repository';
import { Injectable } from '@nestjs/common';
import { RecipientNotFoundError } from '../../../core/errors/errors/recipient-not-found-error';

interface FetchSingleRecipientsUseCaseRequest {
  recipientId: string;
}

type FetchSingleRecipientsUseCaseResponse = Either<
  RecipientNotFoundError,
  {
    recipient: Recipient;
  }
>;

@Injectable()
export class FetchSingleRecipientUseCase {
  constructor(private recipientsRepository: RecipientsRepository) {}

  async execute({
    recipientId,
  }: FetchSingleRecipientsUseCaseRequest): Promise<FetchSingleRecipientsUseCaseResponse> {
    const recipient = await this.recipientsRepository.findById(recipientId);

    if (!recipient) {
      return left(new RecipientNotFoundError(recipientId));
    }

    return right({
      recipient,
    });
  }
}
