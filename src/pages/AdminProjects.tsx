import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  createProject,
  deleteProject,
  getProjects,
  updateProject,
} from "../lib/projectsApi";
import type { Project, ProjectInput } from "../types/project";

type ProjectFormState = {
  slug: string;
  title: string;
  category: string;
  description: string;
  longDescription: string;
  challenge: string;
  solution: string;
  results: string;
  techStack: string;
  images: string;
  liveUrl: string;
  features: string;
  bgColor: string;
  featured: boolean;
  published: boolean;
  sortOrder: number;
};

const emptyForm: ProjectFormState = {
  slug: "",
  title: "",
  category: "",
  description: "",
  longDescription: "",
  challenge: "",
  solution: "",
  results: "",
  techStack: "",
  images: "",
  liveUrl: "",
  features: "",
  bgColor: "bg-[#ecfdf3]",
  featured: true,
  published: true,
  sortOrder: 0,
};

const listFromText = (value: string) =>
  value
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);

const textFromList = (value: string[]) => value.join("\n");

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

const formFromProject = (project: Project): ProjectFormState => ({
  slug: project.slug,
  title: project.title,
  category: project.category,
  description: project.description,
  longDescription: project.longDescription,
  challenge: project.challenge,
  solution: project.solution,
  results: textFromList(project.results),
  techStack: textFromList(project.techStack),
  images: textFromList(project.images),
  liveUrl: project.liveUrl ?? "",
  features: textFromList(project.features),
  bgColor: project.bgColor ?? "bg-[#ecfdf3]",
  featured: project.featured,
  published: project.published,
  sortOrder: project.sortOrder,
});

const inputFromForm = (form: ProjectFormState): ProjectInput => ({
  slug: form.slug || slugify(form.title),
  title: form.title,
  category: form.category,
  description: form.description,
  longDescription: form.longDescription,
  challenge: form.challenge,
  solution: form.solution,
  results: listFromText(form.results),
  techStack: listFromText(form.techStack),
  images: listFromText(form.images),
  liveUrl: form.liveUrl || null,
  features: listFromText(form.features),
  bgColor: form.bgColor || null,
  featured: form.featured,
  published: form.published,
  sortOrder: Number(form.sortOrder) || 0,
});

const fieldClass =
  "w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white";

const labelClass = "text-sm font-semibold text-slate-700 dark:text-white-50";

