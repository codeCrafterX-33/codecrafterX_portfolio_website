import type { ProjectInput } from "../src/types/project";

export const projectSelect = {
  id: true,
  slug: true,
  title: true,
  category: true,
  description: true,
  longDescription: true,
  challenge: true,
  solution: true,
  results: true,
  techStack: true,
  images: true,
  liveUrl: true,
  features: true,
  bgColor: true,
  featured: true,
  published: true,
  sortOrder: true,
  createdAt: true,
  updatedAt: true,
};

const text = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";
const optionalText = (value: unknown) => {
  const trimmed = text(value);
  return trimmed.length > 0 ? trimmed : null;
};

const stringList = (value: unknown) => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
};

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

export const parseProjectInput = (body: unknown): ProjectInput => {
  const payload = body as Partial<ProjectInput>;
  const title = text(payload.title);
  const slug = slugify(text(payload.slug) || title);

  if (!title) {
    throw new Error("Project title is required.");
  }

  if (!slug) {
    throw new Error("Project slug is required.");
  }

  return {
    slug,
    title,
    category: text(payload.category),
    description: text(payload.description),
    longDescription: text(payload.longDescription),
    challenge: text(payload.challenge),
    solution: text(payload.solution),
    results: stringList(payload.results),
    techStack: stringList(payload.techStack),
    images: stringList(payload.images),
    liveUrl: optionalText(payload.liveUrl),
    features: stringList(payload.features),
    bgColor: optionalText(payload.bgColor),
    featured: Boolean(payload.featured),
    published: payload.published !== false,
    sortOrder:
      typeof payload.sortOrder === "number" &&
      Number.isFinite(payload.sortOrder)
        ? payload.sortOrder
        : 0,
  };
};
