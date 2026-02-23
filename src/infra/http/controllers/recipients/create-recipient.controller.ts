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

const createRecipientBodySchema = z.object({
  name: z.string(),
  cpf: z.string(),
});

const bodyValidationPipe = new ZodValidationPipe(createRecipientBodySchema);

type CreateRecipientBodySchema = z.infer<typeof createRecipientBodySchema>;

@Controller('/recipients')
export class CreateRecipientController {
  constructor(private registerRecipient: RegisterRecipientUseCase) {}

  @Post()
  @Roles('ADMIN')
  @HttpCode(201)
  async handle(@Body(bodyValidationPipe) body: CreateRecipientBodySchema) {
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
