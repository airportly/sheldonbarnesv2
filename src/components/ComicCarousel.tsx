"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { comics, comicPage, comicByCode, type Comic } from "@/lib/comics";
import comicQuotes from "@/data/comic-quotes.json";

const QUOTES = comicQuotes as Record<string, Record<string, string>>;

type Selection = { code: string; page: number };

export default function ComicCarousel() {
  const [selection, setSelection] = useState<Selection | null>(null);

  const open = useCallback((code: string, page: number) => {
    setSelection({ code, page });
  }, []);

  return (
    <section id="comic" className="py-24 px-6 relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <p
            className="font-mono text-sm tracking-widest uppercase mb-3"
            style={{ color: "var(--rwb-red)" }}
          >
            Read the comic
          </p>
          <h2 className="text-4xl font-bold">
            <span className="rwb-text">The Comic, in French &amp; Arabic</span>
          </h2>
          <p className="text-muted mt-4 max-w-2xl mx-auto">
            A 24-page illustrated companion to the book. The rows drift through
            every page — hover to pause, click any panel to read it full size.
          </p>
        </div>

        <div className="space-y-8">
          {comics.map((c) => (
            <ComicRow key={c.code} comic={c} onOpen={open} />
          ))}
        </div>
      </div>

      {selection && (
        <Lightbox
          selection={selection}
          onClose={() => setSelection(null)}
          onNavigate={setSelection}
        />
      )}
    </section>
  );
}

type Spot = { idx: number; page: number; quote: string; left: number };

