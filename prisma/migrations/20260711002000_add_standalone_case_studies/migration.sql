CREATE TABLE IF NOT EXISTS "CaseStudy" (
  "id" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "company" TEXT NOT NULL,
  "challenge" TEXT NOT NULL,
  "solution" TEXT NOT NULL,
  "results" TEXT[] NOT NULL,
  "techStack" TEXT[] NOT NULL,
  "images" TEXT[] NOT NULL,
  "liveUrl" TEXT,
  "published" BOOLEAN NOT NULL DEFAULT true,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "CaseStudy_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "CaseStudy_slug_key"
ON "CaseStudy"("slug");
