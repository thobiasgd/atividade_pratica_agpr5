import { User } from '../entities/user';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../repositories/user-repository';
import { Either, left, right } from '@/core/either';

interface AlterPasswordUseCaseRequest {
  userId: string;
  newUserPassword: string;
}

type AlterPasswordUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    user: User;
  }
>;

@Injectable()
export class AlterPasswordUseCase {
  constructor(private userRepository: UsersRepository) {}

  async execute({
    userId,
    newUserPassword,
  }: AlterPasswordUseCaseRequest): Promise<AlterPasswordUseCaseResponse> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      return left(new ResourceNotFoundError());
    }

    user.password = newUserPassword;

    await this.userRepository.alterUserPassword(user);

    return right({
      user,
    });
  }
}
