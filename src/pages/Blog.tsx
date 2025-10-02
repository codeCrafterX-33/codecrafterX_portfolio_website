import BlogArticles from "../components/sections/BlogArticles";

const Blog = () => {
  return (
    <div className="min-h-screen bg-black">
      {/* Add some top padding to account for fixed navbar */}
      <div className="pt-20">
        <BlogArticles />
      </div>
    </div>
  );
};

export default Blog;
