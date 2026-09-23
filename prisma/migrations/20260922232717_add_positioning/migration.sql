-- CreateTable
CREATE TABLE "Positioning" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "targetCustomer" TEXT NOT NULL,
    "customerProblem" TEXT NOT NULL,
    "valueProposition" TEXT NOT NULL,
    "differentiation" TEXT NOT NULL,
    "brandPromise" TEXT NOT NULL,
    "mainMessage" TEXT NOT NULL,
    "salesArguments" TEXT NOT NULL,
    "positioning" TEXT NOT NULL,
    "slogans" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Positioning_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Positioning_projectId_key" ON "Positioning"("projectId");

-- AddForeignKey
ALTER TABLE "Positioning" ADD CONSTRAINT "Positioning_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
