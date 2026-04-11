import type { MetadataRoute } from "next";
import { books } from "@/lib/books";

const BASE_URL = "https://sheldonbarnes.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/books`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
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

  return [...staticPages, ...bookPages];
}
