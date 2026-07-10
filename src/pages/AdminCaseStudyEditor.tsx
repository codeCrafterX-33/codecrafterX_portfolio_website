import { UserButton, useAuth, useUser } from "@clerk/clerk-react";
import { ArrowLeft, Pencil, Plus } from "lucide-react";
import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ImageUpload from "../components/ImageUpload";
import { createCaseStudy, getAdminCaseStudy, updateCaseStudy } from "../lib/caseStudiesApi";
import { deleteCloudinaryImage } from "../lib/projectsApi";
import type { CaseStudy, CaseStudyInput } from "../types/caseStudy";

type FormState = {
  slug: string; title: string; company: string; challenge: string; solution: string;
  results: string; techStack: string; images: string; liveUrl: string;
  published: boolean; sortOrder: number;
};

const emptyForm: FormState = { slug: "", title: "", company: "", challenge: "", solution: "", results: "", techStack: "", images: "", liveUrl: "", published: true, sortOrder: 0 };
const lines = (value: string) => value.split(/\n/).map((item) => item.trim()).filter(Boolean);
const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
const fieldClass = "w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white";
const labelClass = "space-y-2 text-sm font-semibold text-slate-700 dark:text-white";

const fromStudy = (study: CaseStudy): FormState => ({
  slug: study.slug, title: study.title, company: study.company, challenge: study.challenge,
  solution: study.solution, results: study.results.join("\n"), techStack: study.techStack.join("\n"),
  images: study.images.join("\n"), liveUrl: study.liveUrl ?? "", published: study.published, sortOrder: study.sortOrder,
});

const toInput = (form: FormState): CaseStudyInput => ({
  slug: form.slug || slugify(form.title), title: form.title, company: form.company,
  challenge: form.challenge, solution: form.solution, results: lines(form.results),
  techStack: lines(form.techStack), images: lines(form.images), liveUrl: form.liveUrl || null,
  published: form.published, sortOrder: Number(form.sortOrder) || 0,
});

