import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { CompleteChecklist } from '@/domain/entities/complete-checklist';
import { ChecklistRepository } from '@/domain/repositories/checklist-repository';

interface FetchChecklistOrderUseCaseRequest {
  orderId: string;
}

type FetchChecklistOrderUseCaseResponse = Either<
  null,
  {
    completeChecklist: CompleteChecklist;
  }
>;

@Injectable()
export class FetchCompleteChecklistOrderUseCase {
  constructor(private checklistRepository: ChecklistRepository) {}

  async execute({
    orderId,
  }: FetchChecklistOrderUseCaseRequest): Promise<FetchChecklistOrderUseCaseResponse> {
    const completeChecklist =
      await this.checklistRepository.fetchCompleteChecklistOrder(orderId);

    if (!completeChecklist) {
      return left(null);
    }

    return right({
      completeChecklist,
    });
  }
}
