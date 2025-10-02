import ModernButton from "../ModernButton";

const BlogArticles = () => {
  return (
    <section id="blog" className="py-20 px-5 md:px-20 bg-gradient-to-b from-zinc-900 to-black">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Blog & <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">Articles</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Stay tuned for insightful content coming soon
          </p>
        </div>

        {/* Under Construction */}
        <div className="text-center py-20">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-12 border border-gray-700 max-w-2xl mx-auto">
            <div className="text-6xl mb-6">🚧</div>
            <h3 className="text-3xl font-bold text-white mb-4">
              Under Construction
            </h3>
            <p className="text-gray-300 text-lg mb-6">
              Blog articles are currently being prepared. Check back soon for interesting content!
            </p>
            <div className="flex items-center justify-center gap-2 text-blue-400">
              <div className="animate-spin">⏳</div>
              <span>Coming Soon</span>
            </div>
          </div>
        </div>
        
      </div>
    </section>
  );
};

export default BlogArticles;