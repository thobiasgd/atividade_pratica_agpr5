import { Either, left, right } from '@/core/either';
import { Address } from '../entities/address';
import { Injectable } from '@nestjs/common';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { AddressRepository } from '../repositories/address-repository';

interface RegisterAddressUseCaseRequest {
  country: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  number: number;
  recipientId: UniqueEntityID;
}

type RegisterAddressUseCaseResponse = Either<
  null,
  {
    address: Address;
  }
>;

@Injectable()
export class RegisterAddressUseCase {
  constructor(private addressRepository: AddressRepository) {}

  async execute({
    country,
    state,
    city,
    neighborhood,
    street,
    number,
    recipientId,
  }: RegisterAddressUseCaseRequest): Promise<RegisterAddressUseCaseResponse> {
    const address = Address.create({
      country,
      state,
      city,
      neighborhood,
      street,
      number,
      recipientId,
    });

    await this.addressRepository.create(address);

    return right({
      address,
    });
  }
}
