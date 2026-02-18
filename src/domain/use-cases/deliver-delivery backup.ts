import { Order } from '../entities/order';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { Injectable } from '@nestjs/common';
import { OrderRepository } from '../repositories/order-repository';
import { Either, left, right } from '@/core/either';

interface DeliverDeliveryUseCaseRequest {
  userId: string;
  orderId: string;
}

type DeliverDeliveryUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    order: Order;
  }
>;

@Injectable()
export class DeliverDeliveryUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute({
    userId,
    orderId,
  }: DeliverDeliveryUseCaseRequest): Promise<DeliverDeliveryUseCaseResponse> {
    const order = await this.orderRepository.findById(orderId);

    if (!order) {
      return left(new ResourceNotFoundError());
    }

    if (order.carrierId?.toString() != userId) {
      return left(new NotAllowedError());
    }

    const status = 'DELIVERED';

    await this.orderRepository.changeOrderStatus(order, order.status);

    return right({
      order,
    });
  }
}
