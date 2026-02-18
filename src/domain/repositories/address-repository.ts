import { Address } from '../entities/address';

export abstract class AddressRepository {
  abstract findByNeighborhood(neighborhood: string): Promise<Address[] | null>;
  abstract create(user: Address): Promise<void>;
}
