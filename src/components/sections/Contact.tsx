import TitleHeader from "../TitleHeader";
import ContactExperience from "../ContactExperience";
import { useRef, useState } from "react";
import Modal from "../Modal";
import emailjs from "@emailjs/browser";

const Contact = () => {
  const formRef = useRef(null);
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

    if (!formRef.current) return;

    try {
      await emailjs.sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        formRef.current,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      // Reset form and show success modal
      setForm({ name: "", email: "", message: "" });
      setShowSuccess(true);
    } catch (error) {
      console.error("EmailJS Error:", error); // Optional: show toast
    } finally {
      setLoading(false); // Always stop loading, even on error
    }
  };

  return (
    <section id="contact" className="flex-center section-padding xl:px-0">
      <div className="w-full h-full md:px-10 px-5">
        <TitleHeader title="Contact Us" sub="📧 Get In Touch" />
        <div className="mt-32 relative">
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

                <div className="flex-center card-border rounded-xl p-10">
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
