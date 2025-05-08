-- CreateTable
CREATE TABLE "SubTopic" (
    "id" TEXT NOT NULL,
    "partitionKey" TEXT NOT NULL,
    "sortKey" TEXT NOT NULL,
    "subTopicId" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "priority" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT NOT NULL,
    "updatedBy" TEXT NOT NULL,
    "subTopicJson" JSONB NOT NULL,

    CONSTRAINT "SubTopic_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SubTopic_subTopicId_key" ON "SubTopic"("subTopicId");

-- CreateIndex
CREATE INDEX "SubTopic_partitionKey_sortKey_idx" ON "SubTopic"("partitionKey", "sortKey");

-- CreateIndex
CREATE INDEX "SubTopic_isActive_idx" ON "SubTopic"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "SubTopic_partitionKey_sortKey_key" ON "SubTopic"("partitionKey", "sortKey");

-- AddForeignKey
ALTER TABLE "SubTopic" ADD CONSTRAINT "SubTopic_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
