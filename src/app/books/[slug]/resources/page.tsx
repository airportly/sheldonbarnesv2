import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { books, getBookBySlug } from "@/lib/books";
import ResourcesContent from "./Content";

export function generateStaticParams() {
  return books
    .filter((book) => book.figures.length > 0 || book.downloads.length > 0)
    .map((book) => ({ slug: book.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const book = getBookBySlug(slug);
  if (!book) return {};

  const url = `https://www.sheldonbarnes.com/books/${slug}/resources`;
  const ogImage = book.cover.startsWith("http")
    ? book.cover
    : `https://www.sheldonbarnes.com${book.cover}`;

  const description = `Free figures, templates, and frameworks from ${book.title}. Download the toolkit Sheldon Barnes featured in the book.`;

  return {
    title: `${book.title}: Resources & Figures | Sheldon Barnes`,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${book.title} — Resources & Figures`,
      description,
      url,
      images: [{ url: ogImage, width: 1200, height: 630, alt: `${book.title} resources` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${book.title} — Resources & Figures`,
      description,
      images: [ogImage],
    },
  };
}

export default async function BookResourcesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const book = getBookBySlug(slug);

  if (!book || (book.figures.length === 0 && book.downloads.length === 0)) {
    notFound();
  }

  return <ResourcesContent book={book} />;
}
