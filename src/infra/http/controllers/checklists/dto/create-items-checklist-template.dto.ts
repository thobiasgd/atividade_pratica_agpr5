import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { ApiProperty } from '@nestjs/swagger';
import z from 'zod';
import { ChecklistItemDTO } from './item.dto';

const createItemsChecklistTemplateBodySchema = z.object({
  templateId: z.string(),
  items: z.array(
    z.object({
      atribute: z.string(),
      required: z.boolean(),
      sortOrder: z.number(),
    }),
  ),
});

export const bodyValidationPipe = new ZodValidationPipe(
  createItemsChecklistTemplateBodySchema,
);

type CreateItemsChecklistTemplateBodySchema = z.infer<
  typeof createItemsChecklistTemplateBodySchema
>;

export class CreateItemsChecklistTemplateDTO {
  @ApiProperty({
    description: 'Id do checklist que receberá os itens',
    example: 'uuid-do-template',
  })
  templateId!: string;

  @ApiProperty({
    description: 'Lista de itens do checklist',
    type: [ChecklistItemDTO],
  })
  items!: ChecklistItemDTO[];
}
