import { Address } from '@/domain/entities/address';

export class AddressPresenter {
  static toHTTP(address: Address) {
    return {
      country: address.country,
      state: address.state,
      city: address.city,
      neighborhood: address.neighborhood,
      street: address.street,
      number: address.number,
    };
  }
}
