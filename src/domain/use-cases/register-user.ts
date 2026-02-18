import { Either, left, right } from "@/core/either"
import { UserAlreadyExistsError } from "./errors/user-already-exists"
import { User, UserType } from "../entities/user"
import { Injectable } from "@nestjs/common"
import { UsersRepository } from '../repositories/user-repository'
import { HashGenerator } from '../cryptography/hash-generator'

interface RegisterUserUseCaseRequest {
    name: string
    cpf: string
    password: string
    type: UserType
}

type RegisterUserUseCaseResponse = Either<
    UserAlreadyExistsError,
    {
        user: User
    }
>

@Injectable()
export class RegisterUserUseCase {
    constructor(
        private userRepository: UsersRepository,
        private hashGenerator: HashGenerator
    ) {}

    async execute({
        name, cpf, password, type
    }: RegisterUserUseCaseRequest): Promise<RegisterUserUseCaseResponse>{
        const userWithSameEmail = await this.userRepository.findByCpf(cpf)

        if (userWithSameEmail){
            return left(new UserAlreadyExistsError(cpf))
        }

        const hashedPassword = await this.hashGenerator.hash(password)

        const user = User.create({
            name, cpf, password: hashedPassword, type
        })

        await this.userRepository.create(user)

        return right({
            user
        })
    }
}
