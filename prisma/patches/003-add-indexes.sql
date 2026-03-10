-- Add missing indexes for common query patterns
CREATE INDEX IF NOT EXISTS "Project_approvalStatus_idx" ON "Project"("approvalStatus");
CREATE INDEX IF NOT EXISTS "Project_approvalStatus_category_idx" ON "Project"("approvalStatus", "category");
CREATE INDEX IF NOT EXISTS "Project_approvalStatus_layer_idx" ON "Project"("approvalStatus", "layer");
CREATE INDEX IF NOT EXISTS "Project_category_idx" ON "Project"("category");
CREATE INDEX IF NOT EXISTS "Project_layer_idx" ON "Project"("layer");
CREATE INDEX IF NOT EXISTS "Review_projectId_idx" ON "Review"("projectId");
CREATE INDEX IF NOT EXISTS "Review_isPublished_idx" ON "Review"("isPublished");
CREATE INDEX IF NOT EXISTS "Suggestion_status_idx" ON "Suggestion"("status");
