import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common';
import z from 'zod';
import { Roles } from '@/infra/auth/roles';
import { RegisterOrderUseCase } from '@/domain/use-cases/register-order';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

const createOrderBodySchema = z.object({
  description: z.string(),
  status: z
    .enum(['WAITING', 'ON_THE_WAY', 'DELIVERED', 'RETURNED'])
    .default('WAITING'),
  recipientId: z.uuid(),
  addressId: z.uuid(),
  carrierId: z.uuid().optional().nullable(),
});

type CreateOrderBodySchema = z.infer<typeof createOrderBodySchema>;

@Controller('/orders')
export class CreateOrderController {
  constructor(private registerOrder: RegisterOrderUseCase) {}

  @Post()
  @Roles('ADMIN')
  @HttpCode(201)
  async handle(@Body() body: CreateOrderBodySchema) {
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
