import words from "../../constants";
import Button from "../Button";
import HeroExperience from "../HeroModels/HeroExperience";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import AnimatedCounter from "../Animatedcounter";
const Hero = () => {
  useGSAP(() => {
    gsap.fromTo(
      ".hero-text h1",
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.2,
        ease: "power2.inOut",
      }
    );
  });
  return (
    <section id="hero" className="relative overflow-hidden">
      <div className="absolute top-0 left-0 z-10">
        <img src="/images/bg.png" alt="background" />
      </div>

      <div className="hero-layout">
        {/*LEFT: HERO CONTENT*/}
        <header className="flex flex-col justify-center md:w-full w-screen md:px-20 px-5">
          <div className="flex flex-col gap-7">
            {/* Main Header */}
            <div className="mb-4 flex items-start gap-6">
              {/* Gradient Line */}
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-purple-400 mb-2"></div>
                <div className="gradient-line w-1 h-20"></div>
              </div>

              <div>
                <h1 className="text-4xl md:text-3xl lg:text-2xl xl:text-5xl font-bold text-white mb-2">
                  Hi, I'm <span className="text-purple-400">Sopefoluwa</span>
                </h1>
                <h2 className="text-xl md:text-2xl lg:text-1xl xl:text-1xl font-semibold text-white-50">
                  A passionate Software Engineer
                </h2>
              </div>
            </div>

            <div className="hero-text">
              <h3 className="text-3xl md:text-xl lg:text-3xl xl:text-3xl">
                Shaping{" "}
                <span className="slide relative overflow-hidden">
                  <span className="wrapper">
                    {words.map((word) => (
                      <span
                        key={word.text}
                        className="flex items-center gap-3 pb-2"
                      >
                        <img
                          src={word.imgPath}
                          alt={word.text}
                          className="size-8 p-1 rounded-full bg-white-50"
                        />
                        {word.text}
                      </span>
                    ))}
                  </span>
                </span>
              </h3>

              <h3 className="text-3xl md:text-xl lg:text-3xl xl:text-3xl">
                into Real Projects
              </h3>
              <h3 className="text-3xl md:text-xl lg:text-3xl xl:text-3xl">
                that Deliver Results
              </h3>
            </div>
            <Button
              className="md:w-80 md:h-16 w-60 h-12"
              id="counter"
              text="See my work"
            />
          </div>
        </header>
        {/*RIGHT: 3D MODEL*/}
        <figure className="hero-3d-layout">
          <HeroExperience />
        </figure>
      </div>
      <AnimatedCounter />
    </section>
  );
};
export default Hero;
