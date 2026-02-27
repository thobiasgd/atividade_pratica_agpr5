import {
  ChecklistInstanceItem,
  ChecklistTemplateItem,
  ChecklistTemplateStatus,
} from '@prisma/client';
import { ChecklistTemplate } from '../entities/checklistTemplate';
import { CompleteChecklist } from '../entities/complete-checklist';

export abstract class ChecklistRepository {
  abstract createNewChecklist(
    checklistTemplate: ChecklistTemplate,
  ): Promise<void>;
  abstract insertItensInChecklistTemplate(
    checklistTemplateItem: ChecklistTemplateItem[],
  ): Promise<void>;
  abstract onOrderCreation(orderId: string): Promise<void>;
  abstract createRelationChecklistOrder(
    orderId: string,
    checklistId: string,
  ): Promise<void>;
  abstract fetchCompleteChecklistOrder(
    orderId: string,
  ): Promise<CompleteChecklist>;
  abstract checkOrUncheck(
    body: { checklistInstanceItemId: string; values: boolean }[],
  ): Promise<void>;
  abstract fetchRequiredChecklistOrder(
    orderId: string,
  ): Promise<CompleteChecklist>;
  abstract fetchRequiredChecklistItems(
    orderId: string,
  ): Promise<{ templateItemId: string; atribute: string }[]>;
  abstract removeItensFromChecklistTemplate(params: {
    templateId: string;
    templateItemIdsToRemove: string[];
  }): Promise<void>;
  abstract fetchAllCompleteChecklistOrder(): Promise<
    {
      id: string;
      checklistName: string;
      version: number;
      status: ChecklistTemplateStatus;
    }[]
  >;
  abstract editChecklistName(
    templateId: string,
    newTemplateName: string,
  ): Promise<void>;
}
