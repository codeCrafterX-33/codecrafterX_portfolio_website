import type { Project, ProjectInput } from "../types/project";

type ApiOptions = {
  authToken?: string;
};

export const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? "").replace(
  /\/$/,
  "",
);

export const apiUrl = (path: string) => `${apiBaseUrl}${path}`;

const jsonHeaders = (authToken?: string) => ({
  "Content-Type": "application/json",
  ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
});

const readJson = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    const message =
      error && typeof error === "object" && "error" in error
        ? String(error.error)
        : "Request failed";

    throw new Error(`${message} (${response.status})`);
  }

  return response.json() as Promise<T>;
};

export const getProjects = async (
  options: ApiOptions = {},
): Promise<Project[]> => {
  const path = options.authToken ? "/api/admin/projects" : "/api/projects";
  const response = await fetch(apiUrl(path), {
    headers: options.authToken
      ? { Authorization: `Bearer ${options.authToken}` }
      : undefined,
  });
  return readJson<Project[]>(response);
};

export const getProject = async (slug: string): Promise<Project> => {
  const response = await fetch(apiUrl(`/api/projects/${slug}`));
  return readJson<Project>(response);
};

export const getAdminProject = async (
  slug: string,
  options: ApiOptions,
): Promise<Project> => {
  const response = await fetch(apiUrl(`/api/admin/projects/${slug}`), {
    headers: options.authToken
      ? { Authorization: `Bearer ${options.authToken}` }
      : undefined,
  });
  return readJson<Project>(response);
};

export const createProject = async (
  input: ProjectInput,
  options: ApiOptions,
): Promise<Project> => {
  const response = await fetch(apiUrl("/api/projects"), {
    method: "POST",
    headers: jsonHeaders(options.authToken),
    body: JSON.stringify(input),
  });

  return readJson<Project>(response);
};

export const updateProject = async (
  slug: string,
  input: ProjectInput,
  options: ApiOptions,
): Promise<Project> => {
  const response = await fetch(apiUrl(`/api/projects/${slug}`), {
    method: "PUT",
    headers: jsonHeaders(options.authToken),
    body: JSON.stringify(input),
  });

  return readJson<Project>(response);
};

export const deleteProject = async (
  slug: string,
  options: ApiOptions,
): Promise<{ ok: boolean }> => {
  const response = await fetch(apiUrl(`/api/projects/${slug}`), {
    method: "DELETE",
    headers: jsonHeaders(options.authToken),
  });

  return readJson<{ ok: boolean }>(response);
};

export const deleteCloudinaryImage = async (
  imageUrl: string,
  options: ApiOptions,
): Promise<{ ok: boolean; publicId?: string }> => {
  const response = await fetch(apiUrl("/api/cloudinary/image"), {
    method: "DELETE",
    headers: jsonHeaders(options.authToken),
    body: JSON.stringify({ imageUrl }),
  });

  return readJson<{ ok: boolean; publicId?: string }>(response);
};
