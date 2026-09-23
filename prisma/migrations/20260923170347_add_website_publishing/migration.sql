/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Website` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Website" ADD COLUMN     "published" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "publishedAt" TIMESTAMP(3),
ADD COLUMN     "slug" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Website_slug_key" ON "Website"("slug");
