import { Either, left, right } from '@/core/either';
import { Attachment } from '@/domain/entities/attachment';
import { AttachmentsRepository } from '@/domain/repositories/attachments-repository';
import { Injectable } from '@nestjs/common';

interface fetchListOfAttachmentsUseCaseRequest {
  orderId: string;
}

type fetchListOfAttachmentsResponse = Either<
  null,
  {
    attachments: Attachment[];
  }
>;

@Injectable()
export class fetchListOfAttachmentsUseCase {
  constructor(private attachmentsRepository: AttachmentsRepository) {}

  async execute({
    orderId,
  }: fetchListOfAttachmentsUseCaseRequest): Promise<fetchListOfAttachmentsResponse> {
    const attachments =
      await this.attachmentsRepository.fetchListOfAttachments(orderId);

    return right({
      attachments,
    });
  }
}
