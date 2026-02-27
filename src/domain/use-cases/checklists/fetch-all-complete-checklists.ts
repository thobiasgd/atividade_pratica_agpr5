import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { CompleteChecklist } from '@/domain/entities/complete-checklist';
import { ChecklistRepository } from '@/domain/repositories/checklist-repository';
import { ChecklistTemplateStatus } from '@prisma/client';

/* interface FetchChecklistOrderUseCaseRequest {
  orderId: string;
} */

type FetchAllChecklistOrderUseCaseResponse = Either<
  null,
  {
    completeChecklists: {
      id: string;
      checklistName: string;
      version: number;
      status: ChecklistTemplateStatus;
    }[];
  }
>;

@Injectable()
export class FetchAllCompleteChecklistOrderUseCase {
  constructor(private checklistRepository: ChecklistRepository) {}

  async execute(): Promise<FetchAllChecklistOrderUseCaseResponse> {
    const completeChecklists =
      await this.checklistRepository.fetchAllCompleteChecklistOrder();

    if (!completeChecklists) {
      return left(null);
    }

    return right({
      completeChecklists,
    });
  }
}
