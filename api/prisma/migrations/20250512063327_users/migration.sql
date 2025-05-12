-- DropForeignKey
ALTER TABLE "ChangeLog" DROP CONSTRAINT "ChangeLog_submittedBy_fkey";

-- AddForeignKey
ALTER TABLE "ChangeLog" ADD CONSTRAINT "ChangeLog_submittedBy_fkey" FOREIGN KEY ("submittedBy") REFERENCES "User"("auth0Id") ON DELETE RESTRICT ON UPDATE CASCADE;
