/*
  Warnings:

  - Added the required column `entityType` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "entityType" TEXT NOT NULL;
