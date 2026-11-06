import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { Backdrop } from "../components/Backdrop";
import { COLORS, TYPE } from "../theme";
import { TOTALS, SCOTUS, CASES, AS_OF } from "../data/loader";

/**
 * Placeholder shown by every composition until the Phase 2 globe + beat
 * systems land. It proves the toolchain, theme, and data loader all resolve:
 * the counters below are read live from routes.json / animation-cases.json.
 * Replace the <ScaffoldStatus/> body with the real timeline in Phase 2+.
 */
export const ScaffoldStatus: React.FC<{ label: string }> = ({ label }) => {
  const frame = useCurrentFrame();
  const blink = interpolate(frame % 60, [0, 30, 60], [1, 0.25, 1]);

  const lines = [
    `COMPOSITION  ${label}`,
    `DATA AS OF   ${AS_OF}`,
    `PEOPLE       ${TOTALS.people.toLocaleString()}`,
    `DESTINATIONS ${TOTALS.destinations}`,
    `HOME CTRYS   ${TOTALS.homeCountries}`,
    `ROUTES       ${TOTALS.routes}`,
    `CASES LOADED ${CASES.length}  (${CASES.filter((c) => c.role === "main").length} MAIN / ${CASES.filter((c) => c.role === "rapid").length} RAPID)`,
    `SCOTUS ARG   ${SCOTUS.argument}  ·  ${SCOTUS.caseName} NO. ${SCOTUS.docket}`,
  ];

  return (
    <Backdrop>
      <AbsoluteFill
        style={{
          justifyContent: "center",
          paddingLeft: 120,
          color: COLORS.grey200,
          ...TYPE.label,
          fontSize: TYPE.sizes.body,
          lineHeight: 2,
        }}
      >
        <div style={{ color: COLORS.white, marginBottom: 24, opacity: blink }}>
          THIRD COUNTRY / REMOVAL TRACE — SCAFFOLD OK
        </div>
        {lines.map((l) => (
          <div key={l}>{l}</div>
        ))}
        <div style={{ color: COLORS.grey400, marginTop: 24 }}>
          PHASE 1 COMPLETE · GLOBE + BEATS ARRIVE IN PHASE 2
        </div>
      </AbsoluteFill>
    </Backdrop>
  );
};
