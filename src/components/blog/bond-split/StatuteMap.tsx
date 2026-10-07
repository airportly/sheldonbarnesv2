"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import raw from "@/data/bond-split/statute-map.json";

/**
 * Statute map for the INA 235(b) versus 236(a) bond split.
 *
 * One compact card. Readers pick a provision from the tabs, tap a contested
 * phrase, and a reader pops up right there: circuit tabs across the top,
 * a majority / dissent switch, the court's own words, and arrow keys to step
 * through the circuits or switch topics without closing. A second tab shows
 * the full grid of every opinion against every argument; any dot opens the
 * same reader. Annotations live in src/data/bond-split/statute-map.json, and
 * every quote was checked verbatim against the court's slip opinion.
 */

type Side = "bond" | "mandatory";
type Status = "relied" | "answered" | "none";
type Part = "majority" | "dissent" | "concurrence";

interface Segment { t: string; topics?: string[] }
interface Provision { id: string; cite: string; ina: string; title: string; segments: Segment[]; note?: string }
interface Topic { id: string; group: "text" | "beyond"; label: string; short: string; question: string }
interface Opinion { id: string; circuit: string; part: Part; judge: string; side: Side; case: string; pdf: string | null }
interface Annotation { op: string; topic: string; status: Status; summary: string | null; quote: string | null; page: number | null }

const D = raw as unknown as { provisions: Provision[]; topics: Topic[]; opinions: Opinion[]; annotations: Annotation[] };
const TOPICS: Record<string, Topic> = Object.fromEntries(D.topics.map((t) => [t.id, t]));
const ANN: Record<string, Annotation> = Object.fromEntries(D.annotations.map((a) => [`${a.op}|${a.topic}`, a]));
const CIRCUITS = Array.from(new Set(D.opinions.map((o) => o.circuit)));
const OPS_BY_CIRCUIT: Record<string, Opinion[]> = Object.fromEntries(
  CIRCUITS.map((c) => [c, D.opinions.filter((o) => o.circuit === c)]),
);
// Topic order for stepping: the order of the topic list.
const TOPIC_ORDER = D.topics.map((t) => t.id);
// Which provision each text topic first appears in, for the reader's eyebrow.
const TOPIC_CITE: Record<string, string> = {};
for (const p of D.provisions) for (const s of p.segments) for (const t of s.topics ?? []) TOPIC_CITE[t] ??= p.cite;

// Same validated pair as the circuit map.
const SIDE_COLOR: Record<Side, string> = { bond: "#4f8fd6", mandatory: "#dd6814" };
const SIDE_TEXT: Record<Side, string> = {
  bond: "Reads the statute for a bond hearing",
  mandatory: "Reads the statute for mandatory detention",
};
const PART_LABEL: Record<Part, string> = { majority: "Majority", dissent: "Dissent", concurrence: "Concurrence" };

const ENGAGED: Record<string, number> = Object.fromEntries(
  D.topics.map((t) => [t.id, D.annotations.filter((a) => a.topic === t.id && a.status !== "none").length]),
);

function ord(c: string) {
  const n = Number(c);
  return `${n}${n === 1 ? "st" : n === 2 ? "nd" : n === 3 ? "rd" : "th"}`;
}

interface ReaderState { topic: string; circuit: string; part: Part }

function defaultCircuit(topic: string): string {
  // Open on the Second Circuit (the case under review) when it spoke to the
  // point, otherwise on the first circuit that did.
  const spoke = (c: string) => OPS_BY_CIRCUIT[c].some((o) => ANN[`${o.id}|${topic}`]?.status !== "none");
  return spoke("2") ? "2" : CIRCUITS.find(spoke) ?? "1";
}

