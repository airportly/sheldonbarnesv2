import { getRelatedPosts } from "@/lib/blog";
import type { BlogPost } from "@/lib/blog";
import PostCard from "./PostCard";

export default function RelatedPosts({ post }: { post: BlogPost }) {
  const related = getRelatedPosts(post, 3);

  if (related.length === 0) return null;

  return (
    <section className="px-6 py-16 bg-surface/30 border-t border-surface-light">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-8">
          Related <span className="text-primary">Posts</span>
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {related.map((p) => (
            <PostCard key={p.slug} post={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
