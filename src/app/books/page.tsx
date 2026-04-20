import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import { books } from "@/lib/books";

export const metadata: Metadata = {
  title: "Books by Sheldon Barnes | AI, Pharma, Careers",
  description:
    "Explore books by Sheldon Barnes on AI-first engineering leadership, AI in pharmaceutical R&D, and navigating the AI-driven hiring landscape.",
  alternates: { canonical: "https://www.sheldonbarnes.com/books" },
  openGraph: {
    title: "Books by Sheldon Barnes",
    description:
      "AI-first engineering, drug discovery, and the modern job search. Three books for leaders navigating the AI revolution.",
    url: "https://www.sheldonbarnes.com/books",
    images: [{ url: "/og/books.jpg", width: 1200, height: 630, alt: "Books by Sheldon Barnes" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og/books.jpg"],
  },
};

export default function BooksPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-primary font-mono text-sm tracking-widest uppercase mb-3">
              Published Works
            </p>
            <h1 className="text-5xl font-bold mb-4">
              Books by Sheldon <span className="text-secondary">Barnes</span>
            </h1>
            <p className="text-muted max-w-2xl mx-auto text-lg">
              Three books at the intersection of artificial intelligence,
              enterprise leadership, and the modern career landscape.
            </p>
          </div>

          <div className="space-y-16">
            {books.map((book, i) => (
              <div
                key={book.slug}
                className={`grid md:grid-cols-2 gap-12 items-center ${
                  i % 2 === 1 ? "md:[direction:rtl]" : ""
                }`}
              >
                <div className={`flex justify-center ${i % 2 === 1 ? "md:[direction:ltr]" : ""}`}>
                  <Link href={`/books/${book.slug}`} className="group">
                    <Image
                      src={book.cover}
                      alt={`${book.title} book cover`}
                      width={380}
                      height={500}
                      className="rounded-lg shadow-2xl transition-transform group-hover:scale-[1.02]"
                    />
                  </Link>
                </div>

                <div className={i % 2 === 1 ? "md:[direction:ltr]" : ""}>
                  <h2 className="text-3xl font-bold mb-2">
                    <Link
                      href={`/books/${book.slug}`}
                      className="hover:text-primary transition-colors"
                    >
                      {book.title}
                    </Link>
                  </h2>
                  <p className="text-muted mb-4">{book.subtitle}</p>
                  <p className="text-muted leading-relaxed mb-6">
                    {book.description}
                  </p>

                  <div className="space-y-2 mb-6">
                    {book.highlights.slice(0, 3).map((h) => (
                      <div key={h} className="flex items-start gap-2">
                        <span className="text-primary mt-1 shrink-0">&#9656;</span>
                        <span className="text-sm text-muted">{h}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Link
                      href={`/books/${book.slug}`}
                      className="px-6 py-3 bg-primary text-background font-semibold rounded-lg hover:bg-primary-light transition-all"
                    >
                      Learn More
                    </Link>
                    {book.links.map((link) => (
                      <a
                        key={link.label}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 border border-surface-light text-foreground font-semibold rounded-lg hover:border-primary hover:text-primary transition-all"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
