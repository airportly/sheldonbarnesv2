"use client";

/**
 * Interactive hero for the 2026 midterm post ("Aftershock"): a ballot box at
 * the center with the five shocks orbiting it. Each node shows the issue's
 * icon in the circle, its stat on the outside, and links to the section where
 * it is discussed. Styled with the site's theme tokens. Injected via the
 * {{ballot-wheel}} shortcode in src/app/blog/[slug]/page.tsx.
 */

type Node = {
  issue: string;
  stat: string;
  desc: string;
  icon: string;
  href: string;
  angle: number;
};

const NODES: Node[] = [
  { issue: "Tariffs", stat: "64%", desc: "hurt the economy", icon: "/images/aftershock/icons/tariffs_icon.jpg", href: "#the-shocks-they-will-not-forget", angle: -90 },
  { issue: "Iran war", stat: "Gas spike", desc: "Feb 2026", icon: "/images/aftershock/icons/iran_war_icon.jpg", href: "#the-shocks-they-will-not-forget", angle: -18 },
  { issue: "DOGE", stat: "300K", desc: "workers purged", icon: "/images/aftershock/icons/doge_icon.jpg", href: "#the-shocks-they-will-not-forget", angle: 54 },
  { issue: "Immigration", stat: "68%", desc: "no record", icon: "/images/aftershock/icons/immigration_icon.jpg", href: "#when-the-state-joined-in", angle: 126 },
  { issue: "Surveillance", stat: "4K+", desc: "ICE lookups", icon: "/images/aftershock/icons/surveillance_icon.jpg", href: "#the-surveillance-edge", angle: 198 },
];

const CX = 500;
const CY = 410;
const R = 235;
const r = 66;

function pos(angle: number) {
  const a = (angle * Math.PI) / 180;
  return { x: CX + R * Math.cos(a), y: CY + R * Math.sin(a) };
}

export default function BallotWheel() {
  return (
    <section aria-label="The five shocks that converged on the 2026 vote" className="not-prose my-10">
      <style>{`
        .bw a { text-decoration: none; cursor: pointer; }
        .bw .bw-lift { transition: transform .18s ease; }
        .bw .bw-ring { transition: stroke .18s ease, filter .18s ease; }
        .bw a:hover .bw-lift, .bw a:focus-visible .bw-lift { transform: translateY(-4px); }
        .bw a:hover .bw-ring, .bw a:focus-visible .bw-ring { stroke: #f59e4b; filter: drop-shadow(0 0 10px rgba(232,112,26,.55)); }
        .bw a:focus-visible { outline: none; }
      `}</style>
      <div className="bw mx-auto w-full" style={{ maxWidth: 760 }}>
        <svg viewBox="0 0 1000 780" className="h-auto w-full" role="img" aria-label="Ballot box ringed by five shocks, each a link to its section">
          <text x="500" y="46" textAnchor="middle" fontSize="36" fontWeight="700" letterSpacing="3">
            <tspan fill="#f4f4f2">AFTER</tspan>
            <tspan fill="#e8701a">SHOCK</tspan>
          </text>

          <circle cx={CX} cy={CY} r={R} fill="none" stroke="#2a2f33" strokeWidth={2} strokeDasharray="3 9" />

          {NODES.map((n) => {
            const p = pos(n.angle);
            return <line key={"l" + n.issue} x1={p.x} y1={p.y} x2={CX} y2={CY} stroke="#e8701a" strokeWidth={2} opacity={0.3} />;
          })}

          {/* ballot box */}
          <g>
            <rect x={CX - 62} y={CY - 44} width={124} height={90} rx={11} fill="#22262a" stroke="#e8701a" strokeWidth={3} />
            <rect x={CX - 44} y={CY - 52} width={88} height={14} rx={5} fill="#0e1012" stroke="#e8701a" strokeWidth={2} />
            <g transform={`rotate(-12 ${CX} ${CY - 58})`}>
              <rect x={CX - 34} y={CY - 76} width={68} height={34} rx={4} fill="#f4f4f2" />
              <path d={`M${CX - 20} ${CY - 59} l8 8 l16 -18`} fill="none" stroke="#e8701a" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
            </g>
            <text x={CX} y={CY + 28} textAnchor="middle" fill="#e8701a" fontSize="22" fontWeight="700" letterSpacing="2">2026</text>
          </g>

          {/* nodes: icon inside, stat outside */}
          {NODES.map((n, i) => {
            const p = pos(n.angle);
            const oy = p.y + r + 32;
            const rid = r - 4;
            return (
              <a key={n.issue} href={n.href} aria-label={`${n.issue}, ${n.stat} ${n.desc}: jump to this section`}>
                <title>{`Jump to ${n.issue}`}</title>
                <g className="bw-lift">
                  <clipPath id={`bwclip${i}`}>
                    <circle cx={p.x} cy={p.y} r={rid} />
                  </clipPath>
                  <image href={n.icon} x={p.x - rid} y={p.y - rid} width={rid * 2} height={rid * 2} clipPath={`url(#bwclip${i})`} preserveAspectRatio="xMidYMid slice" />
                  <circle className="bw-ring" cx={p.x} cy={p.y} r={r} fill="none" stroke="#e8701a" strokeWidth={3} />
                </g>
                <text x={p.x} y={oy} textAnchor="middle">
                  <tspan fill="#e8701a" fontSize="23" fontWeight="700">{n.stat}</tspan>
                  <tspan fill="#9aa0a3" fontSize="15" dx="5">{n.desc}</tspan>
                </text>
              </a>
            );
          })}
        </svg>
        <p className="mt-2 text-center text-sm text-muted">Tap an issue to jump to where it is discussed.</p>
      </div>
    </section>
  );
}
