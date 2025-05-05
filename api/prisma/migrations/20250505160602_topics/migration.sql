-- CreateTable
CREATE TABLE "Topic" (
    "id" TEXT NOT NULL,
    "partitionKey" TEXT NOT NULL,
    "sortKey" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "priority" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT NOT NULL,
    "updatedBy" TEXT NOT NULL,
    "topicJson" JSONB NOT NULL,

    CONSTRAINT "Topic_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Topic_topicId_key" ON "Topic"("topicId");

-- CreateIndex
CREATE INDEX "Topic_partitionKey_sortKey_idx" ON "Topic"("partitionKey", "sortKey");

-- CreateIndex
CREATE INDEX "Topic_isActive_idx" ON "Topic"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "Topic_partitionKey_sortKey_key" ON "Topic"("partitionKey", "sortKey");

-- AddForeignKey
ALTER TABLE "Topic" ADD CONSTRAINT "Topic_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
