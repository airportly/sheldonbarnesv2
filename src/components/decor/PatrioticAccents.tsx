import React from "react";

/**
 * Decorative red/white/blue layer: twinkling stars + soft color flares, placed
 * among the glass panels. Pure SVG + CSS animation (no JS, no GIF) so it stays
 * crisp and light and honors prefers-reduced-motion. Purely decorative —
 * aria-hidden and pointer-events: none so it never interferes with content.
 *
 * Drop it as a child of a `relative overflow-hidden` container and give the
 * real content `relative z-10` so it sits on top.
 */

type Accent = "red" | "white" | "blue";

// True red / white / blue, tuned to read on the dark glass.
const HEX: Record<Accent, string> = {
  red: "#d7263d",
  white: "#ffffff",
  blue: "#3a6bf0",
};

// 4-point sparkle and a classic 5-point star.
const SPARK =
  "M12 1C12.6 6.2 13.8 7.4 23 12 13.8 16.6 12.6 17.8 12 23 11.4 17.8 10.2 16.6 1 12 10.2 7.4 11.4 6.2 12 1Z";
const STAR5 =
  "M12 2l2.47 5.56 6.03.52-4.57 3.97 1.38 5.92L12 14.9l-5.31 3.07 1.38-5.92L3.5 8.08l6.03-.52z";

type Star = {
  top: string;
  left: string;
  size: number;
  color: Accent;
  shape: "spark" | "five";
  delay: number;
  dur: number;
};

type Flare = { top: string; left: string; size: number; color: Accent; delay: number };

// Curated so each cluster holds red + white + blue "together".
const STARS: Star[] = [
  { top: "7%", left: "5%", size: 15, color: "red", shape: "spark", delay: 0, dur: 4 },
  { top: "15%", left: "11%", size: 9, color: "white", shape: "five", delay: 1.2, dur: 5 },
  { top: "4%", left: "14%", size: 7, color: "blue", shape: "spark", delay: 0.6, dur: 4.5 },

  { top: "9%", left: "90%", size: 13, color: "blue", shape: "spark", delay: 0.3, dur: 4.2 },
  { top: "18%", left: "95%", size: 8, color: "white", shape: "five", delay: 1.6, dur: 5.5 },
  { top: "5%", left: "85%", size: 6, color: "red", shape: "spark", delay: 0.9, dur: 4 },

  { top: "83%", left: "7%", size: 10, color: "blue", shape: "five", delay: 0.5, dur: 5 },
  { top: "90%", left: "12%", size: 6, color: "red", shape: "spark", delay: 1.4, dur: 4.3 },

  { top: "87%", left: "93%", size: 14, color: "red", shape: "spark", delay: 1, dur: 4.4 },
  { top: "92%", left: "87%", size: 7, color: "white", shape: "five", delay: 0.4, dur: 5 },
  { top: "80%", left: "96%", size: 8, color: "blue", shape: "spark", delay: 1.9, dur: 4.6 },
];

const FLARES: Flare[] = [
  { top: "-4%", left: "-3%", size: 190, color: "red", delay: 0 },
  { top: "58%", left: "82%", size: 230, color: "blue", delay: 2 },
  { top: "74%", left: "6%", size: 150, color: "white", delay: 1 },
];

export default function PatrioticAccents({
  className = "",
  mirror = false,
}: {
  className?: string;
  /** Flip horizontally for variety between sections. */
  mirror?: boolean;
}) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${
        mirror ? "-scale-x-100" : ""
      } ${className}`}
    >
      {FLARES.map((f, i) => (
        <span
          key={`f${i}`}
          className="rwb-flare absolute rounded-full"
          style={{
            top: f.top,
            left: f.left,
            width: f.size,
            height: f.size,
            background: `radial-gradient(circle, ${HEX[f.color]}55, transparent 70%)`,
            animationDelay: `${f.delay}s`,
          }}
        />
      ))}
      {STARS.map((s, i) => (
        <svg
          key={`s${i}`}
          viewBox="0 0 24 24"
          fill="currentColor"
          className="rwb-star absolute"
          style={{
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size,
            color: HEX[s.color],
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.dur}s`,
            filter: `drop-shadow(0 0 6px ${HEX[s.color]}88)`,
          }}
        >
          <path d={s.shape === "spark" ? SPARK : STAR5} />
        </svg>
      ))}
    </div>
  );
}
