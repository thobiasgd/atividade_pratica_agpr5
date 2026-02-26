import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { ApiProperty } from '@nestjs/swagger';
import z from 'zod';

const checkAndUncheckChecklistItemBodySchema = z.object({
  items: z.array(
    z.object({
      checklistInstanceItemId: z.uuid(),
      values: z.boolean(),
    }),
  ),
});

export const bodyValidationPipe = new ZodValidationPipe(
  checkAndUncheckChecklistItemBodySchema,
);

type checkAndUncheckChecklistItemBodySchema = z.infer<
  typeof checkAndUncheckChecklistItemBodySchema
>;

export class CheckAndUncheckChecklistItemDTO implements checkAndUncheckChecklistItemBodySchema {
  @ApiProperty({
    description: 'Lista de itens a serem checados.',
    example: [
      {
        checklistInstanceItemId: 'uuid',
        values: true,
      },
      {
        checklistInstanceItemId: 'uuid',
        values: false,
      },
    ],
  })
  items!: {
    checklistInstanceItemId: string;
    values: boolean;
  }[];
}
