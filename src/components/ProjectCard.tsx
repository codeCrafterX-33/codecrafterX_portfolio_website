import React from 'react';
import { Link } from 'react-router-dom';
import ModernButton from './ModernButton';

interface ProjectCardProps {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  techStack: string[];
  bgColor?: string;
  featured?: boolean;
  layout?: 'default' | 'showcase' | 'grid';
  additionalDescription?: string;
  className?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  id,
  title,
  category,
  description,
  image,
  techStack,
  bgColor = "bg-gray-100",
  featured = false,
  layout = 'default',
  additionalDescription,
  className = ""
}) => {
  // Default grid layout (used in Projects page)
  if (layout === 'grid') {
    return (
      <div
        className={`group bg-gray-800/50 rounded-2xl p-6 border border-gray-700 hover:border-purple-500/50 transition-all duration-300 hover:transform hover:scale-105 ${className}`}
      >
        {/* Project Image */}
        <div className={`relative overflow-hidden rounded-xl mb-6 ${bgColor} p-4 aspect-video`}>
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover rounded-lg"
          />
          {featured && (
            <div className="absolute top-3 right-3 bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-medium">
              Featured
            </div>
          )}
        </div>

        {/* Project Info */}
        <div className="space-y-4">
          <div>
            <div className="inline-block px-3 py-1 bg-purple-900/30 rounded-full mb-3">
              <span className="text-purple-300 text-sm font-medium">{category}</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors duration-300">
              {title}
            </h3>
            <p className="text-gray-300 leading-relaxed">
              {description}
            </p>
          </div>

          {/* Tech Stack */}
          <div className="flex flex-wrap gap-2">
            {techStack.map((tech, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-xs font-medium hover:bg-gray-600 transition-colors duration-300"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <ModernButton
              href={`/projects/${id}`}
              variant="primary"
              size="sm"
              className="flex-1"
            >
              View Details
            </ModernButton>
          </div>
        </div>
      </div>
    );
  }

  // Showcase layout (used in ShowcaseSection)
  if (layout === 'showcase') {
    return (
      <div className={`project ${className}`}>
        <div className={`image-wrapper ${bgColor}`}>
          <img src={image} alt={title} />
        </div>
        <div className="text-content space-y-4 p-4">
          <h2 className="heading-3">{title}</h2>
          <h3 className="paragraph">{category}</h3>
          {additionalDescription && (
            <p className="text-white-50 md:text-xl">{additionalDescription}</p>
          )}
          <div className="badges flex gap-2 mb-4">
            {techStack.map((tech, index) => (
              <span key={index} className="tag">{tech}</span>
            ))}
          </div>
          <div className="mt-4">
            <ModernButton
              href={`/projects/${id}`}
              variant="primary"
              size="sm"
            >
              View Project →
            </ModernButton>
          </div>
        </div>
      </div>
    );
  }

  // Default layout (customizable)
  return (
    <div className={`group ${className}`}>
      {/* Project Image */}
      <div className={`relative overflow-hidden rounded-xl mb-6 ${bgColor} p-4 aspect-video`}>
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover rounded-lg"
        />
        {featured && (
          <div className="absolute top-3 right-3 bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-medium">
            Featured
          </div>
        )}
      </div>

      {/* Project Info */}
      <div className="space-y-4">
        <div>
          <div className="text-sm text-purple-400 mb-2">{category}</div>
          <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
          <p className="text-gray-300 text-sm leading-relaxed">{description}</p>
          {additionalDescription && (
            <p className="text-gray-400 text-sm mt-2">{additionalDescription}</p>
          )}
        </div>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2">
          {techStack.map((tech, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-full border border-gray-600"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <ModernButton
            href={`/projects/${id}`}
            variant="primary"
            size="sm"
          >
            View Project →
          </ModernButton>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
