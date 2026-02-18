import { Order } from '../entities/order';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { Injectable } from '@nestjs/common';
import { OrderRepository } from '../repositories/order-repository';
import { Either, left, right } from '@/core/either';
import { InvalidAttachmentTypeError } from './errors/invalid-attachment-type-error';
import { AttachmentsRepository } from '../repositories/attachments-repository';
import { Uploader } from '../storage/uploader';
import { Attachment } from '../entities/attachment';
import { MissingAttachmentError } from './errors/missing-attachment-error';
import { DomainEvents } from '@/core/events/domain-events';

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
    attachment: Attachment;
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

    // ✅ muda NA ENTIDADE (gera DomainEvent no setter)
    order.status = 'DELIVERED';

    // ✅ persiste o novo status
    await this.orderRepository.changeOrderStatus(order, order.status);

    const attachment = Attachment.create({
      title: fileName,
      url,
    });

    await this.attachmentsRepository.create(attachment);

    // ✅ dispara eventos (OrderDeliveredEvent -> subscriber -> notificação)
    DomainEvents.dispatchEventsForAggregate(order.id);

    return right({
      order,
      attachment,
    });
  }
}
