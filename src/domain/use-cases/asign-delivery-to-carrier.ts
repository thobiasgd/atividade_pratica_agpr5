import { Order } from '../entities/order';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { Injectable } from '@nestjs/common';
import { OrderRepository } from '../repositories/order-repository';
import { Either, left, right } from '@/core/either';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { DomainEvents } from '@/core/events/domain-events';

interface AsignDeliveryToCarrierUseCaseRequest {
  orderId: string;
  userId: string;
}

type AsignDeliveryToCarrierUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { order: Order }
>;

@Injectable()
export class AsignDeliveryToCarrierUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute({
    orderId,
    userId,
  }: AsignDeliveryToCarrierUseCaseRequest): Promise<AsignDeliveryToCarrierUseCaseResponse> {
    const order = await this.orderRepository.findById(orderId);

    if (!order) {
      return left(new ResourceNotFoundError());
    }

    order.carrierId = new UniqueEntityID(userId);
    await this.orderRepository.asignOrderToCarrier(order);

    order.status = 'ON_THE_WAY';

    await this.orderRepository.changeOrderStatus(order, order.status);

    DomainEvents.dispatchEventsForAggregate(order.id);

    return right({ order });
  }
}
