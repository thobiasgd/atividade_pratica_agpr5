import { Either, left, right } from '@/core/either';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '../../entities/user';
import { UsersRepository } from '../../repositories/user-repository';

interface EditUserUseCaseRequest {
  newUserCpf: string;
  newUserName: string;
}

type EditUserUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    user: User;
  }
>;

@Injectable()
export class EditUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    newUserCpf,
    newUserName,
  }: EditUserUseCaseRequest): Promise<EditUserUseCaseResponse> {
    const user = await this.usersRepository.findByCpf(newUserCpf);

    if (!user) {
      return left(new BadRequestException('User not found.'));
    }

    user.cpf = newUserCpf;
    user.name = newUserName;

    await this.usersRepository.save(user);

    return right({
      user,
    });
  }
}
