import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Order, OrderStatus } from '@/domain/entities/order';
import { PrismaOrderMapper } from '../mappers/prisma-order-mapper';
import { OrderRepository } from '@/domain/repositories/order-repository';
import { DomainEvents } from '@/core/events/domain-events';
import { OrderWithDetails } from '@/domain/entities/orderWithDetails';

@Injectable()
export class PrismaOrderRepository implements OrderRepository {
  constructor(private prisma: PrismaService) {}

  async fetchListOfOrders(page: number): Promise<OrderWithDetails[]> {
    const orders = await this.prisma.order.findMany({
      take: 20,
      skip: (page - 1) * 20,
      include: {
        address: {
          select: {
            country: true,
            state: true,
            city: true,
            neighborhood: true,
            street: true,
          },
        },
        recipient: true,
        carrier: true,
      },
    });

    return orders.map(PrismaOrderMapper.toDomainWithDetails);
  }

  async listNearOrders(neighborhood: string): Promise<Order[]> {
    const orders = await this.prisma.order.findMany({
      where: {
        address: {
          neighborhood: neighborhood,
        },
      },
    });

    return orders.map(PrismaOrderMapper.toDomain);
  }

  async findById(id: string): Promise<Order | null> {
    const order = await this.prisma.order.findUnique({
      where: {
        id,
      },
    });

    if (!order) {
      return null;
    }

    return PrismaOrderMapper.toDomain(order);
  }

  async asignOrderToCarrier(order: Order): Promise<void> {
    const data = PrismaOrderMapper.toPrisma(order);

    await this.prisma.order.update({
      where: {
        id: order.id.toString(),
      },
      data,
    });
  }

  async changeOrderStatus(order: Order, status: OrderStatus): Promise<void> {
    await this.prisma.order.update({
      where: {
        id: order.id.toString(),
      },
      data: {
        status,
      },
    });
  }

  async create(order: Order): Promise<void> {
    console.log('[OrderRepository] Salvando pedido:', order.id.toString());

    await this.prisma.order.create({
      data: {
        id: order.id.toString(),
        description: order.description,
        status: order.status,
        recipientId: order.recipientId.toString(),
        addressId: order.addressId.toString(),
        carrierId: order.carrierId ? order.carrierId.toString() : null,
      },
    });

    console.log('[OrderRepository] Disparando DomainEvents');
    DomainEvents.dispatchEventsForAggregate(order.id);
  }

  async save(order: Order): Promise<void> {
    const data = PrismaOrderMapper.toPrisma(order);

    await Promise.all([
      this.prisma.order.update({
        where: {
          id: order.id.toString(),
        },
        data,
      }),
    ]);
  }

  async delete(order: Order): Promise<void> {
    const data = PrismaOrderMapper.toPrisma(order);

    await this.prisma.order.delete({
      where: {
        id: data.id,
      },
    });
  }
}
