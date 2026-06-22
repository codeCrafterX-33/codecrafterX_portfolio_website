import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ModernButton from "../components/ModernButton";
import { getProject } from "../lib/projectsApi";
import type { Project } from "../types/project";

const ProjectTemplate = () => {
  const { projectId } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProject = async () => {
      if (!projectId) {
        setError("Project slug is missing.");
        setIsLoading(false);
        return;
      }

      try {
        const nextProject = await getProject(projectId);
        setProject(nextProject);
        setCurrentImageIndex(0);
      } catch (loadError) {
        setProject(null);
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load this project.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadProject();
  }, [projectId]);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 bg-gradient-to-b from-zinc-900 to-black flex items-center justify-center">
        <p className="text-gray-300">Loading project...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen pt-20 bg-gradient-to-b from-zinc-900 to-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            Project Not Found
          </h1>
          <p className="text-gray-300 mb-8">
            {error || "The project you're looking for doesn't exist."}
          </p>
          <ModernButton href="/" variant="primary">
            Back to Home
          </ModernButton>
        </div>
      </div>
    );
  }

  const nextImage = () => {
    if (project.images.length === 0) {
      return;
    }

    setCurrentImageIndex((prev) => (prev + 1) % project.images.length);
  };

  const prevImage = () => {
    if (project.images.length === 0) {
      return;
    }

    setCurrentImageIndex(
      (prev) => (prev - 1 + project.images.length) % project.images.length,
    );
  };

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-zinc-900 to-black">
      <div className="max-w-7xl mx-auto px-5 md:px-20 py-10">
        {/* Back Button */}
        <div className="mb-8">
          <Link to="/" reloadDocument>
            <ModernButton variant="outline" size="sm">
              ← Back to Projects
            </ModernButton>
          </Link>
        </div>

        {/* Project Header */}
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-2 bg-black/100 dark:bg-green-900/30 rounded-full mb-4">
            <span className="text-green-300 text-sm font-medium">
              {project.category}
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            {project.title}
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            {project.description}
          </p>
          {project.liveUrl && (
            <div className="flex justify-center gap-4">
              <ModernButton
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Live Site
              </ModernButton>
            </div>
          )}
        </div>

        {/* Image Carousel */}
        {project.images.length > 0 && (
          <div className="mb-16 relative group">
            <div className="relative overflow-hidden rounded-2xl bg-gray-800">
              <img
                src={project.images[currentImageIndex]}
                alt={`${project.title} screenshot ${currentImageIndex + 1}`}
                className="w-full h-auto max-h-[600px] object-cover transition-all duration-300"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = project.images[0];
                }}
              />

              <button
                type="button"
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full border border-zinc-300 bg-white/80 p-3 text-zinc-900 opacity-0 shadow-sm backdrop-blur-sm transition-all duration-300 group-hover:opacity-100 hover:bg-white dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-white dark:hover:bg-zinc-900"
                aria-label="Previous image"
                title="Previous image"
              >
                ←
              </button>
              <button
                type="button"
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full border border-zinc-300 bg-white/80 p-3 text-zinc-900 opacity-0 shadow-sm backdrop-blur-sm transition-all duration-300 group-hover:opacity-100 hover:bg-white dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-white dark:hover:bg-zinc-900"
                aria-label="Next image"
                title="Next image"
              >
                →
              </button>
            </div>

            {project.images.length > 1 && (
              <div className="flex justify-center mt-6 gap-2">
                {project.images.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                      index === currentImageIndex
                        ? "bg-green-500"
                        : "bg-gray-600 hover:bg-gray-500"
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                    title={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Project Details Grid */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Left Column */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Project Overview
              </h2>
              <p className="text-gray-300 leading-relaxed">
                {project.longDescription}
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-white mb-4">
                The Challenge
              </h2>
              <p className="text-gray-300 leading-relaxed">
                {project.challenge}
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-white mb-4">
                My Solution
              </h2>
              <p className="text-gray-300 leading-relaxed">
                {project.solution}
              </p>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Key Features
              </h2>
              <ul className="space-y-3">
                {project.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-300">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3 flex-shrink-0"></span>
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
          <h2 className="text-3xl font-bold text-white mb-8">
            Results & Achievements
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {project.results.map((result, index) => (
              <div
                key={index}
                className="bg-gray-800/50 p-6 rounded-xl border border-gray-700"
              >
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-white font-bold text-xl">
                    {index + 1}
                  </span>
                </div>
                <p className="text-gray-300 leading-relaxed">{result}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gray-800/50 p-12 rounded-2xl border border-gray-700">
          <h2 className="text-3xl font-bold text-white mb-4">
            Interested in A Similar Project?
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Let's discuss how I can help bring your vision to life with a
            comprehensive solution tailored to your needs.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/" reloadDocument>
              <ModernButton variant="primary">Let's Talk</ModernButton>
            </Link>
            <Link to="/projects" reloadDocument>
              <ModernButton variant="outline">View All Projects</ModernButton>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectTemplate;
