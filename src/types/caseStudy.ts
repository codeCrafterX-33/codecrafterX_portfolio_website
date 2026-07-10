export type CaseStudy = {
  id: string;
  slug: string;
  title: string;
  company: string;
  challenge: string;
  solution: string;
  results: string[];
  techStack: string[];
  images: string[];
  liveUrl?: string | null;
  published: boolean;
  sortOrder: number;
  projectSlug?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type CaseStudyInput = Omit<
  CaseStudy,
  "id" | "projectSlug" | "createdAt" | "updatedAt"
>;
