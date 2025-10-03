import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import ModernButton from "../components/ModernButton";

interface ProjectData {
  id: string;
  title: string;
  category: string;
  description: string;
  longDescription: string;
  challenge: string;
  solution: string;
  results: string[];
  techStack: string[];
  images: string[];
  liveUrl?: string;
  features: string[];
}


const ProjectTemplate = () => {
  const { projectId } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Project data - you can expand this or move to a separate file
  const projects: Record<string, ProjectData> = {
    campusly: {
      id: "campusly",
      title: "Campusly",
      category: "Mobile Application",
      description: "A platform that helps students connect with other students within or outside their school.",
      longDescription: "Campusly is a comprehensive social networking mobile application designed specifically for students. The platform enables students from different educational institutions to connect, share experiences, and build meaningful relationships within the student community.",
      challenge: "Students often struggle to connect with peers outside their immediate social circles or institutions, limiting opportunities for collaboration, knowledge sharing, and networking.",
      solution: "Developed a React Native mobile application with Firebase backend integration, featuring user profiles, real-time messaging, event sharing, and campus-specific groups to facilitate meaningful student connections.",
      results: [
        "Built with React Native for cross-platform iOS and Android support",
        "Expo framework for streamlined development and deployment",
        "Firebase integration for real-time data synchronization",
        "Student verification system ensuring authentic user base",
        "Interactive campus maps and location-based features"
      ],
      techStack: ["React Native", "Expo", "Firebase", "JavaScript", "React Navigation"],
      images: [
        "/images/campusly_screen1.png",
        "/images/campusly_1.jpg",
        "/images/campusly_3.jpg",
   
      
      ],
      features: [
        "User Authentication & Profiles",
        "Real-time Messaging",
        "Campus-based Groups",
        "Event Discovery",
        "Student Directory",
        "Push Notifications"
      ]
    },
    phylote: {
      id: "phylote",
      title: "Phylote",
      category: "E-commerce Platform",
      description: "Nigeria's leading armored vehicle and weapons company specializing in security solutions and tactical equipment.",
      longDescription: "Phylote is a premium e-commerce platform designed for the defense and security industry. The platform showcases armored vehicles, weapons, and tactical equipment with advanced filtering, customization options, and secure client portals for defense professionals.",
      challenge: "The defense industry requires a specialized e-commerce platform that can handle complex product catalogs, customization requests, secure transactions, and compliance with regulations.",
      solution: "Developed a React-based e-commerce solution with advanced product filtering, customization tools, secure payment processing, and professional client portals with document verification and order tracking.",
      results: [
        "Custom React application with responsive design",
        "Advanced product filtering and search capabilities",
        "Secure client portal with document management",
        "Customization tools for equipment specifications",
        "Integration with payment processors and logistics partners"
      ],
      techStack: ["React", "Node.js", "MongoDB", "Stripe", "TailwindCSS"],
      images: [
        "/images/phylote_homepage.png",
        "/images/phylote_products.png",
        "/images/phylote_customization.png",
        "/images/phylote_portal.png"
      ],
      liveUrl: "https://phyloteng.com",
      features: [
        "Product Catalog",
        "Customization Tools",
        "Secure Client Portal",
        "Document Management",
        "Order Tracking",
        "Multi-language Support"
      ]
    },
    crismyla: {
      id: "crismyla",
      title: "Crismyla",
      category: "Beauty E-commerce",
      description: "A beauty brand offering premium beauty products including perfume, hair care, facials, and skincare essentials.",
      longDescription: "Crismyla is a comprehensive beauty e-commerce platform that offers premium beauty products with personalized consultation services, beauty tutorials, and seamless online shopping experience for beauty enthusiasts.",
      challenge: "Creating an immersive beauty shopping experience that allows customers to discover products, book consultations, access expert advice, and make informed purchasing decisions.",
      solution: "Built a complete WordPress e-commerce solution with WooCommerce integration, featuring product catalogs, virtual consultation booking, beauty tutorials, customer reviews, and personalized product recommendations.",
      results: [
        "Complete WordPress e-commerce website built from scratch",
        "WooCommerce integration for seamless product management",
        "Virtual consultation booking system",
        "Beauty tutorial content management",
        "CRM integration for customer relationship management",
        "Mobile-responsive design for optimal user experience"
      ],
      techStack: ["WordPress", "WooCommerce", "PHP", "MySQL", "CSS3", "JavaScript"],
      images: [
        "/images/crismyl_homepage.png",
        "/images/crismyla_products.png",
        "/images/crismyla_consultation.png",
        "/images/crismyla_blog.png"
      ],
      liveUrl: "https://crismyla.store",
      features: [
        "Product Catalog",
        "Consultation Booking",
        "Beauty Tutorials",
        "Customer Reviews",
        "Personalized Recommendations",
        "Mobile Responsive"
      ]
    }
  };

  const project = projectId ? projects[projectId] : null;

  if (!project) {
    return (
      <div className="min-h-screen pt-20 bg-gradient-to-b from-zinc-900 to-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Project Not Found</h1>
          <p className="text-gray-300 mb-8">The project you're looking for doesn't exist.</p>
          <ModernButton href="/" variant="primary">
            Back to Home
          </ModernButton>
        </div>
      </div>
    );
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % project.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + project.images.length) % project.images.length);
  };

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-zinc-900 to-black">
      <div className="max-w-7xl mx-auto px-5 md:px-20 py-10">
        {/* Back Button */}
        <div className="mb-8">
          <Link to="/">
            <ModernButton variant="outline" size="sm">
              ← Back to Projects
            </ModernButton>
          </Link>
        </div>

        {/* Project Header */}
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-2 bg-purple-900/30 rounded-full mb-4">
            <span className="text-purple-300 text-sm font-medium">{project.category}</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            {project.title}
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            {project.description}
          </p>
          {project.liveUrl && (
            <div className="flex justify-center gap-4">
              <ModernButton href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                View Live Site
              </ModernButton>
            </div>
          )}
        </div>

        {/* Image Carousel */}
        <div className="mb-16 relative group">
          <div className="relative overflow-hidden rounded-2xl bg-gray-800">
            <img
              src={project.images[currentImageIndex]}
              alt={`${project.title} screenshot ${currentImageIndex + 1}`}
              className="w-full h-auto max-h-[600px] object-cover transition-all duration-300"
              onError={(e) => {
                // Fallback for missing images
                const target = e.target as HTMLImageElement;
                target.src = project.images[0];
              }}
            />
            
            {/* Navigation Arrows */}
            <button
              type="button"
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              aria-label="Previous image"
              title="Previous image"
            >
              ←
            </button>
            <button
              type="button"
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              aria-label="Next image"
              title="Next image"
            >
              →
            </button>
          </div>

          {/* Carousel Indicators */}
          {project.images.length > 1 && (
            <div className="flex justify-center mt-6 gap-2">
              {project.images.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                    index === currentImageIndex
                      ? "bg-purple-500"
                      : "bg-gray-600 hover:bg-gray-500"
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                  title={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Project Details Grid */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Left Column */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">Project Overview</h2>
              <p className="text-gray-300 leading-relaxed">{project.longDescription}</p>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-white mb-4">The Challenge</h2>
              <p className="text-gray-300 leading-relaxed">{project.challenge}</p>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-white mb-4">My Solution</h2>
              <p className="text-gray-300 leading-relaxed">{project.solution}</p>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">Key Features</h2>
              <ul className="space-y-3">
                {project.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-300">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-3 flex-shrink-0"></span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-white mb-4">Tech Stack</h2>
              <div className="flex flex-wrap gap-3">
                {project.techStack.map((tech, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-gray-800 text-gray-300 rounded-full text-sm font-medium hover:bg-gray-700 transition-colors duration-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8">Results & Achievements</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {project.results.map((result, index) => (
              <div key={index} className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-white font-bold text-xl">{index + 1}</span>
                </div>
                <p className="text-gray-300 leading-relaxed">{result}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gray-800/50 p-12 rounded-2xl border border-gray-700">
          <h2 className="text-3xl font-bold text-white mb-4">Interested in A Similar Project?</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Let's discuss how I can help bring your vision to life with a comprehensive solution tailored to your needs.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/#contact">
              <ModernButton variant="primary">Let's Talk</ModernButton>
            </Link>
            <Link to="/projects">
              <ModernButton variant="outline">View All Projects</ModernButton>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectTemplate;
