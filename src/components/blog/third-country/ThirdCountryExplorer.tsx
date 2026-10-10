"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import geo from "@/data/bond-split/circuit-geo.json";
import data from "@/data/third-country/circuits.json";
import Cite, { type CiteSegments } from "../bond-split/Cite";

/**
 * Interactive circuit map for third country removals (DHS v. D.V.D., No. 26-426).
 *
 * Reuses the bond split geometry (states merged by circuit from us-atlas) and
 * the same slab treatment as CircuitExplorer. Two views share one map:
 *   removal  where courts have ruled on DHS's third country procedures, with
 *            striped fills for circuits that have only district court rulings
 *   juris    the 8 U.S.C. 1252(g) disagreement behind Question 1
 * Case data lives in src/data/third-country/circuits.json.
 */

type View = "removal" | "juris";
type RemovalStatus = "merits" | "access" | "district" | "denied" | "filings" | "none";
type JurisStatus = "allows" | "exercised" | "rejects" | "none";

interface CaseItem {
  name: string;
  bluebook: CiteSegments | null;
  holding: string;
  meta?: [string, string][];
  links?: { label: string; url: string }[];
}

interface Circuit {
  circuit: string;
  label: number[];
  removal: { status: RemovalStatus; appellate?: CaseItem[]; district?: CaseItem[]; earlier?: CaseItem[]; note?: string };
  juris: { status: JurisStatus; items?: CaseItem[]; note?: string };
}

interface Geo {
  viewBox: string;
  circuits: Record<string, { d: string }>;
  stateMesh: string;
  circuitMesh: string;
  nation: string;
  dc: number[];
  insets: { label: string; box: number[][]; shapes: { id: string; circuit: string; d: string }[] }[];
}

interface TEvent {
  date: string;
  approx?: string;
  kind: "policy" | "district" | "circuit" | "scotus";
  label: string;
  circuit?: string;
  future?: boolean;
}

interface Data {
  asOf: string;
  scotus: { caseName: string; docket: string; docketUrl: string; qpUrl: string; granted: string; argument: string; questions: string[] };
  quotes: Record<View, { by: string; role: string; text: string; cite: CiteSegments }>;
  circuits: Circuit[];
  timeline: TEvent[];
}

const G = geo as unknown as Geo;
const D = data as unknown as Data;
const BY_ID: Record<string, Circuit> = Object.fromEntries(D.circuits.map((c) => [c.circuit, c]));
const CERT_CIRCUIT = "1";
const CERT_RING = "#f5c451";

// Same validated family as the bond map: blue for the courts that reached the
// claim, orange for the opposite answer, neutral grey for no ruling.
const BLUE = { top: "#4f8fd6", side: "#22405f", hover: "#6aa3e3" };
const ORANGE = { top: "#dd6814", side: "#6a320b", hover: "#ec8136" };
const VIOLET = { top: "#9a86e0", side: "#3f3466", hover: "#ad9ce8" };
const GREY = { top: "#5b6066", side: "#33373b", hover: "#70757b" };

interface Style {
  top: string; // fill: a color or a pattern url
  swatch: string; // CSS background for chips and legend keys
  side: string;
  hover: string;
  label: string;
}

const HATCH_BLUE = "repeating-linear-gradient(45deg,#4f8fd6 0 2px,#22405f 2px 6px)";
const HATCH_ORANGE = "repeating-linear-gradient(45deg,#dd6814 0 2px,#6a320b 2px 6px)";
const DOTS_GREY = "radial-gradient(circle,#9ca3af 1.2px,#3a3d3e 1.5px) 0 0/6px 6px";

