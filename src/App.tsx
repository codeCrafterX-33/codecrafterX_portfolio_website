import Hero from "./components/sections/Hero";
import ShowcaseSection from "./components/sections/ShowcaseSection";
import NavBar from "./components/NavBar";
import LogoSection from "./components/sections/LogoSection";
import FeatureCards from "./components/sections/FeatureCards";
import { ExperienceSection } from "./components/sections/ExperienceSection";
import TechStack from "./components/sections/TechStack";
import TechSkills from "./components/sections/TechSkills";
const App = () => {
  return (
    <>
      <NavBar />
      <Hero />
      <ShowcaseSection />
      <LogoSection />
      <FeatureCards/>
      <ExperienceSection />
      <TechSkills />
      <TechStack />
    </>
  );
};
export default App;
