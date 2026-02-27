import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FetchAllCompleteChecklistOrderUseCase } from '@/domain/use-cases/checklists/fetch-all-complete-checklists';

@ApiTags('Checklists')
@ApiBearerAuth()
@Controller('/all-checklists')
export class FetchAllChecklistOrderController {
  constructor(
    private fetchAllChecklist: FetchAllCompleteChecklistOrderUseCase,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Rota para listagem de todos os checklists.',
  })
  async handle() {
    const result = await this.fetchAllChecklist.execute();

    if (result.isLeft()) {
      return { completeChecklists: [] };
    }

    return result.value;
  }
}
