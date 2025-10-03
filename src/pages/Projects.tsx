import { Link } from "react-router-dom";
import ProjectCard from "../components/ProjectCard";
import ModernButton from "../components/ModernButton";

interface ProjectCard {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  techStack: string[];
  bgColor: string;
  featured: boolean;
}

const Projects = () => {
  const projects: ProjectCard[] = [
    {
      id: "campusly",
      title: "Campusly",
      category: "Mobile Application",
      description: "A platform that helps students connect with other students within or outside their school.",
      image: "/images/campusly_screen1.png",
      techStack: ["React Native", "Expo", "Firebase"],
      bgColor: "bg-[#ffefdb]",
      featured: true
    },
    {
      id: "phylote",
      title: "Phylote",
      category: "E-commerce Platform",
      description: "Nigeria's leading armored vehicle and weapons company specializing in security solutions and tactical equipment.",
      image: "/images/phylote_homepage.png",
      techStack: ["React", "E-commerce", "Security"],
      bgColor: "bg-[#ffefdb]",
      featured: true
    },
    {
      id: "crismyla",
      title: "Crismyla",
      category: "Beauty E-commerce",
      description: "A beauty brand offering premium beauty products including perfume, hair care, facials, and skincare essentials.",
      image: "/images/crismyl_homepage.png",
      techStack: ["WordPress", "Beauty E-commerce", "WooCommerce"],
      bgColor: "bg-[#ffe7eb]",
      featured: true
    }
  ];

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-zinc-900 to-black">
      <div className="max-w-7xl mx-auto px-5 md:px-20 py-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            My <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Projects</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Explore my portfolio of web applications, mobile apps, and e-commerce solutions built with modern technologies.
          </p>
          <div className="flex justify-center">
            <Link to="/">
              <ModernButton variant="outline" size="sm">
                ← Back to Home
              </ModernButton>
            </Link>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              layout="grid"
              {...project}
            />
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gray-800/50 p-12 rounded-2xl border border-gray-700">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Your Project?
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Let's bring your ideas to life with modern technologies and exceptional user experiences. 
            From mobile apps to e-commerce platforms, I'm ready to help you succeed.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/#contact">
              <ModernButton variant="primary" size="lg">
                Start a Project
              </ModernButton>
            </Link>
            <Link to="/case-studies">
              <ModernButton variant="outline" size="lg">
                View Case Studies
              </ModernButton>
            </Link>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl">📱</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Mobile Apps</h3>
              <p className="text-gray-300">
                React Native applications built for both iOS and Android platforms
              </p>
            </div>

            <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl">💻</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Web Applications</h3>
              <p className="text-gray-300">
                Modern React applications with responsive design and optimal performance
              </p>
            </div>

            <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mx-4 mb-4">
                <span className="text-white text-xl">🛒</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">E-commerce</h3>
              <p className="text-gray-300">
                Complete online stores with WordPress and custom integrations
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;
