-- CreateEnum
CREATE TYPE "ReviewStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "SubTopic" ADD COLUMN     "review" "ReviewStatus" NOT NULL DEFAULT 'PENDING';
