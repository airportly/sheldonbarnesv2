"use client";

import { motion } from "framer-motion";

const ideas = [
  {
    title: "The Platform Inversion",
    description:
      "Point solutions are valuable but they cannot compound. Platforms do. The transition from portfolio to platform is not a technology decision, it is a leadership decision.",
    color: "primary",
  },
  {
    title: "Digital Work Equivalents",
    description:
      "A unit of AI-produced value that a finance organization can defend. The metric that lets you talk to your CFO about the return on an agent workforce.",
    color: "secondary",
  },
  {
    title: "Context is the Product",
    description:
      "The brand book, design system, SDK, API docs, and runbooks are now the highest-leverage investments. The code is the output, the context is the product.",
    color: "primary",
  },
  {
    title: "Verification over Implementation",
    description:
      "The developer's job shifts from writing code to verifying outcomes. Evals are the new unit tests. Demos are not evidence.",
    color: "secondary",
  },
  {
    title: "Humans Direct, Agents Build",
    description:
      "The unit of leadership shifts from managing humans who write code to orchestrating a hybrid system in which humans direct and agents build.",
    color: "primary",
  },
  {
    title: "Specifications are Executable",
    description:
      "User stories were designed for human developers who fill gaps with judgment. Agents cannot. The Agent Brief is the new highest-value artifact.",
    color: "secondary",
  },
];

export default function KeyIdeas() {
  return (
    <section id="ideas" className="py-24 px-6 bg-surface/30">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-primary font-mono text-sm tracking-widest uppercase mb-3">
            From The Platform Inversion
          </p>
          <h2 className="text-4xl font-bold">
            Key <span className="text-primary">Ideas</span>
          </h2>
          <p className="text-muted mt-4 max-w-2xl mx-auto">
            The principles and frameworks that anchor the AI-first operating model.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ideas.map((idea, i) => (
            <motion.div
              key={idea.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="relative p-6 rounded-xl bg-background border border-surface-light hover:border-primary/30 transition-all overflow-hidden group"
            >
              {/* Accent stripe */}
              <div
                className={`absolute top-0 left-0 w-1 h-full ${
                  idea.color === "primary" ? "bg-primary" : "bg-secondary"
                }`}
              />
              <h3 className="text-lg font-bold mb-3 pl-3">{idea.title}</h3>
              <p className="text-sm text-muted leading-relaxed pl-3">
                {idea.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
