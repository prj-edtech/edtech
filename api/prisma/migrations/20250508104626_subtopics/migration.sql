/*
  Warnings:

  - Added the required column `sectionId` to the `SubTopic` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subtopicContentPath` to the `SubTopic` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SubTopic" ADD COLUMN     "sectionId" TEXT NOT NULL,
ADD COLUMN     "subtopicContentPath" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "SubTopic" ADD CONSTRAINT "SubTopic_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE CASCADE ON UPDATE CASCADE;
