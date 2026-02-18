import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Address } from '@/domain/entities/address';
import { PrismaAddressMapper } from '../mappers/prisma-address-mapper';
import { AddressRepository } from '@/domain/repositories/address-repository';

@Injectable()
export class PrismaAddressRepository implements AddressRepository {
  constructor(private prisma: PrismaService) {}

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
}
