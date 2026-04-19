import type { MetadataRoute } from "next";
import { books } from "@/lib/books";
import { getAllPosts, getAllTagsWithCount, POSTS_PER_PAGE } from "@/lib/blog";
import { categories } from "@/lib/categories";

const BASE_URL = "https://sheldonbarnes.com";
const NOINDEX_THRESHOLD = 3;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/books`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/tools/ai-voice-guided-molecule-viewer`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];

  const bookPages: MetadataRoute.Sitemap = books.flatMap((book) => {
    const pages: MetadataRoute.Sitemap = [
      {
        url: `${BASE_URL}/books/${book.slug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.8,
      },
    ];

    if (book.figures.length > 0 || book.downloads.length > 0) {
      pages.push({
        url: `${BASE_URL}/books/${book.slug}/resources`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }

    return pages;
  });

  const posts = getAllPosts();
  const blogIndex: MetadataRoute.Sitemap = posts.length > 0
    ? [{ url: `${BASE_URL}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.9 }]
    : [];

  const blogPages: MetadataRoute.Sitemap = posts.map((p) => {
    const entry: MetadataRoute.Sitemap[number] = {
      url: `${BASE_URL}/blog/${p.slug}`,
      lastModified: new Date(p.date + "T12:00:00Z"),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    };

    if (p.heroVideo) {
      const videoUrl = p.heroVideo.startsWith("http")
        ? p.heroVideo
        : `${BASE_URL}${p.heroVideo}`;
      const thumbnailUrl = p.hero
        ? (p.hero.startsWith("http") ? p.hero : `${BASE_URL}${p.hero}`)
        : `${BASE_URL}/og/books.jpg`;
      entry.videos = [
        {
          title: p.title,
          description: p.description,
          thumbnail_loc: thumbnailUrl,
          content_loc: videoUrl,
          publication_date: new Date(p.date + "T12:00:00Z").toISOString(),
        },
      ];
    }

    return entry;
  });

  // Pagination pages — noindex but still in sitemap is fine; they redirect to /blog if empty
  const paginationPages: MetadataRoute.Sitemap = [];
  const pageCount = Math.ceil(posts.length / POSTS_PER_PAGE);
  for (let i = 2; i <= pageCount; i++) {
    paginationPages.push({
      url: `${BASE_URL}/blog/page/${i}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.4,
    });
  }

  // Only include category pages that have enough posts to be indexable
  const categoryPages: MetadataRoute.Sitemap = categories
    .filter((c) => posts.filter((p) => p.category === c.slug).length >= NOINDEX_THRESHOLD)
    .map((c) => ({
      url: `${BASE_URL}/blog/category/${c.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));

  // Only include tag pages that have enough posts to be indexable
  const tagPages: MetadataRoute.Sitemap = getAllTagsWithCount()
    .filter(({ count }) => count >= NOINDEX_THRESHOLD)
    .map(({ tag }) => ({
      url: `${BASE_URL}/blog/tag/${tag}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    }));

  return [
    ...staticPages,
    ...bookPages,
    ...blogIndex,
    ...blogPages,
    ...paginationPages,
    ...categoryPages,
    ...tagPages,
  ];
}
