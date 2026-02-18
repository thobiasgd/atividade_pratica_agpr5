import z from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
} from '@nestjs/common';
import { RegisterAddressUseCase } from '@/domain/use-cases/register-address';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Roles } from '@/infra/auth/roles';

const recipientAddressBodySchema = z.object({
  country: z.string(),
  state: z.string(),
  city: z.string(),
  neighborhood: z.string(),
  street: z.string(),
  number: z.coerce.number().int(),
});

const recipientIdParamSchema = z.uuid();

const bodyValidationPipe = new ZodValidationPipe(recipientAddressBodySchema);

type RecipientAddressBodySchema = z.infer<typeof recipientAddressBodySchema>;

@Controller('/recipients/:recipientId/addresses')
export class AddressRecipientController {
  constructor(private recipientAddress: RegisterAddressUseCase) {}

  @Post()
  @Roles('ADMIN')
  async handle(
    @Body(bodyValidationPipe) body: RecipientAddressBodySchema,
    @Param('recipientId') recipientId: string,
  ) {
    const { country, state, city, neighborhood, street, number } = body;

    const parsedRecipientId = recipientIdParamSchema.parse(recipientId);

    const result = await this.recipientAddress.execute({
      country,
      state,
      city,
      neighborhood,
      street,
      number,
      recipientId: new UniqueEntityID(parsedRecipientId),
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
