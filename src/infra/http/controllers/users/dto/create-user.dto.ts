import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { ApiProperty } from '@nestjs/swagger';
import z from 'zod';

const createUserBodySchema = z.object({
  name: z.string(),
  cpf: z.string(),
  password: z.string(),
  type: z.enum(['ADMIN', 'EMPLOYEE']),
});

export const bodyValidationPipe = new ZodValidationPipe(createUserBodySchema);

type CreateUserBodySchema = z.infer<typeof createUserBodySchema>;

export class CreateUserDTO implements CreateUserBodySchema {
  @ApiProperty({
    description: 'Nome do usuário.',
  })
  name!: string;

  @ApiProperty({
    description: 'CPF do usuário.',
  })
  cpf!: string;

  @ApiProperty({
    description: 'Senha do usuário.',
  })
  password!: string;

  @ApiProperty({ enum: ['ADMIN', 'EMPLOYEE'] })
  type!: 'ADMIN' | 'EMPLOYEE';
}
