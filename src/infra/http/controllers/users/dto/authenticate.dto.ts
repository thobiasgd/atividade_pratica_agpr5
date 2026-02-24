import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { ApiProperty } from '@nestjs/swagger';
import z from 'zod';

export const authenticateBodySchema = z.object({
  cpf: z.string(),
  password: z.string(),
});

export const authenticateBodyValidationPipe = new ZodValidationPipe(
  authenticateBodySchema,
);

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>;

export class AuthenticateDTO implements AuthenticateBodySchema {
  @ApiProperty({
    description: 'CPF do usuário.',
    example: '123.456.789.10',
  })
  cpf!: string;

  @ApiProperty({
    description: 'Senha do usuário.',
    example: '111111',
  })
  password!: string;
}
