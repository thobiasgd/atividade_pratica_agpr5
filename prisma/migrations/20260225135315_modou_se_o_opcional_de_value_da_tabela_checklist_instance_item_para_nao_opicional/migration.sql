/*
  Warnings:

  - Made the column `value` on table `ChecklistInstanceItem` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ChecklistInstanceItem" ALTER COLUMN "value" SET NOT NULL;
