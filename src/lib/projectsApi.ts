import type { Project, ProjectInput } from "../types/project";

type ApiOptions = {
  adminToken?: string;
};

const jsonHeaders = (adminToken?: string) => ({
  "Content-Type": "application/json",
  ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {}),
});

const readJson = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error ?? "Request failed");
  }

  return response.json() as Promise<T>;
};

export const getProjects = async (options: ApiOptions = {}): Promise<Project[]> => {
  const response = await fetch("/api/projects", {
    headers: options.adminToken
      ? { Authorization: `Bearer ${options.adminToken}` }
      : undefined,
  });
  return readJson<Project[]>(response);
};

export const getProject = async (slug: string): Promise<Project> => {
  const response = await fetch(`/api/projects/${slug}`);
  return readJson<Project>(response);
};

export const createProject = async (
  input: ProjectInput,
  options: ApiOptions,
): Promise<Project> => {
  const response = await fetch("/api/projects", {
    method: "POST",
    headers: jsonHeaders(options.adminToken),
    body: JSON.stringify(input),
  });

  return readJson<Project>(response);
};

export const updateProject = async (
  slug: string,
  input: ProjectInput,
  options: ApiOptions,
): Promise<Project> => {
  const response = await fetch(`/api/projects/${slug}`, {
    method: "PUT",
    headers: jsonHeaders(options.adminToken),
    body: JSON.stringify(input),
  });

  return readJson<Project>(response);
};

export const deleteProject = async (
  slug: string,
  options: ApiOptions,
): Promise<{ ok: boolean }> => {
  const response = await fetch(`/api/projects/${slug}`, {
    method: "DELETE",
    headers: jsonHeaders(options.adminToken),
  });

  return readJson<{ ok: boolean }>(response);
};
