import { SignInButton, UserButton, useAuth, useUser } from "@clerk/clerk-react";
import { ArrowLeft, BookOpen, Pencil, Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteCaseStudy, getCaseStudies } from "../lib/caseStudiesApi";
import type { CaseStudy } from "../types/caseStudy";

const AdminCaseStudies = () => {
  const { getToken } = useAuth();
  const { isLoaded, isSignedIn, user } = useUser();
  const [studies, setStudies] = useState<CaseStudy[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [deletingSlug, setDeletingSlug] = useState("");
  const isAdmin = user?.publicMetadata?.role === "admin";

  const token = useCallback(async () => {
    const value = await getToken();
    if (!value) throw new Error("Sign in required.");
    return value;
  }, [getToken]);

  const loadStudies = useCallback(async () => {
    if (!isSignedIn || !isAdmin) return;
    try {
      setError("");
      setStudies(await getCaseStudies({ authToken: await token() }));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load case studies.");
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin, isSignedIn, token]);

  useEffect(() => {
    if (isLoaded) void loadStudies();
  }, [isLoaded, loadStudies]);

  const removeStudy = async (study: CaseStudy) => {
    if (!window.confirm(`Delete ${study.title}?`)) return;
    try {
      setDeletingSlug(study.slug);
      await deleteCaseStudy(study.slug, { authToken: await token() });
      await loadStudies();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Unable to delete case study.");
    } finally {
      setDeletingSlug("");
    }
  };

  if (!isLoaded || (isSignedIn && isAdmin && isLoading)) {
    return <main className="min-h-screen bg-[#f6f1e8] px-5 pt-32 dark:bg-[#111] dark:text-white">Loading case studies...</main>;
  }

  if (!isSignedIn) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f6f1e8] px-5 dark:bg-[#111]">
        <SignInButton mode="modal">
          <button className="rounded-full bg-slate-950 px-6 py-3 font-bold text-white">Sign in to admin</button>
        </SignInButton>
      </main>
    );
  }

  if (!isAdmin) {
    return <main className="min-h-screen bg-[#f6f1e8] px-5 pt-32 text-center dark:bg-[#111] dark:text-white">Admin access only.</main>;
  }

  return (
    <main className="min-h-screen bg-[#f6f1e8] px-4 pb-20 pt-32 text-slate-950 dark:bg-[#111] dark:text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 rounded-3xl bg-[#101820] p-6 text-white md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <Link to="/admin/projects" className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-emerald-300">
                <ArrowLeft size={16} /> Projects
              </Link>
              <div className="flex items-center gap-3">
                <BookOpen className="text-emerald-400" />
                <h1 className="text-4xl font-black text-emerald-400 md:text-5xl">Case studies</h1>
              </div>
              <p className="mt-4 max-w-2xl text-slate-300">Manage standalone case studies here. Project-linked case studies remain inside their project editor.</p>
            </div>
            <UserButton afterSignOutUrl="/admin/case-studies" />
          </div>
        </header>

        {error && <div className="mb-6 rounded-2xl bg-red-500/10 p-4 font-semibold text-red-700 dark:text-red-200">{error}</div>}

        <section className="rounded-3xl bg-white p-5 dark:bg-zinc-950 md:p-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-300">Standalone library</p>
              <h2 className="mt-1 text-2xl font-black">{studies.length} case studies</h2>
            </div>
            <Link to="/admin/case-studies/new" className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 font-bold text-white dark:bg-white dark:text-black">
              <Plus size={17} /> New case study
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {studies.map((study) => (
              <article key={study.id} className="rounded-2xl border border-slate-200 p-4 dark:border-white/10 dark:bg-zinc-900">
                {study.images[0] && <img src={study.images[0]} alt={study.title} className="mb-4 aspect-video w-full rounded-xl object-contain object-top" />}
                <h3 className="font-black">{study.title}</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">{study.company}</p>
                <span className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-bold ${study.published ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"}`}>
                  {study.published ? "Published" : "Draft"}
                </span>
                <div className="mt-5 flex gap-2">
                  <Link to={`/admin/case-studies/${study.slug}/edit`} className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-slate-300 px-3 py-2 text-sm font-bold">
                    <Pencil size={15} /> Edit
                  </Link>
                  <button type="button" onClick={() => void removeStudy(study)} disabled={deletingSlug === study.slug} className="rounded-full bg-red-600 px-3 text-white disabled:opacity-50" aria-label={`Delete ${study.title}`}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </article>
            ))}
          </div>

          {!studies.length && <p className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500">No standalone case studies yet.</p>}
        </section>
      </div>
    </main>
  );
};

export default AdminCaseStudies;
