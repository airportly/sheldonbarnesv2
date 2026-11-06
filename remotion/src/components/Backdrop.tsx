import React from "react";
import { AbsoluteFill } from "remotion";
import { COLORS, FX } from "../theme";

/**
 * The always-on look layer: pure black, faint scanlines, subtle film grain.
 * Children render on top. Grain is a deterministic SVG turbulence so every
 * frame is reproducible (no Math.random at render time).
 */
export const Backdrop: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      {children}
      {/* scanlines */}
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          backgroundImage: `repeating-linear-gradient(
            to bottom,
            rgba(255,255,255,${FX.scanlineOpacity}) 0px,
            rgba(255,255,255,${FX.scanlineOpacity}) 1px,
            transparent 1px,
            transparent ${FX.scanlineGap}px
          )`,
          mixBlendMode: "overlay",
        }}
      />
      {/* film grain */}
      <AbsoluteFill style={{ pointerEvents: "none", opacity: FX.grainOpacity }}>
        <svg width="100%" height="100%">
          <filter id="grain">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.9"
              numOctaves="2"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#grain)" />
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
