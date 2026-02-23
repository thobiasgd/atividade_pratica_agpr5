import { Either, left, right } from '@/core/either';
import { User } from '@/domain/entities/user';
import { UsersRepository } from '@/domain/repositories/user-repository';
import { Injectable } from '@nestjs/common';
import { UserNotFoundError } from './errors/user-not-found-error';

interface FetchSingleUsersUseCaseRequest {
  userId: string;
}

type FetchSingleUsersUseCaseResponse = Either<
  UserNotFoundError,
  {
    user: User;
  }
>;

@Injectable()
export class FetchSingleUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
  }: FetchSingleUsersUseCaseRequest): Promise<FetchSingleUsersUseCaseResponse> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      return left(new UserNotFoundError(userId));
    }

    return right({
      user,
    });
  }
}
