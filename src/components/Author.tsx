"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Author() {
  return (
    <section id="author" className="py-24 px-6 bg-surface/30">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row items-center gap-12"
        >
          {/* Author photo */}
          <div className="shrink-0">
            <div className="relative">
              <div className="w-64 h-64 md:w-72 md:h-72 rounded-full overflow-hidden border-4 border-primary/30 shadow-2xl">
                <Image
                  src="/author-photo.jpg"
                  alt="Sheldon Barnes — Author"
                  width={288}
                  height={288}
                  className="w-full h-full object-cover object-top"
                  priority
                />
              </div>
              <div className="absolute -inset-2 rounded-full border border-primary/10 -z-10" />
            </div>
          </div>

          {/* Author info */}
          <div className="text-center md:text-left">
            <p className="text-primary font-mono text-sm tracking-widest uppercase mb-3">
              Meet the Author
            </p>
            <h2 className="text-4xl font-bold mb-4">
              Sheldon <span className="text-primary">Barnes</span>
            </h2>
            <p className="text-muted leading-relaxed mb-4">
              Senior engineering leader, AI strategist, and author of three books on
              the intersection of artificial intelligence, enterprise leadership, and
              the modern career landscape.
              With years of experience building and shipping AI products inside
              regulated Fortune 100 organizations, Sheldon writes the books he
              wished someone had handed him on day one.
            </p>
            <p className="text-muted leading-relaxed mb-8">
              His work spans AI-first engineering, platform architecture, agent
              orchestration, and the application of AI in pharmaceutical R&amp;D,
              always grounded in the operating realities of industries where
              compliance is non-negotiable.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <a
                href="https://amazon.com/author/sheldonbarnes"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-background font-semibold rounded-lg hover:bg-primary-light transition-all"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M.045 18.02c.07-.116.36-.236.89-.36C3.46 17.02 6.09 16.61 8.78 16.61c2.78 0 5.45.55 8.01 1.65.31.13.58.2.79.2.34 0 .53-.15.53-.47 0-.19-.08-.42-.22-.69-1.5-2.78-3.56-4.94-6.17-6.49-2.6-1.56-5.47-2.34-8.6-2.34-.93 0-1.83.08-2.69.24-.55.1-.86.04-.93-.19-.07-.22.08-.39.45-.49.96-.26 2.05-.39 3.27-.39 3.34 0 6.39.87 9.17 2.6 2.78 1.73 4.87 4.07 6.28 7.01.19.39.29.7.29.93 0 .67-.38 1-1.15 1-.29 0-.67-.08-1.15-.24-2.73-1.04-5.52-1.56-8.38-1.56-2.85 0-5.59.45-8.24 1.36-.36.13-.63.19-.82.19-.36 0-.53-.13-.53-.39l.03-.11z"/>
                  <path d="M13.59 10.87c0-1.42.43-2.59 1.28-3.52.85-.93 1.97-1.39 3.35-1.39 1.2 0 2.17.38 2.91 1.15.73.77 1.1 1.79 1.1 3.08 0 1.42-.43 2.61-1.28 3.56-.85.95-1.95 1.43-3.29 1.43-1.23 0-2.22-.39-2.97-1.18-.75-.79-1.1-1.82-1.1-3.13z"/>
                </svg>
                Amazon Author Page
              </a>
              <a
                href="https://linkedin.com/in/sheldonbarnes"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 border border-secondary text-secondary font-semibold rounded-lg hover:bg-secondary/10 transition-all"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
                </svg>
                LinkedIn
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
