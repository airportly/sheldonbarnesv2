import React from "react";

const STAR5 =
  "M12 2l2.47 5.56 6.03.52-4.57 3.97 1.38 5.92L12 14.9l-5.31 3.07 1.38-5.92L3.5 8.08l6.03-.52z";

/**
 * A slim stars-and-stripes banner for the top edge of a glass panel: a navy
 * canton with white stars beside red/white stripes, with a slow sheen sweep.
 * Decorative only. Drop it into a `relative overflow-hidden rounded-*` box.
 */
export default function PatrioticBanner() {
  return (
    <div
      aria-hidden
      className="absolute top-0 inset-x-0 h-5 flex overflow-hidden z-20 shadow-[0_2px_10px_rgba(0,0,0,0.35)]"
    >
      {/* Canton with stars */}
      <div
        className="relative h-full w-[20%] min-w-[88px]"
        style={{ background: "var(--rwb-navy)" }}
      >
        <div className="absolute inset-0 flex items-center justify-evenly px-1">
          {[0, 1, 2, 3].map((i) => (
            <svg
              key={i}
              viewBox="0 0 24 24"
              fill="#ffffff"
              className="h-2 w-2 opacity-90"
            >
              <path d={STAR5} />
            </svg>
          ))}
        </div>
      </div>

      {/* Red/white stripes + sheen */}
      <div className="relative h-full flex-1 rwb-banner-stripes">
        <div className="absolute inset-0 rwb-banner-sheen" />
      </div>
    </div>
  );
}
