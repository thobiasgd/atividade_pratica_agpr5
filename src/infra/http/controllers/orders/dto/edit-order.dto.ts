import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { ApiProperty } from '@nestjs/swagger';
import z from 'zod';

const editOrderBodySchema = z.object({
  newOrderDescription: z.string(),
});

export const bodyValidationPipe = new ZodValidationPipe(editOrderBodySchema);

type EditOrderBodySchema = z.infer<typeof editOrderBodySchema>;

export class EditOrderDTO implements EditOrderBodySchema {
  @ApiProperty({
    description: 'Nova descrição da encomenda.',
    example: 'Refeição enlatada refrigerada.',
  })
  newOrderDescription!: string;
}
