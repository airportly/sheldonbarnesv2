"use client";

import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";

type LightboxState = { src: string; alt: string } | null;

export default function MarkdownBody({ source }: { source: string }) {
  const [lightbox, setLightbox] = useState<LightboxState>(null);

  // ESC closes the lightbox; lock body scroll while it's open so the
  // article underneath doesn't move when the user moves their mouse.
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [lightbox]);

  return (
    <>
      <div className="prose prose-invert max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          // rehypeSlug stays so heading IDs exist for any future #anchor jumps;
          // rehype-autolink-headings was removed because it wrapped every
          // heading's text in a self-link, making them look like clickable
          // links that go nowhere.
          rehypePlugins={[rehypeSlug]}
          components={{
            h2: ({ children, ...props }) => (
              <h2
                {...props}
                className="text-3xl font-bold mt-12 mb-4 text-foreground scroll-mt-24"
              >
                {children}
              </h2>
            ),
            h3: ({ children, ...props }) => (
              <h3
                {...props}
                className="text-2xl font-bold mt-8 mb-3 text-foreground scroll-mt-24"
              >
                {children}
              </h3>
            ),
            p: ({ children }) => (
              // Center paragraphs that are just a standalone image or an
              // anchor-wrapped image, so the max-width'd media sits in the middle
              // of the reading column rather than flush-left.
              <p className="text-muted leading-relaxed mb-5 text-lg [&:has(>img)]:text-center [&:has(>a>img)]:text-center">
                {children}
              </p>
            ),
            ul: ({ children }) => (
              <ul className="space-y-2 mb-6 pl-6 list-disc text-muted text-lg">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="space-y-2 mb-6 pl-6 list-decimal text-muted text-lg">
                {children}
              </ol>
            ),
            li: ({ children }) => <li className="leading-relaxed">{children}</li>,
            strong: ({ children }) => (
              <strong className="text-foreground font-semibold">{children}</strong>
            ),
            em: ({ children }) => <em className="italic">{children}</em>,
            a: ({ children, href }) => {
              // If this anchor wraps a single image, render the anchor with a
              // plain (non-lightbox) image inside — the link navigation is the
              // intent. Otherwise render a normal text anchor.
              const childArray = React.Children.toArray(children);
              const onlyChild = childArray.length === 1 ? childArray[0] : null;
              const isImageWrap =
                React.isValidElement(onlyChild) &&
                (onlyChild as React.ReactElement<{ src?: string }>).type === "img";
              if (isImageWrap) {
                const imgEl = onlyChild as React.ReactElement<{
                  src?: string;
                  alt?: string;
                  className?: string;
                }>;
                return (
                  <a
                    href={href}
                    target={href?.startsWith("http") ? "_blank" : undefined}
                    rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imgEl.props.src ?? ""}
                      alt={imgEl.props.alt ?? ""}
                      className={imgEl.props.className}
                      loading="lazy"
                    />
                  </a>
                );
              }
              return (
                <a
                  href={href}
                  className="text-primary hover:text-primary-light underline underline-offset-2"
                  target={href?.startsWith("http") ? "_blank" : undefined}
                  rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
                >
                  {children}
                </a>
              );
            },
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-primary pl-6 italic text-muted my-6 text-lg">
                {children}
              </blockquote>
            ),
            code: ({ children, className }) => {
              const isBlock = className?.includes("language-");
              if (isBlock) {
                return (
                  <code className="block bg-background border border-surface-light rounded-lg p-4 overflow-x-auto text-sm font-mono">
                    {children}
                  </code>
                );
              }
              return (
                <code className="bg-background px-1.5 py-0.5 rounded text-sm font-mono text-primary">
                  {children}
                </code>
              );
            },
            hr: () => <hr className="my-10 border-surface-light" />,
            img: ({ src, alt }) => {
              const safeSrc = typeof src === "string" ? src : "";
              const safeAlt = alt ?? "";
              // inline-block + max-width keeps images tight within the reading
              // column; the parent <p>'s text-center handles horizontal alignment.
              // cursor-zoom-in + onClick opens the lightbox modal at the bottom
              // of this component so users can see the image at full viewport
              // size. Anchor-wrapped images (handled in the a renderer above)
              // bypass this onClick — link navigation wins.
              return (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={safeSrc}
                  alt={safeAlt}
                  className="inline-block rounded-2xl my-8 w-full max-w-xs h-auto border border-surface-light shadow-lg shadow-black/40 cursor-zoom-in"
                  loading="lazy"
                  onClick={() => safeSrc && setLightbox({ src: safeSrc, alt: safeAlt })}
                />
              );
            },
          }}
        >
          {source}
        </ReactMarkdown>
      </div>

      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Image preview"
          onClick={() => setLightbox(null)}
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out"
        >
          {/* Close button — visual cue and a real button for accessibility. */}
          <button
            type="button"
            aria-label="Close"
            onClick={(e) => {
              e.stopPropagation();
              setLightbox(null);
            }}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white text-xl leading-none flex items-center justify-center transition-colors cursor-pointer"
          >
            ×
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightbox.src}
            alt={lightbox.alt}
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
