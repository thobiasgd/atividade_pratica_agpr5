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
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { z } from 'zod';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { EditUserUseCase } from '@/domain/use-cases/users/edit-user';

const editUserBodySchema = z.object({
  newUserCpf: z.string(),
  newUserName: z.string(),
});

const bodyValidationPipe = new ZodValidationPipe(editUserBodySchema);

type EditUserBodySchema = z.infer<typeof editUserBodySchema>;

@Controller('/users/edit')
export class EditUserController {
  constructor(private editUser: EditUserUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: EditUserBodySchema,
    @CurrentUser() user: UserPayload,
    @Param('id') userId: string,
  ) {
    const { newUserCpf, newUserName } = body;
    const userIdBearer = user.sub;

    if (userId !== userIdBearer) {
      new NotAllowedError();
    }

    const result = await this.editUser.execute({
      //userIdBearer,
      newUserCpf,
      newUserName,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
