import { Either, left, right } from '@/core/either';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Order } from '../../entities/order';
import { OrderRepository } from '../../repositories/order-repository';
import { Address } from '@/domain/entities/address';
import { AddressRepository } from '@/domain/repositories/address-repository';

interface EditAddressUseCaseRequest {
  addressId: string;
  newCountry: string;
  newState: string;
  newCity: string;
  newNeighborhood: string;
  newStreet: string;
  newNumber: number;
}

type EditAddressUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    address: Address;
  }
>;

@Injectable()
export class EditAddressUseCase {
  constructor(private addressesRepository: AddressRepository) {}

  async execute({
    addressId,
    newCountry,
    newState,
    newCity,
    newNeighborhood,
    newStreet,
    newNumber,
  }: EditAddressUseCaseRequest): Promise<EditAddressUseCaseResponse> {
    const address = await this.addressesRepository.findById(addressId);

    if (!address) {
      return left(new BadRequestException('Address not found.'));
    }

    address.country = newCountry;
    address.state = newState;
    address.city = newCity;
    address.neighborhood = newNeighborhood;
    address.street = newStreet;
    address.number = newNumber;

    await this.addressesRepository.save(address);

    return right({
      address,
    });
  }
}
