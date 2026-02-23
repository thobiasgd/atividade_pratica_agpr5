import { Either, left, right } from '@/core/either';
import { Order } from '@/domain/entities/order';
import { Injectable } from '@nestjs/common';
import { OrderNotFoundError } from '../../../core/errors/errors/order-not-found-error';
import { OrderRepository } from '../../repositories/order-repository';

interface FetchSingleOrdersUseCaseRequest {
  orderId: string;
}

type FetchSingleOrdersUseCaseResponse = Either<
  OrderNotFoundError,
  {
    order: Order;
  }
>;

@Injectable()
export class FetchSingleOrderUseCase {
  constructor(private ordersRepository: OrderRepository) {}

  async execute({
    orderId,
  }: FetchSingleOrdersUseCaseRequest): Promise<FetchSingleOrdersUseCaseResponse> {
    const order = await this.ordersRepository.findById(orderId);

    if (!order) {
      return left(new OrderNotFoundError(orderId));
    }

    return right({
      order,
    });
  }
}
