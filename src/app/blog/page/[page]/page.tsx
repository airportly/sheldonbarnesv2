import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import PostCard from "@/components/blog/PostCard";
import { getAllPosts, POSTS_PER_PAGE } from "@/lib/blog";
import { categories } from "@/lib/categories";

const SITE = "https://sheldonbarnes.com";

export function generateStaticParams() {
  const posts = getAllPosts();
  const pageCount = Math.ceil(posts.length / POSTS_PER_PAGE);
  if (pageCount <= 1) return [];
  return Array.from({ length: pageCount - 1 }, (_, i) => ({ page: String(i + 2) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ page: string }>;
}): Promise<Metadata> {
  const { page } = await params;
  const url = `${SITE}/blog/page/${page}`;
  return {
    title: `Blog — Page ${page} | Sheldon Barnes`,
    description: `More essays from Sheldon Barnes on AI-first engineering, drug discovery, and the future of work — page ${page}.`,
    alternates: { canonical: url },
    robots: { index: false, follow: true },
  };
}

export default async function BlogPaginatedPage({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page } = await params;
  const pageNum = parseInt(page, 10);
  if (!Number.isFinite(pageNum) || pageNum < 2) notFound();

  const posts = getAllPosts();
  const pageCount = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE));
  if (pageNum > pageCount) notFound();

  const start = (pageNum - 1) * POSTS_PER_PAGE;
  const visible = posts.slice(start, start + POSTS_PER_PAGE);

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-primary font-mono text-sm tracking-widest uppercase mb-3">
              Page {pageNum} of {pageCount}
            </p>
            <h1 className="text-5xl font-bold mb-4">
              The <span className="text-secondary">Blog</span>
            </h1>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/blog/category/${c.slug}`}
                className="px-4 py-2 text-sm rounded-full border border-surface-light text-muted hover:border-primary hover:text-primary transition-colors"
              >
                {c.name}
              </Link>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visible.map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
          </div>

          <div className="flex justify-center gap-2 mt-12">
            {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => {
              const href = p === 1 ? "/blog" : `/blog/page/${p}`;
              const isCurrent = p === pageNum;
              return isCurrent ? (
                <span
                  key={p}
                  className="px-4 py-2 rounded-lg bg-primary text-background text-sm font-semibold"
                >
                  {p}
                </span>
              ) : (
                <Link
                  key={p}
                  href={href}
                  className="px-4 py-2 rounded-lg border border-surface-light text-muted hover:border-primary hover:text-primary text-sm"
                >
                  {p}
                </Link>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
