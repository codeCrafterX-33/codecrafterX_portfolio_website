import { techSkills } from "../../constants";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TitleHeader from "../TitleHeader";
import GlowCard from "../GlowCard";
gsap.registerPlugin(ScrollTrigger);

const TechSkills = () => {
  useGSAP(() => {
    gsap.utils.toArray(".tech-timeline-card").forEach((card: any) => {
      gsap.from(card, {
        xPercent: -100,
        opacity: 0,
        transformOrigin: "left left",
        duration: 1,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: card,
          start: "top 80%",
        },
      });
    });

    gsap.to(".tech-timeline", {
      transformOrigin: "bottom bottom",
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: ".tech-timeline",
        start: "top center",
        end: "80% center",
        onUpdate: (self) => {
          gsap.to(".tech-timeline", {
            scaleY: 1 - self.progress,
          });
        },
      },
    });

    gsap.utils.toArray(".tech-expText").forEach((text: any) => {
      gsap.from(text, {
        xPercent: 0,
        opacity: 0,
        transformOrigin: "left left",
        duration: 1,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: text,
          start: "top 69%",
        },
      });
    });
  }, []);

  return (
    <section
      id="TechSkills"
      className="w-full md:mt-40 my-20 section-padding xl:px-0"
    >
      <div className="w-full h-full md:px-20 px-5">
        <TitleHeader
          title="How I Contribute Across Web, Mobile, and Tools"
          sub="🤝 What I Bring to the Table"
        />
        <div className="mt-32 relative">
          <div className="relative z-50 xl:space-y-32 space-y-10">
            {techSkills.map((skill, index) => (
              <div key={skill.title} className="tech-exp-card-wrapper">
                <div className="xl:w-2/6">
                  <GlowCard card={skill} index={index}>
                    <div>
                      <img src={skill.logoPath} alt={skill.logoPath} />
                    </div>
                  </GlowCard>
                </div>
                <div className="xl:w-4/6">
                  <div className="flex items-start">
                    <div className="tech-timeline-wrapper">
                      <div className="tech-timeline" />
                      <div className="gradient-line w-1 h-full" />
                    </div>

                    <div className="tech-expText flex xl:gap-20 md:gap-10 gap-5 relative z-20">
                      <div className="tech-timeline-logo">
                        <img src={skill.logoPath} alt="logo" />
                      </div>
                      <div>
                        <h1 className="text-3xl font-semibold">
                          {skill.title}
                        </h1>

                        <ul className="list-disc ms-5 mt-5 flex flex-col gap-5 text-white-50">
                          {skill.skills.map((skillItem) => (
                            <li key={skillItem}>{skillItem}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechSkills;
