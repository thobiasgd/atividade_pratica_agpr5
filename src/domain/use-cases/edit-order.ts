import { Either, left, right } from '@/core/either';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Order } from '../entities/order';
import { OrderRepository } from '../repositories/order-repository';

interface EditOrderUseCaseRequest {
  orderId: string;
  newOrderDescription: string;
  orderIdBearer: string;
}

type EditOrderUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    order: Order;
  }
>;

@Injectable()
export class EditOrderUseCase {
  constructor(private ordersRepository: OrderRepository) {}

  async execute({
    orderId,
    orderIdBearer,
    newOrderDescription,
  }: EditOrderUseCaseRequest): Promise<EditOrderUseCaseResponse> {
    const order = await this.ordersRepository.findById(orderId);

    if (!order) {
      return left(new BadRequestException('Order not found.'));
    }

    if (order.carrierId?.toString() !== orderIdBearer) {
      new NotAllowedError();
    }

    order.description = newOrderDescription;

    await this.ordersRepository.save(order);

    return right({
      order,
    });
  }
}
