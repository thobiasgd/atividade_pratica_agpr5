import { Either, left, right } from '@/core/either';
import { InvalidAttachmentTypeError } from '@/core/errors/errors/invalid-attachment-type-error';
import { MissingAttachmentError } from '@/core/errors/errors/missing-attachment-error';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { DomainEvents } from '@/core/events/domain-events';
import { Attachment, AttachmentProps } from '@/domain/entities/attachment';
import { Order } from '@/domain/entities/order';
import { AttachmentsRepository } from '@/domain/repositories/attachments-repository';
import { OrderRepository } from '@/domain/repositories/order-repository';
import { Uploader } from '@/domain/storage/uploader';
import { Injectable } from '@nestjs/common';

interface DeliverDeliveryUseCaseRequest {
  userId: string;
  orderId: string;

  fileName: string;
  fileType: string;
  body: Buffer;
}

type DeliverDeliveryUseCaseResponse = Either<
  | ResourceNotFoundError
  | NotAllowedError
  | InvalidAttachmentTypeError
  | MissingAttachmentError,
  {
    order: Order;
    attachment: AttachmentProps;
  }
>;

@Injectable()
export class DeliverDeliveryUseCase {
  constructor(
    private orderRepository: OrderRepository,
    private attachmentsRepository: AttachmentsRepository,
    private uploader: Uploader,
  ) {}

  async execute({
    userId,
    orderId,
    fileName,
    fileType,
    body,
  }: DeliverDeliveryUseCaseRequest): Promise<DeliverDeliveryUseCaseResponse> {
    if (!body || !fileName || !fileType) {
      return left(new MissingAttachmentError());
    }

    if (!/^(image\/(jpeg|png))$|^application\/pdf$/.test(fileType)) {
      return left(new InvalidAttachmentTypeError(fileType));
    }

    const { url } = await this.uploader.upload({ fileName, fileType, body });

    const order = await this.orderRepository.findById(orderId);

    if (!order) {
      return left(new ResourceNotFoundError());
    }

    if (order.carrierId?.toString() !== userId) {
      return left(new NotAllowedError());
    }

    order.status = 'DELIVERED';

    await this.orderRepository.changeOrderStatus(order, order.status);

    const attachment = Attachment.create({
      title: fileName,
      url,
    });

    await this.attachmentsRepository.create(attachment);

    DomainEvents.dispatchEventsForAggregate(order.id);

    return right({
      order,
      attachment,
    });
  }
}
