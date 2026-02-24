import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { ApiProperty } from '@nestjs/swagger';
import z from 'zod';

const editRecipientBodySchema = z.object({
  newRecipientCpf: z.string(),
  newRecipientName: z.string(),
});

export const bodyValidationPipe = new ZodValidationPipe(
  editRecipientBodySchema,
);

type EditRecipientBodySchema = z.infer<typeof editRecipientBodySchema>;

export class EditRecipientDTO implements EditRecipientBodySchema {
  @ApiProperty({
    description: 'Novo nome para o destinatário.',
    example: 'John Cena.',
  })
  newRecipientName!: string;

  @ApiProperty({
    description: 'Novo CPF do destinatário.',
    example: '222.222.222.22',
  })
  newRecipientCpf!: string;
}
