/*
  Warnings:

  - You are about to drop the column `sectionId` on the `Section` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Section_partitionKey_sortKey_isActive_idx";

-- DropIndex
DROP INDEX "Section_sectionId_key";

-- AlterTable
ALTER TABLE "Section" DROP COLUMN "sectionId";

-- CreateIndex
CREATE INDEX "Section_partitionKey_sortKey_idx" ON "Section"("partitionKey", "sortKey");

-- CreateIndex
CREATE INDEX "Section_isActive_idx" ON "Section"("isActive");
