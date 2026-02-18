-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_carrier_id_fkey";

-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "carrier_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_carrier_id_fkey" FOREIGN KEY ("carrier_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
