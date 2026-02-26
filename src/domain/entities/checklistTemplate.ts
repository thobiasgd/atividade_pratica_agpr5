import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export type ChecklistTemplateStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface ChecklistTemplateProps {
  checklistName: string;
  version: number;
  status: ChecklistTemplateStatus;
  createdAt: Date;
}

export class ChecklistTemplate extends Entity<ChecklistTemplateProps> {
  get checklistName() {
    return this.props.checklistName;
  }

  get version() {
    return this.props.version;
  }

  get status() {
    return this.props.status;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  static create(props: ChecklistTemplateProps, id?: UniqueEntityID) {
    const checklisttemplate = new ChecklistTemplate(props, id);

    return checklisttemplate;
  }
}
