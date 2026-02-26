import { Injectable } from '@nestjs/common';
import { Either, right } from '@/core/either';
import { ChecklistRepository } from '@/domain/repositories/checklist-repository';

interface CheckAndUncheckChecklistItemUseCaseRequest {
  orderId: string;
  body: { checklistInstanceItemId: string; values: boolean }[];
}

type CheckAndUncheckChecklistItemUseCaseResponse = Either<null, null>;

@Injectable()
export class CheckAndUncheckChecklistItemUseCase {
  constructor(private checklistRepository: ChecklistRepository) {}

  async execute({
    body,
  }: CheckAndUncheckChecklistItemUseCaseRequest): Promise<CheckAndUncheckChecklistItemUseCaseResponse> {
    const listOfItems = await this.checklistRepository.checkOrUncheck(body);

    return right(null);
  }
}
