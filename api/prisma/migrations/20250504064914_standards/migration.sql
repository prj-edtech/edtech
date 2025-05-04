-- CreateTable
CREATE TABLE "Standard" (
    "id" TEXT NOT NULL,
    "partitionKey" TEXT NOT NULL,
    "sortKey" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT NOT NULL,
    "updatedBy" TEXT NOT NULL,
    "standardJson" JSONB NOT NULL,
    "boardId" TEXT NOT NULL,

    CONSTRAINT "Standard_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Standard_partitionKey_sortKey_idx" ON "Standard"("partitionKey", "sortKey");

-- CreateIndex
CREATE UNIQUE INDEX "Standard_partitionKey_sortKey_key" ON "Standard"("partitionKey", "sortKey");

-- AddForeignKey
ALTER TABLE "Standard" ADD CONSTRAINT "Standard_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
