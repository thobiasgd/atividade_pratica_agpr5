import { CreateChecklistItensUseCase } from '@/domain/use-cases/checklists/insert-itens-checklist';
import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  bodyValidationPipe,
  CreateItemsChecklistTemplateDTO,
} from './dto/create-items-checklist-template.dto';

@ApiTags('Checklists')
@ApiBearerAuth()
@Controller('checklist/items')
export class CreateItemsChecklistTemplateController {
  constructor(private createChecklist: CreateChecklistItensUseCase) {}

  @Post()
  @ApiOperation({
    summary: 'Rota para designação de novos "checks" para um checklist',
  })
  @HttpCode(200)
  async handle(
    @Body(bodyValidationPipe) body: CreateItemsChecklistTemplateDTO,
  ) {
    const { templateId, items } = body;

    await this.createChecklist.execute({
      checklistItensArray: items.map((it) => ({
        templateId,
        atribute: it.atribute,
        required: it.required,
        sortOrder: it.sortOrder,
      })) as any,
    });
    return { ok: true };
  }
}
