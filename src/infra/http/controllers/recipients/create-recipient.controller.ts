import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common';
import z from 'zod';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe';
import { RecipientAlreadyExistsError } from '@/core/errors/errors/recipient-already-exists';
import { RegisterRecipientUseCase } from '@/domain/use-cases/recipients/register-recipient';
import { Roles } from '@/infra/auth/roles';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  bodyValidationPipe,
  CreateRecipientDTO,
} from './dto/create-recipient.dto';

@ApiTags('Recipients')
@ApiBearerAuth()
@Controller('/recipients')
export class CreateRecipientController {
  constructor(private registerRecipient: RegisterRecipientUseCase) {}

  @Post()
  @ApiOperation({
    summary: 'Rota para criação de novos destinatários',
  })
  @Roles('ADMIN')
  @HttpCode(201)
  async handle(@Body(bodyValidationPipe) body: CreateRecipientDTO) {
    const { name, cpf } = body;

    const result = await this.registerRecipient.execute({
      name,
      cpf,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case RecipientAlreadyExistsError:
          throw new ConflictException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}
