/*
  Warnings:

  - Added the required column `attributes` to the `QuestionPaper` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "QuestionPaper_year_month_idx";

-- AlterTable
ALTER TABLE "QuestionPaper" ADD COLUMN     "attributes" JSONB NOT NULL;

-- CreateIndex
CREATE INDEX "QuestionPaper_year_idx" ON "QuestionPaper"("year");
