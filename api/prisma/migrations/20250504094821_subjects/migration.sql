-- CreateTable
CREATE TABLE "Subject" (
    "id" TEXT NOT NULL,
    "partitionKey" TEXT NOT NULL,
    "sortKey" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT NOT NULL,
    "updatedBy" TEXT NOT NULL,
    "subjectJson" JSONB NOT NULL,
    "boardId" TEXT NOT NULL,
    "standardId" TEXT NOT NULL,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Subject_partitionKey_sortKey_idx" ON "Subject"("partitionKey", "sortKey");

-- CreateIndex
CREATE UNIQUE INDEX "Subject_partitionKey_sortKey_key" ON "Subject"("partitionKey", "sortKey");

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_standardId_fkey" FOREIGN KEY ("standardId") REFERENCES "Standard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
