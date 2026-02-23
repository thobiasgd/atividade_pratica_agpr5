import { Either, left, right } from '@/core/either';
import { User } from '@/domain/entities/user';
import { UsersRepository } from '@/domain/repositories/user-repository';
import { BadRequestException, Injectable } from '@nestjs/common';

interface fetchListOfUsersUseCaseRequest {
  page: number;
}

type fetchListOfUsersResponse = Either<
  null,
  {
    users: User[];
  }
>;

@Injectable()
export class fetchListOfUsersUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    page,
  }: fetchListOfUsersUseCaseRequest): Promise<fetchListOfUsersResponse> {
    const users = await this.usersRepository.fetchListOfUsers(page);

    return right({
      users,
    });
  }
}
