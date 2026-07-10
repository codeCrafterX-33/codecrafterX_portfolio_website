import type { CaseStudy, CaseStudyInput } from "../types/caseStudy";
import { apiUrl } from "./projectsApi";

type ApiOptions = { authToken?: string };

const headers = (authToken?: string) => ({
  "Content-Type": "application/json",
  ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
});

const readJson = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const message =
      body && typeof body === "object" && "error" in body
        ? String(body.error)
        : "Request failed";
    throw new Error(`${message} (${response.status})`);
  }
  return response.json() as Promise<T>;
};

export const getCaseStudies = async (options: ApiOptions = {}) => {
  const path = options.authToken
    ? "/api/admin/case-studies"
    : "/api/case-studies";
  const response = await fetch(apiUrl(path), {
    headers: options.authToken
      ? { Authorization: `Bearer ${options.authToken}` }
      : undefined,
  });
  return readJson<CaseStudy[]>(response);
};

export const getAdminCaseStudy = async (slug: string, options: ApiOptions) => {
  const response = await fetch(apiUrl(`/api/admin/case-studies/${slug}`), {
    headers: { Authorization: `Bearer ${options.authToken}` },
  });
  return readJson<CaseStudy>(response);
};

export const createCaseStudy = async (
  input: CaseStudyInput,
  options: ApiOptions,
) => {
  const response = await fetch(apiUrl("/api/case-studies"), {
    method: "POST",
    headers: headers(options.authToken),
    body: JSON.stringify(input),
  });
  return readJson<CaseStudy>(response);
};

export const updateCaseStudy = async (
  slug: string,
  input: CaseStudyInput,
  options: ApiOptions,
) => {
  const response = await fetch(apiUrl(`/api/case-studies/${slug}`), {
    method: "PUT",
    headers: headers(options.authToken),
    body: JSON.stringify(input),
  });
  return readJson<CaseStudy>(response);
};

export const deleteCaseStudy = async (slug: string, options: ApiOptions) => {
  const response = await fetch(apiUrl(`/api/case-studies/${slug}`), {
    method: "DELETE",
    headers: headers(options.authToken),
  });
  return readJson<{ ok: boolean }>(response);
};
