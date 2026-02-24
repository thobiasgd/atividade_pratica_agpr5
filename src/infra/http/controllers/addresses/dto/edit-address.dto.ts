import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { ApiProperty } from '@nestjs/swagger';
import z from 'zod';

const editAddressBodySchema = z.object({
  newCountry: z.string(),
  newState: z.string(),
  newCity: z.string(),
  newNeighborhood: z.string(),
  newStreet: z.string(),
  newNumber: z.number(),
});

export const bodyValidationPipe = new ZodValidationPipe(editAddressBodySchema);

type EditAddressBodySchema = z.infer<typeof editAddressBodySchema>;

export class EditAddressDTO implements EditAddressBodySchema {
  @ApiProperty({
    description: 'Novo país do endereço.',
    example: 'Brasil',
  })
  newCountry!: string;

  @ApiProperty({
    description: 'Novo estado do endereço.',
    example: 'Santa Catarina',
  })
  newState!: string;

  @ApiProperty({
    description: 'Nova cidade do endereço.',
    example: 'Criciúma',
  })
  newCity!: string;

  @ApiProperty({
    description: 'Novo bairro do endereço.',
    example: 'Centro',
  })
  newNeighborhood!: string;

  @ApiProperty({
    description: 'Nova rua do endereço.',
    example: 'Centenário',
  })
  newStreet!: string;

  @ApiProperty({
    description: 'Nova numeração do endereço.',
    example: 2525,
  })
  newNumber!: number;
}
