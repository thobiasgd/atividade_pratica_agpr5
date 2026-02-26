import { ApiProperty } from '@nestjs/swagger';

export class ChecklistItemDTO {
  @ApiProperty({
    description: 'Nome do atributo do checklist',
    example: 'FOTO_ENVIADA',
  })
  atribute!: string;

  @ApiProperty({
    description: 'Indica se o item é obrigatório',
    example: true,
  })
  required!: boolean;

  @ApiProperty({
    description: 'Ordem do item dentro do checklist',
    example: 3,
  })
  sortOrder!: number;
}
