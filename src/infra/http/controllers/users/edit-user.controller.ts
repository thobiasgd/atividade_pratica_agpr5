import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
} from '@nestjs/common';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { EditUserUseCase } from '@/domain/use-cases/users/edit-user';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { bodyValidationPipe, EditUserDTO } from './dto/edit-user.dto';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('/users/edit')
export class EditUserController {
  constructor(private editUser: EditUserUseCase) {}

  @Put()
  @ApiOperation({
    summary: 'Rota para edição de usuários existentes.',
  })
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: EditUserDTO,
    @CurrentUser() user: UserPayload,
    @Param('id') userId: string,
  ) {
    const { newUserCpf, newUserName } = body;
    const userIdBearer = user.sub;

    if (userId !== userIdBearer) {
      new NotAllowedError();
    }

    const result = await this.editUser.execute({
      newUserCpf,
      newUserName,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
