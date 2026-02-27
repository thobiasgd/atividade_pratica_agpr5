import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Patch,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  bodyValidationPipe,
  EditChecklistNameDTO,
} from './dto/edit-checklist-name.dto';
import { EditChecklistNameUseCase } from '@/domain/use-cases/checklists/edit-checklist-name';

@ApiTags('Checklists')
@ApiBearerAuth()
@Controller('/checklists-name/:templateId')
export class EditChecklistNameController {
  constructor(private editChecklistName: EditChecklistNameUseCase) {}

  @Patch()
  @ApiOperation({
    summary: 'Rota para edição do nome de um checklist.',
  })
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: EditChecklistNameDTO,
    @Param('templateId') templateId: string,
  ) {
    const { newChecklistName } = body;

    const result = await this.editChecklistName.execute({
      templateId,
      newChecklistName,
    });

    /* if (result.isLeft()) {
      throw new BadRequestException();
    } */
  }
}