const STYLES: { removal: Record<RemovalStatus, Style>; juris: Record<JurisStatus, Style> } = {
  removal: {
    merits: { top: BLUE.top, swatch: BLUE.top, side: BLUE.side, hover: BLUE.hover, label: "Court of appeals ruled on the policy" },
    access: { top: VIOLET.top, swatch: VIOLET.top, side: VIOLET.side, hover: VIOLET.hover, label: "Court of appeals ruled on court access, plus district relief" },
    district: { top: "url(#tc-hatch-blue)", swatch: HATCH_BLUE, side: BLUE.side, hover: "url(#tc-hatch-blue-h)", label: "No appellate opinion; district courts stopped individual removals" },
    denied: { top: "url(#tc-hatch-orange)", swatch: HATCH_ORANGE, side: ORANGE.side, hover: "url(#tc-hatch-orange)", label: "No appellate opinion; district court denied relief" },
    filings: { top: "url(#tc-dots)", swatch: DOTS_GREY, side: GREY.side, hover: "url(#tc-dots)", label: "Petitions pending; no ruling found" },
    none: { top: GREY.top, swatch: GREY.top, side: GREY.side, hover: GREY.hover, label: "No ruling found" },
  },
  juris: {
    allows: { top: BLUE.top, swatch: BLUE.top, side: BLUE.side, hover: BLUE.hover, label: "§ 1252(g) does not bar “legal authority” challenges" },
    exercised: { top: "url(#tc-hatch-blue)", swatch: HATCH_BLUE, side: BLUE.side, hover: "url(#tc-hatch-blue-h)", label: "Exercised jurisdiction in D.V.D." },
    rejects: { top: ORANGE.top, swatch: ORANGE.top, side: ORANGE.side, hover: ORANGE.hover, label: "Rejects that reading of § 1252(g)" },
    none: { top: GREY.top, swatch: GREY.top, side: GREY.side, hover: GREY.hover, label: "Not counted in the Ibarra-Perez debate" },
  },
};

const VIEW_COPY: Record<View, { tab: string; sub: string; stats: { value: string; label: string; swatch: string; ring?: boolean }[] }> = {
  removal: {
    tab: "Removal procedures",
    sub: "Where courts have ruled on how DHS sends people to countries not named in their removal orders. Solid fill means a court of appeals; striped fill means only district courts. Select a circuit for the cases.",
    stats: [
      { value: "1", label: "court of appeals has ruled on the policy (1st)", swatch: BLUE.top },
      { value: "3", label: "circuits with no appellate opinion where district courts stopped removals", swatch: HATCH_BLUE },
      { value: "Dec. 9", label: "argument in DHS v. D.V.D.", swatch: CERT_RING, ring: true },
    ],
  },
  juris: {
    tab: "Can courts hear it? § 1252(g)",
    sub: "Question 1 asks whether the district court had jurisdiction at all. The live disagreement is over 8 U.S.C. § 1252(g), which bars claims “arising from” a decision to execute a removal order. The Ninth Circuit reads it narrowly; the circuits in orange read it broadly. Most of those cases predate the third country policy.",
    stats: [
      { value: "1", label: "circuit reads § 1252(g) to allow these claims (9th)", swatch: BLUE.top },
      { value: "4", label: "circuits reject that reading (3rd, 7th, 8th, 11th)", swatch: ORANGE.top },
      { value: "Oct. 23", label: "SG deadline to seek review of Ibarra-Perez", swatch: CERT_RING, ring: true },
    ],
  },
};

function styleFor(view: View, c: string): Style {
  const info = BY_ID[c];
  return view === "removal" ? STYLES.removal[info.removal.status] : STYLES.juris[info.juris.status];
}

function ordinal(c: string): string {
  if (c === "DC") return "D.C.";
  const n = Number(c);
  const s = n === 1 ? "st" : n === 2 ? "nd" : n === 3 ? "rd" : "th";
  return `${n}${s}`;
}

function fmtDate(iso: string): string {
  return new Date(iso + "T12:00:00Z").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
}

function fmtShort(iso: string): string {
  return new Date(iso + "T12:00:00Z").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
}

const DRAW_ORDER = ["9", "10", "8", "5", "7", "6", "11", "4", "3", "2", "1"];
const CHIP_ORDER = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "DC"];

