import { Order } from '../entities/order';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { Injectable } from '@nestjs/common';
import { OrderRepository } from '../repositories/order-repository';
import { Either, left, right } from '@/core/either';

interface OnTheWayDeliveryUseCaseRequest {
  orderId: string;
}

type OnTheWayDeliveryUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    order: Order;
  }
>;

@Injectable()
export class OnTheWayDeliveryUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute({
    orderId,
  }: OnTheWayDeliveryUseCaseRequest): Promise<OnTheWayDeliveryUseCaseResponse> {
    const order = await this.orderRepository.findById(orderId);

    if (!order) {
      return left(new ResourceNotFoundError());
    }

    const status = 'ON_THE_WAY';

    await this.orderRepository.changeOrderStatus(order, order.status);

    return right({
      order,
    });
  }
}
