import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  category: string;
  tags: string[];
  hero: string;
  heroAlt: string;
  body: string;
  readingMinutes: number;
}

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

const cache: { posts?: BlogPost[] } = {};

function estimateReadingMinutes(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}

export function getAllPosts(): BlogPost[] {
  if (cache.posts) return cache.posts;
  if (!fs.existsSync(BLOG_DIR)) return [];

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md") || f.endsWith(".mdx"));

  const posts: BlogPost[] = files
    .map((file) => {
      const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf8");
      const { data, content } = matter(raw);
      const slug = file.replace(/\.(md|mdx)$/, "");

      return {
        slug,
        title: data.title ?? "",
        description: data.description ?? "",
        date: data.date ?? "",
        author: data.author ?? "Sheldon Barnes",
        category: data.category ?? "",
        tags: Array.isArray(data.tags) ? data.tags : [],
        hero: data.hero ?? "",
        heroAlt: data.heroAlt ?? data.title ?? "",
        body: content,
        readingMinutes: estimateReadingMinutes(content),
        published: data.published !== false,
      };
    })
    .filter((p) => (p as BlogPost & { published: boolean }).published)
    .sort((a, b) => (b.date > a.date ? 1 : -1));

  cache.posts = posts;
  return posts;
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}

export function getPostsByCategory(categorySlug: string): BlogPost[] {
  return getAllPosts().filter((p) => p.category === categorySlug);
}

export function getPostsByTag(tag: string): BlogPost[] {
  return getAllPosts().filter((p) => p.tags.includes(tag));
}

export function getAllTagsWithCount(): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const post of getAllPosts()) {
    for (const tag of post.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

export function getRelatedPosts(post: BlogPost, limit = 3): BlogPost[] {
  const all = getAllPosts().filter((p) => p.slug !== post.slug);

  const scored = all.map((p) => {
    let score = 0;
    if (p.category === post.category) score += 5;
    for (const tag of p.tags) {
      if (post.tags.includes(tag)) score += 1;
    }
    return { post: p, score };
  });

  return scored
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || (b.post.date > a.post.date ? 1 : -1))
    .slice(0, limit)
    .map((x) => x.post);
}

export function tagDisplay(tag: string): string {
  return tag
    .split("-")
    .map((w) => (w === "ai" ? "AI" : w[0]?.toUpperCase() + w.slice(1)))
    .join(" ");
}

export const POSTS_PER_PAGE = 10;