export default function ThirdCountryExplorer() {
  const [view, setView] = useState<View>("removal");
  const [selected, setSelected] = useState<string>(CERT_CIRCUIT);
  const [hover, setHover] = useState<string | null>(null);

  const order = useMemo(() => {
    const rest = DRAW_ORDER.filter((c) => c !== selected);
    return selected !== "DC" ? [...rest, selected] : DRAW_ORDER;
  }, [selected]);

  const usedStatuses = useMemo(() => {
    const set = new Set(D.circuits.map((c) => (view === "removal" ? c.removal.status : c.juris.status)));
    const all = Object.keys(STYLES[view]);
    return all.filter((k) => set.has(k as never));
  }, [view]);

  const sel = BY_ID[selected];
  const copy = VIEW_COPY[view];
  const select = (c: string) => setSelected(c);
  const onKey = (c: string) => (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      select(c);
    }
  };
  const dcStyle = styleFor(view, "DC");

  return (
    <div className="not-prose my-10 rounded-2xl border border-surface-light bg-surface p-5 md:p-8">
      {/* Header */}
      <div className="mb-5">
        <p className="text-xs font-mono uppercase tracking-widest text-primary mb-1">Interactive map</p>
        <h3 className="text-xl md:text-2xl font-bold text-foreground">Where each circuit stands</h3>
        <p className="text-sm text-muted mt-1">Status as of {fmtDate(D.asOf)}. Select a circuit to see its cases.</p>
      </div>

      {/* View tabs */}
      <div className="mb-4 inline-flex flex-wrap gap-1 rounded-full border border-surface-light bg-background p-1" role="tablist" aria-label="Map view">
        {(["removal", "juris"] as View[]).map((v) => (
          <button
            key={v}
            type="button"
            role="tab"
            aria-selected={view === v}
            onClick={() => setView(v)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              view === v ? "bg-surface-light text-foreground" : "text-muted hover:text-foreground"
            }`}
          >
            {VIEW_COPY[v].tab}
          </button>
        ))}
      </div>
      <p className="text-sm text-muted mb-4 max-w-3xl">{copy.sub}</p>

      {/* Summary figures */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {copy.stats.map((s) => (
          <Stat key={s.label} {...s} />
        ))}
      </div>

      {/* Signature quote for the view */}
      <QuoteBanner view={view} />

      {/* Map */}
      <div className="rounded-xl border border-surface-light bg-background p-2 md:p-3">
        <svg viewBox={G.viewBox} className="w-full h-auto select-none" role="group" aria-label="Map of the federal judicial circuits colored by third country removal rulings">
          <defs>
            <filter id="tc-lift" x="-10%" y="-10%" width="120%" height="130%">
              <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#000" floodOpacity="0.55" />
            </filter>
            <Hatch id="tc-hatch-blue" line={BLUE.top} bg={BLUE.side} />
            <Hatch id="tc-hatch-blue-h" line={BLUE.hover} bg="#2b4f75" />
            <Hatch id="tc-hatch-orange" line={ORANGE.top} bg={ORANGE.side} />
            <pattern id="tc-dots" patternUnits="userSpaceOnUse" width="9" height="9">
              <rect width="9" height="9" fill="#3a3d3e" />
              <circle cx="4.5" cy="4.5" r="1.6" fill="#9ca3af" />
            </pattern>
          </defs>

          <path d={G.nation} transform="translate(0,12)" fill="none" stroke="#000" strokeOpacity="0.35" strokeWidth="10" strokeLinejoin="round" />

          {order.map((c) => {
            const s = styleFor(view, c);
            const isSel = selected === c;
            const isHover = hover === c;
            const lift = isSel ? -10 : isHover ? -4 : 0;
            const d = G.circuits[c].d;
            return (
              <g
                key={c}
                role="button"
                tabIndex={0}
                aria-pressed={isSel}
                aria-label={`${ordinal(c)} Circuit: ${s.label}`}
                onClick={() => select(c)}
                onKeyDown={onKey(c)}
                onPointerEnter={() => setHover(c)}
                onPointerLeave={() => setHover((h) => (h === c ? null : h))}
                className="cursor-pointer outline-none focus-visible:[&>path:last-of-type]:stroke-white"
              >
                {[8, 6, 4, 2].map((dy) => (
                  <path key={dy} d={d} transform={`translate(0,${dy + lift})`} fill={s.side} stroke={s.side} strokeWidth="2" strokeLinejoin="round" />
                ))}
                <path
                  d={d}
                  transform={`translate(0,${lift})`}
                  fill={isHover && !isSel ? s.hover : s.top}
                  stroke={c === CERT_CIRCUIT ? CERT_RING : isSel ? "#ffffff" : "#1a1d1e"}
                  strokeWidth={c === CERT_CIRCUIT ? 3 : isSel ? 2 : 1}
                  strokeLinejoin="round"
                  filter={isSel ? "url(#tc-lift)" : undefined}
                  style={{ transition: "transform 180ms ease" }}
                />
              </g>
            );
          })}

          <path d={G.stateMesh} fill="none" stroke="#ffffff" strokeOpacity="0.22" strokeWidth="0.6" pointerEvents="none" />
          <path d={G.circuitMesh} fill="none" stroke="#1a1d1e" strokeWidth="1.6" strokeLinejoin="round" pointerEvents="none" />

          {/* D.C. Circuit marker, filled with its status */}
          <g
            role="button"
            tabIndex={0}
            aria-pressed={selected === "DC"}
            aria-label={`D.C. Circuit: ${dcStyle.label}`}
            onClick={() => select("DC")}
            onKeyDown={onKey("DC")}
            className="cursor-pointer outline-none"
          >
            <line x1={G.dc[0]} y1={G.dc[1]} x2={BY_ID.DC.label[0] - 22} y2={BY_ID.DC.label[1]} stroke="#9ca3af" strokeWidth="1" />
            <circle cx={G.dc[0]} cy={G.dc[1]} r={4} fill={GREY.hover} stroke="#1a1d1e" strokeWidth="2" />
            <circle
              cx={BY_ID.DC.label[0]}
              cy={BY_ID.DC.label[1]}
              r={22}
              fill={dcStyle.top}
              stroke={selected === "DC" ? "#ffffff" : "#1a1d1e"}
              strokeWidth={selected === "DC" ? 2.5 : 1.5}
            />
            <Badge x={BY_ID.DC.label[0]} y={BY_ID.DC.label[1]} text="D.C." active={selected === "DC"} wide />
          </g>

          {/* Territories */}
          {G.insets.map((ins) => (
            <g key={ins.label}>
              <rect
                x={ins.box[0][0] - 6}
                y={ins.box[0][1] - 6}
                width={ins.box[1][0] - ins.box[0][0] + 12}
                height={ins.box[1][1] - ins.box[0][1] + 12}
                rx={6}
                fill="none"
                stroke="#3a3d3e"
                strokeWidth={1}
              />
              {ins.shapes.map((s) => (
                <path
                  key={s.id}
                  d={s.d}
                  fill={styleFor(view, s.circuit).top}
                  stroke={s.circuit === CERT_CIRCUIT ? CERT_RING : "#1a1d1e"}
                  strokeWidth="0.8"
                  className="cursor-pointer"
                  onClick={() => select(s.circuit)}
                />
              ))}
            </g>
          ))}
          <text x={926} y={612} textAnchor="middle" fontSize="15" fill="#9ca3af">P.R. (1st), V.I. (3rd)</text>
          <text x={644} y={600} textAnchor="start" fontSize="15" fill="#9ca3af">Guam, N.M.I. (9th)</text>

          {DRAW_ORDER.map((c) => {
            const lift = selected === c ? -10 : hover === c ? -4 : 0;
            return (
              <g key={`b${c}`} pointerEvents="none" style={{ transition: "transform 180ms ease" }} transform={`translate(0,${lift})`}>
                <Badge x={BY_ID[c].label[0]} y={BY_ID[c].label[1]} text={ordinal(c)} active={selected === c} cert={c === CERT_CIRCUIT} />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4 text-xs text-muted">
        {usedStatuses.map((k) => {
          const s = (STYLES[view] as Record<string, Style>)[k];
          return <LegendKey key={k} swatch={s.swatch} label={s.label} />;
        })}
        <LegendKey swatch="transparent" ring={CERT_RING} label="Certiorari granted (1st Cir. case)" />
      </div>

      {/* Circuit chips */}
      <div className="mt-5 flex flex-wrap gap-2" role="tablist" aria-label="Choose a circuit">
        {CHIP_ORDER.map((c) => {
          const s = styleFor(view, c);
          const active = selected === c;
          return (
            <button
              key={c}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => select(c)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-colors ${
                active ? "border-foreground text-foreground bg-surface-light" : "border-surface-light text-muted hover:border-muted hover:text-foreground"
              }`}
            >
              <span
                className="inline-block w-2.5 h-2.5 rounded-full"
                style={{ background: s.swatch, boxShadow: c === CERT_CIRCUIT ? `0 0 0 2px ${CERT_RING}` : undefined }}
              />
              {ordinal(c)}
            </button>
          );
        })}
      </div>

      {sel && <Detail c={sel} view={view} />}

      <Timeline selected={selected} onSelect={select} />

      <p className="text-[11px] text-muted mt-5 leading-relaxed">
        Sources: opinions of the U.S. Courts of Appeals; district court orders and government filings from Habeas Dockets and CourtListener; the
        Ninth Circuit&rsquo;s June 25, 2026 order denying rehearing en banc in Ibarra-Perez, whose statements identify the circuits on each side of
        the § 1252(g) question; Supreme Court docket No. 26-426. A circuit is striped only where I found a written district court ruling or order;
        &ldquo;no ruling found&rdquo; does not mean none exists. Circuit boundaries drawn by state from U.S. Census Bureau geometry (us-atlas).
      </p>
    </div>
  );
}

