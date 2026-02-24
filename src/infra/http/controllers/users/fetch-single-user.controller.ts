import { FetchSingleUserUseCase } from '@/domain/use-cases/users/fetch-single-user';
import { BadRequestException, Controller, Get, Param } from '@nestjs/common';
import { UserPresenter } from '../../presenters/user-presenter';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('/users/:userId')
export class FetchSingleUserController {
  constructor(private fetchUsers: FetchSingleUserUseCase) {}

  @Get()
  @ApiOperation({
    summary: 'Rota para listagem de um usuário único.',
  })
  async handle(@Param('userId') userId: string) {
    const result = await this.fetchUsers.execute({
      userId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const user = result.value.user;

    return UserPresenter.toHTTP(user);
  }
}