export default function StatuteMap() {
  const [view, setView] = useState<"statute" | "grid">("statute");
  const [prov, setProv] = useState<string>(D.provisions[0].id);
  const [reader, setReader] = useState<ReaderState | null>(null);

  const open = useCallback((topic: string, circuit?: string, part?: Part) => {
    const c = circuit ?? defaultCircuit(topic);
    setReader({ topic, circuit: c, part: part ?? "majority" });
  }, []);

  return (
    <div className="not-prose my-10 rounded-2xl border border-surface-light bg-surface p-5 md:p-7">
      <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-primary mb-1">Statute map</p>
          <h3 className="text-xl md:text-2xl font-bold text-foreground">Tap a phrase to see how each circuit read it</h3>
        </div>
        <div className="inline-flex rounded-full border border-surface-light p-0.5 text-xs" role="tablist" aria-label="View">
          {(["statute", "grid"] as const).map((v) => (
            <button
              key={v}
              role="tab"
              aria-selected={view === v}
              onClick={() => setView(v)}
              className={`px-3.5 py-1.5 rounded-full font-semibold transition-colors ${
                view === v ? "bg-surface-light text-foreground" : "text-muted hover:text-foreground"
              }`}
            >
              {v === "statute" ? "The statute" : "The grid"}
            </button>
          ))}
        </div>
      </div>

      {view === "statute" ? (
        <StatuteView prov={prov} setProv={setProv} onOpen={(t) => open(t)} activeTopic={reader?.topic ?? null} />
      ) : (
        <Grid onOpen={open} />
      )}

      <AnimatePresence>
        {reader && <Reader key="reader" state={reader} setState={setReader} onClose={() => setReader(null)} />}
      </AnimatePresence>
    </div>
  );
}

/* ---------------------------------------------------------- statute view */

