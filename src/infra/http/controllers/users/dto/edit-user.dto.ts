import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { ApiProperty } from '@nestjs/swagger';
import z from 'zod';

const editUserBodySchema = z.object({
  newUserCpf: z.string(),
  newUserName: z.string(),
});

export const bodyValidationPipe = new ZodValidationPipe(editUserBodySchema);

type EditUserBodySchema = z.infer<typeof editUserBodySchema>;

export class EditUserDTO implements EditUserBodySchema {
  @ApiProperty({
    description: 'Novo CPF do usuário.',
  })
  newUserCpf!: string;

  @ApiProperty({
    description: 'Novo nome do usuário.',
  })
  newUserName!: string;
}
