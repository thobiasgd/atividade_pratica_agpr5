/*
  Warnings:

  - You are about to drop the `ChecklistInstance` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ChecklistInstanceItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ChecklistTemplateItem` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `checklistId` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ChecklistInstance" DROP CONSTRAINT "ChecklistInstance_orderId_fkey";

-- DropForeignKey
ALTER TABLE "ChecklistInstance" DROP CONSTRAINT "ChecklistInstance_templateId_fkey";

-- DropForeignKey
ALTER TABLE "ChecklistInstanceItem" DROP CONSTRAINT "ChecklistInstanceItem_checked_by_user_fkey";

-- DropForeignKey
ALTER TABLE "ChecklistInstanceItem" DROP CONSTRAINT "ChecklistInstanceItem_instanceId_fkey";

-- DropForeignKey
ALTER TABLE "ChecklistInstanceItem" DROP CONSTRAINT "ChecklistInstanceItem_templateItemId_fkey";

-- DropForeignKey
ALTER TABLE "ChecklistTemplateItem" DROP CONSTRAINT "ChecklistTemplateItem_templateId_fkey";

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "checklistId" TEXT NOT NULL;

-- DropTable
DROP TABLE "ChecklistInstance";

-- DropTable
DROP TABLE "ChecklistInstanceItem";

-- DropTable
DROP TABLE "ChecklistTemplateItem";

-- CreateTable
CREATE TABLE "checklist_template_item" (
    "id" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "atribute" TEXT NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL,

    CONSTRAINT "checklist_template_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "checklist_instance" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "checklist_instance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "checklist_instance_item" (
    "id" TEXT NOT NULL,
    "instanceId" TEXT NOT NULL,
    "templateItemId" TEXT NOT NULL,
    "value" BOOLEAN NOT NULL,
    "checked_by_user" TEXT NOT NULL,
    "checked_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "checklist_instance_item_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "checklist_instance_orderId_key" ON "checklist_instance"("orderId");

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_checklistId_fkey" FOREIGN KEY ("checklistId") REFERENCES "checklist_template"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checklist_template_item" ADD CONSTRAINT "checklist_template_item_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "checklist_template"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checklist_instance" ADD CONSTRAINT "checklist_instance_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checklist_instance" ADD CONSTRAINT "checklist_instance_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "checklist_template"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checklist_instance_item" ADD CONSTRAINT "checklist_instance_item_instanceId_fkey" FOREIGN KEY ("instanceId") REFERENCES "checklist_instance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checklist_instance_item" ADD CONSTRAINT "checklist_instance_item_templateItemId_fkey" FOREIGN KEY ("templateItemId") REFERENCES "checklist_template_item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checklist_instance_item" ADD CONSTRAINT "checklist_instance_item_checked_by_user_fkey" FOREIGN KEY ("checked_by_user") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
