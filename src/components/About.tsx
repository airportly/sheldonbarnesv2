"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const stats = [
  { value: "7+", label: "AI Products Shipped" },
  { value: "F100", label: "Enterprise Experience" },
  { value: "18mo", label: "Portfolio Built" },
  { value: "2026", label: "Published Author" },
];

export default function About() {
  return (
    <section id="about" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-2 gap-16 items-center"
        >
          {/* Profile photo */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-72 h-72 md:w-80 md:h-80 rounded-2xl overflow-hidden">
                <Image
                  src="/profile-photo.jpeg"
                  alt="Sheldon Barnes"
                  width={320}
                  height={320}
                  className="w-full h-full object-cover object-top"
                  priority
                />
              </div>
              {/* Decorative border */}
              <div className="absolute -inset-2 rounded-2xl border border-primary/20 -z-10" />
              <div className="absolute -inset-4 rounded-2xl border border-secondary/10 -z-10" />
            </div>
          </div>

          {/* Bio */}
          <div>
            <p className="text-primary font-mono text-sm tracking-widest uppercase mb-3">
              About Me
            </p>
            <h2 className="text-4xl font-bold mb-6">
              Engineering Leader.{" "}
              <span className="text-primary">AI Strategist.</span>{" "}
              <span className="text-secondary">Author.</span>
            </h2>
            <div className="space-y-4 text-muted leading-relaxed">
              <p>
                I&apos;ve spent the past several years leading an
                AI and automation program inside a regulated Fortune 100 enterprise,
                building a portfolio of seven internal AI products that shipped, scaled,
                and delivered measurable impact.
              </p>
              <p>
                My work sits at the intersection of AI engineering, platform architecture,
                and organizational leadership in industries where compliance is
                non-negotiable: pharmaceuticals, financial services, healthcare, and
                insurance.
              </p>
              <p>
                Software development is being rewritten by AI, and engineering
                leaders who don&apos;t adapt will be left behind. The pharmaceutical
                industry is facing a disruption as radical as what AWS did to
                bookstores or Uber did to taxi cabs. I wrote the books because the playbooks that got us here
                won&apos;t get us where we&apos;re going.  The future is AI-first development.
              </p>
            </div>

            {/* Currently seeking */}
            <div className="mt-8 p-4 rounded-xl bg-primary/5 border border-primary/20">
              <p className="text-sm font-semibold text-primary mb-1">Currently Seeking</p>
              <p className="text-foreground">
                Senior Director role leading AI-first engineering teams in a
                mission-driven organization.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16"
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="text-center p-6 rounded-xl bg-surface border border-surface-light"
            >
              <p className="text-3xl font-bold text-primary">{stat.value}</p>
              <p className="text-sm text-muted mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
