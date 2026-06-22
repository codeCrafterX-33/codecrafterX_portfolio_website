import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import ModernButton from "../ModernButton";
import { getProjects } from "../../lib/projectsApi";
import type { Project } from "../../types/project";

gsap.registerPlugin(ScrollTrigger);

const ShowcaseSection = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setError("");
        const data = await getProjects();
        if (!mounted) return;

        setProjects(data);
      } catch (loadError) {
        if (!mounted) return;

        setProjects([]);
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load projects.",
        );
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useGSAP(() => {
    const cards = sectionRef.current
      ? Array.from(sectionRef.current.querySelectorAll(".showcase-card"))
      : [];

    cards.forEach((card, index) => {
      gsap.fromTo(
        card,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          delay: 0.25 * (index + 1),
          scrollTrigger: {
            trigger: card,
            start: "top bottom-=100",
          },
        },
      );
    });

    gsap.fromTo(
      sectionRef.current,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 1.2,
      },
    );
  }, [projects]);

  const items = projects.filter((project) => project.featured).slice(0, 3);

  return (
    <section ref={sectionRef} id="work" className="app-showcase">
      <div className="text-center mb-10 px-5 md:px-10">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Featured{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
            Projects
          </span>
        </h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
          Explore my recent work across web applications, mobile apps, and
          e-commerce solutions
        </p>
      </div>

      <div className="w-full mt-4">
        <div className="showcaselayout space-y-8">
          {items.map((project, idx) => (
            <div
              key={project.slug || idx}
              className={`showcase-card ${idx === 0 ? "first-project-wrapper" : "project-list-wrapper"}`}
            >
              <div className="image-wrapper">
                <img
                  src={project.images?.[0] || "/images/placeholder.png"}
                  alt={project.title}
                />
              </div>
              <div className="text-content">
                <h2 className="heading-3">{project.title}</h2>
                <h3 className="paragraph">{project.description}</h3>
                <p className="text-white-50 md:text-xl">
                  {project.longDescription}
                </p>
                <div className="mt-4">
                  <ModernButton
                    href={`/projects/${project.slug}`}
                    variant="primary"
                    size="sm"
                  >
                    View Project →
                  </ModernButton>
                </div>
              </div>
            </div>
          ))}

          {error && (
            <div className="text-center py-8">
              <p className="text-red-200">{error}</p>
            </div>
          )}

          {!error && items.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-300">
                No projects yet — check back later.
              </p>
            </div>
          )}
        </div>

        <div className="text-center mt-12">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              Want to see more?
            </h3>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Explore detailed case studies, development processes, and full
              project galleries for each portfolio piece.
            </p>
          </div>
          <ModernButton href="/projects" variant="outline" size="lg">
            View All Projects
          </ModernButton>
        </div>
      </div>
    </section>
  );
};

export default ShowcaseSection;
