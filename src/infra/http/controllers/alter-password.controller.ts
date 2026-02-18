import { Roles } from '@/infra/auth/roles';
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Patch,
} from '@nestjs/common';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import z from 'zod';
import { AlterPasswordUseCase } from '@/domain/use-cases/alter-user-password';
import { HashGenerator } from '@/domain/cryptography/hash-generator';

const alterPasswordBodySchema = z.object({
  newUserPassword: z.string(),
});

const bodyValidationPipe = new ZodValidationPipe(alterPasswordBodySchema);

type AlterPasswordBodySchema = z.infer<typeof alterPasswordBodySchema>;

@Controller('/users/:userId/alter-password')
export class AlterPasswordController {
  constructor(
    private alterPassword: AlterPasswordUseCase,
    private hashGenerator: HashGenerator,
  ) {}

  @Patch()
  @Roles('ADMIN')
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: AlterPasswordBodySchema,
    @Param('userId') userId: string,
  ) {
    let { newUserPassword } = body;
    newUserPassword = await this.hashGenerator.hash(newUserPassword);

    const result = await this.alterPassword.execute({
      userId,
      newUserPassword,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
