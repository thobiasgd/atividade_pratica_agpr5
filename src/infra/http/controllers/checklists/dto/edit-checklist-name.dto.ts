import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { ApiProperty } from '@nestjs/swagger';
import z from 'zod';

const editChecklistNameBodySchema = z.object({
  newChecklistName: z.string(),
});

export const bodyValidationPipe = new ZodValidationPipe(
  editChecklistNameBodySchema,
);

type EditChecklistNameBodySchema = z.infer<typeof editChecklistNameBodySchema>;

export class EditChecklistNameDTO implements EditChecklistNameBodySchema {
  @ApiProperty({
    description: 'Novo nome do checklist.',
  })
  newChecklistName!: string;
}
