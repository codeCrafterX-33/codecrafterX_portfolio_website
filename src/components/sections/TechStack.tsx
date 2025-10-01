import TitleHeader from "../TitleHeader";
import { techStackIcons } from "../../constants";
import TechIcon from "../models/TechLogos/TechIcon";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const TechStack = () => {
  useGSAP(() => {
    gsap.fromTo(
      ".tech-card",
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power2.inOut",
        stagger: 0.2,
        scrollTrigger: {
          trigger: "#skills",
          start: "top center",
        },
      }
    );
  });

  return (
    <div id="skills" className="flex-center section-padding">
      <div className="w-full h-full md:px-10 px-5">
        <TitleHeader
          title="Technology Stack"
          sub="🛠️ Tools & Technologies I Use"
        />
        <div className="tech-grid">
          {techStackIcons.map((icon) => (
            <div
              key={icon.name}
              className="tech-card card-border overflow-hidden group xl:rounded-full rounded-sm"
            >
              <div className="tech-card-animated-bg" />
              <div className="tech-card-content">
                <div className="tech-icon-wrapper">
                  {icon.imgPath ? (
                    <img
                      className="xl:size-30"
                      src={icon.imgPath}
                      alt={icon.name}
                    />
                  ) : (
                    <TechIcon model={icon} />
                  )}
                </div>

                <div className="padding-x w-full relative z-20">
                  <p>{icon.name}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TechStack;
