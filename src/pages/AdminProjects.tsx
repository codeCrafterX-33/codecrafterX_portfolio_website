import { SignInButton, UserButton, useAuth, useUser } from "@clerk/clerk-react";
import {
  ArrowUpRight,
  BookOpen,
  LayoutDashboard,
  Pencil,
  Plus,
  Star,
  Trash2,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { deleteProject, getProjects } from "../lib/projectsApi";
import type { Project } from "../types/project";

const statusPillClass =
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.12em]";

const isClerkAdmin = (role: unknown): role is "admin" => role === "admin";

const AdminProjectsSkeleton = () => (
  <main className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#f6f1e8] px-4 pb-20 pt-32 text-slate-950 dark:bg-[#111111] dark:!text-white sm:px-6 lg:px-8">
    <div className="mx-auto w-full max-w-7xl min-w-0">
      <section className="mb-8 w-full max-w-full overflow-hidden rounded-3xl border border-slate-950/10 bg-[#101820] shadow-[0_24px_80px_rgba(15,23,42,0.16)] dark:border-white/10">
        <div className="flex min-w-0 flex-col gap-8 p-6 md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="h-9 w-40 animate-pulse rounded-full bg-white/10" />
            <div className="h-10 w-36 animate-pulse rounded-full bg-white/10" />
          </div>

          <div className="grid min-w-0 gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,480px)] xl:items-end">
            <div className="min-w-0">
              <div className="h-12 w-72 max-w-full animate-pulse rounded-2xl bg-white/10 md:h-14" />
              <div className="mt-5 h-4 w-full max-w-xl animate-pulse rounded-full bg-white/10" />
              <div className="mt-3 h-4 w-2/3 max-w-md animate-pulse rounded-full bg-white/10" />
            </div>

            <div className="grid min-w-0 gap-3 sm:grid-cols-3 xl:max-w-[480px]">
              {[0, 1, 2].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/[0.08] p-4"
                >
                  <div className="mb-3 h-9 w-9 animate-pulse rounded-full bg-white/15" />
                  <div className="h-3 w-24 animate-pulse rounded-full bg-white/10" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="w-full max-w-full overflow-hidden rounded-3xl border border-slate-950/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-zinc-950 md:p-6">
        <div className="mb-6 flex min-w-0 flex-wrap items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="h-3 w-24 animate-pulse rounded-full bg-emerald-200 dark:bg-emerald-300/20" />
            <div className="mt-3 h-8 w-36 animate-pulse rounded-xl bg-slate-200 dark:bg-white/10" />
          </div>
          <div className="h-10 w-32 animate-pulse rounded-full bg-slate-200 dark:bg-white/10" />
        </div>

        <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-[repeat(2,minmax(0,1fr))] xl:grid-cols-[repeat(3,minmax(0,1fr))]">
          {[0, 1, 2, 3, 4, 5].map((item) => (
            <article
              key={item}
              className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-zinc-900"
            >
              <div className="mb-4 aspect-video animate-pulse rounded-xl bg-slate-100 dark:bg-zinc-800" />
              <div className="flex min-w-0 items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="h-5 w-4/5 animate-pulse rounded-full bg-slate-200 dark:bg-white/10" />
                  <div className="mt-3 h-4 w-2/3 animate-pulse rounded-full bg-slate-100 dark:bg-white/10" />
                </div>
                <div className="h-8 w-8 animate-pulse rounded-full bg-amber-100 dark:bg-amber-300/15" />
              </div>
              <div className="mt-4 flex min-w-0 flex-wrap gap-2">
                <div className="h-7 w-24 animate-pulse rounded-full bg-emerald-100 dark:bg-emerald-300/15" />
                <div className="h-7 w-32 animate-pulse rounded-full bg-slate-100 dark:bg-white/10" />
              </div>
              <div className="mt-5 flex min-w-0 gap-2">
                <div className="h-10 flex-1 animate-pulse rounded-full bg-slate-100 dark:bg-white/10" />
                <div className="h-10 w-12 animate-pulse rounded-full bg-red-100 dark:bg-red-400/15" />
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  </main>
);

const AdminProjects = () => {
  const { getToken } = useAuth();
  const { isLoaded, isSignedIn, user } = useUser();
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState("");
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [isDeletingSlug, setIsDeletingSlug] = useState("");

  const hasAdminRole = isClerkAdmin(user?.publicMetadata?.role);

  const dashboardStats = useMemo(() => {
    const publishedCount = projects.filter((project) => project.published).length;
    const featuredCount = projects.filter((project) => project.featured).length;

    return [
      {
        label: "Total projects",
        value: projects.length,
        tone: "bg-slate-950 !text-white dark:bg-white dark:!text-black",
      },
      {
        label: "Published",
        value: publishedCount,
        tone: "bg-emerald-600 !text-white",
      },
      {
        label: "Featured",
        value: featuredCount,
        tone: "bg-amber-500 text-slate-950",
      },
    ];
  }, [projects]);

  const getSessionToken = useCallback(async () => {
    const token = await getToken();
    if (!token) {
      throw new Error("Sign in required.");
    }
    return token;
  }, [getToken]);

  const loadProjects = useCallback(async (showSkeleton = true) => {
    if (!isSignedIn || !hasAdminRole) {
      return;
    }

    try {
      setError("");
      if (showSkeleton) {
        setIsLoadingProjects(true);
      }
      const token = await getSessionToken();
      const nextProjects = await getProjects({ authToken: token });
      setProjects(nextProjects);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load admin projects.",
      );
    } finally {
      if (showSkeleton) {
        setIsLoadingProjects(false);
      }
    }
  }, [getSessionToken, hasAdminRole, isSignedIn]);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    if (!isSignedIn) {
      setProjects([]);
      setIsLoadingProjects(false);
      return;
    }

    void loadProjects();
  }, [isLoaded, isSignedIn, loadProjects]);

  const handleDelete = async (slug: string) => {
    if (!window.confirm(`Delete ${slug}?`)) {
      return;
    }

    try {
      setIsDeletingSlug(slug);
      const token = await getSessionToken();
      await deleteProject(slug, { authToken: token });
      await loadProjects(false);
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete project.",
      );
    } finally {
      setIsDeletingSlug("");
    }
  };

  if (!isLoaded) {
    return (
      <main className="min-h-screen bg-[#f6f1e8] px-5 pb-24 pt-32 text-slate-950 dark:bg-[#111111] dark:!text-white md:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="h-2 w-32 animate-pulse rounded-full bg-emerald-500" />
          <p className="mt-6 text-lg text-slate-600 dark:text-gray-300">
            Loading admin workspace...
          </p>
        </div>
      </main>
    );
  }

  if (!isSignedIn) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f6f1e8] px-5 pb-12 pt-32 text-slate-950 dark:bg-[#111111] dark:!text-white">
        <div className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-slate-950/10 bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.12)] dark:border-white/10 dark:bg-zinc-950 md:p-12">
          <div className="relative max-w-2xl">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-slate-950/10 bg-[#fff8ec] px-4 py-2 text-sm font-bold text-slate-700 dark:border-white/10 dark:bg-white/5 dark:!text-white">
              <LayoutDashboard size={16} />
              Portfolio admin
            </div>
            <h1 className="text-4xl font-black leading-tight tracking-tight md:text-6xl">
              Sign in to manage the work that shows up on your portfolio.
            </h1>
          </div>
          <div className="relative mt-8 flex flex-wrap items-center gap-4">
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
              className="inline-flex items-center rounded-full border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-emerald-500 hover:text-emerald-700 dark:border-white/10 dark:text-gray-200 dark:hover:!text-white"
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
        <div className="w-full max-w-xl rounded-3xl border border-slate-950/10 bg-white p-8 text-center shadow-[0_24px_80px_rgba(15,23,42,0.12)] dark:border-white/10 dark:bg-zinc-950 md:p-12">
          <h1 className="text-3xl font-black md:text-5xl">Admin access only</h1>
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

  if (isLoadingProjects) {
    return <AdminProjectsSkeleton />;
  }

  return (
    <main className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#f6f1e8] px-4 pb-20 pt-32 text-slate-950 dark:bg-[#111111] dark:!text-white sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl min-w-0">
        <section className="mb-8 w-full max-w-full overflow-hidden rounded-3xl border border-slate-950/10 bg-[#101820] !text-white shadow-[0_24px_80px_rgba(15,23,42,0.16)] dark:border-white/10">
          <div className="flex min-w-0 flex-col gap-8 p-6 md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-emerald-100">
                <LayoutDashboard size={16} />
                Admin workspace
              </div>
              <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/10 px-3 py-2">
                <span className="text-sm font-bold !text-white">Admin active</span>
                <UserButton afterSignOutUrl="/admin/projects" />
              </div>
            </div>

            <div className="grid min-w-0 gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,480px)] xl:items-end">
	              <div className="min-w-0">
                <h1 className="text-4xl font-black !text-green-400 leading-tight md:text-5xl">
                  Project library
                </h1>
                <p className="mt-4 max-w-2xl text-base font-medium !text-slate-300 md:text-lg">
                  Review portfolio projects, open detail editors, and create new
                  work from a focused page.
                </p>
              </div>

              <div className="grid min-w-0 gap-3 sm:grid-cols-3 xl:max-w-[480px]">
                {dashboardStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-white/10 bg-white/[0.08] p-4 backdrop-blur"
                  >
                    <div
                      className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-full text-sm font-black ${stat.tone}`}
                    >
                      {stat.value}
                    </div>
                    <p className="text-xs font-bold uppercase tracking-[0.12em] !text-slate-300">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {error && (
          <div className="mb-8 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 font-semibold text-red-800 dark:text-red-200">
            {error}
          </div>
        )}

        <section className="w-full max-w-full overflow-hidden rounded-3xl border border-slate-950/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-zinc-950 md:p-6">
	          <div className="mb-6 flex min-w-0 flex-wrap items-center justify-between gap-4">
	            <div className="min-w-0">
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-300">
                Library
              </p>
              <h2 className="mt-1 text-2xl font-black">Projects</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/admin/case-studies"
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-bold transition hover:border-emerald-500 hover:text-emerald-700 dark:border-white/15 dark:hover:text-emerald-200"
              >
                <BookOpen size={16} />
                Case studies
              </Link>
              <Link
                to="/admin/projects/new"
                className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-bold !text-white transition hover:bg-emerald-700 dark:bg-white dark:!text-slate-950 dark:hover:bg-emerald-200"
              >
                <Plus size={16} />
                New project
              </Link>
            </div>
          </div>

          <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-[repeat(2,minmax(0,1fr))] xl:grid-cols-[repeat(3,minmax(0,1fr))]">
            {projects.map((project) => (
              <article
                key={project.id}
	                className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-slate-300 dark:border-white/10 dark:bg-zinc-900 dark:hover:border-white/20"
              >
                {project.images[0] && (
                  <div className="mb-4 aspect-video overflow-hidden rounded-xl bg-slate-100 dark:bg-zinc-800">
                    <img
                      src={project.images[0]}
                      alt={project.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
	                <div className="flex min-w-0 items-start justify-between gap-3">
	                  <div className="min-w-0">
	                    <h3 className="break-words font-black">{project.title}</h3>
	                    <p className="mt-1 break-all text-sm text-slate-500 dark:text-gray-400">
                      /projects/{project.slug}
                    </p>
                  </div>
                  {project.featured && (
                    <span className="rounded-full bg-amber-100 p-2 text-amber-700 dark:bg-amber-300/15 dark:text-amber-200">
                      <Star size={15} fill="currentColor" />
                    </span>
                  )}
                </div>
	                <div className="mt-4 flex min-w-0 flex-wrap gap-2">
                  <span
                    className={`${statusPillClass} ${
                      project.published
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-300/15 dark:text-emerald-200"
                        : "bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-gray-300"
                    }`}
                  >
                    {project.published ? "Published" : "Draft"}
                  </span>
	                  <span className={`${statusPillClass} max-w-full break-words bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-gray-300`}>
                    {project.category || "Uncategorized"}
                  </span>
                </div>
	                <div className="mt-5 flex min-w-0 gap-2">
                  <Link
                    to={`/admin/projects/${project.slug}/edit`}
                    reloadDocument
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-slate-300 px-3 py-2 text-sm font-bold transition hover:border-emerald-500 hover:text-emerald-700 dark:border-white/10 dark:hover:text-emerald-200"
                  >
                    <Pencil size={15} />
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => void handleDelete(project.slug)}
                    disabled={isDeletingSlug === project.slug}
                    className="inline-flex items-center justify-center rounded-full bg-red-600 px-3 py-2 text-sm font-bold !text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                    aria-label={`Delete ${project.title}`}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </article>
            ))}
          </div>

          {projects.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-[#fff8ec] p-8 text-center dark:border-white/15 dark:bg-white/5">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-300/15 dark:text-emerald-200">
                <Plus size={22} />
              </div>
              <p className="font-black">No projects yet</p>
              <p className="mt-2 text-sm text-slate-500 dark:text-gray-400">
                Create the first project from its dedicated editor.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default AdminProjects;
