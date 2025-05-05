-- CreateTable
CREATE TABLE "Section" (
    "id" TEXT NOT NULL,
    "partitionKey" TEXT NOT NULL,
    "sortKey" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "priority" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT NOT NULL,
    "updatedBy" TEXT NOT NULL,
    "sectionJson" JSONB NOT NULL,
    "boardId" TEXT NOT NULL,
    "standardId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,

    CONSTRAINT "Section_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Section_sectionId_key" ON "Section"("sectionId");

-- CreateIndex
CREATE INDEX "Section_partitionKey_sortKey_isActive_idx" ON "Section"("partitionKey", "sortKey", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "Section_partitionKey_sortKey_key" ON "Section"("partitionKey", "sortKey");

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_standardId_fkey" FOREIGN KEY ("standardId") REFERENCES "Standard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
