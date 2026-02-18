import { Entity } from "@/core/entities/entity"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"

export interface AddressProps {
    country:      string 
    state:        string
    city:         string
    neighborhood: string
    street:       string
    number:       number
    recipientId:  UniqueEntityID
}

export class Address extends Entity<AddressProps> {
    get country() {
        return this.props.country
    }

    get state() {
        return this.props.state
    }

    get city() {
        return this.props.city
    }

    get neighborhood() {
        return this.props.neighborhood
    }

    get street() {
        return this.props.street
    }

    get number() {
        return this.props.number
    }

    get recipientId() {
        return this.props.recipientId
    }

    static create(props: AddressProps, id?: UniqueEntityID){
        const address = new Address(props, id)

        return address
    }
}