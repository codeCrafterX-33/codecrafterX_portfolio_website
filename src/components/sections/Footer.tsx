import { Link } from "react-router-dom";
import { socialImgs } from "../../constants";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const whatsappHref =
    socialImgs.find((social) => social.name === "whatsapp")?.href ??
    "https://wa.me/2349035466958";

  return (
    <footer className="mt-20 bg-gradient-to-t from-gray-900 to-black border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-5 md:px-20 py-16">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">
                CodeCrafter
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
                  X
                </span>
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Full-Stack Developer crafting exceptional digital experiences
                that solve real-world problems.
              </p>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialImgs.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 bg-black/100 dark:bg-gray-800 rounded-lg flex items-center justify-center hover:bg-green-600 transition-colors duration-300 group"
                  aria-label={social.name}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={social.imgPath}
                    alt={social.name}
                    className={`w-5 h-5 ${
                      social.name === "x" || social.name === "whatsapp"
                        ? "opacity-70 group-hover:opacity-100" // X and WhatsApp icons already carry their own colors.
                        : "filter brightness-0 invert opacity-70 group-hover:opacity-100"
                    }`}
                  />
                </a>
              ))}
            </div>

            {/* Email Contact */}
            <div className="mt-18">
              <a
                href="mailto:codecrafterx@sopefoluwabakare.dev"
                className="inline-flex items-center text-gray-300 hover:text-green-400 transition-colors duration-300"
              >
                <img
                  src="/images/logos/codecrafter_logo.png"
                  alt=""
                  aria-hidden="true"
                  className="mr-2 h-7 w-auto object-contain"
                />
                <span>codecrafterx@sopefoluwabakare.dev</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white mb-6">
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  reloadDocument
                  className="text-gray-300 hover:text-green-400 transition-colors duration-300"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  reloadDocument
                  className="text-gray-300 hover:text-green-400 transition-colors duration-300"
                >
                  About Me
                </Link>
              </li>
              <li>
                <Link
                  to="/projects"
                  reloadDocument
                  className="text-gray-300 hover:text-green-400 transition-colors duration-300"
                >
                  Projects
                </Link>
              </li>
              <li>
                <Link
                  to="/case-studies"
                  reloadDocument
                  className="text-gray-300 hover:text-green-400 transition-colors duration-300"
                >
                  Case Studies
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white mb-6">Services</h4>
            <ul className="space-y-3">
              <li className="text-gray-300">Web Development</li>
              <li className="text-gray-300">Mobile Apps</li>
              <li className="text-gray-300">E-commerce Solutions</li>
              <li className="text-gray-300">UI/UX Design</li>
              <li className="text-gray-300">Performance Optimization</li>
              <li className="text-gray-300">AI Automation</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white mb-6">
              Get In Touch
            </h4>
            <div className="space-y-3">
              <p className="text-gray-300">
                📍 <span className="ml-2">Based in China</span>
              </p>
              <p className="text-gray-300">
                💼 <span className="ml-2">Available for Projects</span>
              </p>
              <p className="text-gray-300">
                💪🏾 <span className="ml-2">Building in Public</span>
              </p>
            </div>

            {/* Call to Action */}
            <div className="pt-4">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300 text-sm font-medium"
              >
                Let's Connect →
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-center md:text-left">
              <p className="text-gray-400 text-sm">
                © {currentYear} Sopefoluwa Bakare. All rights reserved.
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Crafted with ❤️ and React
              </p>
            </div>

            {/* Tech Stack */}
            <div className="flex items-center space-x-6">
              <span className="text-gray-400 text-xs">Built with:</span>
              <div className="flex space-x-2">
                <span className="px-2 py-1 bg-black/100 dark:bg-green-500/20 text-green-300 text-xs rounded-full">
                  React
                </span>
                <span className="px-2 py-1 bg-black/100 dark:bg-emerald-500/20 text-emerald-300 text-xs rounded-full">
                  TypeScript
                </span>
                <span className="px-2 py-1 bg-black/100 dark:bg-green-500/20 text-green-300 text-xs rounded-full">
                  Tailwind
                </span>
              </div>
            </div>

            {/* Additional Links */}
            <div className="flex space-x-6">
              <Link
                to="/process"
                reloadDocument
                className="text-gray-400 hover:text-green-400 text-xs transition-colors duration-300"
              >
                Privacy Policy
              </Link>
              <Link
                to="/case-studies"
                reloadDocument
                className="text-gray-400 hover:text-green-400 text-xs transition-colors duration-300"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
