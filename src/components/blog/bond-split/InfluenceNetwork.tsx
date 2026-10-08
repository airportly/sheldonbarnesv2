"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import raw from "@/data/bond-split/influence.json";

/**
 * Influence network for the INA 235(b) vs 236(a) bond split.
 *
 * Twenty-one opinions (eleven majorities, nine dissents, one concurrence) sit
 * on a ring ordered by decision date. Three switchable layers run over the
 * same ring:
 *   Citations      directed arcs, who cites whom and how (follows / rejects)
 *   Shared language a coined or borrowed phrase lights up the opinions using it
 *   Shared authority a Supreme Court case lights up the opinions leaning on it
 * Clicking a node opens a reader with its outgoing and incoming citations, each
 * with the court's own words and a pin cite. Data is in influence.json; every
 * quotation was checked verbatim against the slip opinion.
 */

type Side = "bond" | "mandatory";
type Part = "majority" | "dissent" | "concurrence";
type Stance = "adopts" | "agrees" | "distinguishes" | "rejects" | "discusses";

interface Node {
  id: string; circuit: string; part: Part; judge: string; side: Side;
  case: string; date: string; ordinal: string; cite: string; pdf: string | null;
  deg: { in: number; out: number; in_follow: number };
}
interface Pin { page: number; page_end: number | null; fn: number | null }
interface Edge { source: string; target: string; stance: Stance; mixed: boolean; gist: string; quote: string | null; pin: Pin | null; count: number }
interface Use { op: string; snippet: string; lean?: "bond" | "mandatory" | "neutral" }
interface Phrase { label: string; phrase: string; kind: "borrowed" | "coined"; source?: string; uses: Use[] }
interface Precedent { case: string; uses: Use[] }

const D = raw as unknown as { nodes: Node[]; edges: Edge[]; language: Phrase[]; precedent: Precedent[] };
const NODE: Record<string, Node> = Object.fromEntries(D.nodes.map((n) => [n.id, n]));

const SIDE: Record<Side, string> = { bond: "#4f8fd6", mandatory: "#dd6814" };
const LEAN: Record<string, string> = { bond: "#4f8fd6", mandatory: "#dd6814", neutral: "#8a9099" };
// Stance: green = moves with (adopts/agrees), red = moves against (rejects),
// gray = distinguishes or neutral. Line style is the backup channel for CVD.
const STANCE: Record<Stance, { color: string; label: string; follow: boolean; dash?: string }> = {
  adopts: { color: "#46a883", label: "Adopts", follow: true },
  agrees: { color: "#46a883", label: "Agrees", follow: true, dash: "5 4" },
  distinguishes: { color: "#8a9099", label: "Distinguishes", follow: false, dash: "2 4" },
  rejects: { color: "#d85c42", label: "Rejects", follow: false },
  discusses: { color: "#8a9099", label: "Discusses", follow: false, dash: "2 4" },
};

// ring order: by date, majority before separate within a circuit
const ORDER = [...D.nodes].sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0) || a.circuit.localeCompare(b.circuit) || (a.part === "majority" ? -1 : 1));

function partShort(p: Part) {
  return p === "majority" ? "" : p === "dissent" ? " dis." : " con.";
}

type Layer = "cite" | "language" | "authority";

