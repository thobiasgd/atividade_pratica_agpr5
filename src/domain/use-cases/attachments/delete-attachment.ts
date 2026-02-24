import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { Injectable } from '@nestjs/common';
import { AttachmentsRepository } from '@/domain/repositories/attachments-repository';

interface DeleteAttachmentUseCaseRequest {
  attachmentId: string;
}

type DeleteAttachmentUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>;

@Injectable()
export class DeleteAttachmentUseCase {
  constructor(private attachmentsRepository: AttachmentsRepository) {}

  async execute({
    attachmentId,
  }: DeleteAttachmentUseCaseRequest): Promise<DeleteAttachmentUseCaseResponse> {
    const attachment = await this.attachmentsRepository.findById(attachmentId);

    if (!attachment) {
      return left(new ResourceNotFoundError());
    }

    await this.attachmentsRepository.delete(attachment);

    return right(null);
  }
}
