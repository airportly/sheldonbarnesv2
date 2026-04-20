import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import PostCard from "@/components/blog/PostCard";
import { getAllPosts, POSTS_PER_PAGE } from "@/lib/blog";
import { categories } from "@/lib/categories";

export const metadata: Metadata = {
  title: "Blog | Sheldon Barnes",
  description:
    "Essays from Sheldon Barnes on AI-first engineering leadership, drug discovery, and the future of work in regulated enterprises.",
  alternates: { canonical: "https://www.sheldonbarnes.com/blog" },
  openGraph: {
    title: "Blog by Sheldon Barnes",
    description:
      "Essays on AI-first engineering leadership, drug discovery, and the future of work in regulated enterprises.",
    url: "https://www.sheldonbarnes.com/blog",
    images: [{ url: "/og/books.jpg", width: 1200, height: 630, alt: "Sheldon Barnes blog" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og/books.jpg"],
  },
};

export default function BlogIndexPage() {
  const posts = getAllPosts();
  const pageCount = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE));
  const visible = posts.slice(0, POSTS_PER_PAGE);

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-primary font-mono text-sm tracking-widest uppercase mb-3">
              Essays & Analysis
            </p>
            <h1 className="text-5xl font-bold mb-4">
              The <span className="text-secondary">Blog</span>
            </h1>
            <p className="text-muted max-w-2xl mx-auto text-lg">
              Notes from the field on AI-first engineering, drug discovery, and what changes when intelligent systems take work off your hands.
            </p>
          </div>

          {/* Category nav */}
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

          {posts.length === 0 ? (
            <p className="text-center text-muted py-20">No posts yet — check back soon.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visible.map((p) => (
                <PostCard key={p.slug} post={p} />
              ))}
            </div>
          )}

          {pageCount > 1 && (
            <div className="flex justify-center gap-2 mt-12">
              <span className="px-4 py-2 rounded-lg bg-primary text-background text-sm font-semibold">
                1
              </span>
              {Array.from({ length: pageCount - 1 }, (_, i) => i + 2).map((p) => (
                <Link
                  key={p}
                  href={`/blog/page/${p}`}
                  className="px-4 py-2 rounded-lg border border-surface-light text-muted hover:border-primary hover:text-primary text-sm"
                >
                  {p}
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
