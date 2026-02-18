import { Order } from '../entities/order';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { Injectable } from '@nestjs/common';
import { OrderRepository } from '../repositories/order-repository';
import { Either, left, right } from '@/core/either';

interface PostDeliveryUseCaseRequest {
  orderId: string;
}

type PostDeliveryUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    order: Order;
  }
>;

@Injectable()
export class PostDeliveryUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute({
    orderId,
  }: PostDeliveryUseCaseRequest): Promise<PostDeliveryUseCaseResponse> {
    const order = await this.orderRepository.findById(orderId);

    if (!order) {
      return left(new ResourceNotFoundError());
    }

    const status = 'WAITING';

    await this.orderRepository.changeOrderStatus(order, status);

    return right({
      order,
    });
  }
}
