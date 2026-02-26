import { Either, left, right } from '@/core/either';
import { Order } from '../../entities/order';
import { Injectable } from '@nestjs/common';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { OrderRepository } from '../../repositories/order-repository';
import { OrderStatus } from 'generated/enums';
import { ChecklistRepository } from '@/domain/repositories/checklist-repository';

interface RegisterOrderUseCaseRequest {
  description: string;
  status: OrderStatus;
  recipientId: UniqueEntityID;
  addressId: UniqueEntityID;
  carrierId?: UniqueEntityID | null;
  checklistId: UniqueEntityID;
}

type RegisterOrderUseCaseResponse = Either<
  null,
  {
    order: Order;
  }
>;

@Injectable()
export class RegisterOrderUseCase {
  constructor(
    private orderRepository: OrderRepository,
    private checklistRepository: ChecklistRepository,
  ) {}

  async execute({
    description,
    status,
    recipientId,
    addressId,
    carrierId,
    checklistId,
  }: RegisterOrderUseCaseRequest): Promise<RegisterOrderUseCaseResponse> {
    const order = Order.create({
      description,
      status,
      recipientId,
      addressId,
      carrierId: carrierId ?? null,
      checklistId,
    });

    await this.orderRepository.create(order);
    await this.checklistRepository.createRelationChecklistOrder(
      order.id.toString(),
      order.checklistId.toString(),
    );
    await this.checklistRepository.onOrderCreation(order.id.toString());

    return right({
      order,
    });
  }
}
