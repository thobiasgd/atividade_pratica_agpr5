import { RegisterUserUseCase } from '@/domain/use-cases/users/register-user';
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common';
import { UserAlreadyExistsError } from '@/core/errors/errors/user-already-exists';
import { Roles } from '@/infra/auth/roles';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { bodyValidationPipe, CreateUserDTO } from './dto/create-user.dto';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('/users')
export class CreateUserController {
  constructor(private registerUser: RegisterUserUseCase) {}

  @Post()
  @ApiOperation({
    summary: 'Rota para criação de novos usuários.',
  })
  @Roles('ADMIN')
  @HttpCode(201)
  async handle(@Body(bodyValidationPipe) body: CreateUserDTO) {
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
