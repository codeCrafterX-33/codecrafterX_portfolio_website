import type { CaseStudyInput } from "../src/types/caseStudy";
import { slugify } from "./projects";

export const caseStudySelect = {
  id: true,
  slug: true,
  title: true,
  company: true,
  challenge: true,
  solution: true,
  results: true,
  techStack: true,
  images: true,
  liveUrl: true,
  published: true,
  sortOrder: true,
  createdAt: true,
  updatedAt: true,
};

const text = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

const optionalText = (value: unknown) => {
  const valueText = text(value);
  return valueText || null;
};

const stringList = (value: unknown) =>
  Array.isArray(value)
    ? value
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim())
        .filter(Boolean)
    : [];

export const parseCaseStudyInput = (body: unknown): CaseStudyInput => {
  const payload = body as Partial<CaseStudyInput>;
  const title = text(payload.title);
  const slug = slugify(text(payload.slug) || title);

  if (!title) throw new Error("Case study title is required.");
  if (!slug) throw new Error("Case study slug is required.");

  return {
    slug,
    title,
    company: text(payload.company),
    challenge: text(payload.challenge),
    solution: text(payload.solution),
    results: stringList(payload.results),
    techStack: stringList(payload.techStack),
    images: stringList(payload.images),
    liveUrl: optionalText(payload.liveUrl),
    published: payload.published !== false,
    sortOrder:
      typeof payload.sortOrder === "number" && Number.isFinite(payload.sortOrder)
        ? payload.sortOrder
        : 0,
  };
};
