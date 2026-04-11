"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { books } from "@/lib/books";

function BookFeature({ bookIndex, reverse }: { bookIndex: number; reverse?: boolean }) {
  const book = books[bookIndex];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`grid md:grid-cols-2 gap-12 items-center mb-20 ${
        reverse ? "md:[direction:rtl]" : ""
      }`}
    >
      <div className={`flex justify-center ${reverse ? "md:[direction:ltr]" : ""}`}>
        <Link href={`/books/${book.slug}`} className="relative group">
          <Image
            src={book.cover}
            alt={`${book.title} book cover`}
            width={400}
            height={520}
            className="rounded-lg shadow-2xl transition-transform group-hover:scale-[1.02]"
          />
          <div className="absolute inset-0 rounded-lg glow-orange opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>
      </div>

      <div className={reverse ? "md:[direction:ltr]" : ""}>
        <div className="inline-block px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-semibold mb-4">
          Available Now
        </div>
        <h3 className="text-3xl font-bold mb-2">{book.title}</h3>
        <p className="text-muted mb-6">{book.subtitle}</p>
        <p className="text-muted leading-relaxed mb-6">{book.description}</p>

        <div className="space-y-2 mb-8">
          <p className="text-sm font-semibold text-foreground">
            What you&apos;ll learn:
          </p>
          {book.highlights.map((h) => (
            <div key={h} className="flex items-start gap-2">
              <span className="text-primary mt-1 shrink-0">&#9656;</span>
              <span className="text-sm text-muted">{h}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href={`/books/${book.slug}`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-background font-semibold rounded-lg hover:bg-primary-light transition-all"
          >
            Learn More
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
          {book.links.map((link) => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 border border-surface-light text-foreground font-semibold rounded-lg hover:border-primary hover:text-primary transition-all"
            >
              {link.icon === "amazon" && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M.045 18.02c.07-.116.36-.236.89-.36C3.46 17.02 6.09 16.61 8.78 16.61c2.78 0 5.45.55 8.01 1.65.31.13.58.2.79.2.34 0 .53-.15.53-.47 0-.19-.08-.42-.22-.69-1.5-2.78-3.56-4.94-6.17-6.49-2.6-1.56-5.47-2.34-8.6-2.34-.93 0-1.83.08-2.69.24-.55.1-.86.04-.93-.19-.07-.22.08-.39.45-.49.96-.26 2.05-.39 3.27-.39 3.34 0 6.39.87 9.17 2.6 2.78 1.73 4.87 4.07 6.28 7.01.19.39.29.7.29.93 0 .67-.38 1-1.15 1-.29 0-.67-.08-1.15-.24-2.73-1.04-5.52-1.56-8.38-1.56-2.85 0-5.59.45-8.24 1.36-.36.13-.63.19-.82.19-.36 0-.53-.13-.53-.39l.03-.11z" />
                  <path d="M13.59 10.87c0-1.42.43-2.59 1.28-3.52.85-.93 1.97-1.39 3.35-1.39 1.2 0 2.17.38 2.91 1.15.73.77 1.1 1.79 1.1 3.08 0 1.42-.43 2.61-1.28 3.56-.85.95-1.95 1.43-3.29 1.43-1.23 0-2.22-.39-2.97-1.18-.75-.79-1.1-1.82-1.1-3.13z" />
                </svg>
              )}
              {link.icon === "apple" && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
              )}
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function Books() {
  return (
    <section id="books" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-primary font-mono text-sm tracking-widest uppercase mb-3">
            Published Works
          </p>
          <h2 className="text-4xl font-bold">
            <span className="text-primary">Books</span>
          </h2>
        </motion.div>

        {books.map((_, i) => (
          <BookFeature key={books[i].slug} bookIndex={i} reverse={i % 2 === 1} />
        ))}
      </div>
    </section>
  );
}
