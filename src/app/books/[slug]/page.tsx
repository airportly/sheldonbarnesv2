import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import { books, getBookBySlug } from "@/lib/books";

export function generateStaticParams() {
  return books.map((book) => ({ slug: book.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const book = getBookBySlug(slug);
  if (!book) return {};

  const ogMap: Record<string, string> = {
    "the-platform-inversion": "/og/book-platform-inversion.jpg",
    "the-200-billion-problem": "/og/book-200-billion.jpg",
    "why-youre-not-getting-hired": "/og/book-hiring.jpg",
  };
  // Prefer the book's cover image; fall back to older og assets if needed.
  const ogImage = book.cover || ogMap[slug] || "/og/home.jpg";
  const ogImageUrl = ogImage.startsWith("http") ? ogImage : `https://sheldonbarnes.com${ogImage}`;
  const url = `https://sheldonbarnes.com/books/${slug}`;

  return {
    title: `${book.title} by Sheldon Barnes | ${book.subtitle}`,
    description: book.description,
    alternates: { canonical: url },
    openGraph: {
      title: `${book.title} — Sheldon Barnes`,
      description: book.description,
      url,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: book.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: book.title,
      description: book.description,
      images: [ogImageUrl],
    },
  };
}

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const book = getBookBySlug(slug);
  if (!book) notFound();

  const hasResources = book.figures.length > 0 || book.downloads.length > 0;

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-16">
        {/* Hero */}
        <section className="px-6 pb-16">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className="flex justify-center">
              <Image
                src={book.cover}
                alt={`${book.title} book cover`}
                width={420}
                height={550}
                className="rounded-lg shadow-2xl"
                priority
              />
            </div>

            <div>
              <Link
                href="/books"
                className="inline-flex items-center gap-1 text-sm text-muted hover:text-primary transition-colors mb-6"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                All Books
              </Link>
              <h1 className="text-4xl md:text-5xl font-bold mb-3">{book.title}</h1>
              <p className="text-xl text-muted mb-6">{book.subtitle}</p>
              <p className="text-muted leading-relaxed mb-8">
                {book.longDescription}
              </p>

              <div className="flex flex-wrap gap-3 mb-8">
                {book.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-background font-semibold rounded-lg hover:bg-primary-light transition-all"
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

              {hasResources && (
                <Link
                  href={`/books/${book.slug}/resources`}
                  className="inline-flex items-center gap-2 text-secondary hover:text-secondary-light transition-colors font-semibold"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                    <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
                  </svg>
                  View Figures &amp; Resources
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* What You'll Learn */}
        <section className="px-6 py-16 bg-surface/30">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">
              What You&apos;ll <span className="text-primary">Learn</span>
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {book.keyConcepts.map((concept) => (
                <div
                  key={concept.title}
                  className="p-6 rounded-xl bg-background border border-surface-light"
                >
                  <h3 className="text-lg font-bold mb-2">{concept.title}</h3>
                  <p className="text-sm text-muted leading-relaxed">
                    {concept.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Table of Contents */}
        <section className="px-6 py-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">
              Table of <span className="text-primary">Contents</span>
            </h2>
            <div className="space-y-8">
              {book.tableOfContents.map((part) => (
                <div key={part.part}>
                  <h3 className="text-lg font-bold text-primary mb-3">
                    {part.part}
                  </h3>
                  <div className="space-y-2 pl-4 border-l-2 border-surface-light">
                    {part.chapters.map((ch) => (
                      <p key={ch} className="text-muted text-sm py-1">
                        {ch}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Who This Is For */}
        <section className="px-6 py-16 bg-surface/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">
              Who This Book Is <span className="text-primary">For</span>
            </h2>
            <div className="space-y-3">
              {book.audience.map((a) => (
                <div key={a} className="flex items-start gap-3">
                  <span className="text-primary mt-1 shrink-0">&#9656;</span>
                  <p className="text-muted">{a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Get Your Copy
            </h2>
            <p className="text-muted mb-8">
              Available now on Amazon and Apple Books.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              {book.links.map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-background font-semibold rounded-lg hover:bg-primary-light transition-all text-lg"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
