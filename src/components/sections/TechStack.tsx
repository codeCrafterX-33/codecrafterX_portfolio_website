import { Code2, Smartphone, Server, Database, Sparkles, Cloud } from "lucide-react";
import "./TechStack.css";

const stackDetails = [
  { category: "Web development", title: "React & Next.js", description: "Responsive interfaces for storefronts, dashboards, and web applications.", tools: ["React", "Next.js", "TypeScript", "Tailwind CSS"], accent: "#61dafb", icon: Code2 },
  { category: "Mobile development", title: "React Native & Expo", description: "Cross-platform apps, navigation, and build workflows for iOS and Android.", tools: ["React Native", "Expo", "Expo Router", "EAS"], accent: "#c4b5fd", icon: Smartphone },
  { category: "Backend & APIs", title: "Node.js services", description: "REST APIs, authentication, webhooks, and the logic behind the product.", tools: ["Node.js", "Express", "Fastify", "NestJS"], accent: "#8cc84b", icon: Server },
  { category: "Databases", title: "Data & persistence", description: "Relational data, schema migrations, and caching for connected applications.", tools: ["PostgreSQL", "Prisma", "Drizzle", "Redis"], accent: "#80b9e5", icon: Database },
  { category: "AI integrations", title: "AI, OCR & translation", description: "Screenshot text extraction, translation, and AI-assisted output in mobile apps.", tools: ["Gemini API", "Google Vision", "Google Translate"], accent: "#f9a8d4", icon: Sparkles },
  { category: "Cloud & delivery", title: "Build, deploy & maintain", description: "Cloud services, containerized deployments, and automated delivery workflows.", tools: ["Cloud Run", "Vercel", "Docker", "GitHub Actions"], accent: "#f78166", icon: Cloud },
];

type TechStackProps = {
  sectionId?: string;
};

const TechStack = ({ sectionId = "skills" }: TechStackProps) => {
  return (
    <section id={sectionId || undefined} aria-labelledby="technology-stack-title" className="stack-section">
      <div className="stack-inner">
        <div className="stack-heading">
          <div>
            <p className="stack-eyebrow">MY TOOLKIT</p>
            <h2 id="technology-stack-title">Technology stack<span>.</span></h2>
          </div>
          <p className="stack-intro">The tools I use to build, ship, and keep things running.</p>
        </div>
        <div className="stack-grid">
          {stackDetails.map((stack, index) => {
            const Icon = stack.icon;
            return (
              <article key={stack.title} className="stack-card">
                <div className="stack-card-top">
                  <div className="stack-logo" style={{ borderColor: `${stack.accent}30` }}>
                    <Icon size={30} strokeWidth={1.5} color={stack.accent} aria-hidden="true" />
                  </div>
                  <span className="stack-number" aria-hidden="true">0{index + 1}</span>
                </div>
                <p className="stack-category" style={{ color: stack.accent }}>{stack.category}</p>
                <h3>{stack.title}</h3>
                <p className="stack-description">{stack.description}</p>
                <ul className="stack-tools" aria-label={`${stack.category} tools`}>
                  {stack.tools.map((tool) => <li key={tool}>{tool}</li>)}
                </ul>
              </article>
            );
          })}
        </div>
        <div className="stack-integrations">
          <p className="stack-eyebrow">INTEGRATIONS & COMMERCE</p>
          <ul className="stack-tools" aria-label="Integrations and commerce tools">
            {["Clerk", "Paystack", "Stripe", "Cloudinary", "WordPress", "WooCommerce", "Shopify"].map((tool) => <li key={tool}>{tool}</li>)}
          </ul>
        </div>
        <div className="stack-note">
          <span className="stack-note-dot" aria-hidden="true" />
          <p>Everyday workflow: <span>Git, GitHub, JavaScript, automated tests & AI-assisted development</span></p>
        </div>
      </div>
    </section>
  );
};

export default TechStack;
