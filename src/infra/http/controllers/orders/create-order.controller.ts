import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common';
import z from 'zod';
import { Roles } from '@/infra/auth/roles';
import { RegisterOrderUseCase } from '@/domain/use-cases/orders/register-order';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  bodyValidationPipe,
  createOrderBodySchema,
  CreateOrderDTO,
} from './dto/create-order.dto';

@ApiTags('Orders')
@ApiBearerAuth()
@Controller('/orders')
export class CreateOrderController {
  constructor(private registerOrder: RegisterOrderUseCase) {}

  @Post()
  @ApiOperation({
    summary: 'Rota para criação de novas encomendas.',
  })
  @Roles('ADMIN')
  @HttpCode(201)
  async handle(@Body(bodyValidationPipe) body: CreateOrderDTO) {
    const { description, status, recipientId, addressId, carrierId } =
      createOrderBodySchema.parse(body);

    const result = await this.registerOrder.execute({
      description,
      status,
      recipientId: new UniqueEntityID(recipientId),
      addressId: new UniqueEntityID(addressId),
      carrierId: carrierId ? new UniqueEntityID(carrierId) : null,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
