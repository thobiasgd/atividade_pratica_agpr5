import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { ApiProperty } from '@nestjs/swagger';
import z from 'zod';
import { DeleteChecklistItemDTO } from './item.dto';

const deleteItemsChecklistTemplateBodySchema = z.object({
  templateId: z.string().uuid(),
  items: z
    .array(
      z.object({
        id: z.string().uuid(),
      }),
    )
    .min(1),
});

export const bodyValidationPipe = new ZodValidationPipe(
  deleteItemsChecklistTemplateBodySchema,
);

type DeleteItemsChecklistTemplateBodySchema = z.infer<
  typeof deleteItemsChecklistTemplateBodySchema
>;

export class DeleteItemsChecklistTemplateDTO implements DeleteItemsChecklistTemplateBodySchema {
  @ApiProperty({
    description: 'Id do checklist (template) base',
    example: 'uuid-do-template',
  })
  templateId!: string;

  @ApiProperty({
    description: 'Lista de itens (IDs) a serem removidos do checklist',
    type: [DeleteChecklistItemDTO],
    example: [{ id: 'uuid-item-1' }, { id: 'uuid-item-2' }],
  })
  items!: DeleteChecklistItemDTO[];
}
