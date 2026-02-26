/*
  Warnings:

  - You are about to drop the column `checked_by_user` on the `checklist_instance_item` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "checklist_instance_item" DROP COLUMN "checked_by_user";
