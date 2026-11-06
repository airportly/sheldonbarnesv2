/**
 * The single source of truth for the HUD look: colors, type, grid, easing.
 * Nothing else in the project should hardcode a color or a font.
 *
 * Accent discipline (from the brief): only two accents exist.
 *   RED  = a country the person is legally protected from.
 *   WHITE (with glow) = the actual destination.
 * Everything else is greyscale.
 */

export const COLORS = {
  bg: "#000000",
  // greyscale ramp for linework, borders, graticule, dim labels
  grey900: "#0a0a0a",
  grey800: "#141414",
  grey700: "#1f1f1f",
  grey600: "#2a2a2a",
  grey500: "#3d3d3d",
  grey400: "#5c5c5c",
  grey300: "#8a8a8a",
  grey200: "#b5b5b5",
  grey100: "#dcdcdc",
  white: "#ffffff",
  // the two accents
  red: "#ff3b30", // protected-from country
  redDim: "rgba(255,59,48,0.20)", // 20% fill for barred country
  glowWhite: "rgba(255,255,255,0.65)", // destination bloom
  glowRed: "rgba(255,59,48,0.55)",
  // faint route threads in the cold open / swarm
  thread: "rgba(255,255,255,0.12)",
} as const;

export const TYPE = {
  mono: "'IBM Plex Mono', 'JetBrains Mono', ui-monospace, monospace",
  // tiny uppercase HUD labels with wide tracking
  label: {
    fontFamily: "'IBM Plex Mono', 'JetBrains Mono', ui-monospace, monospace",
    textTransform: "uppercase" as const,
    letterSpacing: "0.18em",
    fontWeight: 500,
  },
  sizes: {
    micro: 11,
    label: 13,
    body: 16,
    stat: 34,
    titleBar: 22,
    bigStat: 56,
  },
} as const;

/** Faint 10° graticule + scanline/grain parameters. */
export const GRID = {
  graticuleStepDeg: 10,
  graticuleColor: COLORS.grey700,
  graticuleWidth: 0.5,
  coastColor: COLORS.grey400,
  coastWidth: 0.6,
  borderColor: COLORS.grey600,
  borderWidth: 0.4,
  sphereColor: COLORS.grey800, // ocean disc fill
  sphereStroke: COLORS.grey500,
} as const;

export const FX = {
  scanlineOpacity: 0.05,
  scanlineGap: 3, // px between scanlines
  grainOpacity: 0.04,
  bloomBlurPx: 8, // blur radius for the glow copy under bright lines
} as const;

/** Cubic / expo easing — the brief forbids linear motion. */
export const EASE = {
  // cubic in-out
  cubicInOut: (t: number): number =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  // expo out — for snappy arrivals (pins, labels)
  expoOut: (t: number): number => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  // expo in-out — for camera flies
  expoInOut: (t: number): number =>
    t === 0
      ? 0
      : t === 1
        ? 1
        : t < 0.5
          ? Math.pow(2, 20 * t - 10) / 2
          : (2 - Math.pow(2, -20 * t + 10)) / 2,
  cubicOut: (t: number): number => 1 - Math.pow(1 - t, 3),
} as const;

/** Per-composition geometry. The 16x9 is the master; the 4x5 reflows. */
export const LAYOUT = {
  fps: 60,
  main: {
    width: 1920,
    height: 1080,
    topBarHeight: 92,
    panelRowHeight: 150, // two rows of four panels at the bottom
    panelRows: 2,
    panelCols: 4,
    gutter: 14,
  },
  vertical: {
    width: 1080,
    height: 1350,
    topBarHeight: 120,
    // panels stack in the vertical cut; globe recenters
  },
} as const;

/** Line thickness buckets for the swarm, keyed by documented count (field n). */
export const THREAD_BUCKETS: ReadonlyArray<{ max: number; width: number }> = [
  { max: 9, width: 0.8 },
  { max: 49, width: 1.4 },
  { max: 249, width: 2.2 },
  { max: Infinity, width: 3.4 },
];

export function threadWidth(n: number | null | undefined): number {
  if (n == null) return 0.6; // no-count routes: thin (and dashed, set by caller)
  for (const b of THREAD_BUCKETS) if (n <= b.max) return b.width;
  return THREAD_BUCKETS[THREAD_BUCKETS.length - 1]!.width;
}
