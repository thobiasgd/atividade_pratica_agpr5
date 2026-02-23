import { UsersRepository } from '@/domain/repositories/user-repository';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { User } from '@/domain/entities/user';
import { PrismaUserMapper } from '../mappers/prisma-user-mapper';
import { Order } from '@/domain/entities/order';
import { PrismaOrderMapper } from '../mappers/prisma-order-mapper';

@Injectable()
export class PrismaUserRepository implements UsersRepository {
  constructor(private prisma: PrismaService) {}

  async fetchUserOrders(userId: string): Promise<Order[]> {
    const userOrders = await this.prisma.order.findMany({
      where: {
        carrierId: userId,
      },
    });

    return userOrders.map(PrismaOrderMapper.toDomain);
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    return user ? PrismaUserMapper.toDomain(user) : null;
  }

  async alterUserPassword(user: User): Promise<void> {
    const data = PrismaUserMapper.toPrisma(user);

    await this.prisma.user.update({
      where: {
        id: user.id.toString(),
      },
      data,
    });
  }

  async findByCpf(cpf: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        cpf,
      },
    });
    if (!user) {
      return null;
    }

    return PrismaUserMapper.toDomain(user);
  }

  async create(user: User): Promise<void> {
    const data = PrismaUserMapper.toPrisma(user);

    await this.prisma.user.create({
      data,
    });
  }

  async fetchListOfUsers(page: number): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      take: 20,
      skip: (page - 1) * 20,
    });

    return users.map(PrismaUserMapper.toDomain);
  }

  async save(user: User): Promise<void> {
    const data = PrismaUserMapper.toPrisma(user);

    await Promise.all([
      this.prisma.user.update({
        where: {
          id: user.id.toString(),
        },
        data,
      }),
    ]);
  }

  async delete(user: User): Promise<void> {
    const data = PrismaUserMapper.toPrisma(user);

    await this.prisma.user.delete({
      where: {
        id: data.id,
      },
    });
  }
}
