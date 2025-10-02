const ProcessMethodologies = () => {
  const methodologies = [
    {
      phase: "Discovery",
      icon: "🔍",
      title: "Understanding the Challenge",
      steps: [
        "Stakeholder interviews and requirements gathering",
        "Competitive analysis and market research",
        "Technical feasibility assessment",
        "User persona development and journey mapping"
      ],
      tools: ["Miro", "Figma", "User Research", "Analytics"]
    },
    {
      phase: "Planning",
      icon: "📋",
      title: "Strategic Roadmap",
      steps: [
        "Project scope definition and timeline estimation",
        "Technology stack selection and architecture planning",
        "Team collaboration setup and communication protocols",
        "Risk assessment and mitigation strategies"
      ],
      tools: ["Notion", "Linear", "GitHub Projects", "Slack"]
    },
    {
      phase: "Design",
      icon: "🎨",
      title: "User-Centered Design",
      steps: [
        "Wireframing and information architecture",
        "Interactive prototype creation and testing",
        "Design system development and component library",
        "Accessibility compliance and responsive design"
      ],
      tools: ["Figma", "Whimsical", "InVision", "Accessibility Tools"]
    },
    {
      phase: "Development",
      icon: "⚡",
      title: "Agile Implementation",
      steps: [
        "Version control and branching strategy",
        "Continuous integration and automated testing",
        "Code reviews and pair programming sessions",
        "Performance optimization and security audits"
      ],
      tools: ["Git", "GitHub Actions", "Jest", "Lighthouse"]
    },
    {
      phase: "Testing",
      icon: "🧪",
      title: "Quality Assurance",
      steps: [
        "Unit and integration testing automation",
        "User acceptance testing and feedback loops",
        "Performance testing and optimization",
        "Cross-browser and device compatibility testing"
      ],
      tools: ["Jest", "Cypress", "Postman", "BrowserStack"]
    },
    {
      phase: "Deployment",
      icon: "🚀",
      title: "Scalable Launch",
      steps: [
        "Production environment setup and configuration",
        "CI/CD pipeline implementation and monitoring",
        "Performance monitoring and error tracking",
        "Documentation and knowledge transfer"
      ],
      tools: ["AWS", "Vercel", "Docker", "New Relic"]
    }
  ];

  const principles = [
    {
      title: "User-First Approach",
      description: "Every decision is backed by user research and testing",
      icon: "👥"
    },
    {
      title: "Clean Architecture",
      description: "Scalable, maintainable code following industry best practices",
      icon: "🏗️"
    },
    {
      title: "Agile Methodology",
      description: "Iterative development with regular feedback loops",
      icon: "🔄"
    },
    {
      title: "Performance Focus",
      description: "Optimized for speed, accessibility, and user experience",
      icon: "⚡"
    }
  ];

  return (
    <section id="process" className="py-20 px-5 md:px-20 bg-gradient-to-b from-black to-zinc-900">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Process & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Methodologies</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            How I approach every project to deliver exceptional results consistently
          </p>
        </div>

        {/* Core Principles */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {principles.map((principle, index) => (
            <div key={index} className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 hover:border-blue-500/50 transition-all duration-300">
              <div className="text-3xl mb-4">{principle.icon}</div>
              <h3 className="text-lg font-semibold text-white mb-2">{principle.title}</h3>
              <p className="text-gray-300 text-sm">{principle.description}</p>
            </div>
          ))}
        </div>

        {/* Development Process */}
        <div className="bg-gray-800/30 rounded-2xl p-8 border border-gray-700">
          <h3 className="text-3xl font-bold text-white mb-8 text-center">
            My Development Process
          </h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {methodologies.map((method, index) => (
              <div key={index} className="relative">
                
                {/* Phase Number */}
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {index + 1}
                </div>
                
                <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl p-6 border border-gray-600">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">{method.icon}</span>
                    <h4 className="text-xl font-bold text-white">{method.phase}</h4>
                  </div>
                  
                  <h5 className="text-lg font-semibold text-blue-400 mb-3">{method.title}</h5>
                  
                  <ul className="space-y-2 mb-4">
                    {method.steps.map((step, stepIndex) => (
                      <li key={stepIndex} className="flex items-start text-gray-300 text-sm">
                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        {step}
                      </li>
                    ))}
                  </ul>
                  
                  <div className="flex flex-wrap gap-2">
                    {method.tools.map((tool, toolIndex) => (
                      <span key={toolIndex} className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Connecting Line */}
                {index < methodologies.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-blue-500 to-transparent"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Technologies Stack */}
        <div className="mt-20 text-center">
          <h3 className="text-3xl font-bold text-white mb-8">
            Technologies I Work With
          </h3>
          
          <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-xl p-8 border border-gray-700">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {[
                { name: "React/Next.js", icon: "⚛️", level: "Expert" },
                { name: "Node.js/Express", icon: "🟢", level: "Advanced" },
                { name: "TypeScript", icon: "📘", level: "Expert" },
                { name: "MongoDB/PostgreSQL", icon: "🗄️", level: "Advanced" },
                { name: "AWS/Vercel", icon: "☁️", level: "Intermediate" },
                { name: "Figma/Design", icon: "🎨", level: "Advanced" },
                { name: "Docker", icon: "🐳", level: "Intermediate" },
                { name: "Git/GitHub", icon: "📚", level: "Expert" },
                { name: "GraphQL", icon: "🔷", level: "Intermediate" },
                { name: "Tailwind CSS", icon: "🎭", level: "Expert" },
                { name: "GSAP/Animations", icon: "✨", level: "Advanced" },
                { name: "Three.js", icon: "🎯", level: "Intermediate" }
              ].map((tech, index) => (
                <div key={index} className="text-center group">
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">
                    {tech.icon}
                  </div>
                  <h4 className="text-sm font-semibold text-white mb-1">{tech.name}</h4>
                  <p className="text-xs text-gray-400">{tech.level}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessMethodologies;
