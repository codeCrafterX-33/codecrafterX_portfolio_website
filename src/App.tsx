import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import Footer from "./components/sections/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import CaseStudies from "./pages/CaseStudies";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Process from "./pages/Process";
import Projects from "./pages/Projects";
import ProjectTemplate from "./pages/ProjectTemplate";
import { ThemeToggle } from "./components/ThemeToggle";
import AdminProjectEditor from "./pages/AdminProjectEditor";
import AdminProjects from "./pages/AdminProjects";
import ScrollToTop from "./components/ScrollToTop";

const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/case-studies" element={<CaseStudies />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/process" element={<Process />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:projectId" element={<ProjectTemplate />} />
        <Route path="/admin" element={<Navigate to="/admin/projects" replace />} />
        <Route path="/admin/projects" element={<AdminProjects />} />
        <Route path="/admin/projects/new" element={<AdminProjectEditor />} />
        <Route path="/admin/projects/:slug/edit" element={<AdminProjectEditor />} />
      </Routes>
      <div className="fixed bottom-5 right-5 z-[140] md:hidden">
        <ThemeToggle />
      </div>
      <Footer />
    </Router>
  );
};
export default App;
