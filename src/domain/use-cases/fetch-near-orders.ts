import { Either, right } from '@/core/either';
import { Order } from '../entities/order';
import { Injectable } from '@nestjs/common';
import { OrderRepository } from '../repositories/order-repository';

interface FetchNearOrdersRequest {
  neighborhood: string;
}

type FetchNearOrdersResponse = Either<
  null,
  {
    orders: Order[];
  }
>;

@Injectable()
export class FetchNearOrdersUseCase {
  constructor(private ordersRepository: OrderRepository) {}

  async execute({
    neighborhood,
  }: FetchNearOrdersRequest): Promise<FetchNearOrdersResponse> {
    const orders = await this.ordersRepository.listNearOrders(neighborhood);

    return right({
      orders,
    });
  }
}
