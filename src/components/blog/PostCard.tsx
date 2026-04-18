import Image from "next/image";
import Link from "next/link";
import { getCategoryBySlug } from "@/lib/categories";
import type { BlogPost } from "@/lib/blog";

function formatDate(iso: string): string {
  return new Date(iso + "T12:00:00Z").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function PostCard({ post }: { post: BlogPost }) {
  const category = getCategoryBySlug(post.category);

  return (
    <article className="rounded-2xl bg-surface border border-surface-light overflow-hidden hover:border-primary/40 transition-all group">
      <Link href={`/blog/${post.slug}`} className="block">
        {post.hero ? (
          <div className="aspect-[16/9] relative bg-background">
            <Image
              src={post.hero}
              alt={post.heroAlt}
              fill
              className="object-cover group-hover:scale-[1.02] transition-transform"
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            />
          </div>
        ) : post.heroVideo ? (
          <div className="aspect-[16/9] relative bg-background overflow-hidden">
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <video
              src={post.heroVideo}
              aria-label={post.heroAlt}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.02] transition-transform"
              muted
              playsInline
              preload="metadata"
            />
          </div>
        ) : null}
      </Link>

      <div className="p-6">
        <div className="flex items-center gap-3 text-xs text-muted mb-3">
          {category && (
            <Link
              href={`/blog/category/${category.slug}`}
              className="text-primary font-mono uppercase tracking-wider hover:text-primary-light transition-colors"
            >
              {category.name}
            </Link>
          )}
          <span>·</span>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span>·</span>
          <span>{post.readingMinutes} min read</span>
        </div>

        <h3 className="text-xl font-bold mb-2 leading-snug">
          <Link
            href={`/blog/${post.slug}`}
            className="hover:text-primary transition-colors"
          >
            {post.title}
          </Link>
        </h3>

        <p className="text-sm text-muted leading-relaxed line-clamp-3">
          {post.description}
        </p>
      </div>
    </article>
  );
}
