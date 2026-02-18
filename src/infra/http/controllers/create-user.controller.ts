import { RegisterUserUseCase } from '@/domain/use-cases/register-user';
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common';
import z from 'zod';
import { UserAlreadyExistsError } from '@/domain/use-cases/errors/user-already-exists';
import { Roles } from '@/infra/auth/roles';
import { Public } from '@/infra/auth/public';

const createUserBodySchema = z.object({
  name: z.string(),
  cpf: z.string(),
  password: z.string(),
  type: z.enum(['ADMIN', 'EMPLOYEE']),
});

type CreateUserBodySchema = z.infer<typeof createUserBodySchema>;

@Controller('/users')
export class CreateUserController {
  constructor(private registerUser: RegisterUserUseCase) {}

  @Post()
  @Roles('ADMIN')
  //@Public()
  @HttpCode(201)
  async handle(@Body() body: CreateUserBodySchema) {
    const { name, cpf, password, type } = body;

    const result = await this.registerUser.execute({
      name,
      cpf,
      password,
      type,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case UserAlreadyExistsError:
          throw new ConflictException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}