function StatuteView({
  prov,
  setProv,
  onOpen,
  activeTopic,
}: {
  prov: string;
  setProv: (p: string) => void;
  onOpen: (t: string) => void;
  activeTopic: string | null;
}) {
  const tabs = [...D.provisions.map((p) => ({ id: p.id, label: p.cite.replace("8 U.S.C. ", "§ ").replace(" and (c)(1)(E)", "") })), { id: "beyond", label: "Beyond the text" }];
  const p = D.provisions.find((x) => x.id === prov);
  return (
    <div>
      <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1" role="tablist" aria-label="Provision">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={prov === t.id}
            onClick={() => setProv(t.id)}
            className={`shrink-0 px-3 py-1.5 rounded-full border text-xs font-semibold font-mono transition-colors ${
              prov === t.id ? "border-primary text-primary bg-background" : "border-surface-light text-muted hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-3 rounded-xl border border-surface-light bg-background p-4 md:p-5 min-h-[11rem]">
        {p ? (
          <>
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 mb-2">
              <h4 className="text-sm font-semibold text-foreground">{p.title}</h4>
              <span className="text-[11px] font-mono text-muted">{p.ina}</span>
            </div>
            <p className="text-[15px] md:text-[17px] leading-8 md:leading-9 text-muted whitespace-pre-line">
              {p.segments.map((s, i) =>
                s.topics ? (
                  <Phrase key={i} seg={s} active={!!activeTopic && s.topics.includes(activeTopic)} onOpen={onOpen} />
                ) : (
                  <span key={i}>{s.t}</span>
                ),
              )}
            </p>
            {p.note && <p className="text-[11px] text-muted mt-3">{p.note}</p>}
          </>
        ) : (
          <div>
            <p className="text-sm text-muted mb-3">Arguments the courts made outside the words of the statute. The number is how many of the 21 opinions took each one up.</p>
            <div className="grid sm:grid-cols-2 gap-2">
              {D.topics
                .filter((t) => t.group === "beyond")
                .map((t) => (
                  <button
                    key={t.id}
                    onClick={() => onOpen(t.id)}
                    className="flex items-center justify-between gap-3 text-left rounded-lg border border-surface-light px-3 py-2.5 hover:border-primary group"
                  >
                    <span className="text-sm font-semibold text-foreground group-hover:text-primary">{t.label}</span>
                    <span className="text-xs font-mono text-muted shrink-0">{ENGAGED[t.id]}/21</span>
                  </button>
                ))}
            </div>
          </div>
        )}
      </div>
      <p className="text-[11px] text-muted mt-2">
        Underlined phrases open a reader with every circuit&apos;s treatment. The small number is how many of the 21 opinions argued about it.
      </p>
    </div>
  );
}

function Phrase({ seg, active, onOpen }: { seg: Segment; active: boolean; onOpen: (t: string) => void }) {
  const n = Math.max(...(seg.topics ?? []).map((t) => ENGAGED[t]));
  return (
    <button
      type="button"
      onClick={() => onOpen(seg.topics![0])}
      className={`group inline rounded px-0.5 -mx-0.5 text-left transition-colors ${
        active ? "bg-primary/20 text-foreground" : "text-foreground hover:bg-surface-light"
      }`}
    >
      <span
        className={`underline decoration-2 underline-offset-[6px] ${
          active ? "decoration-primary" : "decoration-muted group-hover:decoration-primary"
        }`}
      >
        {seg.t}
      </span>
      <sup className="ml-0.5 text-[10px] font-mono text-primary">{n}</sup>
    </button>
  );
}

/* ------------------------------------------------------------------ reader */

function Reader({
  state,
  setState,
  onClose,
}: {
  state: ReaderState;
  setState: (s: ReaderState) => void;
  onClose: () => void;
}) {
  const { topic, circuit, part } = state;
  const t = TOPICS[topic];
  const ops = OPS_BY_CIRCUIT[circuit];
  const op = ops.find((o) => o.part === part) ?? ops[0];
  const a = ANN[`${op.id}|${topic}`];

  const counts = useMemo(() => {
    const engaged = D.opinions.map((o) => ({ o, a: ANN[`${o.id}|${topic}`] })).filter((r) => r.a && r.a.status !== "none");
    return {
      bond: engaged.filter((r) => r.o.side === "bond").length,
      mandatory: engaged.filter((r) => r.o.side === "mandatory").length,
    };
  }, [topic]);

  const go = useCallback(
    (dir: 1 | -1) => {
      const i = CIRCUITS.indexOf(circuit);
      const next = CIRCUITS[(i + dir + CIRCUITS.length) % CIRCUITS.length];
      setState({ topic, circuit: next, part: "majority" });
    },
    [circuit, topic, setState],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [go, onClose]);

  const href = op.pdf && a?.page ? `${op.pdf}#page=${a.page}` : op.pdf ?? undefined;

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={`${t.label}: how each circuit read it`}
        className="relative w-full sm:max-w-2xl max-h-[88vh] sm:max-h-[84vh] flex flex-col rounded-t-2xl sm:rounded-2xl border border-surface-light bg-surface shadow-2xl shadow-black/60"
        initial={{ y: 40, opacity: 0.6 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ type: "spring", stiffness: 380, damping: 34 }}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-surface-light">
          <div className="sm:hidden mx-auto mb-3 h-1 w-10 rounded-full bg-surface-light" aria-hidden />
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <label className="sr-only" htmlFor="sm-topic">Topic</label>
              <select
                id="sm-topic"
                value={topic}
                onChange={(e) => setState({ topic: e.target.value, circuit: defaultCircuit(e.target.value), part: "majority" })}
                className="max-w-full bg-transparent text-[11px] font-mono uppercase tracking-widest text-primary outline-none cursor-pointer"
              >
                {TOPIC_ORDER.map((id) => (
                  <option key={id} value={id} className="bg-surface text-foreground normal-case">
                    {TOPICS[id].group === "text" ? "Phrase" : "Argument"}: {TOPICS[id].label}
                  </option>
                ))}
              </select>
              <h4 className="text-lg sm:text-xl font-bold text-foreground leading-snug mt-0.5">{t.label}</h4>
              <p className="text-xs sm:text-sm text-muted mt-1 leading-relaxed">{t.question}</p>
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              className="shrink-0 w-8 h-8 rounded-full bg-background hover:bg-surface-light text-muted hover:text-foreground flex items-center justify-center"
            >
              ×
            </button>
          </div>
          <div className="flex items-center gap-3 mt-3 text-[11px] text-muted">
            <span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: SIDE_COLOR.bond }} />{counts.bond} bond side</span>
            <span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: SIDE_COLOR.mandatory }} />{counts.mandatory} mandatory side</span>
            <span>{21 - counts.bond - counts.mandatory} silent</span>
            {TOPIC_CITE[topic] && <span className="ml-auto font-mono hidden sm:inline">{TOPIC_CITE[topic]}</span>}
          </div>
        </div>

        {/* Circuit tabs */}
        <div className="px-4 sm:px-5 pt-3">
          <div className="flex gap-1 overflow-x-auto pb-2 -mx-1 px-1" role="tablist" aria-label="Circuit">
            {CIRCUITS.map((c) => {
              const active = c === circuit;
              return (
                <button
                  key={c}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setState({ topic, circuit: c, part: "majority" })}
                  className={`shrink-0 flex flex-col items-center gap-1 px-2.5 pt-1.5 pb-1 rounded-lg border text-xs font-semibold transition-colors ${
                    active ? "border-foreground bg-background text-foreground" : "border-transparent text-muted hover:text-foreground hover:bg-background"
                  }`}
                >
                  {ord(c)}
                  <span className="flex gap-0.5">
                    {OPS_BY_CIRCUIT[c].map((o) => (
                      <MiniDot key={o.id} status={ANN[`${o.id}|${topic}`]?.status ?? "none"} color={SIDE_COLOR[o.side]} />
                    ))}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Opinion switch */}
        {ops.length > 1 && (
          <div className="px-4 sm:px-5 pb-2">
            <div className="inline-flex rounded-full border border-surface-light p-0.5 text-[11px]">
              {ops.map((o) => (
                <button
                  key={o.id}
                  onClick={() => setState({ topic, circuit, part: o.part })}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-semibold transition-colors ${
                    o.id === op.id ? "bg-surface-light text-foreground" : "text-muted hover:text-foreground"
                  }`}
                >
                  <span className="w-2 h-2 rounded-full" style={{ background: SIDE_COLOR[o.side] }} />
                  {PART_LABEL[o.part]} · {o.judge}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-5 pb-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${op.id}|${topic}`}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.16 }}
              className="rounded-xl border border-surface-light bg-background p-4"
            >
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="w-1.5 h-4 rounded-full" style={{ background: SIDE_COLOR[op.side] }} />
                <span className="text-xs font-semibold text-foreground">
                  {ord(op.circuit)} Cir. · Judge {op.judge}, {PART_LABEL[op.part].toLowerCase()}
                </span>
                <span className="text-[11px] text-muted">{SIDE_TEXT[op.side]}</span>
              </div>
              {!a || a.status === "none" ? (
                <p className="text-sm text-muted">This opinion did not meaningfully address this point.</p>
              ) : (
                <>
                  <span className="inline-block text-[10px] font-mono uppercase tracking-wider text-muted border border-surface-light rounded-full px-2 py-0.5 mb-2">
                    {a.status === "relied" ? "Relies on it" : "Answers the other side"}
                  </span>
                  <p className="text-sm sm:text-[15px] text-foreground leading-relaxed">{a.summary}</p>
                  {a.quote && (
                    <blockquote className="mt-3 border-l-2 pl-3 text-sm text-muted leading-relaxed italic" style={{ borderColor: SIDE_COLOR[op.side] }}>
                      &ldquo;{a.quote}&rdquo;
                    </blockquote>
                  )}
                  <p className="text-[11px] text-muted mt-2">
                    <em>{op.case}</em>
                    {href && (
                      <>
                        {" · "}
                        <a href={href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-primary">
                          Open the opinion{a.page ? ` at p. ${a.page}` : ""}
                        </a>
                      </>
                    )}
                  </p>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-2 px-4 sm:px-5 py-3 border-t border-surface-light text-xs">
          <button onClick={() => go(-1)} className="px-3 py-1.5 rounded-full border border-surface-light text-muted hover:text-foreground hover:border-muted">
            ← {ord(CIRCUITS[(CIRCUITS.indexOf(circuit) - 1 + CIRCUITS.length) % CIRCUITS.length])}
          </button>
          <span className="text-muted hidden sm:inline">Arrow keys move between circuits</span>
          <button onClick={() => go(1)} className="px-3 py-1.5 rounded-full border border-surface-light text-muted hover:text-foreground hover:border-muted">
            {ord(CIRCUITS[(CIRCUITS.indexOf(circuit) + 1) % CIRCUITS.length])} →
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function MiniDot({ status, color }: { status: Status; color: string }) {
  if (status === "relied") return <span className="block w-2 h-2 rounded-full" style={{ background: color }} />;
  if (status === "answered") return <span className="block w-2 h-2 rounded-full" style={{ boxShadow: `inset 0 0 0 1.5px ${color}` }} />;
  return <span className="block w-2 h-2 rounded-full bg-surface-light" />;
}

/* -------------------------------------------------------------------- grid */

function Grid({ onOpen }: { onOpen: (t: string, c: string, p: Part) => void }) {
  const cols = D.topics;
  return (
    <div>
      <div className="flex flex-wrap gap-x-4 gap-y-1.5 mb-3 text-[11px] text-muted">
        <span className="inline-flex items-center gap-1.5"><Dot status="relied" color={SIDE_COLOR.bond} />Relies on it, bond reading</span>
        <span className="inline-flex items-center gap-1.5"><Dot status="relied" color={SIDE_COLOR.mandatory} />Relies on it, mandatory reading</span>
        <span className="inline-flex items-center gap-1.5"><Dot status="answered" color="#9ca3af" />Answers the other side</span>
        <span className="inline-flex items-center gap-1.5"><Dot status="none" color="#9ca3af" />Silent</span>
      </div>
      <div className="overflow-x-auto -mx-1 px-1 pr-12 rounded-xl border border-surface-light bg-background">
        <table className="border-separate border-spacing-0 text-xs min-w-[560px] w-full">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 bg-background text-left font-semibold text-muted pb-2 pl-3 pr-2 align-bottom">Opinion</th>
              {cols.map((c) => (
                <th key={c.id} className="relative h-[88px] w-[30px] p-0 align-bottom">
                  <span className="absolute bottom-2 left-1/2 origin-bottom-left -rotate-[55deg] whitespace-nowrap text-[10.5px] font-semibold text-muted" title={c.label}>
                    {c.short}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {D.opinions.map((o, i) => {
              const newCircuit = i > 0 && D.opinions[i - 1].circuit !== o.circuit;
              const b = newCircuit ? "border-t border-surface-light" : "";
              return (
                <tr key={o.id}>
                  <td className={`sticky left-0 z-10 bg-background pl-3 pr-2 py-1 whitespace-nowrap ${b}`}>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-1.5 h-4 rounded-full" style={{ background: SIDE_COLOR[o.side] }} />
                      <span className="text-foreground font-semibold">{ord(o.circuit)}</span>
                      <span className="text-muted">
                        {o.judge}
                        {o.part === "dissent" ? " (dis.)" : o.part === "concurrence" ? " (conc.)" : ""}
                      </span>
                    </span>
                  </td>
                  {cols.map((c) => {
                    const st: Status = ANN[`${o.id}|${c.id}`]?.status ?? "none";
                    return (
                      <td key={c.id} className={`text-center py-1 px-0.5 ${b}`}>
                        <button
                          onClick={() => onOpen(c.id, o.circuit, o.part)}
                          aria-label={`${ord(o.circuit)} Circuit, Judge ${o.judge}: ${c.label}`}
                          className="w-6 h-6 inline-flex items-center justify-center rounded-full hover:bg-surface-light"
                        >
                          <Dot status={st} color={SIDE_COLOR[o.side]} />
                        </button>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="text-[11px] text-muted mt-2">Tap any dot to open what that opinion said.</p>
    </div>
  );
}

function Dot({ status, color }: { status: Status; color: string }) {
  if (status === "relied") return <span className="block w-3 h-3 rounded-full" style={{ background: color }} />;
  if (status === "answered") return <span className="block w-3 h-3 rounded-full" style={{ boxShadow: `inset 0 0 0 2px ${color}` }} />;
  return <span className="block w-1 h-1 rounded-full bg-surface-light" />;
}
