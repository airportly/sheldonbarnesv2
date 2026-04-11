"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getBookBySlug } from "@/lib/books";

const platformBook = getBookBySlug("the-platform-inversion")!;
const figures = platformBook.figures;
const downloads = platformBook.downloads;

export default function Resources() {
  const [lightbox, setLightbox] = useState<number | null>(null);

  return (
    <section id="resources" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-primary font-mono text-sm tracking-widest uppercase mb-3">
            Free for Practitioners
          </p>
          <h2 className="text-4xl font-bold">
            <span className="text-primary">Resources</span>
          </h2>
          <p className="text-muted mt-4 max-w-2xl mx-auto">
            Figures from the book and practical templates you can use today.
          </p>
        </motion.div>

        {/* Figure Gallery */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold mb-8">Book Figures</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {figures.map((fig, i) => (
              <motion.button
                key={fig.file}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
                onClick={() => setLightbox(i)}
                className="group rounded-lg overflow-hidden bg-surface border border-surface-light hover:border-primary/40 transition-all cursor-pointer"
              >
                <div className="aspect-[4/3] relative">
                  <Image
                    src={`/figures/${fig.file}`}
                    alt={fig.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
                <div className="p-3">
                  <p className="text-xs text-muted line-clamp-2">{fig.title}</p>
                </div>
              </motion.button>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link
              href="/books/the-platform-inversion/resources"
              className="text-primary hover:text-primary-light transition-colors font-semibold inline-flex items-center gap-2"
            >
              View All Resources
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Lightbox */}
        <AnimatePresence>
          {lightbox !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-6"
              onClick={() => setLightbox(null)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="relative max-w-4xl max-h-[90vh] w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={`/figures/${figures[lightbox].file}`}
                  alt={figures[lightbox].title}
                  width={1200}
                  height={800}
                  className="rounded-lg object-contain w-full h-auto max-h-[80vh]"
                />
                <p className="text-center text-foreground mt-4 font-semibold">
                  {figures[lightbox].title}
                </p>
                <button
                  onClick={() => setLightbox(null)}
                  className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-surface border border-surface-light flex items-center justify-center text-foreground hover:text-primary transition-colors"
                >
                  &times;
                </button>
                {lightbox > 0 && (
                  <button
                    onClick={() => setLightbox(lightbox - 1)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-surface/80 flex items-center justify-center text-foreground hover:text-primary"
                  >
                    &#8249;
                  </button>
                )}
                {lightbox < figures.length - 1 && (
                  <button
                    onClick={() => setLightbox(lightbox + 1)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-surface/80 flex items-center justify-center text-foreground hover:text-primary"
                  >
                    &#8250;
                  </button>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Downloadable Templates */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold mb-8">Templates &amp; Tools</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {downloads.map((dl, i) => (
              <motion.div
                key={dl.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="p-6 rounded-xl bg-surface border border-surface-light hover:border-primary/30 transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-lg shrink-0">
                    {dl.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">{dl.title}</h4>
                    <p className="text-sm text-muted mb-3">{dl.description}</p>
                    <span className="text-sm text-primary">Coming soon</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
