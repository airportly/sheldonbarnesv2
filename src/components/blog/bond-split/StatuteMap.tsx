"use client";

import { useMemo, useRef, useState } from "react";
import raw from "@/data/bond-split/statute-map.json";

/**
 * Statute map for the INA 235(b) versus 236(a) bond split.
 *
 * Readers click a contested phrase of the statute (or an argument outside the
 * text) and see what every circuit opinion said about it, sorted by which
 * reading the opinion adopted. A matrix below shows every opinion against
 * every argument. Annotations live in src/data/bond-split/statute-map.json;
 * every quote was checked verbatim against the court's slip opinion.
 */

type Side = "bond" | "mandatory";
type Status = "relied" | "answered" | "none";

interface Segment { t: string; topics?: string[] }
interface Provision { id: string; cite: string; ina: string; title: string; segments: Segment[]; note?: string }
interface Topic { id: string; group: "text" | "beyond"; label: string; short: string; question: string }
interface Opinion { id: string; circuit: string; part: "majority" | "dissent" | "concurrence"; judge: string; side: Side; case: string; pdf: string | null }
interface Annotation { op: string; topic: string; status: Status; summary: string | null; quote: string | null; page: number | null }

const D = raw as unknown as { provisions: Provision[]; topics: Topic[]; opinions: Opinion[]; annotations: Annotation[] };
const TOPICS: Record<string, Topic> = Object.fromEntries(D.topics.map((t) => [t.id, t]));
const ANN: Record<string, Annotation> = Object.fromEntries(D.annotations.map((a) => [`${a.op}|${a.topic}`, a]));

// Same validated pair as the circuit map: blue for the bond reading, orange
// for the mandatory detention reading.
const SIDE_COLOR: Record<Side, string> = { bond: "#4f8fd6", mandatory: "#dd6814" };
const SIDE_LABEL: Record<Side, string> = {
  bond: "Read for a bond hearing (1226(a))",
  mandatory: "Read for mandatory detention (1225(b)(2)(A))",
};

function ord(c: string) {
  const n = Number(c);
  return `${n}${n === 1 ? "st" : n === 2 ? "nd" : n === 3 ? "rd" : "th"}`;
}
function opLabel(o: Opinion) {
  const role = o.part === "majority" ? "majority" : o.part === "dissent" ? "dissent" : "concurrence";
  return `${ord(o.circuit)} Cir. · ${o.judge}, ${role}`;
}

// How many opinions engaged each topic, for the underline weight.
const ENGAGED: Record<string, number> = Object.fromEntries(
  D.topics.map((t) => [t.id, D.annotations.filter((a) => a.topic === t.id && a.status !== "none").length]),
);

export default function StatuteMap() {
  const [topic, setTopic] = useState<string>("T2");
  const [focusOp, setFocusOp] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const choose = (t: string, op: string | null = null, scroll = false) => {
    setTopic(t);
    setFocusOp(op);
    if (scroll) panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="not-prose my-10 space-y-6">
      <StatutePanel topic={topic} onPick={(t) => choose(t)} />
      <div ref={panelRef} className="scroll-mt-24">
        <TopicPanel topic={topic} focusOp={focusOp} onPick={(t) => choose(t)} />
      </div>
      <Matrix topic={topic} focusOp={focusOp} onPick={(t, op) => choose(t, op, true)} />
    </div>
  );
}

/* ----------------------------------------------------------- statute text */

