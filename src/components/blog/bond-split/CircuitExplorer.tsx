"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import geo from "@/data/bond-split/circuit-geo.json";
import data from "@/data/bond-split/circuits.json";
import Cite, { type CiteSegments } from "./Cite";

/**
 * Interactive circuit map for the INA 235(b) versus 236(a) bond split.
 *
 * Geometry is precomputed from the Census-based us-atlas TopoJSON (states
 * merged by circuit), so this component ships no map library. Each circuit is
 * drawn as a slab: three darker copies offset downward give it depth, and the
 * selected circuit lifts off the page. Case data lives in
 * src/data/bond-split/circuits.json.
 */

type Outcome = "bond" | "mandatory" | "none";

interface Circuit {
  circuit: string;
  outcome: Outcome;
  caption: string | null;
  shortName: string | null;
  docket: string | null;
  citation: string | null;
  date: string | null;
  published: boolean | null;
  panel: string[];
  author: string | null;
  dissent: string | null;
  concurrence: string | null;
  holding: string | null;
  rehearing: string | null;
  links: { court: string | null; courtlistener: string | null; justia: string | null };
  westlaw: string | null;
  bluebook?: CiteSegments;
  label: number[];
  notes?: string | null;
  quotes?: Partial<Record<QuoteKind, { by: string; text: string; cite?: CiteSegments }>> | null;
}

type QuoteKind = "majority" | "dissent" | "concurrence";

interface Geo {
  viewBox: string;
  circuits: Record<string, { d: string }>;
  stateMesh: string;
  circuitMesh: string;
  nation: string;
  dc: number[];
  insets: { label: string; box: number[][]; shapes: { id: string; circuit: string; d: string }[] }[];
}

const G = geo as unknown as Geo;
const CIRCUITS = (data as unknown as { circuits: Circuit[] }).circuits;
const SCOTUS = (data as unknown as { scotus: { caseName: string; docket: string; docketUrl: string; granted: string; questionPresented: string; orderListUrl: string } }).scotus;
const BY_ID: Record<string, Circuit> = Object.fromEntries(CIRCUITS.map((c) => [c.circuit, c]));

const CERT_CIRCUIT = "2";

// Validated against the site's dark surfaces (OKLCH L inside 0.48 to 0.67,
// adjacent CVD separation above 24).
const FILL: Record<Outcome, { top: string; side: string; hover: string }> = {
  bond: { top: "#4f8fd6", side: "#22405f", hover: "#6aa3e3" },
  mandatory: { top: "#dd6814", side: "#6a320b", hover: "#ec8136" },
  none: { top: "#5b6066", side: "#33373b", hover: "#70757b" },
};
const CERT_RING = "#f5c451";

const OUTCOME_LABEL: Record<Outcome, string> = {
  bond: "Bond hearing available",
  mandatory: "Mandatory detention upheld",
  none: "No ruling",
};

function ordinal(c: string): string {
  if (c === "DC") return "D.C.";
  const n = Number(c);
  const s = n === 1 ? "st" : n === 2 ? "nd" : n === 3 ? "rd" : "th";
  return `${n}${s}`;
}

function fmtDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso + "T12:00:00Z").toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

function fmtShort(iso: string): string {
  return new Date(iso + "T12:00:00Z").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
}

const DRAW_ORDER = ["9", "10", "8", "5", "7", "6", "11", "4", "3", "2", "1"];

