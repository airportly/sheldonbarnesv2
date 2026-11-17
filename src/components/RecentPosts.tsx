import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import PostCard from "@/components/blog/PostCard";
import PatrioticAccents from "@/components/decor/PatrioticAccents";

// Server component: reads the three most recent published posts and shows them
// with the same hero-image cards used on /blog (glass variant for the home look).
export default function RecentPosts() {
  const posts = getAllPosts().slice(0, 3);
  if (posts.length === 0) return null;

  return (
    <section id="recent-posts" className="py-24 px-6 relative overflow-hidden">
      <PatrioticAccents mirror />
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex items-end justify-between gap-4 mb-12">
          <div>
            <p className="text-primary font-mono text-sm tracking-widest uppercase mb-3">
              From the blog
            </p>
            <h2 className="text-4xl font-bold">
              Latest <span className="text-primary">Writing</span>
            </h2>
          </div>
          <Link
            href="/blog"
            className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-colors shrink-0"
          >
            View all posts
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} variant="glass" />
          ))}
        </div>

        <div className="mt-10 text-center sm:hidden">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 border border-surface-light text-foreground font-semibold rounded-lg hover:border-primary hover:text-primary transition-all"
          >
            View all posts
          </Link>
        </div>
      </div>
    </section>
  );
}
