"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import raw from "@/data/bond-split/series.json";

/**
 * Tabbed chart panel for the bond split post. Every chart is plain SVG drawn
 * at the container's measured width, with a crosshair tooltip, a table view,
 * and a CSV download. Data and source metadata live in
 * src/data/bond-split/series.json, built from the CSVs in public/data/bond-split.
 */

interface Series {
  key: string;
  label: string;
  values: (number | null)[];
}
interface Chart {
  title: string;
  subtitle: string;
  unit: string;
  source: string;
  sourceUrl: string;
  note?: string;
  csv: string;
  x: string[];
  series: Series[];
  partial: boolean[];
  stacked?: boolean;
  reference?: { value: number; label: string };
  band?: { from: string; to: string; label: string };
  events?: { x: string; label: string }[];
}

const CHARTS = (raw as unknown as { charts: Record<string, Chart> }).charts;

// Validated on #1a1d1e and #2a2d2e (dark band, CVD separation 24.7).
const COLORS = ["#4f8fd6", "#dd6814"];
const INK = "#ededed";
const MUTED = "#9ca3af";
const GRID = "#33373a";
const SURFACE = "#1a1d1e";

const TABS: { id: string; label: string; charts: string[] }[] = [
  { id: "detention", label: "Detention", charts: ["detention"] },
  { id: "hearings", label: "Bond hearings", charts: ["hearings"] },
  { id: "jurisdiction", label: "No jurisdiction denials", charts: ["jurisdiction"] },
  { id: "releases", label: "Releases", charts: ["releases"] },
  { id: "habeas", label: "Habeas petitions", charts: ["habeas"] },
  { id: "crossings", label: "Border crossings", charts: ["crossingsMonthly", "crossingsAnnual"] },
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function fmtX(x: string): string {
  const m = /^(\d{4})-(\d{2})$/.exec(x);
  if (m) return `${MONTHS[Number(m[2]) - 1]} ${m[1]}`;
  return x.replace(/^FY/, "FY ");
}

function fmtV(v: number | null, unit: string): string {
  if (v === null || v === undefined) return "not reported";
  if (unit === "percent") return `${v.toFixed(1)}%`;
  return Math.round(v).toLocaleString("en-US");
}

function niceScale(v: number): { max: number; step: number } {
  const rough = v / 4;
  const p = Math.pow(10, Math.floor(Math.log10(rough)));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * p).find((s) => s >= rough) ?? 10 * p;
  return { max: Math.ceil(v / step) * step, step };
}

function tickLabel(v: number, unit: string): string {
  if (unit === "percent") return `${v}%`;
  if (v >= 1_000_000) return `${(v / 1_000_000).toLocaleString("en-US", { maximumFractionDigits: 1 })}M`;
  if (v >= 1000) return `${(v / 1000).toLocaleString("en-US", { maximumFractionDigits: 1 })}K`;
  return String(v);
}

