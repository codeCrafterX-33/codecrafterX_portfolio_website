const AboutMe = () => {
  return (
    <section
      id="about"
      className="py-20 px-5 md:px-20 bg-gradient-to-b from-zinc-900 to-black"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            About{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
              Me
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Get to know the person behind the code - my journey, passion, and
            commitment to building exceptional digital experiences
          </p>
        </div>

        {/* Profile Photo Section */}
        <div className="flex justify-center mb-16">
          <div className="relative">
            <img
              src="/images/codecrafterX.jpg"
              alt="Sopefoluwa"
              className="w-48 h-48 rounded-full object-cover border-4 border-green-500/30 shadow-2xl"
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
                <h3 className="text-3xl font-bold text-white mb-2">
                  Hi, I'm Sopefoluwa!
                </h3>
                <p className="text-green-400 font-semibold">
                  Full-Stack Developer & Co-founder at Xiongzai
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Based in China | Accountant Turned Developer
                </p>
              </div>

              <div className="space-y-6 text-gray-300 leading-relaxed">
                <p>
                  I'm a React Native and React full-stack engineer with 3+ years
                  of experience building mobile, web, and e-commerce products
                  for international clients. I work with TypeScript, Expo,
                  Node.js, and relational databases, from the interface through
                  to payments, authentication, and cloud services.
                </p>

                <p>
                  I originally came from an{" "}
                  <span className="text-green-400 font-semibold">
                    accounting background
                  </span>
                  , but I found my passion in tech and haven't looked back
                  since. That mix of business logic and technical know-how helps
                  me build apps that aren't just functional, but actually make
                  sense to users and teams.
                </p>

                <p>
                  My work spans live e-commerce and learning platforms,
                  marketplace development, and mobile MVPs. I also built
                  ScreenLingo, an AI screenshot translator that combines Gemini,
                  Google Vision OCR, and Google Translate with a backend on
                  Google Cloud Run. Its complete flow has been tested on a
                  physical iPhone; App Store submission is still pending.
                </p>

                <p>
                  I'm also a co-founder at{" "}
                  <span className="text-green-400 font-semibold">
                    Xiongzai (熊崽电竞)
                  </span>
                  , where we're building a gaming marketplace in China that
                  connects players with gaming companions. It's a chance to
                  bring my business background and software development work
                  together while building a product with a team.
                </p>
              </div>
            </div>

            {/* Skills Focus */}
            <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 rounded-xl p-6 border border-green-500/30">
              <h4 className="text-xl font-bold text-white mb-4 flex items-center">
                <span className="text-2xl mr-3">🎯</span>
                What I Do Best
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                  <div className="text-green-400 font-semibold mb-1">
                    Full-Stack Development
                  </div>
                  <div className="text-sm text-gray-400">
                    JavaScript, TypeScript, React
                  </div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                  <div className="text-green-400 font-semibold mb-1">
                    Mobile Development
                  </div>
                  <div className="text-sm text-gray-400">
                    React Native & Expo
                  </div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                  <div className="text-green-400 font-semibold mb-1">
                    Business Logic
                  </div>
                  <div className="text-sm text-gray-400">
                    Accounting Background
                  </div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                  <div className="text-green-400 font-semibold mb-1">
                    AI API Integration
                  </div>
                  <div className="text-sm text-gray-400">Gemini, OCR & Translation</div>
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
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <div>
                    <div className="text-white font-semibold">
                      Self-Taught Journey
                    </div>
                    <div className="text-gray-400 text-sm">
                      Started exploring web development through online resources
                      and practical application
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <div>
                    <div className="text-white font-semibold">
                      First Professional Role
                    </div>
                    <div className="text-gray-400 text-sm">
                      Crismyla International - Built complete WordPress
                      e-commerce solution from scratch
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <div>
                    <div className="text-white font-semibold">
                      Website Management
                    </div>
                    <div className="text-gray-400 text-sm">
                      Toke Makinwa Beauty - Website Manager optimizing
                      dual-platform e-commerce operations
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-lime-500 to-green-500 rounded-full flex items-center justify-center text-sm font-bold">
                    4
                  </div>
                  <div>
                    <div className="text-white font-semibold">Building Xiongzai</div>
                    <div className="text-gray-400 text-sm">
                      Co-founder of an esports marketplace in China, currently
                      in development across mobile, administration, and backend services.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 border border-gray-700">
              <h3 className="text-2xl font-bold text-white mb-6">Education</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="text-white font-semibold">Master of Management (Accounting)</h4>
                  <p className="text-gray-400 text-sm mt-2">Wuhan Textile University, China · 2026</p>
                  <p className="text-green-400 text-sm mt-2">CGPA: 3.89/4.00 · Outstanding Master's Graduate Award</p>
                </div>
                <div>
                  <h4 className="text-white font-semibold">B.Sc. Accounting</h4>
                  <p className="text-gray-400 text-sm mt-2">Afe Babalola University, Nigeria · 2020</p>
                </div>
              </div>
            </div>

            {/* Personal Touch */}
            <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-xl p-6 border border-green-500/30">
              <h4 className="text-lg font-bold text-white mb-3 flex items-center">
                <span className="text-xl mr-2">💡</span>
                Beyond Code
              </h4>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                Long-term, I want to lead or be part of teams that innovate,
                solve real-world problems, and bring ideas to life through code.
                I'm currently working on meaningful side projects and actively
                building in public. When I’m not coding, I’m probably watching
                anime. Open to full-time roles, internships, and collaborations.
              </p>
              <div className="text-center">
                <span className="text-green-400 font-semibold text-sm">
                  🤝🏾 Let's connect... especially if you're into tech, startups,
                  or creating things that matter!
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
