import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { DeleteUserUseCase } from '@/domain/use-cases/delete-user';
import { Roles } from '@/infra/auth/roles';

@Controller('/users/:id')
export class DeleteUserController {
  constructor(private deleteUser: DeleteUserUseCase) {}

  @Delete()
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
