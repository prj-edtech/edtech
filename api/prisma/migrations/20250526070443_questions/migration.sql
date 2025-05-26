-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL,
    "partitionKey" TEXT NOT NULL,
    "sortKey" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "month" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "questionPaperId" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "subTopicId" TEXT NOT NULL,
    "marks" INTEGER NOT NULL,
    "priority" INTEGER NOT NULL,
    "questionType" TEXT NOT NULL,
    "questionContentPath" TEXT NOT NULL,
    "questionAnswerPath" TEXT NOT NULL,
    "attributes" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT NOT NULL,
    "updatedBy" TEXT NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Question_questionId_key" ON "Question"("questionId");

-- CreateIndex
CREATE INDEX "Question_partitionKey_sortKey_idx" ON "Question"("partitionKey", "sortKey");

-- CreateIndex
CREATE INDEX "Question_questionPaperId_idx" ON "Question"("questionPaperId");

-- CreateIndex
CREATE UNIQUE INDEX "Question_partitionKey_sortKey_key" ON "Question"("partitionKey", "sortKey");

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_questionPaperId_fkey" FOREIGN KEY ("questionPaperId") REFERENCES "QuestionPaper"("id") ON DELETE CASCADE ON UPDATE CASCADE;
