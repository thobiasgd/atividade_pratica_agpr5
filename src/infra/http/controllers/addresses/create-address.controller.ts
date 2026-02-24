import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
} from '@nestjs/common';
import { RegisterAddressUseCase } from '@/domain/use-cases/addresses/register-address';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Roles } from '@/infra/auth/roles';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  bodyValidationPipe,
  CreateAddressDTO,
  recipientIdParamSchema,
} from './dto/create-address.dto';

@ApiTags('Addresses')
@ApiBearerAuth()
@Controller('/recipients/:recipientId/addresses')
export class AddressRecipientController {
  constructor(private recipientAddress: RegisterAddressUseCase) {}

  @Post()
  @ApiOperation({
    summary: 'Rota para criação de novos endereços.',
  })
  @Roles('ADMIN')
  async handle(
    @Body(bodyValidationPipe) body: CreateAddressDTO,
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
