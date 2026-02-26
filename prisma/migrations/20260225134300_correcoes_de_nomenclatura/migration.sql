/*
  Warnings:

  - You are about to drop the `CheckListInstance` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CheckListInstanceItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CheckListTemplateItem` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CheckListInstance" DROP CONSTRAINT "CheckListInstance_orderId_fkey";

-- DropForeignKey
ALTER TABLE "CheckListInstance" DROP CONSTRAINT "CheckListInstance_templateId_fkey";

-- DropForeignKey
ALTER TABLE "CheckListInstanceItem" DROP CONSTRAINT "CheckListInstanceItem_checked_by_user_fkey";

-- DropForeignKey
ALTER TABLE "CheckListInstanceItem" DROP CONSTRAINT "CheckListInstanceItem_instanceId_fkey";

-- DropForeignKey
ALTER TABLE "CheckListInstanceItem" DROP CONSTRAINT "CheckListInstanceItem_templateItemId_fkey";

-- DropForeignKey
ALTER TABLE "CheckListTemplateItem" DROP CONSTRAINT "CheckListTemplateItem_templateId_fkey";

-- DropTable
DROP TABLE "CheckListInstance";

-- DropTable
DROP TABLE "CheckListInstanceItem";

-- DropTable
DROP TABLE "CheckListTemplateItem";

-- CreateTable
CREATE TABLE "ChecklistTemplateItem" (
    "id" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "atribute" TEXT NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL,

    CONSTRAINT "ChecklistTemplateItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChecklistInstance" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChecklistInstance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChecklistInstanceItem" (
    "id" TEXT NOT NULL,
    "instanceId" TEXT NOT NULL,
    "templateItemId" TEXT NOT NULL,
    "value" BOOLEAN,
    "checked_by_user" TEXT NOT NULL,
    "checked_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChecklistInstanceItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ChecklistInstance_orderId_key" ON "ChecklistInstance"("orderId");

-- AddForeignKey
ALTER TABLE "ChecklistTemplateItem" ADD CONSTRAINT "ChecklistTemplateItem_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "checklist_template"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChecklistInstance" ADD CONSTRAINT "ChecklistInstance_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChecklistInstance" ADD CONSTRAINT "ChecklistInstance_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "checklist_template"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChecklistInstanceItem" ADD CONSTRAINT "ChecklistInstanceItem_instanceId_fkey" FOREIGN KEY ("instanceId") REFERENCES "ChecklistInstance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChecklistInstanceItem" ADD CONSTRAINT "ChecklistInstanceItem_templateItemId_fkey" FOREIGN KEY ("templateItemId") REFERENCES "ChecklistTemplateItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChecklistInstanceItem" ADD CONSTRAINT "ChecklistInstanceItem_checked_by_user_fkey" FOREIGN KEY ("checked_by_user") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