function Hatch({ id, line, bg }: { id: string; line: string; bg: string }) {
  return (
    <pattern id={id} patternUnits="userSpaceOnUse" width="9" height="9" patternTransform="rotate(45)">
      <rect width="9" height="9" fill={bg} />
      <line x1="0" y1="0" x2="0" y2="9" stroke={line} strokeWidth="4" />
    </pattern>
  );
}

function Badge({ x, y, text, active, cert, wide }: { x: number; y: number; text: string; active?: boolean; cert?: boolean; wide?: boolean }) {
  const w = wide || text.length > 3 ? 40 : 34;
  return (
    <g>
      <rect
        x={x - w / 2}
        y={y - 12}
        width={w}
        height={24}
        rx={12}
        fill={active ? "#ededed" : "#1a1d1e"}
        fillOpacity={active ? 1 : 0.85}
        stroke={cert ? CERT_RING : active ? "#ededed" : "#3a3d3e"}
        strokeWidth={cert ? 2 : 1}
      />
      <text x={x} y={y + 4.5} textAnchor="middle" fontSize="13" fontWeight={700} fill={active ? "#1a1d1e" : "#ededed"}>
        {text}
      </text>
    </g>
  );
}

function Stat({ value, label, swatch, ring }: { value: string; label: string; swatch: string; ring?: boolean }) {
  return (
    <div className="rounded-lg border border-surface-light bg-background p-3 min-w-0">
      <div className="flex items-center gap-2">
        <span
          className="inline-block w-3 h-3 rounded-sm shrink-0"
          style={ring ? { boxShadow: `inset 0 0 0 2px ${swatch}` } : { background: swatch }}
        />
        <span className="text-xl md:text-3xl font-semibold text-foreground leading-none whitespace-nowrap">{value}</span>
      </div>
      <p className="text-[11px] md:text-xs text-muted mt-1.5 leading-snug">{label}</p>
    </div>
  );
}

