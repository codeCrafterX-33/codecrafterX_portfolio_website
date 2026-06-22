import { SignInButton, UserButton, useAuth, useUser } from "@clerk/clerk-react";
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  LayoutDashboard,
  Pencil,
  Plus,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ImageUpload from "../components/ImageUpload";
import {
  createProject,
  getAdminProject,
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

const listFromLines = (value: string) =>
  value
    .split(/\n/)
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
  results: listFromLines(form.results),
  techStack: listFromLines(form.techStack),
  images: listFromLines(form.images),
  liveUrl: form.liveUrl || null,
  features: listFromLines(form.features),
  bgColor: form.bgColor || null,
  featured: form.featured,
  published: form.published,
  sortOrder: Number(form.sortOrder) || 0,
});

const fieldClass =
  "w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-900 dark:!text-white";

const labelClass = "text-sm font-semibold text-slate-700 dark:text-white-50";

const isClerkAdmin = (role: unknown): role is "admin" => role === "admin";

const AdminProjectEditor = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const { isLoaded, isSignedIn, user } = useUser();
  const [form, setForm] = useState<ProjectFormState>(emptyForm);
  const [originalSlug, setOriginalSlug] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoadingProject, setIsLoadingProject] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const hasAdminRole = isClerkAdmin(user?.publicMetadata?.role);
  const isEditing = Boolean(slug);
  const imageUrls = useMemo(() => listFromLines(form.images), [form.images]);

  const getSessionToken = useCallback(async () => {
    const token = await getToken();
    if (!token) {
      throw new Error("Sign in required.");
    }
    return token;
  }, [getToken]);

  const canSubmit = Boolean(
    user && hasAdminRole && form.title.trim().length > 0,
  );

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !hasAdminRole || !slug) {
      setIsLoadingProject(false);
      return;
    }

    const loadProject = async () => {
      try {
        setError("");
        setIsLoadingProject(true);
        const token = await getSessionToken();
        const project = await getAdminProject(slug, { authToken: token });
        setForm(formFromProject(project));
        setOriginalSlug(project.slug);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load project.",
        );
      } finally {
        setIsLoadingProject(false);
      }
    };

    void loadProject();
  }, [getSessionToken, hasAdminRole, isLoaded, isSignedIn, slug]);

  const updateField = <Key extends keyof ProjectFormState>(
    key: Key,
    value: ProjectFormState[Key],
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const appendImageUrls = useCallback((urls: string[]) => {
    setForm((current) => {
      const nextImages = new Set(listFromLines(current.images));
      urls.forEach((url) => {
        if (url) nextImages.add(url);
      });

      return { ...current, images: Array.from(nextImages).join("\n") };
    });
  }, []);

  const removeImageUrl = useCallback((urlToRemove: string) => {
    setForm((current) => ({
      ...current,
      images: listFromLines(current.images)
        .filter((url) => url !== urlToRemove)
        .join("\n"),
    }));
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!canSubmit) {
      setError("Admin access required.");
      return;
    }

    try {
      setIsSaving(true);
      setError("");
      setMessage("");
      const token = await getSessionToken();
      const input = inputFromForm(form);

      if (isEditing) {
        await updateProject(originalSlug || slug!, input, { authToken: token });
        setMessage("Project updated.");
        setOriginalSlug(input.slug);
        if (input.slug !== slug) {
          navigate(`/admin/projects/${input.slug}/edit`, { replace: true });
        }
      } else {
        const created = await createProject(input, { authToken: token });
        navigate(`/admin/projects/${created.slug}/edit`, { replace: true });
      }
    } catch (saveError) {
      setError(
        saveError instanceof Error ? saveError.message : "Unable to save project.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (!isLoaded) {
    return (
      <main className="min-h-screen bg-[#f6f1e8] px-5 pb-24 pt-32 text-slate-950 dark:bg-[#111111] dark:!text-white md:px-12">
        <div className="mx-auto max-w-5xl">
          <div className="h-2 w-32 animate-pulse rounded-full bg-emerald-500" />
          <p className="mt-6 text-lg text-slate-600 dark:text-gray-300">
            Loading project editor...
          </p>
        </div>
      </main>
    );
  }

  if (isLoadingProject) {
    return (
      <main className="min-h-screen bg-[#f6f1e8] px-5 pb-24 pt-32 text-slate-950 dark:bg-[#111111] dark:!text-white md:px-12">
        <div className="mx-auto max-w-5xl">
          <div className="h-2 w-32 animate-pulse rounded-full bg-emerald-500" />
          <p className="mt-6 text-lg text-slate-600 dark:text-gray-300">
            Loading project...
          </p>
        </div>
      </main>
    );
  }

  if (!isSignedIn) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f6f1e8] px-5 pb-12 pt-32 text-slate-950 dark:bg-[#111111] dark:!text-white">
        <div className="w-full max-w-3xl rounded-3xl border border-slate-950/10 bg-white p-8 dark:border-white/10 dark:bg-zinc-950 md:p-12">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-slate-950/10 bg-[#fff8ec] px-4 py-2 text-sm font-bold text-slate-700 dark:border-white/10 dark:bg-white/5 dark:!text-white">
            <LayoutDashboard size={16} />
            Portfolio admin
          </div>
          <h1 className="text-4xl font-black leading-tight tracking-tight md:text-5xl">
            Sign in to manage project details.
          </h1>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <SignInButton mode="modal">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3 font-bold !text-white transition hover:bg-emerald-700 dark:bg-white dark:!text-slate-950 dark:hover:bg-emerald-200"
              >
                Open admin
                <ArrowUpRight size={18} />
              </button>
            </SignInButton>
            <Link
              to="/"
              reloadDocument
              className="font-bold text-slate-700 dark:text-gray-200"
            >
              Go to homepage
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (!hasAdminRole) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f6f1e8] px-5 pb-12 pt-32 text-slate-950 dark:bg-[#111111] dark:!text-white">
        <div className="w-full max-w-xl rounded-3xl border border-slate-950/10 bg-white p-8 text-center dark:border-white/10 dark:bg-zinc-950 md:p-12">
          <h1 className="text-4xl font-black">Admin access only</h1>
          <p className="mt-4 text-slate-600 dark:text-gray-300">
            Your Clerk account is signed in, but it does not have the admin role.
          </p>
          <div className="mt-8 flex justify-center">
            <UserButton afterSignOutUrl="/admin/projects" />
          </div>
        </div>
      </main>
    );
  }

  if (isEditing && error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f6f1e8] px-5 pb-12 pt-32 text-slate-950 dark:bg-[#111111] dark:!text-white">
        <div className="w-full max-w-3xl rounded-3xl border border-slate-950/10 bg-white p-8 dark:border-white/10 dark:bg-zinc-950 md:p-12">
          <h1 className="text-4xl font-black">Couldn&apos;t load project</h1>
          <p className="mt-4 text-slate-600 dark:text-gray-300">{error}</p>
          <div className="mt-8 flex gap-4">
            <Link
              to="/admin/projects"
              reloadDocument
              className="inline-flex items-center rounded-full bg-slate-950 px-6 py-3 font-bold !text-white transition hover:bg-emerald-700 dark:bg-white dark:!text-slate-950 dark:hover:bg-emerald-200"
            >
              Back to projects
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-[#f6f1e8] px-4 pb-20 pt-32 text-slate-950 dark:bg-[#111111] dark:!text-white sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl min-w-0">
        <div className="mb-8 flex min-w-0 flex-wrap items-center justify-between gap-4">
          <div className="min-w-0">
            <Link
              to="/admin/projects"
              reloadDocument
              className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-emerald-700 dark:text-emerald-300"
            >
              <ArrowLeft size={16} />
              Back to projects
            </Link>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-300">
              {isEditing ? "Edit project" : "Create project"}
            </p>
            <h1 className="mt-2 break-words text-4xl font-black md:text-5xl">
              {isEditing ? form.title || "Project details" : "New project"}
            </h1>
          </div>
          <UserButton afterSignOutUrl="/admin/projects" />
        </div>

        {message && (
          <div className="mb-8 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 font-semibold text-emerald-800 dark:text-emerald-200">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-8 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 font-semibold text-red-800 dark:text-red-200">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="min-w-0 rounded-3xl border border-slate-950/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-950 md:p-8"
        >
          <div className="grid min-w-0 gap-5 md:grid-cols-2">
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
                onChange={(event) => updateField("category", event.target.value)}
                className={fieldClass}
              />
            </label>
            <label className="space-y-2">
              <span className={labelClass}>Live URL</span>
              <input
                value={form.liveUrl}
                onChange={(event) => updateField("liveUrl", event.target.value)}
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
                onChange={(event) => updateField("challenge", event.target.value)}
                className={fieldClass}
                rows={4}
              />
            </label>
            <label className="space-y-2">
              <span className={labelClass}>Solution</span>
              <textarea
                value={form.solution}
                onChange={(event) => updateField("solution", event.target.value)}
                className={fieldClass}
                rows={4}
              />
            </label>
            <label className="space-y-2">
              <span className={labelClass}>Features</span>
              <textarea
                value={form.features}
                onChange={(event) => updateField("features", event.target.value)}
                className={fieldClass}
                rows={5}
                placeholder="One per line"
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
                onChange={(event) => updateField("techStack", event.target.value)}
                className={fieldClass}
                rows={4}
              />
            </label>
            <div className="space-y-3 md:col-span-2">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className={labelClass}>Project images</span>
                <span className="text-xs font-semibold text-slate-500 dark:text-gray-400">
                  {imageUrls.length} uploaded
                </span>
              </div>
              <ImageUpload
                value={imageUrls}
                multiple
                disabled={isSaving}
                onChange={(url) => appendImageUrls([url])}
                onRemove={removeImageUrl}
                onError={setError}
              />
              <div className="space-y-2">
                <span className={labelClass}>Image URLs</span>
                <textarea
                  value={form.images}
                  onChange={(event) => updateField("images", event.target.value)}
                  className={fieldClass}
                  rows={4}
                  placeholder="Uploaded image URLs appear here. You can also paste URLs manually."
                />
              </div>
            </div>
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
                onChange={(event) => updateField("featured", event.target.checked)}
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
            {form.published && (
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-800 dark:bg-emerald-300/15 dark:text-emerald-200">
                <CheckCircle2 size={16} />
                Ready for public view
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={!canSubmit || isSaving}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3 font-bold !text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:!text-slate-950 dark:hover:bg-emerald-200"
          >
            {isEditing ? <Pencil size={18} /> : <Plus size={18} />}
            {isSaving
              ? "Saving..."
              : isEditing
                ? "Update project"
                : "Create project"}
          </button>
        </form>
      </div>
    </main>
  );
};

export default AdminProjectEditor;
