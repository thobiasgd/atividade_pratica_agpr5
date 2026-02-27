import { Injectable } from '@nestjs/common';
import { ChecklistRepository } from '@/domain/repositories/checklist-repository';

interface DeleteChecklistItensUseCaseRequest {
  templateId: string;
  templateItemIdsToRemove: string[];
}

@Injectable()
export class DeleteChecklistItensUseCase {
  constructor(private checklistRepository: ChecklistRepository) {}

  async execute({
    templateId,
    templateItemIdsToRemove,
  }: DeleteChecklistItensUseCaseRequest): Promise<void> {
    await this.checklistRepository.removeItensFromChecklistTemplate({
      templateId,
      templateItemIdsToRemove,
    });
  }
}
