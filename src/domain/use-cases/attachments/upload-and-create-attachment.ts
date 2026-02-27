import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { InvalidAttachmentTypeError } from '../../../core/errors/errors/invalid-attachment-type-error';
import { Uploader } from '../../storage/uploader';
import { AttachmentsRepository } from '../../repositories/attachments-repository';
import { Attachment } from '../../entities/attachment';

interface UploadAndCreateAttachmentRequest {
  orderId: string;
  fileName: string;
  fileType: string;
  body: Buffer;
}

type UploadAndCreateAttachmentResponse = Either<
  InvalidAttachmentTypeError,
  { attachment: Attachment }
>;

@Injectable()
export class UploadAndCreateAttachmentUseCase {
  constructor(
    private attachmentsRepository: AttachmentsRepository,
    private uploader: Uploader,
  ) {}

  async execute({
    orderId,
    fileName,
    fileType,
    body,
  }: UploadAndCreateAttachmentRequest): Promise<UploadAndCreateAttachmentResponse> {
    if (!/^(image\/(jpeg|png))$|^application\/pdf$/.test(fileType)) {
      return left(new InvalidAttachmentTypeError(fileType));
    }

    const { url } = await this.uploader.upload({ fileName, fileType, body });

    const attachment = Attachment.create({
      title: fileName,
      url,
      orderId,
    });

    await this.attachmentsRepository.create(attachment); // <- erro aqui

    return right({
      attachment,
    });
  }
}
