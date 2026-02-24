import { Address } from '../entities/address';

export abstract class AddressRepository {
  abstract findByNeighborhood(neighborhood: string): Promise<Address[] | null>;
  abstract create(user: Address): Promise<void>;
  abstract fetchListOfRecipientsAddresses(
    recipientId: string,
  ): Promise<Address[]>;
  abstract save(address: Address): Promise<void>;
  abstract findById(id: string): Promise<Address | null>;
  abstract delete(address: Address): Promise<void>;
}
