import { Either, right } from '@/core/either';
import {
  ChecklistTemplate,
  ChecklistTemplateStatus,
} from '../../entities/checklisttemplate';
import { Injectable } from '@nestjs/common';
import { ChecklistRepository } from '@/domain/repositories/checklist-repository';

interface CreateChecklistTemplateUseCaseRequest {
  checklistName: string;
  version: number;
  status: ChecklistTemplateStatus;
  createdAt: Date;
}

type CreateChecklistTemplateUseCaseResponse = Either<
  null,
  {
    checklisttemplate: ChecklistTemplate;
  }
>;

@Injectable()
export class CreateChecklistTemplateUseCase {
  constructor(private checklisttemplateRepository: ChecklistRepository) {}

  async execute({
    checklistName,
    version,
    status,
    createdAt,
  }: CreateChecklistTemplateUseCaseRequest): Promise<CreateChecklistTemplateUseCaseResponse> {
    const checklisttemplate = ChecklistTemplate.create({
      checklistName,
      version,
      status,
      createdAt,
    });

    await this.checklisttemplateRepository.createNewChecklist(
      checklisttemplate,
    );

    return right({
      checklisttemplate,
    });
  }
}
