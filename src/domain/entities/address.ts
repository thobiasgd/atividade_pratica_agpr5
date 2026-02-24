import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export interface AddressProps {
  country: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  number: number;
  recipientId: UniqueEntityID;
}

export class Address extends Entity<AddressProps> {
  get country() {
    return this.props.country;
  }

  set country(newCountry: string) {
    this.props.country = newCountry;
  }

  get state() {
    return this.props.state;
  }

  set state(newState: string) {
    this.props.state = newState;
  }

  get city() {
    return this.props.city;
  }

  set city(newCity: string) {
    this.props.city = newCity;
  }

  get neighborhood() {
    return this.props.neighborhood;
  }

  set neighborhood(newNeighborhood: string) {
    this.props.neighborhood = newNeighborhood;
  }

  get street() {
    return this.props.street;
  }

  set street(newStreet: string) {
    this.props.street = newStreet;
  }

  get number() {
    return this.props.number;
  }

  set number(newNumber: number) {
    this.props.number = newNumber;
  }

  get recipientId() {
    return this.props.recipientId;
  }

  static create(props: AddressProps, id?: UniqueEntityID) {
    const address = new Address(props, id);

    return address;
  }
}
