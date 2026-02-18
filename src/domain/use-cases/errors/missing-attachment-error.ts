import { UseCaseError } from '@/core/errors/use-case-error';

export class MissingAttachmentError extends Error implements UseCaseError {
  constructor() {
    super('Attachment file is required.');
  }
}
