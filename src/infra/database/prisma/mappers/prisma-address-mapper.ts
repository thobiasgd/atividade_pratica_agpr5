import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Address } from '@/domain/entities/address';
import { Address as PrismaAddress, Prisma } from '@prisma/client';

export class PrismaAddressMapper {
  static toDomain(raw: PrismaAddress): Address {
    return Address.create(
      {
        country: raw.country,
        state: raw.state,
        city: raw.city,
        neighborhood: raw.neighborhood,
        street: raw.street,
        number: raw.number,
        recipientId: new UniqueEntityID(raw.recipientId),
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(address: Address): Prisma.AddressUncheckedCreateInput {
    return {
      id: address.id.toString(),
      country: address.country,
      state: address.state,
      city: address.city,
      neighborhood: address.neighborhood,
      street: address.street,
      number: address.number,
      recipientId: address.recipientId.toString(),
    };
  }
}
