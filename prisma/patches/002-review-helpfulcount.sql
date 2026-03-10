-- Add missing helpfulCount column to Review table (was missing from init migration)
ALTER TABLE "Review" ADD COLUMN "helpfulCount" INTEGER NOT NULL DEFAULT 0;