export default function CircuitExplorer() {
  const [selected, setSelected] = useState<string>(CERT_CIRCUIT);
  const [hover, setHover] = useState<string | null>(null);

  const order = useMemo(() => {
    // Draw the selected circuit last so its lifted slab sits on top.
    const rest = DRAW_ORDER.filter((c) => c !== selected);
    return BY_ID[selected] && selected !== "DC" ? [...rest, selected] : DRAW_ORDER;
  }, [selected]);

  const counts = useMemo(() => {
    const bond = CIRCUITS.filter((c) => c.outcome === "bond").length;
    const mandatory = CIRCUITS.filter((c) => c.outcome === "mandatory").length;
    return { bond, mandatory };
  }, []);

  const sel = BY_ID[selected];

  const select = (c: string) => setSelected(c);
  const onKey = (c: string) => (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      select(c);
    }
  };

  return (
    <div className="not-prose my-10 rounded-2xl border border-surface-light bg-surface p-5 md:p-8">
      {/* Header */}
      <div className="mb-5">
        <p className="text-xs font-mono uppercase tracking-widest text-primary mb-1">Interactive map</p>
        <h3 className="text-xl md:text-2xl font-bold text-foreground">Where each circuit stands</h3>
        <p className="text-sm text-muted mt-1">
          Status as of October 7, 2026. Select a circuit to see its controlling decision.
        </p>
      </div>

      {/* Summary figures */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <Stat value={String(counts.bond)} label="circuits: bond hearing available" swatch={FILL.bond.top} />
        <Stat value={String(counts.mandatory)} label="circuits: mandatory detention upheld" swatch={FILL.mandatory.top} />
        <Stat value="Oct. 1" label="certiorari granted, 2nd Cir. case" swatch={CERT_RING} ring />
      </div>

      {/* Signature quote for the selected circuit */}
      {sel && <QuoteBanner key={sel.circuit} c={sel} />}

      {/* Map */}
      <div className="rounded-xl border border-surface-light bg-background p-2 md:p-3">
        <svg
          viewBox={G.viewBox}
          className="w-full h-auto select-none"
          role="group"
          aria-label="Map of the federal judicial circuits colored by how each ruled on bond hearings"
        >
          <defs>
            <filter id="bs-lift" x="-10%" y="-10%" width="120%" height="130%">
              <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#000" floodOpacity="0.55" />
            </filter>
          </defs>

          {/* Ground shadow under the whole nation */}
          <path d={G.nation} transform="translate(0,12)" fill="none" stroke="#000" strokeOpacity="0.35" strokeWidth="10" strokeLinejoin="round" />

          {order.map((c) => {
            const info = BY_ID[c];
            const outcome = info?.outcome ?? "none";
            const f = FILL[outcome];
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
                aria-label={`${ordinal(c)} Circuit: ${OUTCOME_LABEL[outcome]}${info?.shortName ? `, ${info.shortName}` : ""}`}
                onClick={() => select(c)}
                onKeyDown={onKey(c)}
                onPointerEnter={() => setHover(c)}
                onPointerLeave={() => setHover((h) => (h === c ? null : h))}
                className="cursor-pointer outline-none focus-visible:[&>path:last-of-type]:stroke-white"
              >
                {[8, 6, 4, 2].map((dy) => (
                  <path key={dy} d={d} transform={`translate(0,${dy + lift})`} fill={f.side} stroke={f.side} strokeWidth="2" strokeLinejoin="round" />
                ))}
                <path
                  d={d}
                  transform={`translate(0,${lift})`}
                  fill={isHover && !isSel ? f.hover : f.top}
                  stroke={c === CERT_CIRCUIT ? CERT_RING : isSel ? "#ffffff" : "#1a1d1e"}
                  strokeWidth={c === CERT_CIRCUIT ? 3 : isSel ? 2 : 1}
                  strokeLinejoin="round"
                  filter={isSel ? "url(#bs-lift)" : undefined}
                  style={{ transition: "transform 180ms ease, fill 120ms ease" }}
                />
              </g>
            );
          })}

          {/* State lines inside circuits, then circuit boundaries */}
          <path d={G.stateMesh} fill="none" stroke="#ffffff" strokeOpacity="0.22" strokeWidth="0.6" pointerEvents="none" />
          <path d={G.circuitMesh} fill="none" stroke="#1a1d1e" strokeWidth="1.6" strokeLinejoin="round" pointerEvents="none" />

          {/* D.C. Circuit marker */}
          <g
            role="button"
            tabIndex={0}
            aria-pressed={selected === "DC"}
            aria-label="D.C. Circuit: no ruling on this question"
            onClick={() => select("DC")}
            onKeyDown={onKey("DC")}
            className="cursor-pointer outline-none"
          >
            <line x1={G.dc[0]} y1={G.dc[1]} x2={BY_ID.DC.label[0] - 16} y2={BY_ID.DC.label[1]} stroke="#9ca3af" strokeWidth="1" />
            <circle cx={G.dc[0]} cy={G.dc[1]} r={4} fill={FILL.none.hover} stroke="#1a1d1e" strokeWidth="2" />
            <circle cx={BY_ID.DC.label[0]} cy={BY_ID.DC.label[1]} r={24} fill="transparent" />
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
                  fill={FILL[BY_ID[s.circuit].outcome].top}
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

          {/* Circuit number badges */}
          {DRAW_ORDER.map((c) => {
            const info = BY_ID[c];
            const lift = selected === c ? -10 : hover === c ? -4 : 0;
            return (
              <g key={`b${c}`} pointerEvents="none" style={{ transition: "transform 180ms ease" }} transform={`translate(0,${lift})`}>
                <Badge x={info.label[0]} y={info.label[1]} text={ordinal(c)} active={selected === c} cert={c === CERT_CIRCUIT} />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4 text-xs text-muted">
        <LegendKey color={FILL.bond.top} label="Bond hearing available (circuit rejected mandatory detention)" />
        <LegendKey color={FILL.mandatory.top} label="Mandatory detention upheld" />
        <LegendKey color={FILL.bond.top} ring={CERT_RING} label="Certiorari granted" />
        <LegendKey color={FILL.none.top} label="No ruling" />
      </div>

      {/* Circuit chips: the list view, and the easy target on a phone */}
      <div className="mt-5 flex flex-wrap gap-2" role="tablist" aria-label="Choose a circuit">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "DC"].map((c) => {
          const o = BY_ID[c].outcome;
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
                style={{ background: FILL[o].top, boxShadow: c === CERT_CIRCUIT ? `0 0 0 2px ${CERT_RING}` : undefined }}
              />
              {ordinal(c)}
            </button>
          );
        })}
      </div>

      {/* Detail panel */}
      {sel && <Detail c={sel} />}

      {/* Timeline */}
      <Timeline selected={selected} onSelect={select} />

      <p className="text-[11px] text-muted mt-5 leading-relaxed">
        Sources: published opinions of the U.S. Courts of Appeals, with Bluebook citations and pin cites checked against the Westlaw versions (citations within quotations omitted); Supreme Court docket No. 26-104 and order list of October 1,
        2026. Circuit boundaries drawn by state from U.S. Census Bureau geometry (us-atlas). Puerto Rico sits in the 1st Circuit,
        the U.S. Virgin Islands in the 3rd, and Guam and the Northern Mariana Islands in the 9th.
      </p>
    </div>
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

function LegendKey({ color, label, ring }: { color: string; label: string; ring?: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="inline-block w-3.5 h-3.5 rounded-sm" style={{ background: color, boxShadow: ring ? `0 0 0 2px ${ring}` : undefined }} />
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

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  if (!v) return null;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-1 sm:gap-3 py-2 border-t border-surface-light first:border-t-0">
      <dt className="text-[11px] font-mono uppercase tracking-wider text-muted pt-0.5">{k}</dt>
      <dd className="text-sm text-foreground leading-relaxed">{v}</dd>
    </div>
  );
}

function Detail({ c }: { c: Circuit }) {
  const isCert = c.circuit === CERT_CIRCUIT;
  const title = c.circuit === "DC" ? "D.C. Circuit" : `${ordinal(c.circuit)} Circuit`;
  return (
    <div className="mt-5 rounded-xl border border-surface-light bg-background p-4 md:p-5" aria-live="polite">
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <h4 className="text-lg font-bold text-foreground mr-1">{title}</h4>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-surface-light text-[11px] text-foreground">
          <span className="w-2 h-2 rounded-full" style={{ background: FILL[c.outcome].top }} />
          {OUTCOME_LABEL[c.outcome]}
        </span>
        {isCert && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-background" style={{ background: CERT_RING }}>
            Certiorari granted
          </span>
        )}
      </div>

      {c.shortName ? (
        <p className="text-base text-foreground mb-3">
          <em>{c.shortName}</em>
          {c.citation ? <span className="text-muted">, {c.citation}</span> : null}
        </p>
      ) : null}

      <dl>
        {c.bluebook && <Row k="Citation" v={<Cite segs={c.bluebook} />} />}
        <Row k="Holding" v={c.holding} />
        <Row k="Decided" v={c.date ? fmtDate(c.date) : null} />
        <Row k="Docket" v={c.docket} />
        <Row
          k="Panel"
          v={
            c.panel.length
              ? c.panel.map((j, i) => (
                  <span key={j}>
                    {j}
                    {j === c.author ? <span className="text-muted"> (author)</span> : null}
                    {i < c.panel.length - 1 ? ", " : ""}
                  </span>
                ))
              : null
          }
        />
        <Row k="Dissent" v={c.dissent} />
        <Row k="Concurrence" v={c.concurrence} />
        <Row k="Afterward" v={c.rehearing} />
        {c.circuit === "DC" ? <Row k="Note" v={c.notes} /> : null}
      </dl>

      {isCert && (
        <div className="mt-3 rounded-lg border p-3 md:p-4" style={{ borderColor: CERT_RING }}>
          <p className="text-[11px] font-mono uppercase tracking-wider mb-1" style={{ color: CERT_RING }}>
            At the Supreme Court
          </p>
          <p className="text-sm text-foreground">
            <em>{SCOTUS.caseName}</em>, No. {SCOTUS.docket}. Certiorari granted {fmtDate(SCOTUS.granted)}. The petition
            presents a single, statutory question:
          </p>
          <p className="text-sm text-muted mt-2 italic">&ldquo;{SCOTUS.questionPresented}&rdquo;</p>
          <div className="flex flex-wrap gap-2 mt-3">
            <LinkButton href={SCOTUS.docketUrl}>Supreme Court docket</LinkButton>
            <LinkButton href={SCOTUS.orderListUrl}>Oct. 1 order list</LinkButton>
          </div>
        </div>
      )}

      {c.circuit !== "DC" && (
        <div className="flex flex-wrap gap-2 mt-4">
          {c.links.court && <LinkButton href={c.links.court}>Opinion (court website)</LinkButton>}
          {c.links.justia && <LinkButton href={c.links.justia}>Justia</LinkButton>}
          {c.links.courtlistener && <LinkButton href={c.links.courtlistener}>CourtListener</LinkButton>}
          {c.westlaw ? (
            <LinkButton href={c.westlaw}>Westlaw</LinkButton>
          ) : null}
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- timeline */

interface TEvent {
  date: string;
  label: string;
  circuit?: string;
  kind: "policy" | "bond" | "mandatory" | "scotus";
}

const T_EVENTS: TEvent[] = ([
  { date: "2025-07-08", label: "ICE interim guidance: no bond for applicants for admission", kind: "policy" },
  { date: "2025-09-05", label: "BIA decides Matter of Yajure Hurtado", kind: "policy" },
  ...CIRCUITS.filter((c) => c.date).map((c) => ({
    date: c.date as string,
    label: `${ordinal(c.circuit)} Cir., ${c.shortName}`,
    circuit: c.circuit,
    kind: c.outcome as "bond" | "mandatory",
  })),
  { date: "2026-06-22", label: "Government petitions in the 6th Cir. case (now Putra v. Lopez-Campos)", kind: "scotus" },
  { date: "2026-07-23", label: "Government petitions in the 2nd Cir. case (Rhoney v. Barbosa da Cunha)", kind: "scotus" },
  { date: "2026-10-01", label: "Supreme Court grants certiorari in Rhoney v. Barbosa da Cunha", circuit: "2", kind: "scotus" },
] as TEvent[]).sort((a, b) => (a.date < b.date ? -1 : 1));

const T0 = Date.parse("2025-06-15");
const T1 = Date.parse("2026-10-20");

function Timeline({ selected, onSelect }: { selected: string; onSelect: (c: string) => void }) {
  const [focus, setFocus] = useState<number | null>(null);
  const W = 1000;
  const H = 92;
  const x = (iso: string) => 20 + ((Date.parse(iso) - T0) / (T1 - T0)) * (W - 40);

  // Stack events that land within 12 days of each other.
  const placed = useMemo(() => {
    const out: { e: TEvent; cx: number; level: number }[] = [];
    for (const e of T_EVENTS) {
      const cx = x(e.date);
      let level = 0;
      while (out.some((p) => p.level === level && Math.abs(p.cx - cx) < 16)) level++;
      out.push({ e, cx, level });
    }
    return out;
  }, []);

  const color = (k: TEvent["kind"]) =>
    k === "bond" ? FILL.bond.top : k === "mandatory" ? FILL.mandatory.top : k === "scotus" ? CERT_RING : "#9ca3af";

  const shown =
    focus !== null
      ? placed[focus].e
      : placed.map((p) => p.e).filter((e) => e.circuit === selected).slice(-1)[0] ?? null;

  const months = ["2025-07", "2025-10", "2026-01", "2026-04", "2026-07", "2026-10"];

  return (
    <div className="mt-6">
      <p className="text-xs font-mono uppercase tracking-widest text-muted mb-2">Timeline</p>
      <div className="hidden sm:block rounded-xl border border-surface-light bg-background px-2 pt-2 pb-1">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="list" aria-label="Timeline of the litigation">
          <line x1={20} x2={W - 20} y1={62} y2={62} stroke="#3a3d3e" strokeWidth="1" />
          {months.map((m) => (
            <g key={m}>
              <line x1={x(m + "-01")} x2={x(m + "-01")} y1={58} y2={66} stroke="#3a3d3e" />
              <text x={x(m + "-01")} y={84} textAnchor="middle" fontSize="15" fill="#9ca3af">
                {new Date(m + "-15T12:00:00Z").toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" })}
              </text>
            </g>
          ))}
          {placed.map((p, i) => {
            const isSel = p.e.circuit === selected && p.e.kind !== "scotus";
            const cy = 62 - p.level * 18;
            return (
              <g
                key={i}
                role="listitem"
                tabIndex={0}
                aria-label={`${fmtDate(p.e.date)}: ${p.e.label}`}
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
                  fill={color(p.e.kind)}
                  stroke={isSel ? "#ffffff" : "#1a1d1e"}
                  strokeWidth={2}
                />
              </g>
            );
          })}
        </svg>
      </div>
      <ol className="sm:hidden rounded-xl border border-surface-light bg-background divide-y divide-surface-light">
        {placed.map((p, i) => {
          const isSel = p.e.circuit === selected && p.e.kind !== "scotus";
          return (
            <li key={i}>
              <button
                type="button"
                disabled={!p.e.circuit}
                onClick={() => p.e.circuit && onSelect(p.e.circuit)}
                className={`w-full flex items-start gap-3 px-3 py-2 text-left text-xs ${isSel ? "bg-surface-light" : ""}`}
              >
                <span className="mt-1 inline-block w-2.5 h-2.5 rounded-full shrink-0" style={{ background: color(p.e.kind) }} />
                <span className="text-muted w-20 shrink-0">{fmtShort(p.e.date)}</span>
                <span className="text-foreground">{p.e.label}</span>
              </button>
            </li>
          );
        })}
      </ol>
      <p className="hidden sm:block text-sm text-foreground mt-2 min-h-[2.75rem]">
        {shown ? (
          <>
            <span className="text-muted">{fmtDate(shown.date)}. </span>
            {shown.label}
          </>
        ) : (
          <span className="text-muted">Hover or tab through the dots; circuit decisions select that circuit on the map.</span>
        )}
      </p>
      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 sm:mt-0 text-[11px] text-muted">
        <LegendDot color="#9ca3af" label="Executive or BIA action" />
        <LegendDot color={FILL.bond.top} label="Circuit: bond hearing" />
        <LegendDot color={FILL.mandatory.top} label="Circuit: mandatory detention" />
        <LegendDot color={CERT_RING} label="Supreme Court" />
      </div>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}

/* ------------------------------------------------------------ quote banner */

const KIND_LABEL: Record<QuoteKind, string> = {
  majority: "Majority",
  dissent: "Dissent",
  concurrence: "Concurrence",
};

function QuoteBanner({ c }: { c: Circuit }) {
  const kinds = (["majority", "dissent", "concurrence"] as QuoteKind[]).filter((k) => c.quotes?.[k]);
  const [kind, setKind] = useState<QuoteKind>("majority");
  const q = c.quotes?.[kind];
  const court = c.circuit === "DC" ? "D.C. Circuit" : `${ordinal(c.circuit)} Circuit`;
  // The mark beside the quote carries the side: the circuit's outcome color for
  // the majority, the opposing color for a dissent, neutral for a concurrence.
  const opposite: Outcome = c.outcome === "bond" ? "mandatory" : "bond";
  const bar =
    kind === "majority" ? FILL[c.outcome].top : kind === "dissent" ? FILL[opposite].top : "#9ca3af";

  return (
    <div className="mb-5 rounded-xl border border-surface-light bg-background p-4 md:p-6 min-h-[10rem]">
      {!q ? (
        <p className="text-sm text-muted">The D.C. Circuit has not ruled on this question, so there is no opinion to quote yet.</p>
      ) : (
        <div className="flex gap-4">
          <span className="w-1 rounded-full shrink-0 transition-colors" style={{ background: bar }} aria-hidden />
          <div className="min-w-0 flex-1">
            <AnimatePresence mode="wait">
              <motion.figure
                key={kind}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22 }}
              >
                <blockquote className="relative text-base md:text-xl leading-snug text-foreground font-medium">
                  <span className="text-primary" aria-hidden>&ldquo;</span>
                  {q.text}
                  <span className="text-primary" aria-hidden>&rdquo;</span>
                </blockquote>
                <figcaption className="mt-3 text-xs md:text-sm text-muted">
                  Judge {q.by}, {kind === "majority" ? "for the majority" : kind === "dissent" ? "dissenting" : "concurring"} ({court})
                  {q.cite && (
                    <span className="block mt-1 text-[11px] md:text-xs">
                      <Cite segs={q.cite} />
                    </span>
                  )}
                </figcaption>
              </motion.figure>
            </AnimatePresence>
            {kinds.length > 1 && (
              <div className="flex flex-wrap gap-2 mt-3" role="tablist" aria-label="Choose an opinion">
                {kinds.map((k) => (
                  <button
                    key={k}
                    type="button"
                    role="tab"
                    aria-selected={kind === k}
                    onClick={() => setKind(k)}
                    className={`px-2.5 py-1 rounded-full border text-[11px] font-semibold transition-colors ${
                      kind === k ? "border-foreground text-foreground" : "border-surface-light text-muted hover:text-foreground"
                    }`}
                  >
                    {KIND_LABEL[k]}
                    {k !== "majority" && c.quotes?.[k] ? `: Judge ${c.quotes[k]!.by}` : ""}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
