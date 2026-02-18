import { Either, left, right } from '@/core/either';
import { Order } from '../entities/order';
import { Injectable } from '@nestjs/common';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { OrderRepository } from '../repositories/order-repository';
import { OrderStatus } from 'generated/enums';

interface RegisterOrderUseCaseRequest {
  description: string;
  status: OrderStatus;
  recipientId: UniqueEntityID;
  addressId: UniqueEntityID;
  carrierId?: UniqueEntityID | null;
}

type RegisterOrderUseCaseResponse = Either<
  null,
  {
    order: Order;
  }
>;

@Injectable()
export class RegisterOrderUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute({
    description,
    status,
    recipientId,
    addressId,
    carrierId,
  }: RegisterOrderUseCaseRequest): Promise<RegisterOrderUseCaseResponse> {
    const order = Order.create({
      description,
      status,
      recipientId,
      addressId,
      carrierId: carrierId ?? null,
    });

    await this.orderRepository.create(order);

    return right({
      order,
    });
  }
}
