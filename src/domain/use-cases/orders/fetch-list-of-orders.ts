import { Either, left, right } from '@/core/either';
import { Order } from '@/domain/entities/order';
import { Injectable } from '@nestjs/common';
import { OrderRepository } from '../../repositories/order-repository';
import { OrderWithDetails } from '../../entities/orderWithDetails';

interface fetchListOfOrdersUseCaseRequest {
  page: number;
}

type fetchListOfOrdersResponse = Either<
  null,
  {
    orders: OrderWithDetails[];
  }
>;

@Injectable()
export class fetchListOfOrdersUseCase {
  constructor(private ordersRepository: OrderRepository) {}

  async execute({
    page,
  }: fetchListOfOrdersUseCaseRequest): Promise<fetchListOfOrdersResponse> {
    const orders = await this.ordersRepository.fetchListOfOrders(page);

    return right({
      orders,
    });
  }
}
