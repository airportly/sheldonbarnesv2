"use client";

/**
 * Visual catalog of the five "shocks" for the 2026 midterm post. Each shock
 * carries its icon where it is discussed. Styled with the site's theme tokens.
 * Injected into the post body via the {{shocks-catalog}} shortcode in
 * src/app/blog/[slug]/page.tsx.
 */

const STATS: { n: string; label: string }[] = [
  { n: "~300K", label: "federal workers pushed out by DOGE" },
  { n: "~30%", label: "of the federal workforce were veterans" },
  { n: "68%", label: "of Texas ICE arrests had no criminal record" },
];

const SHOCKS: { t: string; d: string; s: string; icon: string }[] = [
  {
    t: "Tariffs",
    d: "Imposed by executive action, they raised prices and were later struck down by the Supreme Court.",
    s: "64% said they hurt the local economy",
    icon: "/images/aftershock/icons/tariffs_icon.jpg",
  },
  {
    t: "The Iran war",
    d: "Begun in February 2026, it closed the Strait of Hormuz and spiked gas overnight.",
    s: "Gas prices up overnight",
    icon: "/images/aftershock/icons/iran_war_icon.jpg",
  },
  {
    t: "DOGE & the Musk firings",
    d: "An unelected billionaire took a chainsaw to the federal workforce; courts later found it broke the law.",
    s: "~300,000 out, thousands of veterans",
    icon: "/images/aftershock/icons/doge_icon.jpg",
  },
  {
    t: "Immigration sweeps",
    d: "Enforcement promised for criminals reached everyone, from CDL holders to families.",
    s: "68% of Texas arrests had no record",
    icon: "/images/aftershock/icons/immigration_icon.jpg",
  },
  {
    t: "Flock surveillance",
    d: "Local license plate cameras became a side door for ICE. American civil liberties were ignored, and no one moved to regulate it.",
    s: "4,000+ lookups in one Illinois town",
    icon: "/images/aftershock/icons/surveillance_icon.jpg",
  },
];

export default function ShocksCatalog() {
  return (
    <section
      aria-label="The five shocks of the 2026 midterms"
      className="not-prose my-10"
    >
      <div className="rounded-2xl border border-surface-light bg-surface p-5 sm:p-7">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
          Aftershock &middot; 2026
        </p>
        <h3 className="mt-1 text-2xl font-bold text-foreground sm:text-3xl">
          Five shocks, one coalition
        </h3>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {STATS.map((x) => (
            <div
              key={x.label}
              className="rounded-xl border border-surface-light bg-background p-4"
            >
              <div className="text-3xl font-bold text-primary sm:text-4xl">
                {x.n}
              </div>
              <div className="mt-1 text-sm leading-snug text-muted">
                {x.label}
              </div>
            </div>
          ))}
        </div>

        <ol className="mt-6 space-y-3">
          {SHOCKS.map((s) => (
            <li
              key={s.t}
              className="flex items-center gap-4 rounded-xl border border-surface-light bg-background p-4 transition-colors hover:border-primary"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={s.icon}
                alt=""
                className="h-24 w-24 shrink-0 rounded-lg border border-surface-light object-cover sm:h-28 sm:w-28"
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <h4 className="text-base font-semibold text-foreground sm:text-lg">
                    {s.t}
                  </h4>
                  <span className="text-sm font-medium text-primary-light">
                    {s.s}
                  </span>
                </div>
                <p className="mt-1 text-sm leading-relaxed text-muted">{s.d}</p>
              </div>
            </li>
          ))}
        </ol>

        <p className="mt-6 text-center text-lg font-semibold text-foreground sm:text-xl">
          Each one done <span className="text-primary">without a check.</span>
        </p>
      </div>
    </section>
  );
}
