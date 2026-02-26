import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common';
import { Roles } from '@/infra/auth/roles';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CreateChecklistTemplateUseCase } from '@/domain/use-cases/checklists/create-checklist';
import {
  bodyValidationPipe,
  CreateChecklistTemplateDTO,
} from './dto/create-checklist-template.dto';

@ApiTags('Checklists')
@ApiBearerAuth()
@Controller('/checklists')
export class CreateChecklistTemplateController {
  constructor(private createChecklist: CreateChecklistTemplateUseCase) {}

  @Post()
  @ApiOperation({
    summary: 'Rota para criação de novos checklists.',
  })
  @Roles('ADMIN')
  @HttpCode(201)
  async handle(@Body(bodyValidationPipe) body: CreateChecklistTemplateDTO) {
    const { checklistName, version, status } = body;

    const result = await this.createChecklist.execute({
      checklistName,
      version,
      status,
      createdAt: new Date(),
    });

    if (result.isLeft()) {
      const error = result.value;

      throw new BadRequestException(error);
    }
  }
}
