import { lazy } from "react";
import Hero from "../components/sections/Hero";
import ShowcaseSection from "../components/sections/ShowcaseSection";
import DeferredSection from "../components/DeferredSection";

const LogoSection = lazy(() => import("../components/sections/LogoSection"));
const FeatureCards = lazy(() => import("../components/sections/FeatureCards"));
const TechStack = lazy(() => import("../components/sections/TechStack"));

const Contact = lazy(() => import("../components/sections/Contact"));

const Home = () => {
  return (
    <>
      <Hero />
      <ShowcaseSection />
      <DeferredSection minHeight="14rem">
        <LogoSection />
      </DeferredSection>
      <DeferredSection minHeight="22rem">
        <FeatureCards />
      </DeferredSection>
      <DeferredSection id="skills" minHeight="36rem">
        <TechStack sectionId="" />
      </DeferredSection>
      <DeferredSection id="contact" minHeight="48rem">
        <Contact sectionId="" />
      </DeferredSection>
    </>
  );
};

export default Home;
