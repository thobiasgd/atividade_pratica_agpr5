-- CreateEnum
CREATE TYPE "ChecklistTemplateStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "checklist_template" (
    "id" TEXT NOT NULL,
    "checklist_name" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "status" "ChecklistTemplateStatus" NOT NULL DEFAULT 'DRAFT',
    "created_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "checklist_template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CheckListTemplateItem" (
    "id" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "atribute" TEXT NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL,

    CONSTRAINT "CheckListTemplateItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CheckListInstance" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CheckListInstance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CheckListInstanceItem" (
    "id" TEXT NOT NULL,
    "instanceId" TEXT NOT NULL,
    "templateItemId" TEXT NOT NULL,
    "value" BOOLEAN,
    "checked_by_user" TEXT NOT NULL,
    "checked_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CheckListInstanceItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CheckListInstance_orderId_key" ON "CheckListInstance"("orderId");

-- AddForeignKey
ALTER TABLE "CheckListTemplateItem" ADD CONSTRAINT "CheckListTemplateItem_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "checklist_template"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckListInstance" ADD CONSTRAINT "CheckListInstance_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckListInstance" ADD CONSTRAINT "CheckListInstance_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "checklist_template"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckListInstanceItem" ADD CONSTRAINT "CheckListInstanceItem_instanceId_fkey" FOREIGN KEY ("instanceId") REFERENCES "CheckListInstance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckListInstanceItem" ADD CONSTRAINT "CheckListInstanceItem_templateItemId_fkey" FOREIGN KEY ("templateItemId") REFERENCES "CheckListTemplateItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckListInstanceItem" ADD CONSTRAINT "CheckListInstanceItem_checked_by_user_fkey" FOREIGN KEY ("checked_by_user") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
