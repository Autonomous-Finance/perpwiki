-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tagline" TEXT,
    "description" TEXT,
    "website" TEXT,
    "twitter" TEXT,
    "github" TEXT,
    "discord" TEXT,
    "telegram" TEXT,
    "logoUrl" TEXT,
    "layer" TEXT NOT NULL DEFAULT 'BOTH',
    "category" TEXT NOT NULL,
    "tags" TEXT NOT NULL DEFAULT '[]',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "launchYear" INTEGER,
    "launchDate" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isHip3" BOOLEAN NOT NULL DEFAULT false,
    "submittedBy" TEXT,
    "approvalStatus" TEXT NOT NULL DEFAULT 'APPROVED',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Dossier" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "seedId" TEXT NOT NULL,
    "entityName" TEXT NOT NULL,
    "schemaVersion" TEXT NOT NULL DEFAULT '2.0',
    "dossierJson" TEXT NOT NULL,
    "qualityScore" REAL NOT NULL DEFAULT 0.0,
    "readyToPublish" BOOLEAN NOT NULL DEFAULT false,
    "importedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Dossier_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "content" TEXT,
    "authorId" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "helpfulCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Review_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Suggestion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT,
    "field" TEXT,
    "value" TEXT,
    "type" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Suggestion_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Project_slug_key" ON "Project"("slug");

-- CreateIndex: common query filters
CREATE INDEX "Project_approvalStatus_idx" ON "Project"("approvalStatus");
CREATE INDEX "Project_approvalStatus_category_idx" ON "Project"("approvalStatus", "category");
CREATE INDEX "Project_approvalStatus_layer_idx" ON "Project"("approvalStatus", "layer");
CREATE INDEX "Project_category_idx" ON "Project"("category");
CREATE INDEX "Project_layer_idx" ON "Project"("layer");

-- CreateIndex
CREATE UNIQUE INDEX "Dossier_projectId_key" ON "Dossier"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "Dossier_seedId_key" ON "Dossier"("seedId");

-- CreateIndex: review lookups
CREATE INDEX "Review_projectId_idx" ON "Review"("projectId");
CREATE INDEX "Review_isPublished_idx" ON "Review"("isPublished");

-- CreateIndex: suggestion queries
CREATE INDEX "Suggestion_status_idx" ON "Suggestion"("status");

