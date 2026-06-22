import { useParams } from "react-router-dom";
import ModernButton from "../components/ModernButton";
import { blogPosts } from "../data/blogPosts";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Post Not Found</h1>
              <ModernButton href="/blog" variant="primary">
            Back to Blog
          </ModernButton>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="pt-20">
        <article className="max-w-4xl mx-auto px-5 md:px-20 py-20">
          {/* Header */}
          <div className="mb-12">
            <ModernButton href="/blog" variant="outline" size="sm">
              ← Back to Blog
            </ModernButton>

            <div className="mb-6">
              <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                {post.category}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              {post.title}
            </h1>

            <div className="flex items-center gap-6 text-gray-400 mb-8">
              <div className="flex items-center gap-2">
                <span>👀</span>
                <span>{post.readTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>📅</span>
                <span>{post.publishedDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>❤️</span>
                <span>{post.likes} likes</span>
              </div>
            </div>

            <p className="text-xl text-gray-300 leading-relaxed mb-8">
              {post.excerpt}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-3 mb-8">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="prose max-w-none">
            <div className="text-gray-300 text-lg leading-relaxed space-y-6">
              {post.content}
            </div>
          </div>

          {/* Social Share */}
          <div className="mt-16 pt-8 border-t border-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex gap-4">
                <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                  <span>🐦</span>
                  Share on Twitter
                </button>
                <button className="flex items-center gap-2 bg-emerald-700 text-white px-4 py-2 rounded-lg hover:bg-emerald-800 transition-colors">
                  <span>💼</span>
                  Share on LinkedIn
                </button>
              </div>

              <ModernButton href="/blog" variant="outline">
                More Articles
              </ModernButton>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogPost;
