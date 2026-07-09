import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { Project } from "../types/project";

type FeaturedProjectCardProps = {
  project: Project;
  index: number;
};

const FeaturedProjectCard = ({
  project,
  index,
}: FeaturedProjectCardProps) => {
  const number = String(index + 1).padStart(2, "0");
  const reverseOnDesktop = index % 2 === 1;

  return (
    <article className="showcase-card featured-project-card">
      <div
        className={`featured-project-media ${
          reverseOnDesktop ? "md:order-2" : ""
        }`}
      >
        <div className="featured-project-glow" aria-hidden="true" />
        <img
          src={project.images?.[0] || "/images/placeholder.png"}
          alt={`${project.title} project preview`}
          loading={index === 0 ? "eager" : "lazy"}
        />
        <span className="featured-project-number" aria-hidden="true">
          {number}
        </span>
      </div>

      <div
        className={`featured-project-content ${
          reverseOnDesktop ? "md:order-1" : ""
        }`}
      >
        <div className="featured-project-eyebrow">
          <span>{number} / Featured project</span>
          <span className="featured-project-category">{project.category}</span>
        </div>

        <div>
          <h3>{project.title}</h3>
          <p className="featured-project-summary">{project.description}</p>
          {project.longDescription && (
            <p className="featured-project-description">
              {project.longDescription}
            </p>
          )}
        </div>

        <div className="featured-project-footer">
          <ul className="featured-project-tech" aria-label="Technologies used">
            {project.techStack.slice(0, 5).map((tech) => (
              <li key={tech}>{tech}</li>
            ))}
          </ul>

          <Link
            to={`/projects/${project.slug}`}
            className="featured-project-link"
            aria-label={`View ${project.title} case study`}
          >
            <span>View case study</span>
            <span className="featured-project-link-icon" aria-hidden="true">
              <ArrowUpRight size={18} strokeWidth={2} />
            </span>
          </Link>
        </div>
      </div>
    </article>
  );
};

export default FeaturedProjectCard;
