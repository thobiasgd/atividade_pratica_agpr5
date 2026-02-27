import { Either, left, right } from '@/core/either';

import { Injectable } from '@nestjs/common';
import { ChecklistRepository } from '@/domain/repositories/checklist-repository';
import { ChecklistTemplateItem } from '@prisma/client';

interface CreateChecklistItensUseCaseRequest {
  checklistItensArray: ChecklistTemplateItem[];
}

@Injectable()
export class CreateChecklistItensUseCase {
  constructor(private checklistitensRepository: ChecklistRepository) {}

  async execute({
    checklistItensArray,
  }: CreateChecklistItensUseCaseRequest): Promise<void> {
    //const checklistitens =
    await this.checklistitensRepository.insertItensInChecklistTemplate(
      checklistItensArray,
    );

    /* if (!checklistitens){

      return left({
        null
      })
    }

    return right({
      checklistitens,
    }); */
  }
}
