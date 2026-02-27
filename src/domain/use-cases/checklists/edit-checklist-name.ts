import { Either, left, right } from '@/core/either';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ChecklistRepository } from '@/domain/repositories/checklist-repository';

interface EditChecklistNameUseCaseRequest {
  templateId: string;
  newChecklistName: string;
}

@Injectable()
export class EditChecklistNameUseCase {
  constructor(private checklistRepository: ChecklistRepository) {}

  async execute({
    templateId,
    newChecklistName,
  }: EditChecklistNameUseCaseRequest): Promise<void> {
    const checklistname = await this.checklistRepository.editChecklistName(
      templateId,
      newChecklistName,
    );

    return checklistname;
  }
}
