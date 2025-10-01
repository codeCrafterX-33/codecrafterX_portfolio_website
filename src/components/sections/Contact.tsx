import TitleHeader from "../TitleHeader";
import ContactExperience from "../ContactExperience";

const Contact = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted");
  };

  return (
    <section
      id="contact"
      className="w-full md:mt-40 my-20 section-padding xl:px-0"
    >
      <div className="w-full h-full md:px-20 px-5">
        <TitleHeader title="Contact Us" sub="📧 Get In Touch" />
        <div className="mt-32 relative">
          <div className="grid-2-cols gap-12 items-start">
            {/* Left Side - Contact Form */}
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-semibold mb-4">
                  Send me a message
                </h3>
                <p className="text-white-50 mb-8">
                  Ready to work together? I'd love to hear from you. Whether you
                  have a project in mind, want to collaborate, or just want to
                  say hello, feel free to reach out!
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Your name"
                    required
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
                    required
                    className="mt-2 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-white text-black font-semibold rounded-md hover:bg-white-50 transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Right Side - 3D Experience */}
            <div className="flex flex-col items-center">
              <div className="w-full">
                <ContactExperience />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
