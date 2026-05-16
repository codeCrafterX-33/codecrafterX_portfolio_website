CREATE TABLE "Project" (
  "id" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "longDescription" TEXT NOT NULL,
  "challenge" TEXT NOT NULL,
  "solution" TEXT NOT NULL,
  "results" TEXT[] NOT NULL,
  "techStack" TEXT[] NOT NULL,
  "images" TEXT[] NOT NULL,
  "liveUrl" TEXT,
  "features" TEXT[] NOT NULL,
  "bgColor" TEXT,
  "featured" BOOLEAN NOT NULL DEFAULT false,
  "published" BOOLEAN NOT NULL DEFAULT true,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Project_slug_key" ON "Project"("slug");
