import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { ApiProperty } from '@nestjs/swagger';
import z from 'zod';

const createRecipientBodySchema = z.object({
  name: z.string(),
  cpf: z.string(),
});

export const bodyValidationPipe = new ZodValidationPipe(
  createRecipientBodySchema,
);

type CreateRecipientBodySchema = z.infer<typeof createRecipientBodySchema>;

export class CreateRecipientDTO implements CreateRecipientBodySchema {
  @ApiProperty({
    description: 'Nome do destinatário.',
    example: 'John Doe',
  })
  name!: string;

  @ApiProperty({
    description: 'CPF do destinatário.',
    example: '111.111.111.11',
  })
  cpf!: string;
}
