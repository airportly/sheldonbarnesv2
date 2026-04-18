import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import PostCard from "@/components/blog/PostCard";
import { categories, getCategoryBySlug } from "@/lib/categories";
import { getPostsByCategory } from "@/lib/blog";

const SITE = "https://sheldonbarnes.com";
const NOINDEX_THRESHOLD = 3;

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return {};

  const posts = getPostsByCategory(slug);
  const url = `${SITE}/blog/category/${slug}`;
  const shouldIndex = posts.length >= NOINDEX_THRESHOLD;

  return {
    title: `${category.name} | Sheldon Barnes Blog`,
    description: category.description,
    alternates: { canonical: url },
    robots: shouldIndex
      ? { index: true, follow: true }
      : { index: false, follow: true },
    openGraph: {
      title: `${category.name} — Sheldon Barnes Blog`,
      description: category.description,
      url,
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const posts = getPostsByCategory(slug);

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
            <span className="text-foreground">{category.name}</span>
          </div>

          <div className="mb-12">
            <p className="text-primary font-mono text-sm tracking-widest uppercase mb-3">
              Category
            </p>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{category.name}</h1>
            <p className="text-muted text-lg max-w-2xl">{category.description}</p>
            <p className="text-sm text-muted mt-4">
              {posts.length} {posts.length === 1 ? "post" : "posts"}
            </p>
          </div>

          {posts.length === 0 ? (
            <p className="text-center text-muted py-20">No posts in this category yet.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((p) => (
                <PostCard key={p.slug} post={p} />
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
