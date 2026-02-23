import { Either, left, right } from '@/core/either';
import { Recipient } from '@/domain/entities/recipient';
import { RecipientsRepository } from '@/domain/repositories/recipient-repository';
import { BadRequestException, Injectable } from '@nestjs/common';

interface fetchListOfRecipientsUseCaseRequest {
  page: number;
}

type fetchListOfRecipientsResponse = Either<
  null,
  {
    recipients: Recipient[];
  }
>;

@Injectable()
export class fetchListOfRecipientsUseCase {
  constructor(private recipientsRepository: RecipientsRepository) {}

  async execute({
    page,
  }: fetchListOfRecipientsUseCaseRequest): Promise<fetchListOfRecipientsResponse> {
    const recipients =
      await this.recipientsRepository.fetchListOfRecipients(page);

    return right({
      recipients,
    });
  }
}
