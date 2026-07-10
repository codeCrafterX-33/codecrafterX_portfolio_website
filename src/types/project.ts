export type Project = {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  longDescription: string;
  challenge: string;
  solution: string;
  results: string[];
  techStack: string[];
  images: string[];
  liveUrl?: string | null;
  features: string[];
  bgColor?: string | null;
  featured: boolean;
  caseStudy: boolean;
  caseStudyTitle?: string | null;
  caseStudyCompany?: string | null;
  published: boolean;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
};

export type ProjectInput = Omit<Project, "id" | "createdAt" | "updatedAt"> & {
  id?: string;
};
