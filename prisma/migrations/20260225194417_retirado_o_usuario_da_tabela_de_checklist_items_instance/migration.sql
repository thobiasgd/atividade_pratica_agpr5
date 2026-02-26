-- DropForeignKey
ALTER TABLE "checklist_instance_item" DROP CONSTRAINT "checklist_instance_item_checked_by_user_fkey";

-- AlterTable
ALTER TABLE "checklist_instance_item" ALTER COLUMN "checked_at" DROP NOT NULL;
