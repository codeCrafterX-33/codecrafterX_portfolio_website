interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  readTime: string;
  publishedDate: string;
  tags: string[];
  featured: boolean;
  likes: number;
  views: number;
  contentType: 'embedded' | 'external';
  externalUrl?: string;
  content?: string[];
  image: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "Building Scalable React Applications: Lessons from Production",
    slug: "building-scalable-react-applications",
    excerpt: "Real-world strategies for scaling React apps that handle millions of users. Learn about performance optimization, state management, and architectural patterns.",
    category: "React",
    readTime: "8 min read",
    publishedDate: "2024-01-15",
    tags: ["React", "Performance", "Scalability", "Architecture"],
    featured: true,
    likes: 234,
    views: 1200,
    contentType: "embedded", // Embedded on site
    content: [
      "React applications have evolved from simple component libraries to complex, enterprise-scale systems. In my five years of development experience, I've encountered numerous challenges and solutions for building applications that can handle real-world traffic and provide exceptional user experiences.",
      
      "## Setting Up the Foundation",
      
      "The first step to a scalable React application is choosing the right architecture. Here are the key principles I follow:",
      
      "### Component Structure",
      "- **Atomic Design**: Break components into atoms, molecules, organisms, templates, and pages",
      "- **Single Responsibility**: Each component should have one clear purpose", 
      "- **Composition over Inheritance**: Use composition patterns to build complex UIs",
      
      "### State Management",
      "- **Context API** for prop drilling elimination",
      "- **Redux Toolkit** for complex state interactions",
      "- **Local State** for component-specific data",
      
      "## Performance Optimization Strategies",
      
      "Performance is crucial for user experience. Here are techniques I've implemented:",
      
      "### Code Splitting",
      "- Route-based splitting with `React.lazy()`",
      "- Component-based splitting for heavy features",
      "- Dynamic imports for conditional modules",
      
      "### Memory Management",
      "- Proper cleanup of event listeners",
      "- Using `useMemo` and `useCallback` strategically",
      "- Avoiding memory leaks in useEffect",
      
      "## Real-World Example",
      
      "In one of my recent projects for a luxury e-commerce platform, I implemented these strategies and achieved:",
      "- **45% reduction** in initial bundle size",
      "- **60% improvement** in First Contentful Paint",
      "- **30% increase** in user engagement",
      
      "The key was breaking down a monolithic component into smaller, focused pieces and implementing intelligent caching strategies."
    ],
    image: "/images/blog/react-scaling.jpg"
  },
  {
    id: 2,
    title: "The Complete Guide to Modern CSS Architecture",
    slug: "modern-css-architecture-guide",
    excerpt: "Mastering CSS organization patterns, naming conventions, and scalable architecture for large projects.",
    category: "CSS",
    readTime: "12 min read",
    publishedDate: "2024-01-10",
    tags: ["CSS", "Architecture", "SCSS", "Design Systems"],
    featured: true,
    likes: 189,
    views: 890,
    contentType: "embedded",
    content: [
      "CSS architecture has evolved significantly over the years. Gone are the days of writing stylesheets as afterthoughts to HTML. Modern CSS requires careful planning, organization, and scalable patterns that can grow with your project.",
      
      "## Organizing Your Stylesheets",
      
      "The foundation of good CSS architecture lies in how you organize your styles. I follow the 7-1 pattern:",
      
      "### Base Styles",
      "- Reset/normalize styles",
      "- Typography definitions",
      "- Base element styling",
      
      "### Components",
      "- Self-contained UI components",
      "- Modular and reusable",
      "- Name-spaced appropriately",
      
      "### Layout Styles",
      "- Grid systems",
      "- Flexbox utilities",
      "- Container definitions",
      
      "## Naming Conventions",
      
      "Consistent naming is crucial for team collaboration. I use BEM (Block, Element, Modifier):",
      
      "```css",
      ".card { /* Block */",
      "  &__header { /* Element */",
      "  }",
      "  &--featured { /* Modifier */",
      "  }",
      "}",
      "```",
      
      "This approach has helped me maintain consistency across projects with multiple developers."
    ],
    image: "/images/blog/css-architecture.jpg"
  },
  {
    id: 3,
    title: "JavaScript Performance Optimization Techniques",
    slug: "javascript-performance-optimization",
    excerpt: "Advanced techniques to optimize JavaScript performance, from memory management to execution speed.",
    category: "JavaScript",
    readTime: "10 min read",
    publishedDate: "2024-01-05",
    tags: ["JavaScript", "Performance", "Optimization", "Memory"],
    featured: false,
    likes: 156,
    views: 745,
    contentType: "external", // Links to external platform
    externalUrl: "https://medium.com/@sopefoluwa/javascript-performance-techniques",
    image: "/images/blog/js-performance.jpg"
  },
  {
    id: 4,
    title: "Understanding Three.js: Bringing 3D to the Web",
    slug: "understanding-threejs-3d-web",
    excerpt: "Introduction to Three.js and how to create stunning 3D web experiences without plugins.",
    category: "3D Web",
    readTime: "18 min read",
    publishedDate: "2023-12-20",
    tags: ["Three.js", "3D", "WebGL", "Animation"],
    featured: true,
    likes: 267,
    views: 1100,
    contentType: "embedded",
    content: [
      "Three.js is revolutionizing how we create 3D experiences on the web. From interactive product showcases to immersive user interfaces, the possibilities are endless.",
      
      "## Getting Started with WebGL",
      
      "Three.js abstracts away the complexity of WebGL, making 3D development accessible to web developers:",
      
      "```javascript",
      "// Basic Three.js scene",
      "const scene = new THREE.Scene();",
      "const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);",
      "const renderer = new THREE.WebGLRenderer();",
      "```",
      
      "## Creating Your First 3D Object",
      
      "Building 3D objects in Three.js is surprisingly straightforward. Here's how I create interactive elements:",
      
      "- **Geometry**: Define the shape",
      "- **Material**: Determine appearance", 
      "- **Mesh**: Combine geometry and material",
      
      "This approach has helped me create stunning portfolio showcases and interactive product displays for clients."
    ],
    image: "/images/blog/threejs.jpg"
  },
  {
    id: 5,
    title: "Building Accessible Web Applications",
    slug: "building-accessible-web-applications",
    excerpt: "A comprehensive guide to creating web applications that are inclusive and accessible to all users.",
    category: "Accessibility",
    readTime: "15 min read",
    publishedDate: "2023-12-28",
    tags: ["Accessibility", "WCAG", "ARIA", "Inclusive Design"],
    featured: false,
    likes: 198,
    views: 920,
    contentType: "external",
    externalUrl: "https://dev.to/sopefoluwa/accessible-web-applications",
    image: "/images/blog/accessibility.jpg"
  },
  {
    id: 6,
    title: "Node.js Best Practices for Production Applications",
    slug: "nodejs-production-best-practices",
    excerpt: "Production-ready Node.js patterns, security considerations, and performance optimization.",
    category: "Node.js",
    readTime: "14 min read",
    publishedDate: "2023-12-15",
    tags: ["Node.js", "Production", "Security", "Performance"],
    featured: false,
    likes: 142,
    views: 680,
    contentType: "external",
    externalUrl: "https://hashnode.com/@sopefoluwa/nodejs-best-practices",
    image: "/images/blog/nodejs.jpg"
  }
];