function LegendKey({ swatch, label, ring }: { swatch: string; label: string; ring?: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="inline-block w-3.5 h-3.5 rounded-sm" style={{ background: swatch, boxShadow: ring ? `inset 0 0 0 2px ${ring}` : undefined }} />
      {label}
    </span>
  );
}

function LinkButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-surface-light text-xs text-foreground hover:border-primary hover:text-primary transition-colors"
    >
      {children}
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M7 17L17 7M9 7h8v8" />
      </svg>
    </a>
  );
}

function Section({ title, items }: { title: string; items?: CaseItem[] }) {
  if (!items || !items.length) return null;
  return (
    <div className="mt-4">
      <p className="text-[11px] font-mono uppercase tracking-wider text-muted border-b border-surface-light pb-1.5 mb-3">{title}</p>
      <div className="space-y-4">
        {items.map((it) => (
          <CaseCard key={it.name} it={it} />
        ))}
      </div>
    </div>
  );
}

function CaseCard({ it }: { it: CaseItem }) {
  return (
    <div>
      <p className="text-base text-foreground font-semibold">
        <em>{it.name}</em>
      </p>
      {it.bluebook && (
        <p className="text-xs text-muted mt-1">
          <Cite segs={it.bluebook} />
        </p>
      )}
      <p className="text-sm text-foreground leading-relaxed mt-2">{it.holding}</p>
      {it.meta && (
        <dl className="mt-2">
          {it.meta.map(([k, v]) => (
            <div key={k} className="grid grid-cols-1 sm:grid-cols-[110px_1fr] gap-1 sm:gap-3 py-1.5 border-t border-surface-light first:border-t-0">
              <dt className="text-[11px] font-mono uppercase tracking-wider text-muted pt-0.5">{k}</dt>
              <dd className="text-sm text-foreground leading-relaxed">{v}</dd>
            </div>
          ))}
        </dl>
      )}
      {it.links && (
        <div className="flex flex-wrap gap-2 mt-3">
          {it.links.map((l) => (
            <LinkButton key={l.url} href={l.url}>
              {l.label}
            </LinkButton>
          ))}
        </div>
      )}
    </div>
  );
}

