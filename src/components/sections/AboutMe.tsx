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
            Mobile, web, and AI products — with a background in business.
          </p>
        </div>

        {/* Profile Photo Section */}
        <div className="flex justify-center mb-16">
          <div className="relative">
            <img
              src="/images/The_codeCrafterX.png"
              alt="Sopefoluwa"
              width={724}
              height={682}
              className="w-48 h-48 rounded-full object-cover border-4 border-green-500/30 shadow-2xl"
            />
            <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center border-4 border-zinc-900">
              <span className="text-white text-xl">✓</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
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
                  I'm also a co-founder at <span className="font-semibold text-green-400">Xiongzai (熊崽电竞)</span>,
                  where we're building a gaming marketplace in China that connects
                  players with gaming companions.
                </p>
                <p>
                  I enjoy working across the whole product, from the screens
                  people use to the services behind them. I care about making
                  things easy to use, testing how they behave, and keeping the
                  code straightforward to maintain.
                </p>
                <p>
                  My accounting background shapes how I approach software:
                  understanding the business, making workflows clear, and paying
                  attention to the details behind payments and reporting.
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
                    Frontend Development
                  </div>
                  <div className="text-sm text-gray-400">
                    React, Next.js, TypeScript & Tailwind CSS
                  </div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                  <div className="text-green-400 font-semibold mb-1">
                    Mobile Development
                  </div>
                  <div className="text-sm text-gray-400">
                    React Native, Expo & EAS Build
                  </div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                  <div className="text-green-400 font-semibold mb-1">
                    Backend Development
                  </div>
                  <div className="text-sm text-gray-400">
                    Node.js, Express, FastAPI & PostgreSQL
                  </div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                  <div className="text-green-400 font-semibold mb-1">
                    API & Payment Integration
                  </div>
                  <div className="text-sm text-gray-400">REST APIs, Webhooks, Paystack & Clerk</div>
                </div>
              </div>
              <p className="mt-5 border-t border-green-500/20 pt-4 text-sm leading-relaxed text-gray-300">
                <span className="font-semibold text-green-400">Deployment & Delivery:</span>{" "}
                Docker, GitHub Actions, Vercel & Google Cloud Run
              </p>
            </div>
          </div>

          {/* Education and personal background */}
          <div className="space-y-8">
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
                I'm based in China and enjoy building products with people from
                different backgrounds. Outside coding, I'm learning Chinese and
                watching anime. Open to React Native, React, and AI-enabled
                application development roles and collaborations.
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
