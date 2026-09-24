import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FeaturedProjectCard from "../FeaturedProjectCard";
import { getProjects } from "../../lib/projectsApi";
import type { Project } from "../../types/project";

const ShowcaseSection = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getProjects()
      .then((data) => {
        if (mounted) setProjects(data);
      })
      .catch((loadError: unknown) => {
        if (mounted) {
          setError(loadError instanceof Error ? loadError.message : "Unable to load projects.");
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, []);

  const items = projects.filter((project) => project.featured).slice(0, 3);

  return (
    <section id="work" className="app-showcase">
      <div className="mx-auto w-full max-w-7xl px-5 md:px-10">
        <div className="mb-10">
          <p className="mb-3 text-xs font-semibold tracking-widest text-green-400">SELECTED WORK</p>
          <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl">Featured projects</h2>
          <p className="max-w-2xl text-lg leading-relaxed text-gray-300">A closer look at my selected projects.</p>
        </div>
        <div className="showcaselayout">
          {items.map((project, index) => (
            <FeaturedProjectCard key={project.slug || project.id} project={project} index={index} />
          ))}
          {loading && <p role="status" className="py-8 text-center text-gray-300">Loading projects…</p>}
          {error && <p role="alert" className="py-8 text-center text-red-200">{error}</p>}
          {!loading && !error && items.length === 0 && (
            <p className="py-8 text-center text-gray-300">No featured projects yet — check back later.</p>
          )}
        </div>
        <div className="mt-9 text-center">
          <Link to="/projects" className="inline-flex rounded-full border border-green-400/40 px-6 py-3 font-semibold text-green-300 transition-colors hover:bg-green-400/10">Explore the project gallery →</Link>
        </div>
      </div>
    </section>
  );
};

export default ShowcaseSection;
