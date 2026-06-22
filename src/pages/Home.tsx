import Hero from "../components/sections/Hero";
import ShowcaseSection from "../components/sections/ShowcaseSection";
import LogoSection from "../components/sections/LogoSection";
import FeatureCards from "../components/sections/FeatureCards";
import { ExperienceSection } from "../components/sections/ExperienceSection";
import TechStack from "../components/sections/TechStack";
import TechSkills from "../components/sections/TechSkills";

import Contact from "../components/sections/Contact";

const Home = () => {
  return (
    <>
      <Hero />
      <ShowcaseSection />
      <LogoSection />
      <FeatureCards />
      <ExperienceSection />
      <TechSkills />
      <TechStack />
      <Contact />
    </>
  );
};

export default Home;
