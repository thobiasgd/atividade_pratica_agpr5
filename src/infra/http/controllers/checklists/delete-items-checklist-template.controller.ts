import { Body, Controller, Delete, HttpCode } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  bodyValidationPipe,
  DeleteItemsChecklistTemplateDTO,
} from './dto/delete-items-checklist-template.dto';
import { DeleteChecklistItensUseCase } from '@/domain/use-cases/checklists/delete-itens-checklist';

@ApiTags('Checklists')
@ApiBearerAuth()
@Controller('checklist/items')
export class DeleteItemsChecklistTemplateController {
  constructor(private deleteChecklist: DeleteChecklistItensUseCase) {}

  @Delete()
  @ApiOperation({
    summary:
      'Remove itens de um checklist (cria nova versão e remove os itens nela)',
  })
  @HttpCode(200)
  async handle(
    @Body(bodyValidationPipe) body: DeleteItemsChecklistTemplateDTO,
  ) {
    const { templateId, items } = body;

    const templateItemIdsToRemove = items.map((it) => it.id);

    await this.deleteChecklist.execute({
      templateId,
      templateItemIdsToRemove,
    });
  }
}
