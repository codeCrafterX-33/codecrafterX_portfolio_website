const AboutMe = () => {
  return (
    <section id="about" className="py-20 px-5 md:px-20 bg-gradient-to-b from-zinc-900 to-black">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Me</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Get to know the person behind the code - my journey, passion, and commitment to building exceptional digital experiences
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side - Background Story */}
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 border border-gray-700">
              <div className="flex items-center mb-6">
                <span className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-2xl mr-4">
                  👋
                </span>
                <h3 className="text-2xl font-bold text-white">Hi, I'm Sopefoluwa!</h3>
              </div>
              
              <div className="space-y-6 text-gray-300 leading-relaxed">
                <p>
                  I'm a passionate Software Engineer based in Nigeria, specializing in web development and digital solutions. 
                  My journey started with curiosity about how websites work, and now I'm dedicated to building exceptional 
                  digital experiences that solve real-world problems.
                </p>
                
                <p>
                  As a Website Manager for Toke Makinwa Beauty, I've helped optimize e-commerce platforms, resulting in 
                  a <span className="text-green-400 font-semibold">40% increase in online sales</span> through collaborative 
                  efforts and performance improvements.
                </p>

                <p>
                  I've also independently built and managed WordPress e-commerce stores from scratch, like Crismyla International, 
                  where I achieved a <span className="text-blue-400 font-semibold">60% increase in sales</span> through 
                  strategic development and digital marketing implementation.
                </p>
              </div>
            </div>

            {/* Skills Focus */}
            <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-xl p-6 border border-purple-500/30">
              <h4 className="text-xl font-bold text-white mb-4 flex items-center">
                <span className="text-2xl mr-3">🎯</span>
                What I Do Best
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                  <div className="text-green-400 font-semibold mb-1">E-commerce Solutions</div>
                  <div className="text-sm text-gray-400">WordPress & Shopify Development</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                  <div className="text-blue-400 font-semibold mb-1">Performance Optimization</div>
                  <div className="text-sm text-gray-400">Speed & User Experience</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                  <div className="text-purple-400 font-semibold mb-1">Digital Marketing</div>
                  <div className="text-sm text-gray-400">Strategy & Implementation</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                  <div className="text-orange-400 font-semibold mb-1">Multi-platform Management</div>
                  <div className="text-sm text-gray-400">Unified Brand Presence</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Timeline/Journey */}
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 border border-gray-700">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <span className="text-2xl mr-3">📈</span>
                My Journey
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <div>
                    <div className="text-white font-semibold">Self-Taught Journey</div>
                    <div className="text-gray-400 text-sm">Started exploring web development through online resources and practical application</div>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <div>
                    <div className="text-white font-semibold">First Professional Role</div>
                    <div className="text-gray-400 text-sm">Crismyla International - Built complete WordPress e-commerce solution from scratch</div>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <div>
                    <div className="text-white font-semibold">Current Position</div>
                    <div className="text-gray-400 text-sm">Toke Makinwa Beauty - Website Manager optimizing dual-platform e-commerce operations</div>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full flex items-center justify-center text-sm font-bold">
                    4
                  </div>
                  <div>
                    <div className="text-white font-semibold">Future Goals</div>
                    <div className="text-gray-400 text-sm">Expanding into full-stack development and contributing to innovative tech solutions</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Touch */}
            <div className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 rounded-xl p-6 border border-cyan-500/30">
              <h4 className="text-lg font-bold text-white mb-3 flex items-center">
                <span className="text-xl mr-2">💡</span>
                Beyond Code
              </h4>
              <p className="text-gray-300 text-sm leading-relaxed">
                When I'm not coding, you'll find me exploring new technologies, contributing to open source projects, 
                or mentoring aspiring developers. I believe in continuous learning and sharing knowledge with the community.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;
