import React from "react";
import { Composition } from "remotion";
import { LAYOUT } from "./theme";
import { ScaffoldStatus } from "./compositions/ScaffoldStatus";

/**
 * Composition registry. Three entries share one timeline + component tree:
 *   Main16x9    — 1920x1080, 75s master
 *   Vertical4x5 — 1080x1350, same beats reflowed
 *   AnsumanaTest — 10s proof-of-look of the Ansumana S. case beat (Milestone 1)
 *
 * Bodies are Phase-1 placeholders (ScaffoldStatus). Phase 2 swaps in the globe
 * and beat engine; the durations/dimensions below are the real targets.
 */
const FPS = LAYOUT.fps;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Main16x9"
        component={ScaffoldStatus}
        durationInFrames={75 * FPS}
        fps={FPS}
        width={LAYOUT.main.width}
        height={LAYOUT.main.height}
        defaultProps={{ label: "MAIN16X9" }}
      />
      <Composition
        id="Vertical4x5"
        component={ScaffoldStatus}
        durationInFrames={75 * FPS}
        fps={FPS}
        width={LAYOUT.vertical.width}
        height={LAYOUT.vertical.height}
        defaultProps={{ label: "VERTICAL4X5" }}
      />
      <Composition
        id="AnsumanaTest"
        component={ScaffoldStatus}
        durationInFrames={10 * FPS}
        fps={FPS}
        width={LAYOUT.main.width}
        height={LAYOUT.main.height}
        defaultProps={{ label: "ANSUMANA-TEST" }}
      />
    </>
  );
};
