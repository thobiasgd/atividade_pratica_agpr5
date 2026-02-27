import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { ApiProperty } from '@nestjs/swagger';
import z from 'zod';

const createChecklistTemplateBodySchema = z.object({
  checklistName: z.string(),
  version: z.number(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
});

export const bodyValidationPipe = new ZodValidationPipe(
  createChecklistTemplateBodySchema,
);

type CreateChecklistTemplateBodySchema = z.infer<
  typeof createChecklistTemplateBodySchema
>;

export class CreateChecklistTemplateDTO implements CreateChecklistTemplateBodySchema {
  @ApiProperty({
    description: 'Nome do checklist.',
    example: 'Checklist de entrega',
  })
  checklistName!: string;

  @ApiProperty({
    description: 'Versão do checklist.',
    example: 0,
  })
  version!: number;

  @ApiProperty({
    description: 'Estado atual do checklist.',
    enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'],
    example: 'DRAFT',
  })
  status!: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
}