export default function InfluenceNetwork() {
  const [layer, setLayer] = useState<Layer>("cite");
  const [reader, setReader] = useState<string | null>(null); // node id (cite mode)
  const [sel, setSel] = useState<number>(0); // chip index (language / authority)
  const [hover, setHover] = useState<string | null>(null);

  // geometry
  const W = 760, H = 560, cx = W / 2, cy = H / 2 + 6, R = 212;
  const pos = useMemo(() => {
    const m: Record<string, { x: number; y: number; a: number }> = {};
    ORDER.forEach((n, i) => {
      const a = (i / ORDER.length) * 2 * Math.PI - Math.PI / 2;
      m[n.id] = { x: cx + R * Math.cos(a), y: cy + R * Math.sin(a), a };
    });
    return m;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activeUses = useMemo<Set<string>>(() => {
    if (layer === "language") return new Set((D.language[sel]?.uses ?? []).map((u) => u.op));
    if (layer === "authority") return new Set((D.precedent[sel]?.uses ?? []).map((u) => u.op));
    return new Set();
  }, [layer, sel]);
  const leanOf = useMemo<Record<string, string>>(() => {
    const m: Record<string, string> = {};
    if (layer === "authority") (D.precedent[sel]?.uses ?? []).forEach((u) => (m[u.op] = u.lean ?? "neutral"));
    return m;
  }, [layer, sel]);

  const nodeEdges = (id: string) => ({
    out: D.edges.filter((e) => e.source === id),
    inc: D.edges.filter((e) => e.target === id),
  });

  const chord = (s: string, t: string) => {
    const a = pos[s], b = pos[t];
    const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
    // pull control point toward center so arcs bow inward
    const k = 0.45;
    const ctrlX = cx + (mx - cx) * (1 - k), ctrlY = cy + (my - cy) * (1 - k);
    return { d: `M${a.x.toFixed(1)},${a.y.toFixed(1)} Q${ctrlX.toFixed(1)},${ctrlY.toFixed(1)} ${b.x.toFixed(1)},${b.y.toFixed(1)}`, ctrlX, ctrlY, b };
  };

  // which edges to draw in cite mode
  const shownEdges = useMemo(() => {
    if (layer !== "cite") return [];
    if (!hover && !reader) return D.edges;
    const focus = reader ?? hover!;
    return D.edges.filter((e) => e.source === focus || e.target === focus);
  }, [layer, hover, reader]);

  const focusId = reader ?? hover;

  return (
    <div className="not-prose my-10 rounded-2xl border border-surface-light bg-surface p-5 md:p-7">
      <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-primary mb-1">Influence map</p>
          <h3 className="text-xl md:text-2xl font-bold text-foreground">How the circuits talk to each other</h3>
        </div>
        <div className="inline-flex rounded-full border border-surface-light p-0.5 text-xs" role="tablist" aria-label="Layer">
          {([["cite", "Citations"], ["language", "Shared language"], ["authority", "Shared authority"]] as [Layer, string][]).map(([v, lbl]) => (
            <button key={v} role="tab" aria-selected={layer === v} onClick={() => { setLayer(v); setReader(null); setSel(0); }}
              className={`px-3 py-1.5 rounded-full font-semibold transition-colors ${layer === v ? "bg-surface-light text-foreground" : "text-muted hover:text-foreground"}`}>
              {lbl}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-[1.35fr_1fr] gap-5 items-start">
        {/* Ring */}
        <div className="rounded-xl border border-surface-light bg-background p-2">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto select-none" role="img" aria-label="Ring of 21 opinions with links between them">
            <defs>
              <marker id="inf-arrow-follow" markerWidth="7" markerHeight="7" refX="5.5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#46a883" /></marker>
              <marker id="inf-arrow-reject" markerWidth="7" markerHeight="7" refX="5.5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#d85c42" /></marker>
              <marker id="inf-arrow-gray" markerWidth="7" markerHeight="7" refX="5.5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#8a9099" /></marker>
            </defs>

            {/* edges (cite mode) */}
            {layer === "cite" && shownEdges.map((e, i) => {
              const { d } = chord(e.source, e.target);
              const st = STANCE[e.stance];
              const faded = focusId ? false : true;
              const mk = st.follow ? "inf-arrow-follow" : e.stance === "rejects" ? "inf-arrow-reject" : "inf-arrow-gray";
              return <path key={i} d={d} fill="none" stroke={st.color} strokeWidth={focusId ? 2 : 1.1}
                strokeDasharray={st.dash} strokeOpacity={faded ? 0.18 : 0.9} markerEnd={`url(#${mk})`} style={{ transition: "stroke-opacity 150ms" }} />;
            })}

            {/* hub links (language / authority) */}
            {layer !== "cite" && [...activeUses].map((op, i) => {
              const a = pos[op];
              return <line key={i} x1={cx} y1={cy} x2={a.x} y2={a.y} stroke={layer === "authority" ? LEAN[leanOf[op] ?? "neutral"] : "#c9a84a"} strokeWidth={1.4} strokeOpacity={0.5} />;
            })}
            {layer !== "cite" && (
              <circle cx={cx} cy={cy} r={6} fill={layer === "authority" ? "#c9cccf" : "#c9a84a"} />
            )}

            {/* nodes */}
            {ORDER.map((n) => {
              const p = pos[n.id];
              const active = layer === "cite" ? (!focusId || n.id === focusId || D.edges.some((e) => (e.source === focusId && e.target === n.id) || (e.target === focusId && e.source === n.id))) : activeUses.has(n.id);
              const r = 7 + Math.min(6, n.deg.in_follow);
              const fill = layer === "authority" && activeUses.has(n.id) ? LEAN[leanOf[n.id] ?? "neutral"] : SIDE[n.side];
              const sep = n.part !== "majority";
              const labelOut = p.x >= cx;
              return (
                <g key={n.id} style={{ cursor: layer === "cite" ? "pointer" : "default", transition: "opacity 150ms" }} opacity={active ? 1 : 0.22}
                  onPointerEnter={() => layer === "cite" && setHover(n.id)} onPointerLeave={() => setHover((h) => (h === n.id ? null : h))}
                  onClick={() => layer === "cite" && setReader(n.id)}
                  role={layer === "cite" ? "button" : undefined} tabIndex={layer === "cite" ? 0 : undefined}
                  onKeyDown={(ev) => { if (layer === "cite" && (ev.key === "Enter" || ev.key === " ")) { ev.preventDefault(); setReader(n.id); } }}
                  aria-label={`${n.ordinal} Circuit ${n.part}, Judge ${n.judge}`}>
                  <circle cx={p.x} cy={p.y} r={r} fill={sep ? "#1a1d1e" : fill} stroke={fill} strokeWidth={sep ? 2.5 : 1.5}
                    style={{ filter: n.id === focusId ? "drop-shadow(0 0 6px rgba(255,255,255,0.4))" : undefined }} />
                  <text x={p.x + (labelOut ? r + 4 : -(r + 4))} y={p.y + 3.5} textAnchor={labelOut ? "start" : "end"} fontSize="11" fontWeight={600}
                    fill={active ? "#ededed" : "#6b7280"}>
                    {n.ordinal}{partShort(n.part)}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Side rail */}
        <div className="min-w-0">
          {layer === "cite" && <CiteRail focusId={reader} onPick={setReader} />}
          {layer === "language" && <ChipRail kind="language" sel={sel} setSel={setSel} />}
          {layer === "authority" && <ChipRail kind="authority" sel={sel} setSel={setSel} />}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4 text-[11px] text-muted">
        {layer === "cite" ? (
          <>
            <Key swatch={<span className="inline-block w-5 h-[2px]" style={{ background: "#46a883" }} />} label="Adopts or agrees" />
            <Key swatch={<span className="inline-block w-5 h-[2px]" style={{ background: "#d85c42" }} />} label="Rejects" />
            <Key swatch={<span className="inline-block w-5 border-t-2 border-dashed" style={{ borderColor: "#8a9099" }} />} label="Distinguishes or discusses" />
            <Key swatch={<span className="inline-block w-3 h-3 rounded-full" style={{ background: SIDE.bond }} />} label="Bond reading" />
            <Key swatch={<span className="inline-block w-3 h-3 rounded-full" style={{ background: SIDE.mandatory }} />} label="Mandatory reading" />
            <Key swatch={<span className="inline-block w-3 h-3 rounded-full border-2" style={{ borderColor: SIDE.bond, background: "#1a1d1e" }} />} label="Hollow = dissent or concurrence" />
          </>
        ) : (
          <span>Larger nodes are cited favorably more often. A node sits on the ring by its decision date.</span>
        )}
      </div>

      <AnimatePresence>
        {layer === "cite" && reader && <NodeReader key={reader} id={reader} onClose={() => setReader(null)} onJump={(id) => setReader(id)} nodeEdges={nodeEdges} />}
      </AnimatePresence>

      <p className="text-[11px] text-muted mt-4 leading-relaxed">
        Sources: the eleven courts of appeals&apos; slip opinions. Each citation is classified by how the citing opinion treats the cited one, with the court&apos;s own words and a pin cite checked against the Westlaw version. Classifications are my reading; close calls could go either way.
      </p>
    </div>
  );
}

function Key({ swatch, label }: { swatch: React.ReactNode; label: string }) {
  return <span className="inline-flex items-center gap-2">{swatch}{label}</span>;
}

/* --------------------------------------------------------- cite side rail */

function CiteRail({ focusId, onPick }: { focusId: string | null; onPick: (id: string) => void }) {
  if (!focusId) {
    const mostFollowed = [...D.nodes].sort((a, b) => b.deg.in_follow - a.deg.in_follow).slice(0, 5);
    return (
      <div className="rounded-xl border border-surface-light bg-background p-4">
        <p className="text-sm text-foreground font-semibold mb-1">Tap a node to open it</p>
        <p className="text-xs text-muted mb-3">Hover to isolate one opinion&apos;s links. Each opinion shows who it relies on and who relies on it.</p>
        <p className="text-[11px] font-mono uppercase tracking-wider text-muted mb-2">Most followed opinions</p>
        <div className="space-y-1.5">
          {mostFollowed.map((n) => (
            <button key={n.id} onClick={() => onPick(n.id)} className="flex items-center gap-2 w-full text-left text-sm text-foreground hover:text-primary">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: SIDE[n.side] }} />
              <span className="font-semibold">{n.ordinal} Cir.{n.part !== "majority" ? ` (${n.judge}, ${n.part})` : ""}</span>
              <span className="text-muted text-xs ml-auto">{n.deg.in_follow} follow</span>
            </button>
          ))}
        </div>
      </div>
    );
  }
  return null;
}

/* ------------------------------------------------------------ node reader */

function NodeReader({ id, onClose, onJump, nodeEdges }: { id: string; onClose: () => void; onJump: (id: string) => void; nodeEdges: (id: string) => { out: Edge[]; inc: Edge[] } }) {
  const n = NODE[id];
  const { out, inc } = nodeEdges(id);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow; document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [onClose]);

  const title = `${n.ordinal} Circuit${n.part === "majority" ? "" : n.part === "dissent" ? ", " + n.judge + " dissent" : ", " + n.judge + " concurrence"}`;

  return (
    <motion.div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <motion.div role="dialog" aria-modal="true" aria-label={title}
        className="relative w-full sm:max-w-2xl max-h-[88vh] sm:max-h-[84vh] flex flex-col rounded-t-2xl sm:rounded-2xl border border-surface-light bg-surface shadow-2xl shadow-black/60"
        initial={{ y: 40, opacity: 0.6 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }} transition={{ type: "spring", stiffness: 380, damping: 34 }}>
        <div className="p-4 sm:p-5 border-b border-surface-light">
          <div className="sm:hidden mx-auto mb-3 h-1 w-10 rounded-full bg-surface-light" aria-hidden />
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <span className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest" style={{ color: SIDE[n.side] }}>
                <span className="w-2 h-2 rounded-full" style={{ background: SIDE[n.side] }} />
                {n.side === "bond" ? "Bond reading" : "Mandatory reading"}
              </span>
              <h4 className="text-lg sm:text-xl font-bold text-foreground leading-snug mt-0.5">{title}</h4>
              <p className="text-xs text-muted mt-0.5 italic">{n.cite}</p>
            </div>
            <button onClick={onClose} aria-label="Close" className="shrink-0 w-8 h-8 rounded-full bg-background hover:bg-surface-light text-muted hover:text-foreground flex items-center justify-center">×</button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-4 space-y-5">
          <RelList title="This opinion relies on or answers" who="target" edges={out} onJump={onJump} />
          <RelList title="Opinions that engage this one" who="source" edges={inc} onJump={onJump} />
          {out.length === 0 && inc.length === 0 && <p className="text-sm text-muted">No sibling citations recorded for this opinion.</p>}
        </div>
      </motion.div>
    </motion.div>
  );
}

function RelList({ title, who, edges, onJump }: { title: string; who: "source" | "target"; edges: Edge[]; onJump: (id: string) => void }) {
  if (!edges.length) return null;
  const order: Stance[] = ["adopts", "agrees", "distinguishes", "discusses", "rejects"];
  const sorted = [...edges].sort((a, b) => order.indexOf(a.stance) - order.indexOf(b.stance));
  return (
    <div>
      <p className="text-[11px] font-mono uppercase tracking-wider text-muted mb-2">{title}</p>
      <div className="space-y-2">
        {sorted.map((e, i) => {
          const other = NODE[who === "target" ? e.target : e.source];
          const st = STANCE[e.stance];
          return (
            <div key={i} className="rounded-lg border border-surface-light bg-background p-3">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider rounded-full px-2 py-0.5 border" style={{ color: st.color, borderColor: st.color }}>
                  {who === "target" ? st.label : st.label === "Adopts" ? "Adopted by" : st.label === "Agrees" ? "Agreed by" : st.label === "Rejects" ? "Rejected by" : st.label}
                </span>
                <button onClick={() => onJump(other.id)} className="text-sm font-semibold text-foreground hover:text-primary">
                  {other.ordinal} Cir.{other.part !== "majority" ? ` ${other.judge} ${other.part}` : ""}
                </button>
                {e.mixed && <span className="text-[10px] text-muted">(mixed)</span>}
              </div>
              <p className="text-sm text-muted leading-relaxed">{e.gist}</p>
              {e.quote && (
                <blockquote className="mt-2 border-l-2 pl-3 text-[13px] text-foreground leading-relaxed italic" style={{ borderColor: st.color }}>
                  &ldquo;{e.quote}&rdquo;
                  {e.pin && (
                    <span className="block text-[11px] text-muted mt-1 not-italic">
                      at {e.pin.page_end && e.pin.page_end !== e.pin.page ? `${e.pin.page}-${e.pin.page_end}` : e.pin.page}
                      {e.pin.fn ? ` n.${e.pin.fn}` : ""}
                    </span>
                  )}
                </blockquote>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------- language / authority rail */

function ChipRail({ kind, sel, setSel }: { kind: "language" | "authority"; sel: number; setSel: (i: number) => void }) {
  const items = kind === "language" ? D.language : D.precedent;
  const cur = items[sel];
  return (
    <div className="rounded-xl border border-surface-light bg-background p-4">
      <div className="flex flex-wrap gap-1.5 mb-3 max-h-40 overflow-y-auto">
        {items.map((it, i) => {
          const label = kind === "language" ? (it as Phrase).label : (it as Precedent).case;
          const n = (it as Phrase | Precedent).uses.length;
          return (
            <button key={i} onClick={() => setSel(i)} aria-pressed={sel === i}
              className={`px-2.5 py-1 rounded-full border text-xs transition-colors ${sel === i ? "border-primary text-primary bg-surface" : "border-surface-light text-muted hover:text-foreground"}`}>
              {label} <span className="font-mono opacity-70">{n}</span>
            </button>
          );
        })}
      </div>
      {cur && kind === "language" && (
        <div>
          <p className="text-sm text-foreground">
            <span className="font-semibold">&ldquo;{(cur as Phrase).phrase}&rdquo;</span>{" "}
            <span className="text-[11px] font-mono uppercase tracking-wider text-muted">
              {(cur as Phrase).kind === "coined" ? "coined here" : "borrowed"}
            </span>
          </p>
          {(cur as Phrase).source && <p className="text-[11px] text-muted mt-0.5">from {(cur as Phrase).source}</p>}
        </div>
      )}
      {cur && kind === "authority" && (
        <p className="text-sm text-foreground font-semibold mb-1">{(cur as Precedent).case}</p>
      )}
      <div className="mt-3 space-y-2 max-h-80 overflow-y-auto">
        {cur?.uses.map((u, i) => {
          const n = NODE[u.op];
          if (!n) return null;
          return (
            <div key={i} className="rounded-lg border border-surface-light bg-surface p-2.5">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full" style={{ background: kind === "authority" ? LEAN[u.lean ?? "neutral"] : SIDE[n.side] }} />
                <span className="text-xs font-semibold text-foreground">{n.ordinal} Cir.{n.part !== "majority" ? ` ${n.judge} ${n.part}` : ""}</span>
                {kind === "authority" && u.lean && <span className="text-[10px] text-muted ml-auto">{u.lean === "neutral" ? "neutral" : u.lean + " reading"}</span>}
              </div>
              <p className="text-[13px] text-muted leading-relaxed italic">&ldquo;{u.snippet}&rdquo;</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
