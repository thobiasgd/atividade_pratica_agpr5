import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { ApiProperty } from '@nestjs/swagger';
import z from 'zod';

export const createOrderBodySchema = z.object({
  description: z.string(),
  status: z
    .enum(['WAITING', 'ON_THE_WAY', 'DELIVERED', 'RETURNED'])
    .default('WAITING'),
  recipientId: z.uuid(),
  addressId: z.uuid(),
  carrierId: z.uuid().optional().nullable(),
});

export const bodyValidationPipe = new ZodValidationPipe(createOrderBodySchema);

type CreateOrderBodySchema = z.infer<typeof createOrderBodySchema>;

export class CreateOrderDTO implements CreateOrderBodySchema {
  @ApiProperty({
    description: 'Descrição da encomenda.',
    example: 'Refeições enlatadas.',
  })
  description!: string;

  @ApiProperty({
    description: 'Nome do usuário.',
    enum: ['WAITING', 'ON_THE_WAY', 'DELIVERED', 'RETURNED'],
  })
  status!: 'WAITING' | 'ON_THE_WAY' | 'DELIVERED' | 'RETURNED';

  @ApiProperty({
    description: 'Id do destinatário da encomenda.',
    example: 'uuid.',
  })
  recipientId!: string;

  @ApiProperty({
    description: 'Id do endereço da encomenda.',
    example: 'uuid.',
  })
  addressId!: string;

  @ApiProperty({
    description: 'Id do entregador responsável da encomenda.',
    example: 'uuid.',
  })
  carrierId!: string;
}