function StatutePanel({ topic, onPick }: { topic: string; onPick: (t: string) => void }) {
  const beyond = D.topics.filter((t) => t.group === "beyond");
  return (
    <div className="rounded-2xl border border-surface-light bg-surface p-5 md:p-8">
      <p className="text-xs font-mono uppercase tracking-widest text-primary mb-1">The statute</p>
      <h3 className="text-xl md:text-2xl font-bold text-foreground">The words the courts fought over</h3>
      <p className="text-sm text-muted mt-1 mb-5">
        Select an underlined phrase. The heavier the underline, the more opinions argued about it.
      </p>

      <div className="space-y-4">
        {D.provisions.map((p) => (
          <section key={p.id} className="rounded-xl border border-surface-light bg-background p-4 md:p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 mb-2">
              <h4 className="text-sm font-semibold text-foreground">{p.title}</h4>
              <span className="text-[11px] font-mono text-muted">
                {p.cite} · {p.ina}
              </span>
            </div>
            <p className="text-[15px] md:text-base leading-8 text-muted whitespace-pre-line">
              {p.segments.map((s, i) =>
                s.topics ? (
                  <Phrase key={i} seg={s} active={s.topics.includes(topic)} onPick={onPick} />
                ) : (
                  <span key={i}>{s.t}</span>
                ),
              )}
            </p>
            {p.note && <p className="text-[11px] text-muted mt-2">{p.note}</p>}
          </section>
        ))}
      </div>

      <div className="mt-5">
        <p className="text-[11px] font-mono uppercase tracking-widest text-muted mb-2">Arguments beyond the text</p>
        <div className="flex flex-wrap gap-2">
          {beyond.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => onPick(t.id)}
              aria-pressed={topic === t.id}
              className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition-colors ${
                topic === t.id ? "border-primary text-primary bg-background" : "border-surface-light text-muted hover:border-muted hover:text-foreground"
              }`}
            >
              {t.label}
              <span className="ml-1.5 font-mono font-normal opacity-70">{ENGAGED[t.id]}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Phrase({ seg, active, onPick }: { seg: Segment; active: boolean; onPick: (t: string) => void }) {
  const n = Math.max(...(seg.topics ?? []).map((t) => ENGAGED[t]));
  const thickness = n >= 18 ? 4 : n >= 12 ? 3 : n >= 6 ? 2 : 1;
  return (
    <button
      type="button"
      onClick={() => onPick(seg.topics![0])}
      aria-pressed={active}
      title={`${n} of 21 opinions addressed this`}
      className={`inline rounded-sm px-0.5 -mx-0.5 text-left transition-colors ${
        active ? "bg-primary/20 text-foreground" : "text-foreground hover:bg-surface-light"
      }`}
      style={{
        textDecorationLine: "underline",
        textDecorationColor: active ? "#e8701a" : "#9ca3af",
        textDecorationThickness: `${thickness}px`,
        textUnderlineOffset: "5px",
      }}
    >
      {seg.t}
    </button>
  );
}

/* ------------------------------------------------------------ topic panel */

function TopicPanel({ topic, focusOp, onPick }: { topic: string; focusOp: string | null; onPick: (t: string) => void }) {
  const t = TOPICS[topic];
  const siblings = D.provisions.flatMap((p) => p.segments).find((s) => s.topics && s.topics.length > 1 && s.topics.includes(topic))?.topics;

  const rows = useMemo(
    () =>
      D.opinions.map((o) => ({ o, a: ANN[`${o.id}|${topic}`] })).filter((r) => r.a),
    [topic],
  );
  const engaged = rows.filter((r) => r.a.status !== "none");
  const silent = rows.filter((r) => r.a.status === "none");
  const bySide = (s: Side) => engaged.filter((r) => r.o.side === s);

  return (
    <div className="rounded-2xl border border-surface-light bg-surface p-5 md:p-8">
      <p className="text-xs font-mono uppercase tracking-widest text-primary mb-1">
        {t.group === "text" ? "Contested phrase" : "Argument beyond the text"}
      </p>
      <h3 className="text-xl md:text-2xl font-bold text-foreground">{t.label}</h3>
      <p className="text-sm md:text-base text-muted mt-2 leading-relaxed">{t.question}</p>

      {siblings && (
        <div className="flex flex-wrap gap-2 mt-3">
          {siblings.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onPick(s)}
              className={`px-3 py-1 rounded-full border text-xs ${
                s === topic ? "border-foreground text-foreground" : "border-surface-light text-muted hover:text-foreground"
              }`}
            >
              {TOPICS[s].label}
            </button>
          ))}
        </div>
      )}

      <SplitBar bond={bySide("bond").length} mandatory={bySide("mandatory").length} silent={silent.length} />

      <div className="grid md:grid-cols-2 gap-4 mt-5">
        {(["bond", "mandatory"] as Side[]).map((s) => (
          <div key={s}>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-3 h-3 rounded-sm" style={{ background: SIDE_COLOR[s] }} />
              <p className="text-xs font-semibold text-foreground">{SIDE_LABEL[s]}</p>
            </div>
            <div className="space-y-3">
              {bySide(s).length === 0 && <p className="text-xs text-muted">No opinion on this side addressed it.</p>}
              {bySide(s).map(({ o, a }) => (
                <Entry key={`${o.id}|${topic}`} o={o} a={a} focused={focusOp === o.id} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {silent.length > 0 && (
        <p className="text-xs text-muted mt-5">
          <span className="font-semibold text-foreground">Not addressed: </span>
          {silent.map((r) => `${ord(r.o.circuit)} ${r.o.part === "majority" ? "maj." : r.o.part === "dissent" ? "dissent" : "conc."}`).join(", ")}
        </p>
      )}
    </div>
  );
}

function SplitBar({ bond, mandatory, silent }: { bond: number; mandatory: number; silent: number }) {
  const total = bond + mandatory + silent;
  return (
    <div className="mt-5">
      <div className="flex h-2.5 rounded-full overflow-hidden gap-[2px] bg-background" aria-hidden>
        <div style={{ width: `${(bond / total) * 100}%`, background: SIDE_COLOR.bond }} />
        <div style={{ width: `${(mandatory / total) * 100}%`, background: SIDE_COLOR.mandatory }} />
        <div style={{ width: `${(silent / total) * 100}%`, background: "#3a3d3e" }} />
      </div>
      <p className="text-xs text-muted mt-2">
        Addressed by {bond + mandatory} of {total} opinions: {bond} reading for a bond hearing, {mandatory} reading for mandatory
        detention{silent ? `, ${silent} silent` : ""}.
      </p>
    </div>
  );
}

function Entry({ o, a, focused }: { o: Opinion; a: Annotation; focused: boolean }) {
  const [open, setOpen] = useState(false);
  const show = open || focused;
  const href = o.pdf && a.page ? `${o.pdf}#page=${a.page}` : o.pdf ?? undefined;
  return (
    <div
      className={`rounded-xl border bg-background p-3.5 transition-colors ${focused ? "border-foreground" : "border-surface-light"}`}
    >
      <div className="flex flex-wrap items-center gap-2 mb-1.5">
        <span className="text-[11px] font-semibold text-foreground">{opLabel(o)}</span>
        <span className="text-[10px] font-mono uppercase tracking-wider text-muted border border-surface-light rounded-full px-2 py-0.5">
          {a.status === "relied" ? "Relies on it" : "Answers it"}
        </span>
      </div>
      <p className="text-sm text-muted leading-relaxed">{a.summary}</p>
      {a.quote && (
        <>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="mt-2 text-[11px] font-semibold text-primary hover:text-primary-light"
            aria-expanded={show}
          >
            {show ? "Hide the court's words" : "Show the court's words"}
          </button>
          {show && (
            <blockquote className="mt-2 border-l-2 pl-3 text-sm text-foreground leading-relaxed" style={{ borderColor: SIDE_COLOR[o.side] }}>
              &ldquo;{a.quote}&rdquo;
              <span className="block text-[11px] text-muted mt-1 not-italic">
                <em>{o.case}</em>
                {href ? (
                  <>
                    {" · "}
                    <a href={href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-primary">
                      court PDF{a.page ? `, p. ${a.page}` : ""}
                    </a>
                  </>
                ) : null}
              </span>
            </blockquote>
          )}
        </>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ matrix */

function Matrix({ topic, focusOp, onPick }: { topic: string; focusOp: string | null; onPick: (t: string, op: string | null) => void }) {
  const cols = D.topics;
  return (
    <div className="rounded-2xl border border-surface-light bg-surface p-5 md:p-8">
      <p className="text-xs font-mono uppercase tracking-widest text-primary mb-1">The whole map</p>
      <h3 className="text-xl md:text-2xl font-bold text-foreground">Every opinion, every argument</h3>
      <p className="text-sm text-muted mt-1 mb-4">
        Rows are opinions, columns are arguments. Select a cell to read what that opinion said.
      </p>

      <div className="flex flex-wrap gap-x-5 gap-y-2 mb-4 text-xs text-muted">
        <Key kind="relied" color={SIDE_COLOR.bond} label="Relies on it, bond reading" />
        <Key kind="relied" color={SIDE_COLOR.mandatory} label="Relies on it, mandatory reading" />
        <Key kind="answered" color="#9ca3af" label="Answers the other side's use" />
        <Key kind="none" color="#9ca3af" label="Not addressed" />
      </div>

      <div className="overflow-x-auto -mx-1 px-1 pr-12">
        <table className="border-separate border-spacing-0 text-xs min-w-[560px] w-full">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 bg-surface text-left font-semibold text-muted pb-2 pr-3 align-bottom">Opinion</th>
              {cols.map((c) => (
                <th key={c.id} className="relative h-[92px] w-[30px] p-0 align-bottom">
                  <button
                    type="button"
                    onClick={() => onPick(c.id, focusOp)}
                    title={c.label}
                    className={`absolute bottom-2 left-1/2 origin-bottom-left -rotate-[55deg] whitespace-nowrap text-[10.5px] font-semibold ${
                      topic === c.id ? "text-primary" : "text-muted hover:text-foreground"
                    }`}
                  >
                    {c.short}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {D.opinions.map((o, i) => {
              const newCircuit = i > 0 && D.opinions[i - 1].circuit !== o.circuit;
              return (
                <tr key={o.id} className={focusOp === o.id ? "bg-surface-light/60" : ""}>
                  <td className={`sticky left-0 z-10 bg-surface pr-2 py-1 whitespace-nowrap ${newCircuit ? "border-t border-surface-light" : ""}`}>
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
                    const a = ANN[`${o.id}|${c.id}`];
                    const status: Status = a?.status ?? "none";
                    const active = topic === c.id;
                    return (
                      <td key={c.id} className={`text-center py-1 px-0.5 ${newCircuit ? "border-t border-surface-light" : ""} ${active ? "bg-background" : ""}`}>
                        <button
                          type="button"
                          onClick={() => onPick(c.id, o.id)}
                          disabled={status === "none"}
                          aria-label={`${opLabel(o)}: ${c.label}, ${status === "none" ? "not addressed" : status === "relied" ? "relies on it" : "answers it"}`}
                          className="w-6 h-6 inline-flex items-center justify-center rounded-full enabled:hover:bg-surface-light disabled:cursor-default"
                        >
                          <Dot status={status} color={SIDE_COLOR[o.side]} />
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
    </div>
  );
}

function Dot({ status, color }: { status: Status; color: string }) {
  if (status === "relied") return <span className="block w-3 h-3 rounded-full" style={{ background: color }} />;
  if (status === "answered") return <span className="block w-3 h-3 rounded-full" style={{ boxShadow: `inset 0 0 0 2px ${color}` }} />;
  return <span className="block w-1 h-1 rounded-full bg-surface-light" />;
}

function Key({ kind, color, label }: { kind: Status; color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <Dot status={kind} color={color} />
      {label}
    </span>
  );
}
