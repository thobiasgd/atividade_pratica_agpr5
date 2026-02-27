import { Either, left, right } from '@/core/either';
import { InvalidAttachmentTypeError } from '@/core/errors/errors/invalid-attachment-type-error';
import { MissingAttachmentError } from '@/core/errors/errors/missing-attachment-error';
import { MissingRequiredChecklistItemsError } from '@/core/errors/errors/missing-required-checklist-items-error';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { DomainEvents } from '@/core/events/domain-events';
import { Attachment, AttachmentProps } from '@/domain/entities/attachment';
import { Order } from '@/domain/entities/order';
import { AttachmentsRepository } from '@/domain/repositories/attachments-repository';
import { ChecklistRepository } from '@/domain/repositories/checklist-repository';
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
  | MissingAttachmentError
  | MissingRequiredChecklistItemsError,
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
    private checklistRepository: ChecklistRepository,
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

    if (!/^(image\/(jpeg|png|jpg))$|^application\/pdf$/.test(fileType)) {
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

    const requiredItems =
      await this.checklistRepository.fetchRequiredChecklistItems(
        order.id.toString(),
      );

    const completeChecklist =
      await this.checklistRepository.fetchCompleteChecklistOrder(
        order.id.toString(),
      );

    const checkedTemplateItemIds = new Set(
      completeChecklist.items
        .filter((item) => item.value === true)
        .map((item) => item.templateItemId),
    );

    const missingRequired = requiredItems
      .filter((req) => !checkedTemplateItemIds.has(req.templateItemId))
      .map((req) => req.atribute);

    if (missingRequired.length > 0) {
      return left(new MissingRequiredChecklistItemsError(missingRequired));
    }

    order.status = 'DELIVERED';

    await this.orderRepository.changeOrderStatus(order, order.status);

    const attachment = Attachment.create({
      title: fileName,
      url,
      orderId: order.id.toString(),
    });

    await this.attachmentsRepository.create(attachment);

    DomainEvents.dispatchEventsForAggregate(order.id);

    return right({
      order,
      attachment,
    });
  }
}
