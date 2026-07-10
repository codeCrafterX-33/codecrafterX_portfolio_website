import { useEffect, useState } from "react";
import { getCaseStudies } from "../../lib/caseStudiesApi";
import type { CaseStudy } from "../../types/caseStudy";
import ModernButton from "../ModernButton";

const CaseStudies = () => {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [activeCase, setActiveCase] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadCaseStudies = async () => {
      try {
        setError("");
        const studies = await getCaseStudies();

        if (isMounted) {
          setCaseStudies(studies);
          setActiveCase(0);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load case studies.",
          );
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    void loadCaseStudies();

    return () => {
      isMounted = false;
    };
  }, []);

  const activeProject = caseStudies[activeCase];

  return (
    <section
      id="case-studies"
      className="bg-gradient-to-b from-zinc-900 to-black px-5 py-20 md:px-20"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl">
            Case{" "}
            <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              Studies
            </span>
          </h2>
          <p className="mx-auto max-w-3xl text-xl text-gray-300">
            Deep dives into projects where I delivered measurable results and
            business value.
          </p>
        </div>

        {isLoading && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center text-gray-300">
            Loading case studies...
          </div>
        )}

        {!isLoading && error && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-10 text-center text-red-200">
            {error}
          </div>
        )}

        {!isLoading && !error && !activeProject && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center">
            <h3 className="text-2xl font-bold text-white">
              Case studies are coming soon
            </h3>
            <p className="mt-3 text-gray-400">
              Projects selected as case studies in the admin dashboard will
              appear here.
            </p>
          </div>
        )}

        {activeProject && (
          <div className="grid items-start gap-12 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="space-y-4">
              {caseStudies.map((study, index) => (
                <button
                  key={study.id}
                  type="button"
                  onClick={() => setActiveCase(index)}
                  className={`w-full rounded-xl border p-4 text-left transition-all duration-300 ${
                    activeCase === index
                      ? "border-green-500 bg-green-500/10 text-green-400"
                      : "border-gray-700 bg-gray-800/50 text-gray-300 hover:border-gray-500"
                  }`}
                >
                  <h3 className="mb-1 text-lg font-semibold">
                    {study.title}
                  </h3>
                  <p className="text-sm opacity-75">
                    {study.company}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {study.techStack.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="rounded bg-gray-700 px-2 py-1 text-xs text-gray-200"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>

            <article className="overflow-hidden rounded-2xl border border-gray-700 bg-gray-800/50">
              {activeProject.images[0] && (
                <div className="aspect-video overflow-hidden bg-zinc-950">
                  <img
                    src={activeProject.images[0]}
                    alt={`${activeProject.title} case study`}
                    className="h-full w-full object-contain object-top"
                  />
                </div>
              )}

              <div className="space-y-7 p-6 md:p-8">
                <div>
                  <p className="mb-2 text-sm font-bold uppercase tracking-[0.16em] text-green-400">
                    {activeProject.company}
                  </p>
                  <h3 className="text-3xl font-bold text-white">
                    {activeProject.title}
                  </h3>
                </div>

                <div>
                  <h4 className="mb-2 text-lg font-semibold text-white">
                    Challenge
                  </h4>
                  <p className="leading-relaxed text-gray-300">
                    {activeProject.challenge}
                  </p>
                </div>

                <div>
                  <h4 className="mb-2 text-lg font-semibold text-white">
                    Solution
                  </h4>
                  <p className="leading-relaxed text-gray-300">
                    {activeProject.solution}
                  </p>
                </div>

                {activeProject.results.length > 0 && (
                  <div>
                    <h4 className="mb-3 text-lg font-semibold text-white">
                      Results
                    </h4>
                    <ul className="space-y-2">
                      {activeProject.results.map((result) => (
                        <li
                          key={result}
                          className="flex items-start gap-3 text-gray-300"
                        >
                          <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-green-400" />
                          {result}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex flex-wrap gap-3 pt-1">
                  {activeProject.projectSlug && (
                    <ModernButton
                      href={`/projects/${activeProject.projectSlug}`}
                      variant="primary"
                      size="sm"
                    >
                      View related project
                    </ModernButton>
                  )}
                  {activeProject.liveUrl && (
                    <ModernButton
                      href={activeProject.liveUrl}
                      variant="outline"
                      size="sm"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View live site
                    </ModernButton>
                  )}
                </div>
              </div>
            </article>
          </div>
        )}
      </div>
    </section>
  );
};

export default CaseStudies;
