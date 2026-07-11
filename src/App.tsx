import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import Footer from "./components/sections/Footer";
import Home from "./pages/Home";
import ScrollToTop from "./components/ScrollToTop";

const About = lazy(() => import("./pages/About"));
const CaseStudies = lazy(() => import("./pages/CaseStudies"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const Process = lazy(() => import("./pages/Process"));
const Projects = lazy(() => import("./pages/Projects"));
const ProjectTemplate = lazy(() => import("./pages/ProjectTemplate"));
const AdminProjectEditor = lazy(() => import("./pages/AdminProjectEditor"));
const AdminProjects = lazy(() => import("./pages/AdminProjects"));
const AdminCaseStudies = lazy(() => import("./pages/AdminCaseStudies"));
const AdminCaseStudyEditor = lazy(() => import("./pages/AdminCaseStudyEditor"));

const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <NavBar />
      <Suspense fallback={<div className="min-h-screen bg-black" />}>
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
          <Route path="/admin/case-studies" element={<AdminCaseStudies />} />
          <Route path="/admin/case-studies/new" element={<AdminCaseStudyEditor />} />
          <Route path="/admin/case-studies/:slug/edit" element={<AdminCaseStudyEditor />} />
        </Routes>
      </Suspense>
      <Footer />
    </Router>
  );
};
export default App;
