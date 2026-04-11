"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import { getBookBySlug } from "@/lib/books";

export default function BookResourcesPage() {
  const { slug } = useParams<{ slug: string }>();
  const book = getBookBySlug(slug);

  if (!book || (book.figures.length === 0 && book.downloads.length === 0)) {
    notFound();
  }

  const [lightbox, setLightbox] = useState<number | null>(null);

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted mb-8">
            <Link href="/books" className="hover:text-primary transition-colors">
              Books
            </Link>
            <span>/</span>
            <Link
              href={`/books/${book.slug}`}
              className="hover:text-primary transition-colors"
            >
              {book.title}
            </Link>
            <span>/</span>
            <span className="text-foreground">Resources</span>
          </div>

          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-3">
              {book.title} — <span className="text-primary">Resources</span>
            </h1>
            <p className="text-muted text-lg">
              Figures, templates, and tools from the book — free for practitioners.
            </p>
          </div>

          {/* Figures */}
          {book.figures.length > 0 && (
            <section className="mb-20">
              <h2 className="text-2xl font-bold mb-8">Book Figures</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {book.figures.map((fig, i) => (
                  <button
                    key={fig.file}
                    onClick={() => setLightbox(i)}
                    className="group rounded-lg overflow-hidden bg-surface border border-surface-light hover:border-primary/40 transition-all cursor-pointer text-left"
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
                  </button>
                ))}
              </div>
            </section>
          )}

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
                    src={`/figures/${book.figures[lightbox].file}`}
                    alt={book.figures[lightbox].title}
                    width={1200}
                    height={800}
                    className="rounded-lg object-contain w-full h-auto max-h-[80vh]"
                  />
                  <p className="text-center text-foreground mt-4 font-semibold">
                    {book.figures[lightbox].title}
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
                  {lightbox < book.figures.length - 1 && (
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

          {/* Downloads */}
          {book.downloads.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-8">Templates &amp; Tools</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {book.downloads.map((dl) => (
                  <div
                    key={dl.title}
                    className="p-6 rounded-xl bg-surface border border-surface-light"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-lg shrink-0">
                        {dl.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">{dl.title}</h4>
                        <p className="text-sm text-muted mb-3">{dl.description}</p>
                        <span className="text-sm text-primary">Coming soon</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
