import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { ApiProperty } from '@nestjs/swagger';
import z from 'zod';

const recipientAddressBodySchema = z.object({
  country: z.string(),
  state: z.string(),
  city: z.string(),
  neighborhood: z.string(),
  street: z.string(),
  number: z.coerce.number().int(),
});

export const recipientIdParamSchema = z.uuid();

export const bodyValidationPipe = new ZodValidationPipe(
  recipientAddressBodySchema,
);

type RecipientAddressBodySchema = z.infer<typeof recipientAddressBodySchema>;

export class CreateAddressDTO implements RecipientAddressBodySchema {
  @ApiProperty({
    description: 'País do usuário.',
  })
  country!: string;

  @ApiProperty({
    description: 'Estado do usuário.',
  })
  state!: string;

  @ApiProperty({
    description: 'Cidade do usuário.',
  })
  city!: string;

  @ApiProperty({
    description: 'Bairro do usuário.',
  })
  neighborhood!: string;

  @ApiProperty({
    description: 'Rua do usuário.',
  })
  street!: string;

  @ApiProperty({
    description: 'Número da casa do usuário.',
  })
  number!: number;
}
