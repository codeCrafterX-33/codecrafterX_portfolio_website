import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import ModernButton from "../ModernButton";
import ProjectCard from "../ProjectCard";

gsap.registerPlugin(ScrollTrigger);

const ShowcaseSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const project1Ref = useRef<HTMLDivElement>(null);
  const project2Ref = useRef<HTMLDivElement>(null);
  const project3Ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const projects = [
      project1Ref.current,
      project2Ref.current,
      project3Ref.current,
    ];

    projects.forEach((card, index) => {
      gsap.fromTo(
        card,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1, 
          delay: 0.3 * (index + 1),
          scrollTrigger: {
            trigger: card,
            start: "top bottom-=100",
          },
        }
      );
    });

    gsap.fromTo(
      sectionRef.current,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 1.5,
      }
    );
  }, []);

  return (
    <section ref={sectionRef} id="work" className="app-showcase">
      {/* Header */}
      <div className="text-center mb-16 px-5 md:px-20">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Projects</span>
        </h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
          Explore my recent work across web applications, mobile apps, and e-commerce solutions
        </p>
      </div>

      <div className="w-full mt-8">
        <div className="showcaselayout space-y-8">
            {/*LEFT: */}
          <div className="first-project-wrapper" ref={project1Ref}>
            <div className="image-wrapper">
              <img src="/images/campusly_screen1.png" alt="Campusly" />
            </div>
            <div className="text-content">
              <h2 className="heading-3">Campusly</h2>
              <h3 className="paragraph">
                Campusly is a platform that helps students connect with other
                students within or outside their school.
              </h3>
              <p className="text-white-50 md:text-xl">
                An app built with React Native, Expo, and Firebase, Campusly
                allows students to create profiles, post updates, and connect
              </p>
              <div className="mt-4">
                <ModernButton
                  href="/projects/campusly"
                  variant="primary"
                  size="sm"
                >
                  View Project →
                </ModernButton>
              </div>
            </div>
          </div>
          {/*RIGHT: */}
          <div
            className="project-list-wrapper overflow-hidden space-y-4"
            ref={project2Ref}
          >
            <div className="project">
              <div className="image-wrapper bg-[#ffefdb]">
                <img src="/images/phylote_homepage.png" alt="Phylote" />
              </div>
              <div className="text-content space-y-4 p-4">
                <h2 className="heading-3">Phylote</h2>
                <h3 className="paragraph">
                  Phylote is Nigeria's leading armored vehicle and weapons company specializing in security solutions and tactical equipment.
                </h3>
                <p className="text-white-50 md:text-xl">
                  A React-based e-commerce platform showcasing armored vehicles, weapons, and security equipment with detailed specifications, customization options, and secure client portals for defense industry professionals.
                </p>
                <div className="badges flex gap-2 mb-4">
                  <span className="tag">React</span>
                  <span className="tag">E-commerce</span>
                  <span className="tag">Security</span>
                </div>
                <div className="mt-4">
                  <ModernButton
                    href="/projects/phylote"
                    variant="primary"
                    size="sm"
                  >
                    View Project →
                  </ModernButton>
                </div>
              </div>
            </div>
          </div>
          <div
            className="project-list-wrapper overflow-hidden space-y-4 mt-8"
            ref={project3Ref}
          >
            <div className="project">
              <div className="image-wrapper bg-[#ffe7eb]">
                <img src="/images/crismyl_homepage.png" alt="Crismyla" />
              </div>
              <div className="text-content space-y-4 p-4">
                <h2 className="heading-3">Crismyla</h2>
                <h3 className="paragraph">
                  Crismyla is a beauty brand offering premium beauty products including perfume, hair care, facials, and skincare essentials.
                </h3>
                <p className="text-white-50 md:text-xl">
                  A complete WordPress e-commerce solution built from scratch featuring product catalogs, consultation booking systems, beauty tutorials, and seamless online purchasing for beauty enthusiasts.
                </p>
                <div className="badges flex gap-2 mb-4">
                  <span className="tag">WordPress</span>
                  <span className="tag">Beauty E-commerce</span>
                  <span className="tag">WooCommerce</span>
                </div>
                <div className="mt-4">
                  <ModernButton
                    href="/projects/crismyla"
                    variant="primary"
                    size="sm"
                  >
                    View Project →
                  </ModernButton>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* View All Projects Section */}
        <div className="text-center mt-16">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              Want to see more?
            </h3>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Explore detailed case studies, development processes, and full project galleries for each portfolio piece.
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
