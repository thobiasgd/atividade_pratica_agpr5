import { Either, right } from '@/core/either';
import { Order } from '../../entities/order';
import { Injectable } from '@nestjs/common';
import { RecipientsRepository } from '@/domain/repositories/recipient-repository';
import { Address } from '@/domain/entities/address';
import { AddressRepository } from '@/domain/repositories/address-repository';

interface FetchRecipientOrdersRequest {
  recipientId: string;
}

type FetchRecipientOrdersResponse = Either<
  null,
  {
    addresses: Address[];
  }
>;

@Injectable()
export class FetchRecipientAddressesUseCase {
  constructor(private addressRepository: AddressRepository) {}

  async execute({
    recipientId,
  }: FetchRecipientOrdersRequest): Promise<FetchRecipientOrdersResponse> {
    const addresses =
      await this.addressRepository.fetchListOfRecipientsAddresses(recipientId);

    return right({
      addresses,
    });
  }
}
