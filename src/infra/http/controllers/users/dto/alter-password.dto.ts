import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { ApiProperty } from '@nestjs/swagger';
import z from 'zod';

const alterPasswordBodySchema = z.object({
  newUserPassword: z.string(),
});

export const bodyValidationPipe = new ZodValidationPipe(
  alterPasswordBodySchema,
);

type AlterPasswordBodySchema = z.infer<typeof alterPasswordBodySchema>;

export class AlterPasswordDTO implements AlterPasswordBodySchema {
  @ApiProperty({
    description: 'Nova senha do usuário',
  })
  newUserPassword!: string;
}
