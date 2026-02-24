import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { DeleteUserUseCase } from '@/domain/use-cases/users/delete-user';
import { Roles } from '@/infra/auth/roles';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('/users/:id')
export class DeleteUserController {
  constructor(private deleteUser: DeleteUserUseCase) {}

  @Delete()
  @ApiOperation({
    summary: 'Rota para remoção de usuários existentes.',
  })
  @Roles('ADMIN')
  @HttpCode(204)
  async handle(@CurrentUser() user: UserPayload, @Param('id') userId: string) {
    const result = await this.deleteUser.execute({
      userId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
