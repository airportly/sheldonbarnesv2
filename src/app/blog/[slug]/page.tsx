import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import MarkdownBody from "@/components/blog/MarkdownBody";
import RelatedPosts from "@/components/blog/RelatedPosts";
import ShareButtons from "@/components/blog/ShareButtons";
import APAPSimulator from "@/components/blog/APAPSimulator";
import { getAllPosts, getPostBySlug, tagDisplay } from "@/lib/blog";
import { getCategoryBySlug } from "@/lib/categories";

const SITE = "https://sheldonbarnes.com";

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  const url = `${SITE}/blog/${slug}`;
  const fallbackOg = `${SITE}/og/books.jpg`;
  // Prefer socialImage (square brand card) over hero (in-post figure); fall
  // back to the site-wide default when neither is set.
  const ogSource = post.socialImage || post.hero;
  const ogImage = ogSource
    ? (ogSource.startsWith("http") ? ogSource : `${SITE}${ogSource}`)
    : fallbackOg;
  const category = getCategoryBySlug(post.category);

  return {
    title: `${post.title} | Sheldon Barnes`,
    description: post.description,
    alternates: { canonical: url },
    authors: [{ name: post.author, url: SITE }],
    keywords: post.tags,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url,
      siteName: "Sheldon Barnes",
      publishedTime: post.date,
      authors: [post.author],
      section: category?.name,
      tags: post.tags,
      images: [{ url: ogImage, width: 1200, height: 630, alt: post.heroAlt }],
      ...((post.socialVideo || post.heroVideo)
        ? {
            videos: [
              {
                url: (() => {
                  const v = post.socialVideo || post.heroVideo!;
                  return v.startsWith("http") ? v : `${SITE}${v}`;
                })(),
                type: "video/mp4",
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [ogImage],
    },
  };
}

function formatDate(iso: string): string {
  return new Date(iso + "T12:00:00Z").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const category = getCategoryBySlug(post.category);
  const url = `${SITE}/blog/${slug}`;
  const fallbackOg = `${SITE}/og/books.jpg`;
  // Prefer socialImage (square brand card) over hero (in-post figure); fall
  // back to the site-wide default when neither is set.
  const ogSource = post.socialImage || post.hero;
  const ogImage = ogSource
    ? (ogSource.startsWith("http") ? ogSource : `${SITE}${ogSource}`)
    : fallbackOg;
  // Video reference for JSON-LD: prefer socialVideo (explicit) over heroVideo.
  const videoSource = post.socialVideo || post.heroVideo;
  const videoUrl = videoSource
    ? (videoSource.startsWith("http") ? videoSource : `${SITE}${videoSource}`)
    : null;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    headline: post.title,
    description: post.description,
    image: [ogImage],
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Person",
      name: post.author,
      url: SITE,
    },
    publisher: {
      "@type": "Person",
      name: "Sheldon Barnes",
      url: SITE,
    },
    articleSection: category?.name,
    keywords: post.tags.join(", "),
  };

  const videoJsonLd = videoUrl
    ? {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        name: post.title,
        description: post.description,
        thumbnailUrl: [ogImage],
        uploadDate: post.date,
        contentUrl: videoUrl,
        embedUrl: url,
        publisher: { "@type": "Person", name: post.author, url: SITE },
        keywords: post.tags.join(", "),
        ...(category ? { genre: category.name } : {}),
      }
    : null;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Blog", item: `${SITE}/blog` },
      ...(category
        ? [{ "@type": "ListItem", position: 2, name: category.name, item: `${SITE}/blog/category/${category.slug}` }]
        : []),
      {
        "@type": "ListItem",
        position: category ? 3 : 2,
        name: post.title,
        item: url,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      {videoJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(videoJsonLd) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Navbar />
      <main className="pt-24 pb-16">
        <article className="max-w-3xl mx-auto px-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted mb-8">
            <Link href="/blog" className="hover:text-primary transition-colors">
              Blog
            </Link>
            {category && (
              <>
                <span>/</span>
                <Link
                  href={`/blog/category/${category.slug}`}
                  className="hover:text-primary transition-colors"
                >
                  {category.name}
                </Link>
              </>
            )}
          </div>

          {/* Header */}
          <header className={post.heroVideo ? "mb-6" : "mb-10"}>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
              <span>By {post.author}</span>
              <span>·</span>
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              <span>·</span>
              <span>{post.readingMinutes} min read</span>
            </div>
          </header>

          {/* Hero — skipped when the post places imagery inline in body */}
          {post.skipHero ? null : post.heroVideo ? (
            <div className="rounded-2xl overflow-hidden mb-6 mx-auto max-w-sm border border-surface-light bg-background shadow-xl shadow-black/40">
              <video
                src={post.heroVideo}
                poster={post.hero || undefined}
                aria-label={post.heroAlt}
                className="w-full h-auto"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
              />
            </div>
          ) : post.hero ? (
            <div className="rounded-2xl overflow-hidden mb-8 mx-auto max-w-sm border border-surface-light shadow-xl shadow-black/40">
              <Image
                src={post.hero}
                alt={post.heroAlt}
                width={1400}
                height={900}
                className="w-full h-auto"
                priority
              />
            </div>
          ) : null}

          {/* Body — supports {{apap-simulator}} and {{viewer-cta}} shortcodes */}
          {(() => {
            const SHORTCODES: Record<string, React.ReactNode> = {
              "{{apap-simulator}}": <APAPSimulator />,
              "{{viewer-cta}}": (
                <div className="my-8 flex justify-center">
                  <Link
                    href="/tools/ai-voice-guided-molecule-viewer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-background font-semibold rounded-lg hover:bg-primary-light transition-colors shadow-lg shadow-black/30"
                  >
                    Try AI Voice-Guided Molecule Viewer
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              ),
            };
            const keys = Object.keys(SHORTCODES);
            if (!keys.some((k) => post.body.includes(k))) {
              return <MarkdownBody source={post.body} />;
            }
            // Split on any known shortcode, preserving the delimiters via a
            // capture group, then render markdown segments and widgets inline.
            const escape = (s: string) =>
              s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            const re = new RegExp(`(${keys.map(escape).join("|")})`);
            const tokens = post.body.split(re);
            return tokens.map((tok, i) => {
              const widget = SHORTCODES[tok];
              if (widget) return <div key={i}>{widget}</div>;
              return tok ? <MarkdownBody key={i} source={tok} /> : null;
            });
          })()}

          {/* Share */}
          <ShareButtons url={url} title={post.title} />

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-surface-light">
              <p className="text-xs font-mono uppercase tracking-widest text-muted mb-3">
                Tagged
              </p>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((t) => (
                  <Link
                    key={t}
                    href={`/blog/tag/${t}`}
                    className="px-3 py-1 text-sm rounded-full border border-surface-light text-muted hover:border-primary hover:text-primary transition-colors"
                  >
                    {tagDisplay(t)}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>
      </main>

      <RelatedPosts post={post} />

      <Footer />
      <ChatWidget />
    </>
  );
}
