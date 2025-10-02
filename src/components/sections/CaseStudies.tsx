import { useState } from "react";
import ModernButton from "../ModernButton";

const caseStudies = [
  {
    id: 1,
    title: "Multi-Platform E-commerce Management",
    company: "Toke Makinwa Beauty",
    challenge: "Managing two separate e-commerce platforms - international Shopify site and Nigeria WordPress site - requiring optimization and seamless user experience",
    solution: "WordPress site optimization, performance improvements, and strategic management of dual-platform operations as Website Manager",
    results: [
      "40% increase in online sales through collaborative efforts", 
      "Optimized Nigeria WordPress site (tokemakinwabeauty.com.ng) performance",
      "Improved user experience across both platforms"
    ],
    techStack: ["WordPress", "PHP", "WooCommerce", "Shopify", "Multi-Platform Management", "Performance Optimization"],
    image: "/images/case-studies/ecommerce.jpg",
    live: "https://tokemakinwabeauty.com/",
    code: "",
    hideCode: true
  },
  {
    id: 2,
    title: "Complete WordPress E-commerce Build",
    company: "Crismyla International",
    challenge: "No digital presence, manual processes, limited reach in beauty industry",
    solution: "Built WordPress e-commerce website from scratch, managing and continuously optimizing for better performance",
    results: [
      "60% increase in online sales",
      "Established strong brand presence in beauty industry",
      "Automated order management and customer support"
    ],
    techStack: ["WordPress", "PHP", "WooCommerce", "Mailchimp", "Google Analytics"],
    image: "/images/case-studies/beauty.jpg",
    live: "https://crismyla.store",
    code: "",
    hideCode: true
  }
];

const CaseStudies = () => {
  const [activeCase, setActiveCase] = useState(0);

  return (
    <section id="case-studies" className="py-20 px-5 md:px-20 bg-gradient-to-b from-zinc-900 to-black">
      <div className="max-w-7xl mx-auto">
        
        {/* Header<｜tool▁sep｜>*/}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Case <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Studies</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Deep dive into projects where I've delivered measurable results and business value
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side - Case Study Details */}
          <div className="space-y-8">
            
            {/* Case Study Navigation */}
            <div className="flex flex-col space-y-4 mb-8">
              {caseStudies.map((study, index) => (
                <button
                  key={study.id}
                  onClick={() => setActiveCase(index)}
                  className={`text-left p-4 rounded-xl border transition-all duration-300 ${
                    activeCase === index
                      ? "border-purple-500 bg-purple-500/10 text-purple-400"
                      : "border-gray-700 bg-gray-800/50 text-gray-300 hover:border-gray-600"
                  }`}
                >
                  <h3 className="font-semibold text-lg mb-1">{study.title}</h3>
                  <p className="text-sm opacity-75">{study.company}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {study.techStack.slice(0, 3).map((tech) => (
                      <span key={tech} className="text-xs bg-gray-700 px-2 py-1 rounded">
                        {tech}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>

            {/* Selected Case Detail */}
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {caseStudies[activeCase].title}
                </h3>
                <p className="text-gray-400">{caseStudies[activeCase].company}</p>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Challenge</h4>
                  <p className="text-gray-300">{caseStudies[activeCase].challenge}</p>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Solution</h4>
                  <p className="text-gray-300">{caseStudies[activeCase].solution}</p>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Results</h4>
                  <ul className="space-y-2">
                    {caseStudies[activeCase].results.map((result, idx) => (
                      <li key={idx} className="flex items-center text-gray-300">
                        <span className="w-2 h-2 bg-green-400 rounded-full mr-3 flex-shrink-0"></span>
                        {result}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Tech Stack</h4>
                  <div className="flex flex-wrap gap-2">
                    {caseStudies[activeCase].techStack.map((tech) => (
                      <span key={tech} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <ModernButton 
                  href={caseStudies[activeCase].live} 
                  variant="primary" 
                  size="sm"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Live Site
                </ModernButton>
                {!caseStudies[activeCase].hideCode && (
                  <ModernButton 
                    href={caseStudies[activeCase].code} 
                    variant="outline" 
                    size="sm"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Code
                  </ModernButton>
                )}
              </div>
            </div>
          </div>

          {/* Right Side - Visual */}
          <div className="relative">
            <div className="aspect-video bg-gradient-to-br from-purple-900 to-pink-900 rounded-xl overflow-hidden border border-gray-700">
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-2xl mb-4 mx-auto">
                    📊
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{caseStudies[activeCase].title}</h3>
                  <p className="text-gray-300">Project Visualization</p>
                </div>
              </div>
            </div>
            
            {/* Floating cards with metrics */}
            <div className="absolute -top-4 -right-4 bg-green-500 text-white p-3 rounded-xl shadow-lg">
              <div className="text-sm font-bold">+{caseStudies[activeCase].results[0]?.match(/\d+/)?.[0] || '40'}%</div>
              <div className="text-xs opacity-90">Sales Growth</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CaseStudies;
