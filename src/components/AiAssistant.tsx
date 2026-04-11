"use client";

import { motion } from "framer-motion";

export default function AiAssistant() {
  return (
    <section id="ai-assistant" className="py-24 px-6 bg-surface/30">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-primary text-sm font-semibold">AI-Powered</span>
          </div>

          <h2 className="text-4xl font-bold mb-6">
            Why I Built <span className="text-primary">This AI</span>
          </h2>

          <div className="space-y-6 text-muted leading-relaxed text-lg max-w-3xl mx-auto">
            <p>
              I practice what I preach. If I&apos;m going to write a book about
              AI-first operating models, this website should be a living example
              of the principles in that book.
            </p>
            <p>
              The chat assistant you see in the corner of this site is powered by
              Claude. It knows my background, my frameworks, the content of my
              books, and what I&apos;m looking for in my next role. It&apos;s a
              demonstration of what &ldquo;context is the product&rdquo; looks like
              in practice.
            </p>
            <p>
              Ask it anything &mdash; about the Platform Inversion thesis, Digital
              Work Equivalents, the eight principles, my career, or what kind of
              team I want to lead next.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-12 grid md:grid-cols-3 gap-6"
          >
            {[
              {
                question: "What is the Platform Inversion?",
                hint: "The book's central thesis",
              },
              {
                question: "What is a DWE?",
                hint: "The signature metric",
              },
              {
                question: "What role are you looking for?",
                hint: "Career and hiring",
              },
            ].map((item) => (
              <div
                key={item.question}
                className="p-4 rounded-xl bg-background border border-surface-light text-left"
              >
                <p className="text-sm font-semibold text-foreground mb-1">
                  Try asking:
                </p>
                <p className="text-primary text-sm">&ldquo;{item.question}&rdquo;</p>
                <p className="text-xs text-muted mt-2">{item.hint}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
