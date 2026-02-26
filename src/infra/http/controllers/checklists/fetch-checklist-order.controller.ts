import { BadRequestException, Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FetchCompleteChecklistOrderUseCase } from '@/domain/use-cases/checklists/fetch-checklist-order';

@ApiTags('Checklists')
@ApiBearerAuth()
@Controller('/checklists/:orderId')
export class FetchSingleChecklistOrderController {
  constructor(private fetchChecklist: FetchCompleteChecklistOrderUseCase) {}

  @Get()
  @ApiOperation({
    summary: 'Rota para listagem do checklist de uma encomenda.',
  })
  async handle(@Param('orderId') orderId: string) {
    const result = await this.fetchChecklist.execute({
      orderId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    return result;
  }
}
