// src/core/errors/errors/missing-required-checklist-items-error.ts
export class MissingRequiredChecklistItemsError extends Error {
  constructor(public missing: string[]) {
    super(`Missing required checklist items: ${missing.join(', ')}`);
  }
}