const AdminCaseStudyEditor = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const { isLoaded, isSignedIn, user } = useUser();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [originalSlug, setOriginalSlug] = useState("");
  const [persistedImages, setPersistedImages] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const isAdmin = user?.publicMetadata?.role === "admin";
  const isEditing = Boolean(slug);
  const imageUrls = useMemo(() => lines(form.images), [form.images]);

  const token = useCallback(async () => {
    const value = await getToken();
    if (!value) throw new Error("Sign in required.");
    return value;
  }, [getToken]);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !isAdmin || !slug) return;
    void (async () => {
      try {
        const study = await getAdminCaseStudy(slug, { authToken: await token() });
        setForm(fromStudy(study));
        setOriginalSlug(study.slug);
        setPersistedImages(study.images);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Unable to load case study.");
      }
    })();
  }, [isAdmin, isLoaded, isSignedIn, slug, token]);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((current) => ({ ...current, [key]: value }));
  const appendImage = (url: string) => update("images", Array.from(new Set([...imageUrls, url])).join("\n"));
  const removeImage = async (url: string) => {
    try {
      if (url.includes("res.cloudinary.com") && !persistedImages.includes(url)) {
        await deleteCloudinaryImage(url, { authToken: await token() });
      }
      update("images", imageUrls.filter((image) => image !== url).join("\n"));
    } catch (removeError) {
      setError(removeError instanceof Error ? removeError.message : "Unable to remove image.");
    }
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      setSaving(true); setError("");
      const authToken = await token();
      const input = toInput(form);
      const saved = isEditing
        ? await updateCaseStudy(originalSlug || slug!, input, { authToken })
        : await createCaseStudy(input, { authToken });
      setOriginalSlug(saved.slug); setPersistedImages(saved.images);
      navigate(`/admin/case-studies/${saved.slug}/edit`, { replace: true });
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to save case study.");
    } finally { setSaving(false); }
  };

  if (!isLoaded) return <main className="min-h-screen bg-[#f6f1e8] px-5 pt-32 dark:bg-[#111] dark:text-white">Loading editor...</main>;
  if (!isSignedIn || !isAdmin) return <main className="min-h-screen bg-[#f6f1e8] px-5 pt-32 text-center dark:bg-[#111] dark:text-white">Admin access required.</main>;

  return (
    <main className="min-h-screen bg-[#f6f1e8] px-4 pb-20 pt-32 text-slate-950 dark:bg-[#111] dark:text-white sm:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <Link to="/admin/case-studies" className="mb-5 inline-flex items-center gap-2 font-bold text-emerald-700 dark:text-emerald-300"><ArrowLeft size={16} /> Case studies</Link>
            <h1 className="text-4xl font-black md:text-5xl">{isEditing ? "Edit case study" : "New case study"}</h1>
            <p className="mt-3 text-slate-500 dark:text-gray-400">This entry is standalone and does not require a project.</p>
          </div>
          <UserButton afterSignOutUrl="/admin/case-studies" />
        </div>

        {error && <div className="mb-6 rounded-2xl bg-red-500/10 p-4 font-semibold text-red-700 dark:text-red-200">{error}</div>}

        <form onSubmit={submit} className="rounded-3xl bg-white p-6 dark:bg-zinc-950 md:p-8">
          <div className="grid gap-5 md:grid-cols-2">
            <label className={labelClass}>Title<input className={fieldClass} value={form.title} onChange={(e) => update("title", e.target.value)} required /></label>
            <label className={labelClass}>Slug<input className={fieldClass} value={form.slug} onChange={(e) => update("slug", e.target.value)} placeholder="Generated from title" /></label>
            <label className={labelClass}>Company or client<input className={fieldClass} value={form.company} onChange={(e) => update("company", e.target.value)} /></label>
            <label className={labelClass}>Live URL<input className={fieldClass} value={form.liveUrl} onChange={(e) => update("liveUrl", e.target.value)} /></label>
            <label className={labelClass}>Challenge<textarea className={fieldClass} rows={6} value={form.challenge} onChange={(e) => update("challenge", e.target.value)} /></label>
            <label className={labelClass}>Solution<textarea className={fieldClass} rows={6} value={form.solution} onChange={(e) => update("solution", e.target.value)} /></label>
            <label className={labelClass}>Results, one per line<textarea className={fieldClass} rows={6} value={form.results} onChange={(e) => update("results", e.target.value)} /></label>
            <label className={labelClass}>Tech stack, one per line<textarea className={fieldClass} rows={6} value={form.techStack} onChange={(e) => update("techStack", e.target.value)} /></label>
            <div className="space-y-3 md:col-span-2">
              <span className="text-sm font-semibold">Images</span>
              <ImageUpload value={imageUrls} multiple disabled={saving} onChange={appendImage} onRemove={(url) => void removeImage(url)} onError={setError} />
              <textarea className={fieldClass} rows={4} value={form.images} onChange={(e) => update("images", e.target.value)} placeholder="One image URL per line" />
            </div>
            <label className={labelClass}>Sort order<input type="number" className={fieldClass} value={form.sortOrder} onChange={(e) => update("sortOrder", Number(e.target.value))} /></label>
            <label className="flex items-center gap-3 font-semibold"><input type="checkbox" checked={form.published} onChange={(e) => update("published", e.target.checked)} /> Published</label>
          </div>
          <button type="submit" disabled={saving || !form.title.trim()} className="mt-8 inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3 font-bold text-white disabled:opacity-50 dark:bg-white dark:text-black">
            {isEditing ? <Pencil size={17} /> : <Plus size={17} />} {saving ? "Saving..." : isEditing ? "Update case study" : "Create case study"}
          </button>
        </form>
      </div>
    </main>
  );
};

export default AdminCaseStudyEditor;
