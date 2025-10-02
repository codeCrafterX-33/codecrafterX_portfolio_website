import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Hero from "../components/sections/Hero";
import ShowcaseSection from "../components/sections/ShowcaseSection";
import LogoSection from "../components/sections/LogoSection";
import FeatureCards from "../components/sections/FeatureCards";
import { ExperienceSection } from "../components/sections/ExperienceSection";
import TechStack from "../components/sections/TechStack";
import TechSkills from "../components/sections/TechSkills";
import BlogArticles from "../components/sections/BlogArticles";
import Contact from "../components/sections/Contact";

const Home = () => {
  const location = useLocation();

  // Handle scrolling to sections when navigating with hash routes
  useEffect(() => {
    const hash = location.hash;
    if (hash) {
      // Remove the # symbol
      const elementId = hash.substring(1);
      const element = document.getElementById(elementId);
      
      if (element) {
        // Small delay to ensure component has mounted
        setTimeout(() => {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }, 100);
      }
    }
  }, [location]);

  return (
    <>
      <Hero />
      <ShowcaseSection />
      <LogoSection />
      <FeatureCards />
      <ExperienceSection />
      <TechSkills />
      <TechStack />
      <BlogArticles />
      <Contact />
    </>
  );
};

export default Home;