function useWidth<T extends HTMLElement>(): [React.RefObject<T | null>, number] {
  const ref = useRef<T>(null);
  const [w, setW] = useState(680);
  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver((entries) => {
      const cw = entries[0]?.contentRect.width;
      if (cw) setW(Math.round(cw));
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  return [ref, w];
}

export default function BondCharts() {
  const [tab, setTab] = useState("detention");
  const [variant, setVariant] = useState(0);
  const current = TABS.find((t) => t.id === tab)!;
  const chartKey = current.charts[Math.min(variant, current.charts.length - 1)];
  const chart = CHARTS[chartKey];

  return (
    <div className="not-prose my-10 rounded-2xl border border-surface-light bg-surface p-5 md:p-8">
      <div className="mb-4">
        <p className="text-xs font-mono uppercase tracking-widest text-primary mb-1">Interactive data</p>
        <h3 className="text-xl md:text-2xl font-bold text-foreground">Detention, bond, and the courts, by the numbers</h3>
        <p className="text-sm text-muted mt-1">Hover or tap a chart for values. Every series links to its source and downloads as CSV.</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-5" role="tablist" aria-label="Choose a dataset">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => {
              setTab(t.id);
              setVariant(0);
            }}
            className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition-colors ${
              tab === t.id ? "border-primary text-primary bg-background" : "border-surface-light text-muted hover:border-muted hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <ChartCard key={chartKey} chart={chart}>
        {current.charts.length > 1 && (
          <div className="inline-flex rounded-full border border-surface-light p-0.5 text-xs">
            {current.charts.map((k, i) => (
              <button
                key={k}
                type="button"
                onClick={() => setVariant(i)}
                className={`px-3 py-1 rounded-full ${variant === i ? "bg-surface-light text-foreground" : "text-muted hover:text-foreground"}`}
              >
                {i === 0 ? "Monthly" : "By fiscal year"}
              </button>
            ))}
          </div>
        )}
      </ChartCard>
    </div>
  );
}

function ChartCard({ chart, children }: { chart: Chart; children?: React.ReactNode }) {
  const [showTable, setShowTable] = useState(false);
  return (
    <div className="rounded-xl border border-surface-light bg-background p-4 md:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <h4 className="text-base md:text-lg font-semibold text-foreground">{chart.title}</h4>
          <p className="text-sm text-muted">{chart.subtitle}</p>
        </div>
        {children}
      </div>

      {chart.series.length > 1 && (
        <div className="flex flex-wrap gap-x-4 gap-y-1 mb-2 text-xs text-muted">
          {chart.series.map((s, i) => (
            <span key={s.key} className="inline-flex items-center gap-1.5">
              {chart.stacked ? (
                <span className="inline-block w-3 h-3 rounded-sm" style={{ background: COLORS[i] }} />
              ) : (
                <span className="inline-block w-4 h-[2px] rounded" style={{ background: COLORS[i] }} />
              )}
              {s.label}
            </span>
          ))}
        </div>
      )}

      {showTable ? <DataTable chart={chart} /> : <Plot chart={chart} />}
      {!showTable && chart.events && chart.events.length > 0 && (
        <p className="sm:hidden text-[11px] text-muted mt-2">Vertical lines mark: {chart.events.map((e) => e.label).join("; ")}.</p>
      )}

      {chart.note && <p className="text-xs text-muted mt-3 leading-relaxed">{chart.note}</p>}
      <div className="flex flex-wrap items-center justify-between gap-3 mt-3 pt-3 border-t border-surface-light">
        <p className="text-[11px] text-muted leading-relaxed min-w-0">
          Source:{" "}
          <a href={chart.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-primary">
            {chart.source}
          </a>
          . Retrieved October 2026.
        </p>
        <div className="flex gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setShowTable((v) => !v)}
            className="px-3 py-1 rounded-full border border-surface-light text-[11px] text-muted hover:border-primary hover:text-primary transition-colors"
          >
            {showTable ? "Show chart" : "Show table"}
          </button>
          <a
            href={chart.csv}
            download
            className="px-3 py-1 rounded-full border border-surface-light text-[11px] text-muted hover:border-primary hover:text-primary transition-colors"
          >
            Download CSV
          </a>
        </div>
      </div>
    </div>
  );
}

function DataTable({ chart }: { chart: Chart }) {
  return (
    <div className="max-h-80 overflow-auto rounded-lg border border-surface-light">
      <table className="w-full text-xs">
        <thead className="sticky top-0 bg-surface">
          <tr>
            <th className="text-left font-semibold text-foreground px-3 py-2">Period</th>
            {chart.series.map((s) => (
              <th key={s.key} className="text-right font-semibold text-foreground px-3 py-2">
                {s.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {chart.x.map((x, i) => (
            <tr key={x} className="border-t border-surface-light">
              <td className="px-3 py-1.5 text-muted">
                {fmtX(x)}
                {chart.partial[i] ? " (partial)" : ""}
              </td>
              {chart.series.map((s) => (
                <td key={s.key} className="px-3 py-1.5 text-right text-foreground tabular-nums">
                  {fmtV(s.values[i], chart.unit)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Plot({ chart }: { chart: Chart }) {
  const [wrapRef, width] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const narrow = width < 560;
  const H = narrow ? 240 : 300;
  const n = chart.x.length;
  const left = narrow ? 40 : 52;
  const right = 14;
  const iw = Math.max(10, width - left - right);
  const step = iw / n;
  const xc = (i: number) => left + step * (i + 0.5);

  // Place event labels on as few rows as possible without overlap.
  const evLayout = useMemo(() => {
    const rows: [number, number][][] = [];
    return (chart.events ?? [])
      .map((ev) => {
        const i = chart.x.indexOf(ev.x);
        if (i < 0) return null;
        const lx = left + (iw / n) * (i + 0.5);
        const tw = ev.label.length * 5.6 + 6;
        const toRight = lx + tw < left + iw;
        const span: [number, number] = toRight ? [lx, lx + tw] : [lx - tw, lx];
        let row = 0;
        while (rows[row]?.some(([a, b]) => span[0] < b + 8 && span[1] > a - 8)) row++;
        (rows[row] ??= []).push(span);
        return { ...ev, lx, row, toRight };
      })
      .filter(Boolean) as { x: string; label: string; lx: number; row: number; toRight: boolean }[];
  }, [chart.events, chart.x, iw, left, n]);
  const nRows = narrow ? 0 : evLayout.reduce((m, e) => Math.max(m, e.row + 1), 0);
  const M = { top: 22 + nRows * 15, right, bottom: 28, left };
  const ih = H - M.top - M.bottom;

  const dataMax = useMemo(() => {
    let m = 0;
    for (let i = 0; i < n; i++) {
      if (chart.stacked) {
        m = Math.max(m, chart.series.reduce((a, s) => a + (s.values[i] ?? 0), 0));
      } else {
        for (const s of chart.series) m = Math.max(m, s.values[i] ?? 0);
      }
    }
    if (chart.reference) m = Math.max(m, chart.reference.value);
    return m;
  }, [chart, n]);

  const y = (v: number) => M.top + ih - (v / maxV) * ih;
  const scale = niceScale(dataMax * 1.02);
  const maxV = scale.max;
  const ticks = Array.from({ length: Math.round(maxV / scale.step) + 1 }, (_, k) => Math.round(k * scale.step * 1000) / 1000);

  // X labels: years for monthly series, every fifth year for fiscal years.
  const xTicks = useMemo(() => {
    const out: { i: number; label: string }[] = [];
    const monthly = /^\d{4}-\d{2}$/.test(chart.x[0]);
    if (monthly) {
      const every = n > 60 ? (narrow ? 2 : 1) : 1;
      let k = 0;
      chart.x.forEach((x, i) => {
        if (n <= 40 && /-(01|07)$/.test(x)) out.push({ i, label: fmtX(x) });
        else if (n > 40 && x.endsWith("-01")) {
          if (k++ % every === 0) out.push({ i, label: x.slice(0, 4) });
        }
      });
      if (n <= 40 && narrow) return out.filter((t) => chart.x[t.i].endsWith("-01")).map((t) => ({ i: t.i, label: chart.x[t.i].slice(0, 4) }));
    } else {
      chart.x.forEach((x, i) => {
        const yr = Number(x.replace("FY", ""));
        if (yr % 5 === 0) out.push({ i, label: x });
      });
    }
    return out;
  }, [chart.x, n, narrow]);

  const onMove = (e: React.PointerEvent<SVGRectElement>) => {
    const rect = (e.currentTarget.ownerSVGElement as SVGSVGElement).getBoundingClientRect();
    const px = e.clientX - rect.left;
    const i = Math.max(0, Math.min(n - 1, Math.floor((px - M.left) / step)));
    setHover(i);
  };

  const linePath = (vals: (number | null)[]) => {
    let d = "";
    let pen = false;
    vals.forEach((v, i) => {
      if (v === null) {
        pen = false;
        return;
      }
      d += `${pen ? "L" : "M"}${xc(i).toFixed(1)},${y(v).toFixed(1)}`;
      pen = true;
    });
    return d;
  };

  const areaPath = (vals: (number | null)[]) => {
    const pts = vals.map((v, i) => (v === null ? null : [xc(i), y(v)])).filter(Boolean) as number[][];
    if (!pts.length) return "";
    return `M${pts[0][0]},${y(0)}L${pts.map((p) => p.join(",")).join("L")}L${pts[pts.length - 1][0]},${y(0)}Z`;
  };

  const idx = (x: string) => chart.x.indexOf(x);
  const tipLeft = hover !== null ? Math.min(Math.max(xc(hover) + 12, 0), width - 190) : 0;
  const tipFlip = hover !== null && xc(hover) > width - 210;

  return (
    <div ref={wrapRef} className="relative w-full" style={{ height: H }}>
      <svg width={width} height={H} role="img" aria-label={`${chart.title}. ${chart.subtitle}`} className="block">
        {/* Policy band */}
        {chart.band && idx(chart.band.from) >= 0 && (
          <g>
            <rect
              x={xc(idx(chart.band.from)) - step / 2}
              y={M.top}
              width={xc(idx(chart.band.to)) - xc(idx(chart.band.from)) + step}
              height={ih}
              fill={COLORS[0]}
              fillOpacity={0.08}
            />
            <text x={xc(idx(chart.band.from)) - step / 2 + 6} y={M.top + 14} fontSize={11} fill={MUTED}>
              {narrow ? "Bond hearings available" : chart.band.label}
            </text>
          </g>
        )}

        {/* Grid */}
        {ticks.map((t) => (
          <g key={t}>
            <line x1={M.left} x2={M.left + iw} y1={y(t)} y2={y(t)} stroke={GRID} strokeWidth={1} />
            <text x={M.left - 6} y={y(t) + 4} textAnchor="end" fontSize={11} fill={MUTED} style={{ fontVariantNumeric: "tabular-nums" }}>
              {tickLabel(t, chart.unit)}
            </text>
          </g>
        ))}
        {xTicks.map((t) => (
          <text key={t.i} x={xc(t.i)} y={H - 8} textAnchor="middle" fontSize={11} fill={MUTED}>
            {t.label}
          </text>
        ))}

        {/* Event markers */}
        {evLayout.map((ev) => (
          <g key={ev.x}>
            <line x1={ev.lx} x2={ev.lx} y1={narrow ? M.top : 9 + ev.row * 15} y2={M.top + ih} stroke={MUTED} strokeOpacity={0.55} strokeWidth={1} />
            {!narrow && (
              <text x={ev.lx + (ev.toRight ? 4 : -4)} y={19 + ev.row * 15} textAnchor={ev.toRight ? "start" : "end"} fontSize={10.5} fill={MUTED}>
                {ev.label}
              </text>
            )}
          </g>
        ))}

        {/* Reference line */}
        {chart.reference && (
          <g>
            <line x1={M.left} x2={M.left + iw} y1={y(chart.reference.value)} y2={y(chart.reference.value)} stroke={INK} strokeOpacity={0.45} strokeDasharray="4 4" />
            <text x={M.left + 6} y={y(chart.reference.value) - 6} fontSize={11} fill={MUTED}>
              {chart.reference.label}
            </text>
          </g>
        )}

        {/* Marks */}
        {chart.stacked
          ? chart.x.map((_, i) => {
              const bw = Math.min(24, Math.max(2, step - 2));
              let base = 0;
              return (
                <g key={i} opacity={hover === null || hover === i ? 1 : 0.55}>
                  {chart.series.map((s, si) => {
                    const v = s.values[i] ?? 0;
                    const y0 = y(base);
                    const y1 = y(base + v);
                    base += v;
                    const h = Math.max(0, y0 - y1 - (si > 0 ? 2 : 0));
                    const top = si === chart.series.length - 1;
                    const r = top ? Math.min(4, bw / 2, h) : 0;
                    const x0 = xc(i) - bw / 2;
                    const yy = y1;
                    const d = r
                      ? `M${x0},${yy + h}V${yy + r}Q${x0},${yy} ${x0 + r},${yy}H${x0 + bw - r}Q${x0 + bw},${yy} ${x0 + bw},${yy + r}V${yy + h}Z`
                      : `M${x0},${yy}H${x0 + bw}V${yy + h}H${x0}Z`;
                    return <path key={s.key} d={d} fill={COLORS[si]} />;
                  })}
                </g>
              );
            })
          : chart.series.map((s, si) => (
              <g key={s.key}>
                {chart.series.length === 1 && <path d={areaPath(s.values)} fill={COLORS[si]} fillOpacity={0.1} />}
                <path d={linePath(s.values)} fill="none" stroke={COLORS[si]} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
              </g>
            ))}

        {/* Crosshair */}
        {hover !== null && (
          <g pointerEvents="none">
            {!chart.stacked && <line x1={xc(hover)} x2={xc(hover)} y1={M.top} y2={M.top + ih} stroke={INK} strokeOpacity={0.35} />}
            {!chart.stacked &&
              chart.series.map((s, si) =>
                s.values[hover] === null ? null : (
                  <circle key={s.key} cx={xc(hover)} cy={y(s.values[hover] as number)} r={4.5} fill={COLORS[si]} stroke={SURFACE} strokeWidth={2} />
                ),
              )}
          </g>
        )}

        <rect
          x={M.left}
          y={M.top}
          width={iw}
          height={ih}
          fill="transparent"
          onPointerMove={onMove}
          onPointerDown={onMove}
          onPointerLeave={() => setHover(null)}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") setHover((h) => Math.min(n - 1, (h ?? -1) + 1));
            if (e.key === "ArrowLeft") setHover((h) => Math.max(0, (h ?? n) - 1));
          }}
          onBlur={() => setHover(null)}
          style={{ outline: "none", touchAction: "pan-y" }}
        />
      </svg>

      {hover !== null && (
        <div
          className="pointer-events-none absolute z-10 rounded-lg border border-surface-light bg-surface px-3 py-2 shadow-lg shadow-black/40 text-xs"
          style={{ top: M.top, left: tipFlip ? undefined : tipLeft, right: tipFlip ? width - xc(hover) + 12 : undefined, minWidth: 150 }}
        >
          <div className="text-muted mb-1">
            {fmtX(chart.x[hover])}
            {chart.partial[hover] ? " (partial month)" : ""}
          </div>
          {chart.series.map((s, si) => (
            <div key={s.key} className="flex items-center gap-2">
              <span className="inline-block w-3 h-[2px] rounded" style={{ background: COLORS[si] }} />
              <span className="font-semibold text-foreground tabular-nums">{fmtV(s.values[hover], chart.unit)}</span>
              {chart.series.length > 1 && <span className="text-muted">{s.label}</span>}
            </div>
          ))}
          {chart.stacked && (
            <div className="text-muted mt-1">
              Total{" "}
              <span className="text-foreground font-semibold tabular-nums">
                {fmtV(chart.series.reduce((a, s) => a + (s.values[hover] ?? 0), 0), chart.unit)}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
