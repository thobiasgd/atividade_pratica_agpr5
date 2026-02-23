import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Order } from '@/domain/entities/order';
import { OrderWithDetails } from '@/domain/entities/orderWithDetails';
import {
  Order as PrismaOrder,
  Prisma,
  Recipient as PrismaRecipient,
  User as PrismaCarrier,
} from '@prisma/client';

type PrismaOrderWithDetails = PrismaOrder & {
  address: {
    country: string;
    state: string;
    city: string;
    neighborhood: string;
    street: string;
  };
  recipient: PrismaRecipient;
  carrier: PrismaCarrier | null;
};

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

  static toDomainWithDetails(raw: PrismaOrderWithDetails): OrderWithDetails {
    return OrderWithDetails.create(
      {
        description: raw.description,
        status: raw.status,
        recipientName: raw.recipient.name,
        completeAddress: raw.address as any,
        carrierName: raw.carrier?.name ?? null,
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
