import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Address } from '@/domain/entities/address';
import { PrismaAddressMapper } from '../mappers/prisma-address-mapper';
import { AddressRepository } from '@/domain/repositories/address-repository';

@Injectable()
export class PrismaAddressRepository implements AddressRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Address | null> {
    const address = await this.prisma.address.findUnique({ where: { id } });
    return address ? PrismaAddressMapper.toDomain(address) : null;
  }

  async fetchListOfRecipientsAddresses(
    recipientId: string,
  ): Promise<Address[]> {
    const addresses = await this.prisma.address.findMany({
      where: {
        recipientId: recipientId,
      },
    });

    return addresses.map(PrismaAddressMapper.toDomain);
  }

  async save(address: Address): Promise<void> {
    const data = PrismaAddressMapper.toPrisma(address);

    await this.prisma.address.update({
      where: {
        id: address.id.toString(),
      },
      data,
    });
  }

  async findByNeighborhood(neighborhood: string): Promise<Address[] | null> {
    const addresses = await this.prisma.address.findMany({
      where: {
        neighborhood,
      },
    });

    return addresses.map(PrismaAddressMapper.toDomain);
  }

  async create(address: Address): Promise<void> {
    const data = PrismaAddressMapper.toPrisma(address);

    await this.prisma.address.create({
      data,
    });
  }

  async delete(address: Address): Promise<void> {
    const data = PrismaAddressMapper.toPrisma(address);

    await this.prisma.order.deleteMany({
      where: {
        addressId: data.id,
      },
    });

    await this.prisma.address.delete({
      where: {
        id: data.id,
      },
    });
  }
}
