import { Roles } from '@/infra/auth/roles';
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Patch,
} from '@nestjs/common';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe';
import z from 'zod';
import { AlterPasswordUseCase } from '@/domain/use-cases/users/alter-user-password';
import { HashGenerator } from '@/domain/cryptography/hash-generator';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AlterPasswordDTO, bodyValidationPipe } from './dto/alter-password.dto';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('/users/:userId/alter-password')
export class AlterPasswordController {
  constructor(
    private alterPassword: AlterPasswordUseCase,
    private hashGenerator: HashGenerator,
  ) {}

  @Patch()
  @ApiOperation({
    summary: 'Rota para alteração de senha de usuário.',
  })
  @Roles('ADMIN')
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: AlterPasswordDTO,
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
