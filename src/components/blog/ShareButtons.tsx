"use client";

export default function ShareButtons({ url, title }: { url: string; title: string }) {
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

  function open(href: string) {
    window.open(href, "share", "width=600,height=600,noopener,noreferrer");
  }

  return (
    <div className="mt-12 pt-8 border-t border-surface-light">
      <p className="text-xs font-mono uppercase tracking-widest text-muted mb-3">
        Share this post
      </p>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => open(linkedInUrl)}
          aria-label={`Share "${title}" on LinkedIn`}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/10 border border-secondary text-secondary hover:bg-secondary/20 transition-colors text-sm font-semibold"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
          </svg>
          Share on LinkedIn
        </button>
      </div>
    </div>
  );
}
