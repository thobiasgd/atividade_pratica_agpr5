import { Public } from '@/infra/auth/public';
import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe';
import { WrongCredentialsError } from '@/core/errors/errors/wrong-credentials-error';
import { AuthenticateUserUseCase } from '@/domain/use-cases/users/authenticate-user';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  authenticateBodySchema,
  authenticateBodyValidationPipe,
  AuthenticateDTO,
} from './dto/authenticate.dto';

@ApiTags('Authentication')
@ApiBearerAuth()
@Controller('/sessions')
@Public()
export class AuthenticateController {
  constructor(private authenticateUser: AuthenticateUserUseCase) {}

  @Post()
  @ApiOperation({
    summary: 'Rota para autenticação do usuário para geração de JWT token.',
  })
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(@Body(authenticateBodyValidationPipe) body: AuthenticateDTO) {
    const { cpf, password } = body;

    const result = await this.authenticateUser.execute({
      cpf,
      password,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    const { accessToken } = result.value;

    return {
      access_token: accessToken,
    };
  }
}
