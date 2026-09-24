const services = [
  { title: "Mobile & web products", description: "Apps, storefronts, and dashboards built around how people actually use them." },
  { title: "Payments & integrations", description: "Connect payments, authentication, AI services, and the workflows behind your product." },
  { title: "Maintenance & performance", description: "Keep existing websites reliable, resolve issues, and improve the experience over time." },
];

const ServiceHighlights = () => (
  <section id="services" className="service-highlights-dark px-5 py-14 md:px-20">
    <div className="mx-auto max-w-7xl">
      <h2 className="mb-8 text-2xl font-semibold text-white">How I can help</h2>
      <div className="grid gap-5 md:grid-cols-3">
        {services.map((service) => (
          <article key={service.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <h3 className="mb-3 text-lg font-semibold text-green-400">{service.title}</h3>
            <p className="text-sm leading-relaxed text-gray-300">{service.description}</p>
          </article>
        ))}
      </div>
      <div className="stats-dark mt-20 rounded-2xl border border-gray-700 bg-gradient-to-r from-gray-800/50 to-gray-900/50 p-8">
        <div className="grid gap-8 text-center md:grid-cols-3">
          {[
            { value: "40%", label: "Average Sales Increase" },
            { value: "5+", label: "Complete Platforms Built" },
            { value: "100%", label: "Client Satisfaction" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="mb-2 text-3xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default ServiceHighlights;
