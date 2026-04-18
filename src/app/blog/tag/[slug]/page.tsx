import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import PostCard from "@/components/blog/PostCard";
import { getAllTagsWithCount, getPostsByTag, tagDisplay } from "@/lib/blog";

const SITE = "https://sheldonbarnes.com";
const NOINDEX_THRESHOLD = 3;

export function generateStaticParams() {
  return getAllTagsWithCount().map(({ tag }) => ({ slug: tag }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const posts = getPostsByTag(slug);
  if (posts.length === 0) return {};

  const url = `${SITE}/blog/tag/${slug}`;
  const display = tagDisplay(slug);
  const shouldIndex = posts.length >= NOINDEX_THRESHOLD;

  return {
    title: `${display} | Sheldon Barnes Blog`,
    description: `Posts tagged ${display} on the Sheldon Barnes blog — essays on AI-first engineering, drug discovery, and the future of work.`,
    alternates: { canonical: url },
    robots: shouldIndex
      ? { index: true, follow: true }
      : { index: false, follow: true },
  };
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const posts = getPostsByTag(slug);
  if (posts.length === 0) notFound();

  const display = tagDisplay(slug);

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-muted mb-6">
            <Link href="/blog" className="hover:text-primary transition-colors">
              Blog
            </Link>
            <span>/</span>
            <span className="text-foreground">Tag: {display}</span>
          </div>

          <div className="mb-12">
            <p className="text-primary font-mono text-sm tracking-widest uppercase mb-3">
              Tag
            </p>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{display}</h1>
            <p className="text-sm text-muted">
              {posts.length} {posts.length === 1 ? "post" : "posts"}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
