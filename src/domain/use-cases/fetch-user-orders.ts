import { Either, right } from '@/core/either';
import { Order } from '../entities/order';
import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../repositories/user-repository';

interface FetchUserOrdersRequest {
  userId: string;
}

type FetchUserOrdersResponse = Either<
  null,
  {
    orders: Order[];
  }
>;

@Injectable()
export class FetchUserOrdersUseCase {
  constructor(private userRepository: UsersRepository) {}

  async execute({
    userId,
  }: FetchUserOrdersRequest): Promise<FetchUserOrdersResponse> {
    const orders = await this.userRepository.fetchUserOrders(userId);

    return right({
      orders,
    });
  }
}