const AdminProjects = () => {
  const [adminToken, setAdminToken] = useState(
    () => localStorage.getItem("admin-token") ?? "",
  );
  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] = useState<ProjectFormState>(emptyForm);
  const [editingSlug, setEditingSlug] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const canSubmit = useMemo(
    () => adminToken.trim().length > 0 && form.title.trim().length > 0,
    [adminToken, form.title],
  );

  const loadProjects = async (token = adminToken) => {
    if (!token) {
      return;
    }

    try {
      setError("");
      const nextProjects = await getProjects({ adminToken: token });
      setProjects(nextProjects);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load admin projects.",
      );
    }
  };

  useEffect(() => {
    void loadProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateField = <Key extends keyof ProjectFormState>(
    key: Key,
    value: ProjectFormState[Key],
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const saveToken = () => {
    localStorage.setItem("admin-token", adminToken);
    void loadProjects(adminToken);
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingSlug("");
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!canSubmit) {
      setError("Add your admin token and project title first.");
      return;
    }

    try {
      setIsSaving(true);
      setError("");
      setMessage("");

      if (editingSlug) {
        await updateProject(editingSlug, inputFromForm(form), { adminToken });
        setMessage("Project updated.");
      } else {
        await createProject(inputFromForm(form), { adminToken });
        setMessage("Project created.");
      }

      resetForm();
      await loadProjects();
    } catch (saveError) {
      setError(
        saveError instanceof Error ? saveError.message : "Unable to save project.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) {
      return;
    }

    if (!adminToken) {
      setError("Save your admin token before uploading images.");
      return;
    }

    try {
      setIsUploading(true);
      setError("");

      const uploadedUrls: string[] = [];

      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/projects/upload-image", {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || "Upload failed");
        }

        const data = await res.json();
        uploadedUrls.push(data.url);
      }

      setForm((current) => ({
        ...current,
        images: [...listFromText(current.images), ...uploadedUrls].join("\n"),
      }));
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Unable to upload images.",
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (slug: string) => {
    if (!window.confirm(`Delete ${slug}?`)) {
      return;
    }

    try {
      await deleteProject(slug, { adminToken });
      await loadProjects();
      if (editingSlug === slug) {
        resetForm();
      }
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete project.",
      );
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 to-white px-5 py-24 text-slate-950 dark:from-zinc-900 dark:to-black dark:text-white md:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">
            Admin
          </p>
          <h1 className="text-4xl font-bold md:text-5xl">Manage Projects</h1>
          <p className="mt-4 max-w-2xl text-slate-600 dark:text-gray-300">
            Add, edit, publish, and order portfolio projects from Neon Postgres.
          </p>
        </div>

        <div className="mb-8 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
          <label className={labelClass} htmlFor="admin-token">
            Admin token
          </label>
          <div className="mt-2 flex flex-col gap-3 md:flex-row">
            <input
              id="admin-token"
              type="password"
              value={adminToken}
              onChange={(event) => setAdminToken(event.target.value)}
              className={fieldClass}
              placeholder="Paste ADMIN_TOKEN"
            />
            <button
              type="button"
              onClick={saveToken}
              className="rounded-lg bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700"
            >
              Load
            </button>
          </div>
        </div>

        {(message || error) && (
          <div
            className={`mb-8 rounded-xl border p-4 ${
              error
                ? "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-200"
                : "border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200"
            }`}
          >
            {error || message}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <form
            onSubmit={handleSubmit}
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-900"
          >
            <div className="mb-6 flex items-center justify-between gap-4">
              <h2 className="text-2xl font-bold">
                {editingSlug ? "Edit project" : "New project"}
              </h2>
              {editingSlug && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold dark:border-zinc-700"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="space-y-2">
                <span className={labelClass}>Title</span>
                <input
                  value={form.title}
                  onChange={(event) => updateField("title", event.target.value)}
                  className={fieldClass}
                />
              </label>
              <label className="space-y-2">
                <span className={labelClass}>Slug</span>
                <input
                  value={form.slug}
                  onChange={(event) => updateField("slug", event.target.value)}
                  className={fieldClass}
                  placeholder="auto-generated from title"
                />
              </label>
              <label className="space-y-2">
                <span className={labelClass}>Category</span>
                <input
                  value={form.category}
                  onChange={(event) =>
                    updateField("category", event.target.value)
                  }
                  className={fieldClass}
                />
              </label>
              <label className="space-y-2">
                <span className={labelClass}>Live URL</span>
                <input
                  value={form.liveUrl}
                  onChange={(event) =>
                    updateField("liveUrl", event.target.value)
                  }
                  className={fieldClass}
                />
              </label>
              <label className="space-y-2 md:col-span-2">
                <span className={labelClass}>Short description</span>
                <textarea
                  value={form.description}
                  onChange={(event) =>
                    updateField("description", event.target.value)
                  }
                  className={fieldClass}
                  rows={3}
                />
              </label>
              <label className="space-y-2 md:col-span-2">
                <span className={labelClass}>Long description</span>
                <textarea
                  value={form.longDescription}
                  onChange={(event) =>
                    updateField("longDescription", event.target.value)
                  }
                  className={fieldClass}
                  rows={4}
                />
              </label>
              <label className="space-y-2">
                <span className={labelClass}>Challenge</span>
                <textarea
                  value={form.challenge}
                  onChange={(event) =>
                    updateField("challenge", event.target.value)
                  }
                  className={fieldClass}
                  rows={4}
                />
              </label>
              <label className="space-y-2">
                <span className={labelClass}>Solution</span>
                <textarea
                  value={form.solution}
                  onChange={(event) =>
                    updateField("solution", event.target.value)
                  }
                  className={fieldClass}
                  rows={4}
                />
              </label>
              <label className="space-y-2">
                <span className={labelClass}>Features</span>
                <textarea
                  value={form.features}
                  onChange={(event) =>
                    updateField("features", event.target.value)
                  }
                  className={fieldClass}
                  rows={5}
                  placeholder="One per line or comma separated"
                />
              </label>
              <label className="space-y-2">
                <span className={labelClass}>Results</span>
                <textarea
                  value={form.results}
                  onChange={(event) => updateField("results", event.target.value)}
                  className={fieldClass}
                  rows={5}
                />
              </label>
              <label className="space-y-2">
                <span className={labelClass}>Tech stack</span>
                <textarea
                  value={form.techStack}
                  onChange={(event) =>
                    updateField("techStack", event.target.value)
                  }
                  className={fieldClass}
                  rows={4}
                />
              </label>
              <label className="space-y-2">
                <span className={labelClass}>Image URLs</span>
                <textarea
                  value={form.images}
                  onChange={(event) => updateField("images", event.target.value)}
                  className={fieldClass}
                  rows={4}
                />
              </label>
              <label className="space-y-2">
                <span className={labelClass}>Upload images</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(event) => void handleUpload(event.target.files)}
                  className={fieldClass}
                />
                <span className="block text-xs text-slate-500 dark:text-gray-400">
                  {isUploading ? "Uploading..." : "Uploads to Cloudinary (server-side)"}
                </span>
              </label>
              <label className="space-y-2">
                <span className={labelClass}>Card background class</span>
                <input
                  value={form.bgColor}
                  onChange={(event) => updateField("bgColor", event.target.value)}
                  className={fieldClass}
                />
              </label>
              <label className="space-y-2">
                <span className={labelClass}>Sort order</span>
                <input
                  type="number"
                  value={form.sortOrder}
                  onChange={(event) =>
                    updateField("sortOrder", Number(event.target.value))
                  }
                  className={fieldClass}
                />
              </label>
            </div>

            <div className="mt-6 flex flex-wrap gap-6">
              <label className="flex items-center gap-2 text-sm font-semibold">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(event) =>
                    updateField("featured", event.target.checked)
                  }
                />
                Featured
              </label>
              <label className="flex items-center gap-2 text-sm font-semibold">
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(event) =>
                    updateField("published", event.target.checked)
                  }
                />
                Published
              </label>
            </div>

            <button
              type="submit"
              disabled={!canSubmit || isSaving}
              className="mt-8 rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving ? "Saving..." : editingSlug ? "Update project" : "Create project"}
            </button>
          </form>

          <aside className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
            <h2 className="mb-4 text-xl font-bold">Projects</h2>
            <div className="space-y-3">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="rounded-lg border border-slate-200 p-4 dark:border-zinc-700"
                >
                  <div className="font-semibold">{project.title}</div>
                  <div className="text-sm text-slate-500 dark:text-gray-400">
                    /projects/{project.slug}
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingSlug(project.slug);
                        setForm(formFromProject(project));
                      }}
                      className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold dark:border-zinc-700"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleDelete(project.slug)}
                      className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {projects.length === 0 && (
                <p className="text-sm text-slate-500 dark:text-gray-400">
                  Add your token and load projects.
                </p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default AdminProjects;
