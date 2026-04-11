"use client";

import { motion } from "framer-motion";

export default function Contact() {
  return (
    <section id="contact" className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-primary font-mono text-sm tracking-widest uppercase mb-3">
            Get In Touch
          </p>
          <h2 className="text-4xl font-bold">
            Let&apos;s <span className="text-primary">Work Together</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-8"
        >
          {/* What I'm looking for */}
          <div className="p-8 rounded-2xl bg-surface border border-surface-light">
            <h3 className="text-xl font-bold mb-4">What I&apos;m Looking For</h3>
            <div className="space-y-4 text-muted">
              <p>
                I&apos;m seeking a <strong className="text-foreground">Senior Director</strong>{" "}
                role where I can lead the transition to AI-first engineering at scale.
              </p>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">&#9656;</span>
                  <span className="text-sm">
                    <strong className="text-foreground">Industries:</strong> Pharma, healthcare, financial services, insurance, or any regulated enterprise
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">&#9656;</span>
                  <span className="text-sm">
                    <strong className="text-foreground">Focus:</strong> AI-first engineering teams, platform transformation, agent orchestration
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">&#9656;</span>
                  <span className="text-sm">
                    <strong className="text-foreground">Culture:</strong> Mission-driven organizations that take compliance seriously and want to lead, not follow
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">&#9656;</span>
                  <span className="text-sm">
                    <strong className="text-foreground">Impact:</strong> Building platforms that compound, not portfolios that cap out
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Connect */}
          <div className="p-8 rounded-2xl bg-surface border border-surface-light flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold mb-4">Connect With Me</h3>
              <p className="text-muted mb-8">
                Whether you&apos;re hiring, collaborating, or just want to talk about
                AI-first engineering &mdash; I&apos;d love to hear from you.
              </p>
            </div>

            <div className="space-y-4">
              {/* LinkedIn */}
              <a
                href="https://linkedin.com/in/sheldonbarnes"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-xl bg-background border border-surface-light hover:border-secondary/40 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-secondary">
                    <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-sm group-hover:text-secondary transition-colors">
                    LinkedIn
                  </p>
                  <p className="text-xs text-muted">Connect professionally</p>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ml-auto text-muted">
                  <path d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
              </a>

              {/* Email */}
              <a
                href="mailto:sheldonbarnes@gmail.com"
                className="flex items-center gap-4 p-4 rounded-xl bg-background border border-surface-light hover:border-primary/40 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <path d="M22 6l-10 7L2 6" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-sm group-hover:text-primary transition-colors">
                    Email
                  </p>
                  <p className="text-xs text-muted">sheldonbarnes@gmail.com</p>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ml-auto text-muted">
                  <path d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
              </a>

              {/* Resume Download */}
              <a
                href="/downloads/Sheldon-Barnes-Resume.pdf"
                download
                className="flex items-center gap-4 p-4 rounded-xl bg-primary/5 border border-primary/20 hover:border-primary/40 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-sm group-hover:text-primary transition-colors">
                    Download Resume
                  </p>
                  <p className="text-xs text-muted">PDF format</p>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ml-auto text-muted">
                  <path d="M12 5v14M5 12l7 7 7-7" />
                </svg>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
