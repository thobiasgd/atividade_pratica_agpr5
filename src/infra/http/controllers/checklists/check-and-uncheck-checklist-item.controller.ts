import { Body, Controller, HttpCode, Param, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  bodyValidationPipe,
  CheckAndUncheckChecklistItemDTO,
} from './dto/check-and-uncheck-checklist-item.dto';
import { CheckAndUncheckChecklistItemUseCase } from '@/domain/use-cases/checklists/check-and-uncheck-checklist-item';

@ApiTags('Checklists')
@ApiBearerAuth()
@Controller('/checklists/:orderId')
export class CheckAndUncheckChecklistItemController {
  constructor(
    private checkAndUncheckChecklistItem: CheckAndUncheckChecklistItemUseCase,
  ) {}

  @Patch()
  @ApiOperation({
    summary: 'Rota para checagem de itens de um determinado checklist.',
  })
  @HttpCode(200)
  async handle(
    @Param('orderId') orderId: string,
    @Body(bodyValidationPipe) body: CheckAndUncheckChecklistItemDTO,
  ) {
    const result = await this.checkAndUncheckChecklistItem.execute({
      orderId,
      body: body.items,
    });
  }
}
