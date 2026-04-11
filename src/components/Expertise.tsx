"use client";

import { motion } from "framer-motion";

const areas = [
  {
    title: "People Leadership",
    description:
      "Hiring, mentoring, and retaining high-performing engineers. Setting clear expectations, running effective 1:1s, managing performance with candor, and creating the psychological safety that lets teams take risks and deliver. People don't leave companies, they leave managers. I take that personally.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  },
  {
    title: "Program Budget & ROI",
    description:
      "Owning multi-million dollar program budgets, forecasting inference costs, and translating engineering investment into business outcomes the CFO can defend. Building the financial models that prove AI isn't overhead, it's a value accelerator.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
      </svg>
    ),
  },
  {
    title: "Leading for the Future",
    description:
      "The tools, patterns, and expectations of software engineering are changing faster than most organizations can adapt. I stay current on where the industry is headed and make sure my teams are ready before the shift arrives, not after.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
  },
  {
    title: "AI-First Engineering",
    description:
      "Building and leading teams where humans direct and agents build. Designing the operating model that makes AI-first delivery sustainable across the entire SDLC.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    title: "Platform Engineering",
    description:
      "Transforming point-solution portfolios into intelligent operating platforms that compound value across every deployment.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M9 21V9" />
      </svg>
    ),
  },
  {
    title: "Regulated Industry AI",
    description:
      "Deploying AI at scale in pharma, healthcare, financial services, and insurance where compliance is non-negotiable and the cost of error is existential.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    title: "Agent Orchestration",
    description:
      "Designing agent workflows with evaluation gates, specification-driven development, and human-in-the-loop governance.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
      </svg>
    ),
  },
  {
    title: "Digital Transformation Strategy",
    description:
      "Translating AI capability into business outcomes with measurable ROI using Digital Work Equivalents and platform economics.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
  },
  {
    title: "Context Engineering",
    description:
      "Making codebases machine-legible through design systems, API contracts, and artifact ecosystems that agents can reason about.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
      </svg>
    ),
  },
];

export default function Expertise() {
  return (
    <section id="expertise" className="py-24 px-6 bg-surface/30">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-primary font-mono text-sm tracking-widest uppercase mb-3">
            What I Bring
          </p>
          <h2 className="text-4xl font-bold">
            Areas of <span className="text-primary">Expertise</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {areas.map((area, i) => (
            <motion.div
              key={area.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-xl bg-background border border-surface-light hover:border-primary/40 transition-all group"
            >
              <div className="text-primary mb-4 group-hover:text-primary-light transition-colors">
                {area.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{area.title}</h3>
              <p className="text-sm text-muted leading-relaxed">
                {area.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