function ComicRow({
  comic,
  onOpen,
}: {
  comic: Comic;
  onOpen: (code: string, page: number) => void;
}) {
  const pages = Array.from({ length: comic.pages }, (_, i) => i + 1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const hoverRef = useRef(false);
  const pauseUntilRef = useRef(0);
  const dirRef = useRef<1 | -1>(1);
  const speedRef = useRef(0.5);
  const targetSpeedRef = useRef(0.5);
  const [spot, setSpot] = useState<Spot | null>(null);

  useEffect(() => {
    const el = scrollerRef.current;
    const wrap = wrapperRef.current;
    if (!el || !wrap) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const quotes = QUOTES[comic.code] || {};

    // Desync the rows: each gets its own speed that drifts between slow and
    // fast over time, plus a random start page.
    const randSpeed = () => 0.18 + Math.random() * 0.82; // slow → fast (px/frame)
    speedRef.current = randSpeed();
    targetSpeedRef.current = randSpeed();
    el.scrollLeft = Math.random() * (el.scrollWidth / 2 || 1);

    let raf = 0;
    const tick = () => {
      const half = el.scrollWidth / 2;
      // Ease the current speed toward its target for smooth fast/slow changes.
      speedRef.current += (targetSpeedRef.current - speedRef.current) * 0.02;
      if (!reduce && !hoverRef.current && Date.now() > pauseUntilRef.current) {
        el.scrollLeft += dirRef.current * speedRef.current;
      }
      if (half > 0) {
        if (el.scrollLeft >= half) el.scrollLeft -= half;
        else if (el.scrollLeft < 0) el.scrollLeft += half;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // Every now and then, pick a new target speed (ebb and flow, fast ↔ slow).
    let speedTimer = 0 as unknown as ReturnType<typeof setTimeout>;
    const scheduleSpeed = () => {
      speedTimer = setTimeout(
        () => {
          targetSpeedRef.current = randSpeed();
          scheduleSpeed();
        },
        6000 + Math.random() * 10000,
      );
    };
    scheduleSpeed();

    // Every now and then (infrequently), flip the scroll direction.
    let dirTimer = 0 as unknown as ReturnType<typeof setTimeout>;
    const scheduleDir = () => {
      dirTimer = setTimeout(
        () => {
          if (Math.random() < 0.6) dirRef.current = dirRef.current === 1 ? -1 : 1;
          scheduleDir();
        },
        20000 + Math.random() * 25000,
      );
    };
    scheduleDir();

    // Every now and then, spotlight a visible page: tricolor ring + a thought
    // bubble with a line from that page (in this language), paused so it reads.
    let spotTimer = 0 as unknown as ReturnType<typeof setTimeout>;
    let clearTimer = 0 as unknown as ReturnType<typeof setTimeout>;
    const showSpot = () => {
      const btns = Array.from(
        el.querySelectorAll<HTMLButtonElement>("button[data-idx]"),
      );
      const sRect = el.getBoundingClientRect();
      const wRect = wrap.getBoundingClientRect();
      const visible = btns.filter((b) => {
        const r = b.getBoundingClientRect();
        const c = r.left + r.width / 2;
        return (
          c > sRect.left + 60 &&
          c < sRect.right - 60 &&
          !!quotes[String(b.dataset.page)]
        );
      });
      if (!visible.length) return;
      const btn = visible[Math.floor(Math.random() * visible.length)]!;
      const r = btn.getBoundingClientRect();
      const page = Number(btn.dataset.page);
      const left = Math.min(
        Math.max(r.left - wRect.left + r.width / 2, 130),
        wRect.width - 130,
      );
      setSpot({ idx: Number(btn.dataset.idx), page, quote: quotes[String(page)]!, left });
      pauseUntilRef.current = Date.now() + 5600;
      clearTimer = setTimeout(() => setSpot(null), 5200);
    };
    const scheduleSpot = () => {
      spotTimer = setTimeout(
        () => {
          if (!hoverRef.current && !reduce) showSpot();
          scheduleSpot();
        },
        11000 + Math.random() * 14000,
      );
    };
    scheduleSpot();

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(dirTimer);
      clearTimeout(speedTimer);
      clearTimeout(spotTimer);
      clearTimeout(clearTimer);
    };
  }, [comic.code]);

  const nudge = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    pauseUntilRef.current = Date.now() + 1500;
    el.scrollBy({ left: dir * 440, behavior: "smooth" });
  };

  return (
    <div>
      <div className="flex items-center gap-2.5 mb-3">
        <span className="flex gap-1">
          {comic.flags.map((f) => (
            <span
              key={f.code}
              role="img"
              aria-label={f.name}
              title={f.name}
              className="inline-block rounded-[2px] ring-1 ring-white/20 shrink-0"
              style={{
                width: 22,
                height: 15,
                backgroundImage: `url(/flags/${f.code}.svg)`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          ))}
        </span>
        <h3 className="text-lg font-semibold">{comic.language}</h3>
        <span
          lang={comic.code}
          dir={comic.rtl ? "rtl" : "ltr"}
          className="text-sm text-muted truncate"
        >
          {comic.title}
        </span>
        <span className="ml-auto text-xs font-mono" style={{ color: "#7ea4ff" }}>
          {comic.pages} pages
        </span>
      </div>

      <div
        ref={wrapperRef}
        className="relative"
        onMouseEnter={() => (hoverRef.current = true)}
        onMouseLeave={() => (hoverRef.current = false)}
      >
        {spot && (
          <ThoughtBubble
            quote={spot.quote}
            left={spot.left}
            rtl={comic.rtl}
            code={comic.code}
          />
        )}
        <RowArrow dir="prev" onClick={() => nudge(-1)} />
        <div
          ref={scrollerRef}
          className="glass rounded-2xl p-3 overflow-x-auto no-scrollbar"
        >
          <div className="flex w-max">
            {[...pages, ...pages].map((p, idx) => {
              const spotted = spot?.idx === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  data-idx={idx}
                  data-page={p}
                  onClick={() => onOpen(comic.code, p)}
                  aria-label={`${comic.language} comic, open page ${p}`}
                  className={`group relative shrink-0 mx-1.5 rounded-md overflow-hidden transition-all ${
                    spotted
                      ? "rwb-spotlight z-10"
                      : "ring-2 ring-white/10 hover:ring-4 hover:ring-[color-mix(in_srgb,var(--rwb-red)_90%,transparent)] hover:z-10"
                  }`}
                >
                  <Image
                    src={comicPage(comic, p)}
                    alt={`${comic.language} comic page ${p}`}
                    width={130}
                    height={195}
                    sizes="130px"
                    className="block h-[195px] w-auto object-cover group-hover:scale-[1.04] transition-transform"
                  />
                  <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/60 text-white text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                    {p}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        <RowArrow dir="next" onClick={() => nudge(1)} />
      </div>
    </div>
  );
}

function ThoughtBubble({
  quote,
  left,
  rtl,
  code,
}: {
  quote: string;
  left: number;
  rtl: boolean;
  code: string;
}) {
  return (
    <div
      className="rwb-bubble absolute z-30 pointer-events-none"
      style={{ left, bottom: "calc(100% + 10px)", transform: "translateX(-50%)" }}
    >
      <div
        className="relative max-w-[230px] px-4 py-2.5 rounded-2xl bg-white text-[#15181a]"
        style={{
          boxShadow:
            "0 0 0 2px var(--rwb-red), 0 0 0 4px #fff, 0 0 0 6px var(--rwb-blue), 0 12px 30px rgba(0,0,0,0.45)",
        }}
      >
        <p
          lang={code}
          dir={rtl ? "rtl" : "ltr"}
          className="text-sm font-medium leading-snug"
        >
          {quote}
        </p>
        <span
          className="absolute left-1/2 -translate-x-1/2 top-full w-3 h-3 bg-white rotate-45"
          style={{ marginTop: -7, boxShadow: "2px 2px 0 0 var(--rwb-blue)" }}
        />
      </div>
    </div>
  );
}

function RowArrow({ dir, onClick }: { dir: "prev" | "next"; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dir === "prev" ? "Scroll left" : "Scroll right"}
      className={`absolute top-1/2 -translate-y-1/2 z-20 ${
        dir === "prev" ? "left-2" : "right-2"
      } w-10 h-10 rounded-full glass flex items-center justify-center text-white hover:ring-2 hover:ring-white/50 transition-all`}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        {dir === "prev" ? <path d="M15 18l-6-6 6-6" /> : <path d="M9 6l6 6-6 6" />}
      </svg>
    </button>
  );
}

function Lightbox({
  selection,
  onClose,
  onNavigate,
}: {
  selection: Selection;
  onClose: () => void;
  onNavigate: (s: Selection) => void;
}) {
  const comic = comicByCode(selection.code);

  const go = useCallback(
    (delta: number) => {
      if (!comic) return;
      const next = selection.page + delta;
      if (next < 1 || next > comic.pages) return;
      onNavigate({ code: selection.code, page: next });
    },
    [comic, selection, onNavigate],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose, go]);

  if (!comic) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${comic.language} comic, page ${selection.page} of ${comic.pages}`}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute top-4 right-4 w-10 h-10 rounded-full glass flex items-center justify-center text-white hover:ring-2 hover:ring-white/40"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>

      <div
        className="relative flex items-center gap-3 sm:gap-5"
        onClick={(e) => e.stopPropagation()}
      >
        <NavButton
          dir="prev"
          disabled={selection.page <= 1}
          onClick={() => go(-1)}
        />

        <div className="flex flex-col items-center">
          <Image
            src={comicPage(comic, selection.page)}
            alt={`${comic.language} comic page ${selection.page}`}
            width={1000}
            height={1500}
            sizes="(max-width: 768px) 92vw, 60vw"
            priority
            className="max-h-[82vh] w-auto rounded-lg shadow-2xl ring-1 ring-white/10"
          />
          <div className="mt-3 flex items-center gap-4 text-sm">
            <span className="font-mono text-muted">
              {selection.page} / {comic.pages}
            </span>
            <a
              href={`${comic.pdfUrl}#page=${selection.page}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-white hover:text-[color-mix(in_srgb,var(--rwb-red)_80%,white)] transition-colors"
            >
              Open full comic (PDF)
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 17L17 7M17 7H8M17 7v9" />
              </svg>
            </a>
          </div>
        </div>

        <NavButton
          dir="next"
          disabled={selection.page >= comic.pages}
          onClick={() => go(1)}
        />
      </div>
    </div>
  );
}

function NavButton({
  dir,
  disabled,
  onClick,
}: {
  dir: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === "prev" ? "Previous page" : "Next page"}
      className="w-11 h-11 shrink-0 rounded-full glass flex items-center justify-center text-white disabled:opacity-25 disabled:cursor-default hover:ring-2 hover:ring-white/40 transition-all"
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        {dir === "prev" ? <path d="M15 18l-6-6 6-6" /> : <path d="M9 6l6 6-6 6" />}
      </svg>
    </button>
  );
}
