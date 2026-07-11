import { useRef, useState } from "react";
import {
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  Mail,
  Send,
} from "lucide-react";
import Modal from "../Modal";
import { apiUrl } from "../../lib/projectsApi";
import { socialImgs } from "../../constants";

const Contact = () => {
  const formRef = useRef<HTMLFormElement | null>(null);
  const whatsappSocial = socialImgs.find(
    (social) => social.name === "whatsapp",
  );
  const whatsappHref =
    whatsappSocial?.href ?? "https://wa.me/2349035466958";
  const whatsappLogo = whatsappSocial?.imgPath ?? "/images/whatsapp.svg";
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
    company: "",
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSubmitError("");

    try {
      const response = await fetch(apiUrl("/api/contact"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        if (response.status >= 500) {
          throw new Error(
            "Message could not be sent right now. Please try again in a moment or use WhatsApp.",
          );
        }

        const responseText = await response.text();
        const payload = (() => {
          try {
            return JSON.parse(responseText) as { error?: string };
          } catch {
            return null;
          }
        })();
        throw new Error(
          payload?.error ??
            `Unable to send message. (${response.status})`,
        );
      }

      // Reset form and show success modal
      setForm({ name: "", email: "", message: "", company: "" });
      if (formRef.current) {
        formRef.current.reset();
      }
      setShowSuccess(true);
    } catch (error) {
      console.error("Contact form Error:", error);
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Unable to send your message. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="contact"
      className="relative mt-24 overflow-hidden border-y border-white/10 bg-black px-5 py-24 md:mt-40 md:px-10 md:py-32"
    >
      <div className="pointer-events-none absolute -left-32 top-20 h-80 w-80 rounded-full bg-emerald-500/10 blur-[110px]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-cyan-400/5 blur-[120px]" />

      <div className="relative mx-auto grid max-w-7xl gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-20">
        <div className="lg:sticky lg:top-32">
          <div className="contact-availability mb-8 inline-flex items-center gap-3 text-sm font-bold uppercase tracking-[0.12em] text-emerald-300">
            <span className="contact-availability-dot h-2 w-2 rounded-full bg-emerald-400" />
            Available for selected projects
          </div>

          <p className="mb-5 text-sm font-black uppercase tracking-[0.22em] text-white/45">
            Start a conversation
          </p>
          <h2 className="max-w-xl text-5xl font-black leading-[0.98] tracking-[-0.045em] text-white sm:text-6xl xl:text-7xl">
            Let&apos;s build something people
            <span className="block text-emerald-400">remember.</span>
          </h2>
          <p className="mt-7 max-w-lg text-lg leading-8 text-white/60">
            Have a product idea, an existing platform that needs work, or a
            business problem worth solving? Send the details and I&apos;ll reply
            with a clear next step.
          </p>

          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <a
              href="mailto:codecrafterx@sopefoluwabakare.dev"
              className="group rounded-2xl border border-white/10 bg-white/[0.035] p-5 transition hover:border-emerald-400/40 hover:bg-emerald-400/[0.07]"
            >
              <div className="mb-7 flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white">
                  <Mail size={19} />
                </span>
                <ArrowUpRight
                  size={19}
                  className="text-white/35 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-emerald-300"
                />
              </div>
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-white/40">
                Email
              </span>
              <p className="mt-2 break-all text-sm font-semibold text-white sm:text-base">
                codecrafterx@sopefoluwabakare.dev
              </p>
            </a>

            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-2xl border border-white/10 bg-white/[0.035] p-5 transition hover:border-emerald-400/40 hover:bg-emerald-400/[0.07]"
            >
              <div className="mb-7 flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10">
                  <img
                    src={whatsappLogo}
                    alt=""
                    aria-hidden="true"
                    className="h-7 w-7 object-contain"
                  />
                </span>
                <ArrowUpRight
                  size={19}
                  className="text-white/35 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-emerald-300"
                />
              </div>
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-white/40">
                Quick chat
              </span>
              <p className="mt-2 text-base font-semibold text-white">
                Message me on WhatsApp
              </p>
            </a>
          </div>

          <div className="mt-6 flex flex-wrap gap-x-7 gap-y-3 text-sm text-white/50">
            <span className="inline-flex items-center gap-2">
              <Clock3 size={16} className="text-emerald-400" />
              Replies within 24 hours
            </span>
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400" />
              Clear scope, no pressure
            </span>
          </div>
        </div>

        <div className="relative rounded-[2rem] border border-white/10 bg-[#0b0e0d] p-1 shadow-[0_30px_100px_rgba(0,0,0,0.55)]">
          <div className="rounded-[1.7rem] border border-white/[0.06] bg-[linear-gradient(145deg,rgba(255,255,255,0.04),transparent_45%)] p-6 sm:p-9 md:p-11">
            <div className="mb-10 flex items-start justify-between gap-5 border-b border-white/10 pb-7">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-400">
                  Project brief
                </p>
                <h3 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
                  Tell me what you&apos;re working on.
                </h3>
              </div>
           
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex w-full flex-col gap-7"
              ref={formRef}
            >
              <div className="grid gap-7 sm:grid-cols-2">
                <label className="block" htmlFor="name">
                  <span className="text-xs font-bold uppercase tracking-[0.15em] text-white/45">
                    Your name
                  </span>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="How should I address you?"
                    required
                    value={form.name}
                    onChange={handleChange}
                    className="mt-3 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none transition placeholder:text-white/25 focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/10"
                  />
                </label>

                <label className="block" htmlFor="email">
                  <span className="text-xs font-bold uppercase tracking-[0.15em] text-white/45">
                    Email address
                  </span>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="you@company.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="mt-3 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none transition placeholder:text-white/25 focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/10"
                  />
                </label>
              </div>

              <label className="block" htmlFor="message">
                <span className="text-xs font-bold uppercase tracking-[0.15em] text-white/45">
                  Project details
                </span>
                <textarea
                  id="message"
                  name="message"
                  placeholder="What are you building, what problem should it solve, and when would you like to start?"
                  rows={7}
                  value={form.message}
                  onChange={handleChange}
                  required
                  className="mt-3 w-full resize-none rounded-xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none transition placeholder:text-white/25 focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/10"
                />
              </label>

              <div className="hidden" aria-hidden="true">
                <label htmlFor="company">Company</label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.company}
                  onChange={handleChange}
                />
              </div>

              {submitError && (
                <p
                  role="alert"
                  aria-live="polite"
                  className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-200"
                >
                  {submitError}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="group inline-flex min-h-16 w-full items-center justify-between rounded-xl bg-emerald-400 px-6 py-4 text-left font-black uppercase tracking-[0.08em] text-black transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span>{loading ? "Sending message..." : "Send project brief"}</span>
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-emerald-300 transition group-hover:translate-x-1">
                  <Send size={18} />
                </span>
              </button>

              <p className="text-center text-xs leading-5 text-white/35">
                Your details stay private and are only used to reply to this
                inquiry.
              </p>
            </form>
          </div>
        </div>
      </div>
      <Modal
        open={showSuccess}
        onClose={() => setShowSuccess(false)}
        title="Message sent"
      >
        <p className="text-white/80 mb-4">
          Your message has landed in my inbox. Thanks for reaching out. I&apos;ll
          get back to you within 24 hours or less.
        </p>
        <button
          onClick={() => {
            setShowSuccess(false);
            const nameInput = document.getElementById(
              "name"
            ) as HTMLInputElement | null;
            nameInput?.focus();
          }}
          className="px-4 py-2 rounded-md bg-white/10 hover:bg-white/20 transition"
        >
          Send another message
        </button>
      </Modal>
    </section>
  );
};

export default Contact;
