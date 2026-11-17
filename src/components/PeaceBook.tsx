"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { peaceBook } from "@/lib/peaceBook";
import PatrioticAccents from "@/components/decor/PatrioticAccents";
import PatrioticBanner from "@/components/decor/PatrioticBanner";

export default function PeaceBook() {
  return (
    <section id="peace-book" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p
            className="font-mono text-sm tracking-widest uppercase mb-3"
            style={{ color: "var(--rwb-red)" }}
          >
            Now in four languages
          </p>
          <h2 className="text-4xl font-bold">
            <span className="rwb-text">Peace in the Middle East</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-3xl p-8 md:p-12 pt-10 md:pt-14 grid md:grid-cols-[auto_1fr] gap-10 md:gap-12 items-center relative overflow-hidden"
        >
          <PatrioticBanner />
          <PatrioticAccents />

          {/* Cover */}
          <div className="flex justify-center relative z-10">
            <a
              href={peaceBook.siteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative group shrink-0"
            >
              <Image
                src={peaceBook.heroCover}
                alt={`${peaceBook.title} — ${peaceBook.edition} — book cover`}
                width={300}
                height={450}
                className="rounded-xl shadow-2xl transition-transform group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 rounded-xl glow-red opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          </div>

          {/* Copy + editions */}
          <div className="relative z-10">
            <div
              className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4"
              style={{
                color: "var(--rwb-red)",
                background: "color-mix(in srgb, var(--rwb-red) 12%, transparent)",
                border: "1px solid color-mix(in srgb, var(--rwb-red) 40%, transparent)",
              }}
            >
              {peaceBook.edition}
            </div>
            <p className="text-muted mb-2">{peaceBook.subtitle}</p>
            <p className="text-muted leading-relaxed mb-8">{peaceBook.blurb}</p>

            <p className="text-sm font-semibold text-foreground mb-4">
              Read it in your language:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {peaceBook.editions.map((e) => (
                <a
                  key={e.code}
                  href={e.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-soft rwb-hover rounded-xl p-3 flex flex-col gap-2 transition-transform hover:-translate-y-0.5 group"
                >
                  <div className="relative aspect-[2/3] rounded-md overflow-hidden bg-background">
                    <Image
                      src={e.cover}
                      alt={`${e.language} edition cover`}
                      fill
                      className="object-cover transition-transform group-hover:scale-[1.03]"
                      sizes="(max-width: 640px) 45vw, 160px"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className="text-sm font-semibold text-foreground leading-tight">
                        {e.language}
                      </p>
                      <span className="flex gap-1">
                        {e.countries.map((c) => (
                          <span
                            key={c.code}
                            role="img"
                            aria-label={c.name}
                            title={c.name}
                            className="inline-block rounded-[2px] ring-1 ring-white/20 shadow-sm shrink-0"
                            style={{
                              width: 20,
                              height: 14,
                              backgroundImage: `url(/flags/${c.code}.svg)`,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                            }}
                          />
                        ))}
                      </span>
                    </div>
                    <p
                      lang={e.code}
                      dir={e.rtl ? "rtl" : "ltr"}
                      className="text-xs text-muted leading-tight truncate"
                    >
                      {e.nativeTitle}
                    </p>
                    <p
                      className="text-[11px] font-mono mt-1"
                      style={{ color: "#7ea4ff" }}
                    >
                      {e.formats}
                    </p>
                  </div>
                </a>
              ))}
            </div>

            <a
              href={peaceBook.siteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-white font-semibold rounded-lg transition-all hover:bg-secondary-light"
            >
              Explore the book
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
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
