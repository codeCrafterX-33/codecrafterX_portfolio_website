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

        {/* Profile Photo Section */}
        <div className="flex justify-center mb-16">
          <div className="relative">
            <img 
              src="/images/codecrafterX.jpg" 
              alt="Sopefoluwa" 
              className="w-48 h-48 rounded-full object-cover border-4 border-purple-500/30 shadow-2xl"
            />
            <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center border-4 border-zinc-900">
              <span className="text-white text-xl">✓</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side - Background Story */}
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 border border-gray-700">
              <div className="text-center mb-6">
                <h3 className="text-3xl font-bold text-white mb-2">Hi, I'm Sopefoluwa!</h3>
                <p className="text-blue-400 font-semibold">Full-Stack Developer & Tech Enthusiast</p>
                <p className="text-gray-400 text-sm mt-1">Based in China | Former Accountant Turned Developer</p>
              </div>
              
              <div className="space-y-6 text-gray-300 leading-relaxed">
                <p>
                  I'm a passionate Full-Stack Developer with over a year of experience building cool stuff with JavaScript, 
                  TypeScript, React, React Native, and more. I work across both web and mobile, and I love creating clean, 
                  user-friendly interfaces and solving tricky problems under the hood.
                </p>
                
                <p>
                  I originally came from an <span className="text-blue-400 font-semibold">accounting background</span>, 
                  but I found my passion in tech and haven't looked back since. That mix of business logic and technical 
                  know-how helps me build apps that aren't just functional, but actually make sense to users and teams.
                </p>

                <p>
                  As a Website Manager for Toke Makinwa Beauty, I've helped optimize e-commerce platforms, resulting in 
                  a <span className="text-green-400 font-semibold">40% increase in online sales</span> through collaborative 
                  efforts and performance improvements.
                </p>

                <p>
                  Currently based in China, I'm working on meaningful side projects and actively building in public. 
                  My goal is to join a forward-thinking team where I can grow and build scalable products that have real impact.
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
                  <div className="text-green-400 font-semibold mb-1">Full-Stack Development</div>
                  <div className="text-sm text-gray-400">JavaScript, TypeScript, React</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                  <div className="text-blue-400 font-semibold mb-1">Mobile Development</div>
                  <div className="text-sm text-gray-400">React Native & Expo</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                  <div className="text-purple-400 font-semibold mb-1">Business Logic</div>
                  <div className="text-sm text-gray-400">Accounting Background</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                  <div className="text-orange-400 font-semibold mb-1">AI LLM Integration</div>
                  <div className="text-sm text-gray-400">Future Focus Area</div>
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
                    <div className="text-gray-400 text-sm">Diving deep into AI LLM integration and automation to revolutionize business operations and workflows</div>
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
              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                Long-term, I want to lead or be part of teams that innovate, solve real-world problems, and bring ideas to life through code. 
                I'm currently working on meaningful side projects and actively building in public. Open to full-time roles, internships, and collaborations.
              </p>
              <div className="text-center">
                <span className="text-purple-400 font-semibold text-sm">
                  🚀 Let's connect... especially if you're into tech, startups, or creating things that matter!
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;