function Detail({ c, view }: { c: Circuit; view: View }) {
  const s = styleFor(view, c.circuit);
  const isCert = c.circuit === CERT_CIRCUIT;
  const title = c.circuit === "DC" ? "D.C. Circuit" : `${ordinal(c.circuit)} Circuit`;
  return (
    <div className="mt-5 rounded-xl border border-surface-light bg-background p-4 md:p-5" aria-live="polite">
      <div className="flex flex-wrap items-center gap-2 mb-1">
        <h4 className="text-lg font-bold text-foreground mr-1">{title}</h4>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-surface-light text-[11px] text-foreground">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: s.swatch }} />
          {s.label}
        </span>
        {isCert && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-background" style={{ background: CERT_RING }}>
            Certiorari granted
          </span>
        )}
      </div>

      {view === "removal" ? (
        <>
          <Section title="Court of appeals" items={c.removal.appellate} />
          <Section title="District courts" items={c.removal.district} />
          {c.removal.note && <p className="text-sm text-muted mt-4">{c.removal.note}</p>}
          <Section title="Earlier circuit law on notice" items={c.removal.earlier} />
        </>
      ) : (
        <>
          <Section title="Controlling decisions" items={c.juris.items} />
          {c.juris.note && <p className="text-sm text-muted mt-4">{c.juris.note}</p>}
        </>
      )}

      {isCert && (
        <div className="mt-5 rounded-lg border p-3 md:p-4" style={{ borderColor: CERT_RING }}>
          <p className="text-[11px] font-mono uppercase tracking-wider mb-1" style={{ color: CERT_RING }}>
            At the Supreme Court
          </p>
          <p className="text-sm text-foreground">
            <em>{D.scotus.caseName}</em>, No. {D.scotus.docket}. Judgment stayed and certiorari granted {fmtDate(D.scotus.granted)}. Argument{" "}
            {fmtDate(D.scotus.argument)}. The Court directed the parties to brief:
          </p>
          <ol className="list-decimal pl-5 mt-2 space-y-1 text-sm text-muted italic">
            {D.scotus.questions.map((q) => (
              <li key={q}>&ldquo;{q}&rdquo;</li>
            ))}
          </ol>
          <div className="flex flex-wrap gap-2 mt-3">
            <LinkButton href={D.scotus.docketUrl}>Supreme Court docket</LinkButton>
            <LinkButton href={D.scotus.qpUrl}>Questions presented</LinkButton>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- timeline */

const T0 = Date.parse("2025-03-01");
const T1 = Date.parse("2026-12-31");

function Timeline({ selected, onSelect }: { selected: string; onSelect: (c: string) => void }) {
  const [focus, setFocus] = useState<number | null>(null);
  const W = 1000;
  const H = 110;
  const x = (iso: string) => 20 + ((Date.parse(iso) - T0) / (T1 - T0)) * (W - 40);
  const events = D.timeline;

  const placed = useMemo(() => {
    const out: { e: TEvent; cx: number; level: number }[] = [];
    for (const e of events) {
      const cx = x(e.date);
      let level = 0;
      while (out.some((p) => p.level === level && Math.abs(p.cx - cx) < 16)) level++;
      out.push({ e, cx, level });
    }
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const color = (k: TEvent["kind"]) =>
    k === "circuit" ? BLUE.top : k === "district" ? "#2b4f75" : k === "scotus" ? CERT_RING : "#9ca3af";

  const shown =
    focus !== null ? placed[focus].e : placed.map((p) => p.e).filter((e) => e.circuit === selected && !e.future).slice(-1)[0] ?? null;

  const months = ["2025-04", "2025-07", "2025-10", "2026-01", "2026-04", "2026-07", "2026-10"];
  const today = x("2026-10-10");

  return (
    <div className="mt-6">
      <p className="text-xs font-mono uppercase tracking-widest text-muted mb-2">Timeline</p>
      <div className="hidden sm:block rounded-xl border border-surface-light bg-background px-2 pt-2 pb-1">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="list" aria-label="Timeline of the litigation">
          <line x1={20} x2={W - 20} y1={80} y2={80} stroke="#3a3d3e" strokeWidth="1" />
          <line x1={today} x2={today} y1={22} y2={88} stroke="#9ca3af" strokeDasharray="3 3" />
          <text x={today + 4} y={20} fontSize="12" fill="#9ca3af">Today</text>
          {months.map((m) => (
            <g key={m}>
              <line x1={x(m + "-01")} x2={x(m + "-01")} y1={76} y2={84} stroke="#3a3d3e" />
              <text x={x(m + "-01")} y={102} textAnchor="middle" fontSize="15" fill="#9ca3af">
                {new Date(m + "-15T12:00:00Z").toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" })}
              </text>
            </g>
          ))}
          {placed.map((p, i) => {
            const isSel = p.e.circuit === selected && !p.e.future;
            const cy = 80 - p.level * 18;
            return (
              <g
                key={i}
                role="listitem"
                tabIndex={0}
                aria-label={`${p.e.approx ?? fmtDate(p.e.date)}: ${p.e.label}`}
                className="cursor-pointer outline-none"
                onPointerEnter={() => setFocus(i)}
                onPointerLeave={() => setFocus(null)}
                onFocus={() => setFocus(i)}
                onBlur={() => setFocus(null)}
                onClick={() => p.e.circuit && onSelect(p.e.circuit)}
                onKeyDown={(ev) => {
                  if ((ev.key === "Enter" || ev.key === " ") && p.e.circuit) {
                    ev.preventDefault();
                    onSelect(p.e.circuit);
                  }
                }}
              >
                <circle cx={p.cx} cy={cy} r={14} fill="transparent" />
                <circle
                  cx={p.cx}
                  cy={cy}
                  r={isSel || focus === i ? 8 : 6}
                  fill={p.e.future ? "#1a1d1e" : color(p.e.kind)}
                  stroke={p.e.future ? color(p.e.kind) : isSel ? "#ffffff" : p.e.kind === "district" ? BLUE.top : "#1a1d1e"}
                  strokeWidth={2}
                  strokeDasharray={p.e.future ? "3 2" : undefined}
                />
              </g>
            );
          })}
        </svg>
      </div>
      <ol className="sm:hidden rounded-xl border border-surface-light bg-background divide-y divide-surface-light">
        {placed.map((p, i) => {
          const isSel = p.e.circuit === selected && !p.e.future;
          return (
            <li key={i}>
              <button
                type="button"
                disabled={!p.e.circuit}
                onClick={() => p.e.circuit && onSelect(p.e.circuit)}
                className={`w-full flex items-start gap-3 px-3 py-2 text-left text-xs ${isSel ? "bg-surface-light" : ""}`}
              >
                <span
                  className="mt-1 inline-block w-2.5 h-2.5 rounded-full shrink-0"
                  style={p.e.future ? { boxShadow: `inset 0 0 0 1.5px ${color(p.e.kind)}` } : { background: color(p.e.kind) }}
                />
                <span className="text-muted w-20 shrink-0">{p.e.approx ?? fmtShort(p.e.date)}</span>
                <span className="text-foreground">{p.e.label}</span>
              </button>
            </li>
          );
        })}
      </ol>
      <p className="hidden sm:block text-sm text-foreground mt-2 min-h-[2.75rem]">
        {shown ? (
          <>
            <span className="text-muted">{shown.approx ?? fmtDate(shown.date)}. </span>
            {shown.label}
          </>
        ) : (
          <span className="text-muted">Hover or tab through the dots; court events select that circuit on the map.</span>
        )}
      </p>
      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 sm:mt-0 text-[11px] text-muted">
        <LegendDot color="#9ca3af" label="Executive action" />
        <LegendDot color="#2b4f75" ring={BLUE.top} label="District court" />
        <LegendDot color={BLUE.top} label="Court of appeals" />
        <LegendDot color={CERT_RING} label="Supreme Court" />
        <LegendDot color="transparent" ring="#9ca3af" label="Scheduled" />
      </div>
    </div>
  );
}

function LegendDot({ color, label, ring }: { color: string; label: string; ring?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: color, boxShadow: ring ? `inset 0 0 0 1.5px ${ring}` : undefined }} />
      {label}
    </span>
  );
}

/* ------------------------------------------------------------ quote banner */

function QuoteBanner({ view }: { view: View }) {
  const q = D.quotes[view];
  const bar = BLUE.top;
  return (
    <div className="mb-5 rounded-xl border border-surface-light bg-background p-4 md:p-6">
      <div className="flex gap-4">
        <span className="w-1 rounded-full shrink-0 transition-colors" style={{ background: bar }} aria-hidden />
        <div className="min-w-0 flex-1">
          <AnimatePresence mode="wait">
            <motion.figure key={view} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.22 }}>
              <blockquote className="relative text-base md:text-xl leading-snug text-foreground font-medium">
                <span className="text-primary" aria-hidden>&ldquo;</span>
                {q.text}
                <span className="text-primary" aria-hidden>&rdquo;</span>
              </blockquote>
              <figcaption className="mt-3 text-xs md:text-sm text-muted">
                Judge {q.by}, {q.role}
                <span className="block mt-1 text-[11px] md:text-xs">
                  <Cite segs={q.cite} />
                </span>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
