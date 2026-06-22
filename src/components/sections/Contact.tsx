import TitleHeader from "../TitleHeader";
import ContactExperience from "../ContactExperience";
import { useRef, useState } from "react";
import Modal from "../Modal";
import { apiUrl } from "../../lib/projectsApi";
import { socialImgs } from "../../constants";

const Contact = () => {
  const formRef = useRef<HTMLFormElement | null>(null);
  const whatsappHref =
    socialImgs.find((social) => social.name === "whatsapp")?.href ??
    "https://wa.me/2349035466958";
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true); // Show loading state

    try {
      const response = await fetch(apiUrl("/api/contact"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(
          payload?.error ?? `Unable to send message. (${response.status})`,
        );
      }

      // Reset form and show success modal
      setForm({ name: "", email: "", message: "" });
      if (formRef.current) {
        formRef.current.reset();
      }
      setShowSuccess(true);
    } catch (error) {
      console.error("Contact form Error:", error);
    } finally {
      setLoading(false); // Always stop loading, even on error
    }
  };

  return (
    <section id="contact" className="flex-center section-padding xl:px-0">
      <div className="w-full h-full md:px-10 px-5">
        <TitleHeader title="Contact Us" sub="📧 Get In Touch" />
        <div className="mt-20 relative">
          <div className="grid-12-cols mt-16">
            {/* Left Side - Contact Form */}
            <div className="xl:col-span-5">
              <div>
                <h3 className="text-2xl font-semibold mb-4">
                  Send me a message
                </h3>
                <p className="text-white-50 mb-8">
                  Ready to work together? I'd love to hear from you. Whether you
                  have a project in mind, want to collaborate, or just want to
                  say hello, feel free to reach out!
                </p>

                <div className="contact-form-dark flex-center card-border rounded-xl p-10">
                  <form
                    onSubmit={handleSubmit}
                    className="w-full flex flex-col gap-7"
                    ref={formRef}
                  >
                    <div>
                      <label htmlFor="name">Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Your name"
                        required
                        value={form.name}
                        onChange={handleChange}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <label htmlFor="email">Email</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="your.email@example.com"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <label htmlFor="message">Message</label>
                      <textarea
                        id="message"
                        name="message"
                        placeholder="Tell me about your project or just say hello!"
                        rows={6}
                        value={form.message}
                        onChange={handleChange}
                        required
                        className="mt-2 resize-none"
                      />
                    </div>

                    <button type="submit" disabled={loading}>
                      <div className="cta-button group">
                        <div className="bg-circle" />
                        <p className="text">
                          {loading ? "Sending..." : "Send Message"}
                          {loading && <div className="loading-spinner" />}
                        </p>
                        <div className="arrow-wrapper">
                          <img src="/images/arrow-down.svg" alt="arrow" />
                        </div>
                      </div>
                    </button>

                    <div className="flex flex-col items-center gap-3 border-t border-white/10 pt-6 text-center">
                      <span className="text-sm text-white-50">
                        Prefer a faster chat?
                      </span>
                      <a
                        href={whatsappHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-md border border-green-500/40 bg-green-500/10 px-4 py-3 text-sm font-semibold text-green-300 transition hover:border-green-400 hover:bg-green-500/20 hover:text-green-200"
                      >
                        <img
                          src="/images/whatsapp.svg"
                          alt=""
                          aria-hidden="true"
                          className="size-5"
                        />
                        Message me on WhatsApp
                      </a>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* Right Side - 3D Experience */}
            <div className="xl:col-span-7 min-h-96">
              <div className="bg-[#cd7c2e] w-full h-full hover:cursor-grab rounded-3xl overflow-hidden">
                <ContactExperience />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        open={showSuccess}
        onClose={() => setShowSuccess(false)}
        title="Message sent"
      >
        <p className="text-white/80 mb-4">
          Your message has landed in my inbox 📧 Thanks for reaching out — I’ll
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
