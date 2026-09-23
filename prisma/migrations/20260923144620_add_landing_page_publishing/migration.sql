-- Add slug as nullable first
ALTER TABLE "LandingPage"
ADD COLUMN "slug" TEXT;

-- Generate a unique slug for existing landing pages
UPDATE "LandingPage"
SET "slug" = 'landing-page-' || "id"
WHERE "slug" IS NULL;

-- Make slug required after existing rows have been populated
ALTER TABLE "LandingPage"
ALTER COLUMN "slug" SET NOT NULL;

-- Add publication fields
ALTER TABLE "LandingPage"
ADD COLUMN "published" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "LandingPage"
ADD COLUMN "publishedAt" TIMESTAMP(3);

-- Create unique constraint for public URLs
CREATE UNIQUE INDEX "LandingPage_slug_key"
ON "LandingPage"("slug");