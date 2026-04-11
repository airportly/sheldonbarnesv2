"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const titles = [
  "AI-First Engineering Leader",
  "Author of The Platform Inversion",
  "Platform Strategist",
  "Agent Orchestration Pioneer",
];

export default function Hero() {
  const [titleIdx, setTitleIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTitleIdx((prev) => (prev + 1) % titles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(232,112,26,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(232,112,26,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        {/* Gradient orbs */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[120px]"
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-primary font-mono text-sm tracking-widest uppercase mb-6">
            Engineering Leader &middot; AI Strategist &middot; Author
          </p>
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-6">
            Sheldon{" "}
            <span className="text-secondary">Barnes</span>
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="h-10 mb-8"
        >
          <motion.p
            key={titleIdx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-xl md:text-2xl text-muted"
          >
            {titles[titleIdx]}
          </motion.p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-lg text-muted max-w-2xl mx-auto mb-10"
        >
          Building and leading AI-first engineering teams in regulated enterprises.
          Turning point solutions into intelligent operating platforms.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a
            href="#books"
            className="px-8 py-3 bg-primary text-background font-semibold rounded-lg hover:bg-primary-light transition-all glow-orange"
          >
            View My Work
          </a>
          <a
            href="#contact"
            className="px-8 py-3 border border-secondary text-secondary font-semibold rounded-lg hover:bg-secondary/10 transition-all"
          >
            Let&apos;s Connect
          </a>
          <a
            href="#ai-assistant"
            className="px-8 py-3 border border-surface-light text-foreground font-semibold rounded-lg hover:border-primary hover:text-primary transition-all"
          >
            Ask My AI
          </a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-muted"
          >
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </motion.div>
      </div>
    </section>
  );
}
