import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

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
      <div className="w-full">
        <div className="showcaselayout">
          {/*LEFT: */}
          <div className="first-project-wrapper" ref={project1Ref}>
            <div className="image-wrapper">
              <img src="/images/project1.png" alt="Campusly" />
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
            </div>
          </div>
          {/*RIGHT: */}
          <div
            className="project-list-wrapper overflow-hidden"
            ref={project2Ref}
          >
            <div className="project">
              <div className="image-wrapper bg-[#ffefdb]">
                <img src="/images/project2.png" alt="Phylote" />
              </div>
              <h2>Phylote</h2>
            </div>
          </div>
          <div
            className="project-list-wrapper overflow-hidden"
            ref={project3Ref}
          >
            <div className="project">
              <div className="image-wrapper bg-[#ffe7eb]">
                <img src="/images/project3.png" alt="Crismyla" />
              </div>
              <h2>Crismyla</h2>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShowcaseSection;
