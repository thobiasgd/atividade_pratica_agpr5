/*
  Warnings:

  - You are about to drop the column `orderId` on the `attachments` table. All the data in the column will be lost.
  - Added the required column `title` to the `attachments` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "attachments" DROP CONSTRAINT "attachments_orderId_fkey";

-- AlterTable
ALTER TABLE "attachments" DROP COLUMN "orderId",
ADD COLUMN     "order_id" TEXT,
ADD COLUMN     "title" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;
