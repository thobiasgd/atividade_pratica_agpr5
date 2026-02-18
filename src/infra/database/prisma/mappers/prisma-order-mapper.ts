import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Order } from '@/domain/entities/order';
import { Order as PrismaOrder, Prisma } from '@prisma/client';

export class PrismaOrderMapper {
  static toDomain(raw: PrismaOrder): Order {
    return Order.create(
      {
        description: raw.description,
        status: raw.status,
        recipientId: new UniqueEntityID(raw.recipientId),
        addressId: new UniqueEntityID(raw.addressId),
        carrierId: raw.carrierId ? new UniqueEntityID(raw.carrierId) : null,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(order: Order): Prisma.OrderUncheckedCreateInput {
    return {
      id: order.id.toString(),
      description: order.description,
      status: order.status,
      recipientId: order.recipientId.toString(),
      addressId: order.addressId.toString(),
      carrierId: order.carrierId ? order.carrierId.toString() : null,
    };
  }
}
