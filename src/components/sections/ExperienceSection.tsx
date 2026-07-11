import { expCards } from "../../constants";
import TitleHeader from "../TitleHeader";
import GlowCard from "../GlowCard";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

interface ExpCard {
  company: string;
  review: string;
  role: string;
  logoPath: string;
  duration: string;
  responsibilities: string[];
}

gsap.registerPlugin(ScrollTrigger);

export const ExperienceSection = () => {
  const sectionRef = useRef<HTMLElement | null>(null);

  useGSAP(() => {
    const section = sectionRef.current;
    if (!section) return;

    const cards = section.querySelectorAll<HTMLElement>(".timeline-card");
    const details = section.querySelectorAll<HTMLElement>(".expText");
    const timelineCovers = section.querySelectorAll<HTMLElement>(".timeline");

    cards.forEach((card) => {
      gsap.fromTo(
        card,
        { xPercent: -100, opacity: 0 },
        {
          xPercent: 0,
          opacity: 1,
          transformOrigin: "left left",
          duration: 1,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: card,
            start: "top 80%",
            once: true,
          },
        },
      );
    });

    details.forEach((detail) => {
      gsap.fromTo(
        detail,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: detail,
            start: "top 75%",
            once: true,
          },
        },
      );
    });

    if (timelineCovers.length) {
      gsap.to(timelineCovers, {
        scaleY: 0,
        transformOrigin: "bottom",
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top center",
          end: "bottom center",
          scrub: true,
        },
      });
    }

    const refresh = () => ScrollTrigger.refresh();
    const frame = requestAnimationFrame(refresh);
    window.addEventListener("load", refresh, { once: true });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("load", refresh);
    };
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="w-full md:mt-40 my-20 section-padding xl:px-0"
    >
      <div className="w-full h-full md:px-20 px-5">
        <TitleHeader
          title="Professional Work Experience"
          sub="💼 My Career Overview"
        />
        <div className="md:mt-32 mt-10 relative">
          <div className="relative z-50 xl:space-y-32 space-y-10">
            {expCards.map((card: ExpCard) => (
              <div key={card.company} className="exp-card-wrapper">
                <div className="xl:w-2/6">
                  <GlowCard card={card}>
                    <div>
                      <img src={card.logoPath} alt={card.logoPath} />
                    </div>
                  </GlowCard>
                </div>
                <div className="xl:w-4/6">
                  <div className="flex items-start">
                    <div className="timeline-wrapper">
                      <div className="timeline" />
                      <div className="gradient-line w-1 h-full" />
                    </div>

                    <div className="expText flex xl:gap-20 md:gap-10 gap-5 relative z-20">
                      <div className="timeline-logo">
                        <img
                          src={card.logoPath}
                          alt="logo"
                          className="size-full rounded-full object-contain p-1 md:p-2"
                        />
                      </div>
                      <div>
                        <h1 className="text-3xl font-semibold">{card.role}</h1>
                        <p className="my-5 text-white-50">🗓️{card.duration}</p>
                        <p className="text-[#839cb5] italic">
                          {" "}
                          Responsibilities:
                        </p>
                        <ul className="list-disc ms-5 mt-5 flex flex-col gap-5 text-white-50">
                          {" "}
                          {card.responsibilities.map((responsibility: string) => (
                            <li key={responsibility}>{responsibility}</li>
                          ))}{" "}
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
