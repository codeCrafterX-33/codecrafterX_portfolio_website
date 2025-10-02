const ServiceHighlights = () => {
  const services = [
    {
      icon: "⚛️",
      title: "Web & App Development",
      description: "React, React Native & WordPress solutions",
      highlights: ["React & Next.js", "React Native", "WordPress", "Mobile Apps"],
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: "⚡",
      title: "Performance Optimization", 
      description: "Speed up & enhance user experience",
      highlights: ["Speed Optimization", "SEO", "Analytics", "Monitoring"],
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: "🛒",
      title: "E-commerce Solutions",
      description: "Complete online store development",
      highlights: ["WooCommerce", "Shopify", "Payment Integration", "Multi-platform"],
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: "🔧",
      title: "Website Management",
      description: "Ongoing maintenance & optimization",
      highlights: ["Content Updates", "Security", "Backups", "Support"],
      color: "from-orange-500 to-red-500"
    }
  ];

  return (
    <section id="services" className="py-20 px-5 md:px-20 bg-gradient-to-b from-zinc-900 to-black">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            What I <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Do Best</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Focused expertise delivering measurable results for your business
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div key={index} className="group">
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-2">
                
                {/* Service Icon */}
                <div className={`w-16 h-16 bg-gradient-to-r ${service.color} rounded-xl flex items-center justify-center text-3xl mb-6 mx-auto`}>
                  {service.icon}
                </div>
                
                {/* Service Content */}
                <div className="text-center">
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">
                    {service.title}
                  </h3>
                  
                  <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  
                  {/* Service Highlights */}
                  <div className="space-y-2">
                    {service.highlights.map((highlight, idx) => (
                      <div key={idx} className="flex items-center justify-center">
                        <span className="w-1.5 h-1.5 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full mr-2"></span>
                        <span className="text-gray-400 text-xs">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/0 to-blue-500/0 group-hover:from-purple-500/5 group-hover:to-blue-500/5 transition-all duration-300 pointer-events-none"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Stats */}
        <div className="mt-20 bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-2xl p-8 border border-gray-700">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-white mb-2">40%</div>
              <div className="text-gray-400 text-sm">Average Sales Increase</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">2+</div>
              <div className="text-gray-400 text-sm">Complete Platforms Built</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">100%</div>
              <div className="text-gray-400 text-sm">Client Satisfaction</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default ServiceHighlights;
