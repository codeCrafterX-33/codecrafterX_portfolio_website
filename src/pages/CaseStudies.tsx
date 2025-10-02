import CaseStudiesComponent from "../components/sections/CaseStudies";

const CaseStudies = () => {
  return (
    <div className="min-h-screen bg-zinc-900">
      {/* Add some top padding to account for fixed navbar */}
      <div className="pt-20">
        <CaseStudiesComponent />
      </div>
    </div>
  );
};

export default CaseStudies;
