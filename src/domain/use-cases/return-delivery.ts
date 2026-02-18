import { Order } from '../entities/order';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { Injectable } from '@nestjs/common';
import { OrderRepository } from '../repositories/order-repository';
import { Either, left, right } from '@/core/either';
import { DomainEvents } from '@/core/events/domain-events';

interface ReturnDeliveryUseCaseRequest {
  orderId: string;
}

type ReturnDeliveryUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { order: Order }
>;

@Injectable()
export class ReturnDeliveryUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute({
    orderId,
  }: ReturnDeliveryUseCaseRequest): Promise<ReturnDeliveryUseCaseResponse> {
    const order = await this.orderRepository.findById(orderId);

    if (!order) {
      return left(new ResourceNotFoundError());
    }

    order.status = 'RETURNED';

    await this.orderRepository.changeOrderStatus(order, order.status);

    DomainEvents.dispatchEventsForAggregate(order.id);

    return right({ order });
  }
}
