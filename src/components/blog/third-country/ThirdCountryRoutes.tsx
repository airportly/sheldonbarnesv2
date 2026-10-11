"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import world from "@/data/third-country/world-geo.json";
import data from "@/data/third-country/routes.json";

/**
 * World route map for third country removals.
 *
 * Each line runs from a home country (hollow ring) to the destination country
 * (filled pin). Line width is the documented number of people on that route,
 * in stepped buckets; dashed lines are routes where a nationality was reported
 * on a flight without a count. Pin size is the destination's reported total.
 *
 * Data is built from Third Country Deportation Watch country pages, Human Rights
 * Watch's analysis of ICE removal records, the USCRI tracker, and the court
 * opinions discussed in the post. See src/data/third-country/routes.json.
 */

type Pathway = "deal" | "border" | "aca" | "aea" | "born";
type Filter = "deal" | "border" | "aca" | "other" | "all";

interface Route {
  o: string;
  d: string;
  p: Pathway;
  n: number | null;
  flights: [string, string | null][];
  prot: boolean;
  src: string[];
}
interface Dest {
  id: string;
  total: number;
  label: string;
  url: string;
  note: string;
  pathways: Pathway[];
  byPathway: Partial<Record<Pathway, number>>;
  first: string;
}
interface Case {
  name: string;
  court: string;
  o: string | null;
  d: string;
  outcome: "removed" | "blocked" | "allowed" | "returned";
  text: string;
}
interface Data {
  asOf: string;
  sources: { tcdw: string; hrw: string; uscri: string };
  countries: Record<string, { name: string; lon: number; lat: number }>;
  destinations: Dest[];
  routes: Route[];
  cases: Case[];
}
interface World {
  viewBox: number[];
  land: string;
  borders: string;
  points: Record<string, [number, number]>;
}

const D = data as unknown as Data;
const W = world as unknown as World;
const NAME = (c: string) => D.countries[c]?.name ?? c;
const DEST_BY_ID: Record<string, Dest> = Object.fromEntries(D.destinations.map((d) => [d.id, d]));
const BASE: Box = [W.viewBox[0], W.viewBox[1], W.viewBox[2], W.viewBox[3]];
const ASPECT = BASE[2] / BASE[3];

type Box = [number, number, number, number];

const PATH_STYLE: Record<Pathway, { color: string; label: string }> = {
  deal: { color: "#f0a04b", label: "Third country removal deals" },
  border: { color: "#4f8fd6", label: "Transfers within the Americas" },
  aca: { color: "#9a86e0", label: "Asylum Cooperative Agreements" },
  aea: { color: "#e0605a", label: "Alien Enemies Act" },
  born: { color: "#3fb8a0", label: "Sent to a country they never lived in" },
};

const FILTERS: { id: Filter; tab: string; ps: Pathway[]; sub: string }[] = [
  {
    id: "deal",
    tab: "Removal deals",
    ps: ["deal"],
    sub: "The practice D.V.D. is about. People with final removal orders, most of whom an immigration judge protected from return home, flown to countries that agreed to take them, mostly in Africa.",
  },
  {
    id: "border",
    tab: "Americas",
    ps: ["border"],
    sub: "Non-Mexicans handed to Mexico at the land border, Mexicans flown to Guatemala and Honduras and bussed home, and flights to Panama and Costa Rica. By far the largest volume.",
  },
  {
    id: "aca",
    tab: "Asylum agreements",
    ps: ["aca"],
    sub: "Asylum seekers sent under Asylum Cooperative Agreements to a country that is supposed to hear their claim instead, before any U.S. judge decides it.",
  },
  {
    id: "other",
    tab: "Other",
    ps: ["aea", "born"],
    sub: "The Alien Enemies Act flights of Venezuelans to El Salvador's CECOT prison, and refugees sent to a nationality they were born outside of and had never lived in. For these, the ring marks the birth country.",
  },
  { id: "all", tab: "All", ps: ["deal", "border", "aca", "aea", "born"], sub: "Every documented route. Mexico dominates by volume; the removal deals reach the most countries." },
];

// Continents, for scoping the map to a region. Each country is assigned by
// hand rather than guessed from coordinates. A route belongs to a region when
// either its home country or its destination sits in it.
type RegionId = "africa" | "americas" | "europe" | "mideast" | "asia";
const REGIONS: { id: RegionId; short: string; label: string }[] = [
  { id: "africa", short: "Africa", label: "Africa" },
  { id: "americas", short: "Americas", label: "The Americas" },
  { id: "mideast", short: "Middle East", label: "The Middle East" },
  { id: "europe", short: "Europe", label: "Europe" },
  { id: "asia", short: "Asia-Pacific", label: "Asia & the Pacific" },
];
const REGION_MEMBERS: Record<RegionId, string[]> = {
  africa: ["AGO", "BDI", "CMR", "CAF", "TCD", "COD", "COG", "EGY", "GNQ", "ERI", "SWZ", "ETH", "GMB", "GHA", "GIN", "CIV", "KEN", "LBR", "MLI", "MRT", "MAR", "NER", "NGA", "RWA", "SEN", "SLE", "SOM", "SSD", "SDN", "TZA", "TGO", "TUN", "UGA", "ZWE"],
  americas: ["BLZ", "BOL", "BRA", "CHL", "COL", "CRI", "CUB", "DMA", "DOM", "ECU", "SLV", "GTM", "GUY", "HTI", "HND", "JAM", "MEX", "NIC", "PAN", "PRY", "PER", "KNA", "LCA", "TTO", "VEN"],
  europe: ["XKX", "MDA", "POL", "RUS", "SRB", "UKR"],
  mideast: ["ARM", "AZE", "GEO", "IRN", "IRQ", "JOR", "TUR", "YEM"],
  asia: ["AFG", "BGD", "BTN", "KHM", "CHN", "IND", "IDN", "KAZ", "KGZ", "LAO", "MMR", "NPL", "PAK", "PLW", "PHL", "LKA", "THA", "UZB", "VNM"],
};
const REGION_OF: Record<string, RegionId> = {};
for (const [rg, codes] of Object.entries(REGION_MEMBERS)) for (const c of codes) REGION_OF[c] = rg as RegionId;
const REGION_LABEL = Object.fromEntries(REGIONS.map((r) => [r.id, r.label])) as Record<RegionId, string>;

const BUCKETS = [
  { min: 250, w: 6, label: "250 or more" },
  { min: 50, w: 4, label: "50 to 249" },
  { min: 10, w: 2.6, label: "10 to 49" },
  { min: 1, w: 1.5, label: "1 to 9" },
];
const widthFor = (n: number | null) => (n == null ? 1.1 : (BUCKETS.find((b) => n >= b.min)?.w ?? 1.5));

const OUTCOME: Record<Case["outcome"], { color: string; label: string }> = {
  blocked: { color: "#4f8fd6", label: "Court blocked the removal" },
  allowed: { color: "#dd6814", label: "Court allowed the removal" },
  removed: { color: "#9ca3af", label: "Already removed when the court ruled" },
  returned: { color: "#3fb8a0", label: "Court ordered the person returned" },
};

const SRC_LABEL: Record<string, string> = {
  tcdw: "Third Country Deportation Watch",
  hrw: "Human Rights Watch, from ICE removal records",
  uscri: "U.S. Committee for Refugees and Immigrants tracker",
};

const MONTHS = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "June", "July", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."];
function fmtDate(s: string) {
  const [y, m, d] = s.split("-").map(Number);
  if (!m) return String(y);
  if (!d) return `${MONTHS[m - 1]} ${y}`;
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}
const fmtN = (n: number) => n.toLocaleString("en-US");

/** Quadratic arc bowed toward the north, so routes read as flight paths. */
function arc(a: [number, number], b: [number, number]) {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len = Math.hypot(dx, dy) || 1;
  let nx = -dy / len;
  let ny = dx / len;
  if (ny > 0) {
    nx = -nx;
    ny = -ny;
  }
  const bow = Math.min(len * 0.22, 90);
  const c: [number, number] = [(a[0] + b[0]) / 2 + nx * bow, (a[1] + b[1]) / 2 + ny * bow];
  const mid: [number, number] = [0.25 * a[0] + 0.5 * c[0] + 0.25 * b[0], 0.25 * a[1] + 0.5 * c[1] + 0.25 * b[1]];
  return { d: `M${a[0]},${a[1]} Q${c[0].toFixed(1)},${c[1].toFixed(1)} ${b[0]},${b[1]}`, mid };
}

/** Bounding box of some points, padded and widened to the map's aspect ratio. */
function fitBox(pts: [number, number][]): Box {
  if (pts.length < 2) return BASE;
  let x0 = Math.min(...pts.map((p) => p[0]));
  let x1 = Math.max(...pts.map((p) => p[0]));
  let y0 = Math.min(...pts.map((p) => p[1]));
  let y1 = Math.max(...pts.map((p) => p[1]));
  const pad = 40;
  x0 -= pad;
  x1 += pad;
  y0 -= pad * 1.6; // room for the arcs' northward bow
  y1 += pad;
  let w = x1 - x0;
  let h = y1 - y0;
  if (w / h < ASPECT) {
    const nw = h * ASPECT;
    x0 -= (nw - w) / 2;
    w = nw;
  } else {
    const nh = w / ASPECT;
    y0 -= (nh - h) / 2;
    h = nh;
  }
  if (w >= BASE[2] * 0.85) return BASE;
  return [x0, y0, w, h];
}

function useTweenBox(target: Box) {
  const [box, setBox] = useState<Box>(target);
  const from = useRef<Box>(target);
  const cur = useRef<Box>(target);
  useEffect(() => {
    from.current = cur.current;
    const start = performance.now();
    let raf = 0;
    const step = (t: number) => {
      const k = Math.min(1, (t - start) / 650);
      const e = 1 - Math.pow(1 - k, 3);
      const b = from.current.map((v, i) => v + (target[i] - v) * e) as Box;
      cur.current = b;
      setBox(b);
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target.join(",")]);
  return box;
}

type Sel = { kind: "dest" | "origin"; id: string } | { kind: "route"; o: string; d: string; p: Pathway } | { kind: "case"; i: number } | null;

export default function ThirdCountryRoutes() {
  const [filter, setFilter] = useState<Filter>("deal");
  const [region, setRegion] = useState<RegionId | "all">("all");
  const [sel, setSel] = useState<Sel>(null);
  const [showCases, setShowCases] = useState(true);
  const [hover, setHover] = useState<{ x: number; y: number; text: string; sub?: string } | null>(null);
  const [tour, setTour] = useState(false);
  const [tourIdx, setTourIdx] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);

  const f = FILTERS.find((x) => x.id === filter)!;
  const inRegion = (r: Route) => region === "all" || REGION_OF[r.o] === region || REGION_OF[r.d] === region;
  const routes = useMemo(
    () => D.routes.filter((r) => f.ps.includes(r.p) && W.points[r.o] && W.points[r.d] && inRegion(r)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [f, region]
  );

  // Which regions have any route in the current pathway, for enabling chips.
  const regionCounts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const r of D.routes) {
      if (!f.ps.includes(r.p) || !W.points[r.o] || !W.points[r.d]) continue;
      for (const id of new Set([REGION_OF[r.o], REGION_OF[r.d]])) if (id) c[id] = (c[id] ?? 0) + 1;
    }
    return c;
  }, [f]);

  // If the chosen pathway has nothing in the current region, fall back to all.
  useEffect(() => {
    if (region !== "all" && !regionCounts[region]) setRegion("all");
  }, [region, regionCounts]);

  const dests = useMemo(() => {
    if (region !== "all") {
      // Scoped view: count each destination from the routes actually shown.
      const m = new Map<string, number>();
      for (const r of routes) m.set(r.d, (m.get(r.d) ?? 0) + (r.n ?? 0));
      return [...m.keys()].map((id) => ({ id, n: m.get(id)! })).sort((a, b) => b.n - a.n);
    }
    const m: { id: string; n: number }[] = [];
    for (const d of D.destinations) {
      const n = f.ps.reduce((s, p) => s + (d.byPathway[p] ?? 0), 0);
      if (n > 0 || routes.some((r) => r.d === d.id)) m.push({ id: d.id, n });
    }
    return m.sort((a, b) => b.n - a.n);
  }, [f, routes, region]);

  const origins = useMemo(() => {
    const m = new Map<string, { id: string; n: number; dests: Set<string>; counted: boolean }>();
    for (const r of routes) {
      const e = m.get(r.o) ?? { id: r.o, n: 0, dests: new Set<string>(), counted: false };
      e.n += r.n ?? 0;
      e.counted = e.counted || r.n != null;
      e.dests.add(r.d);
      m.set(r.o, e);
    }
    return [...m.values()].sort((a, b) => b.n - a.n || b.dests.size - a.dests.size);
  }, [routes]);

  const people = dests.reduce((s, d) => s + d.n, 0);

  // Guided tour: step through each home country, zooming to it, drawing its
  // routes, and labelling each destination with how many people went there.
  const tourId = origins.length ? origins[tourIdx % origins.length].id : null;
  useEffect(() => {
    if (!tour || !tourId) return;
    setSel({ kind: "origin", id: tourId });
    const t = setTimeout(() => setTourIdx((i) => i + 1), 3400);
    return () => clearTimeout(t);
  }, [tour, tourIdx, tourId]);
  const startTour = () => {
    setTourIdx(0);
    setTour(true);
  };

  const cases = useMemo(
    () =>
      D.cases
        .map((c, i) => {
          const r = c.o ? D.routes.find((x) => x.o === c.o && x.d === c.d) : undefined;
          const p: Pathway = r?.p ?? DEST_BY_ID[c.d]?.pathways[0] ?? "deal";
          return { c, i, p, hasRoute: !!r };
        })
        .filter((x) => f.ps.includes(x.p) && (region === "all" || REGION_OF[x.c.d] === region || (x.c.o ? REGION_OF[x.c.o] === region : false))),
    [f, region]
  );

  // Which routes are emphasized by the current selection.
  const active = (r: Route) => {
    if (!sel) return true;
    if (sel.kind === "dest") return r.d === sel.id;
    if (sel.kind === "origin") return r.o === sel.id;
    if (sel.kind === "route") return r.o === sel.o && r.d === sel.d && r.p === sel.p;
    if (sel.kind === "case") {
      const c = D.cases[sel.i];
      return r.d === c.d && (!c.o || r.o === c.o);
    }
    return true;
  };

  const target = useMemo<Box>(() => {
    if (!sel) {
      // No selection: frame the active region, or the whole world.
      if (region === "all") return BASE;
      const pts: [number, number][] = [];
      for (const r of routes) pts.push(W.points[r.o], W.points[r.d]);
      return fitBox(pts);
    }
    const pts: [number, number][] = [];
    for (const r of routes) if (active(r)) pts.push(W.points[r.o], W.points[r.d]);
    if (sel.kind === "case") {
      const c = D.cases[sel.i];
      pts.push(W.points[c.d]);
      if (c.o) pts.push(W.points[c.o]);
    }
    return fitBox(pts);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sel, routes, region]);
  const box = useTweenBox(target);

  // Centroid of each region's countries that appear, for clickable map labels.
  const regionLabels = useMemo(() => {
    const acc: Partial<Record<RegionId, { sx: number; sy: number; n: number }>> = {};
    const add = (code: string) => {
      const rg = REGION_OF[code];
      const p = W.points[code];
      if (!rg || !p) return;
      const a = (acc[rg] ??= { sx: 0, sy: 0, n: 0 });
      a.sx += p[0];
      a.sy += p[1];
      a.n += 1;
    };
    for (const r of D.routes) {
      if (!f.ps.includes(r.p) || !W.points[r.o] || !W.points[r.d]) continue;
      add(r.o);
      add(r.d);
    }
    return REGIONS.filter((rg) => acc[rg.id]).map((rg) => ({ id: rg.id, label: rg.short, x: acc[rg.id]!.sx / acc[rg.id]!.n, y: acc[rg.id]!.sy / acc[rg.id]!.n }));
  }, [f]);

  // Everyone can zoom and pan; phones also get a taller aspect crop to start.
  const [narrow, setNarrow] = useState(false);
  const [cw, setCw] = useState(1000);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const drag = useRef<{ x: number; y: number; pan: { x: number; y: number }; moved: boolean } | null>(null);
  const pointers = useRef<Map<number, { x: number; y: number }>>(new Map());
  const pinch = useRef<{ dist: number; zoom: number } | null>(null);
  const panBounds = useRef<{ x: [number, number]; y: [number, number] }>({ x: [0, 0], y: [0, 0] });
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => {
      setNarrow(e.contentRect.width < 640);
      setCw(e.contentRect.width || 1000);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const focusX = useMemo(() => {
    let sx = 0;
    let sw = 0;
    for (const d of dests) {
      const p = W.points[d.id];
      if (!p) continue;
      const wt = Math.log10(d.n + 10);
      sx += p[0] * wt;
      sw += wt;
    }
    return sw ? sx / sw : BASE[0] + BASE[2] / 2;
  }, [dests]);
  const targetKey = target.join(",");
  useEffect(() => {
    setPan({ x: 0, y: 0 });
    setZoom(1);
  }, [targetKey, narrow, filter]);
  const view = useMemo<Box>(() => {
    // Base frame from the selection box, with the phone aspect crop.
    let fw: number;
    let fh: number;
    let fcx: number;
    let fcy: number;
    if (narrow) {
      const NA = 1.2;
      fw = Math.min(box[2], BASE[3] * NA);
      fh = fw / NA;
      const t = Math.max(0, Math.min(1, (box[2] - fw) / (BASE[2] - fw || 1)));
      fcx = box[0] + box[2] / 2 + (focusX - (box[0] + box[2] / 2)) * t;
      fcy = box[1] + box[3] / 2;
    } else {
      fw = box[2];
      fh = box[3];
      fcx = box[0] + box[2] / 2;
      fcy = box[1] + box[3] / 2;
    }
    // User zoom shrinks the window; never show more than the whole map.
    const w = Math.min(fw / zoom, BASE[2]);
    const h = Math.min(fh / zoom, BASE[3]);
    const minCx = BASE[0] + w / 2;
    const maxCx = BASE[0] + BASE[2] - w / 2;
    const minCy = BASE[1] + h / 2;
    const maxCy = BASE[1] + BASE[3] - h / 2;
    const b0x = Math.max(minCx, Math.min(maxCx, fcx));
    const b0y = Math.max(minCy, Math.min(maxCy, fcy));
    panBounds.current = { x: [minCx - b0x, maxCx - b0x], y: [minCy - b0y, maxCy - b0y] };
    const cx = Math.max(minCx, Math.min(maxCx, b0x + pan.x));
    const cy = Math.max(minCy, Math.min(maxCy, b0y + pan.y));
    return [cx - w / 2, cy - h / 2, w, h];
  }, [box, narrow, zoom, pan, focusX]);
  // Symbol scale in map units, so pins and rings keep one size on screen at any zoom or width.
  const k = (view[2] / Math.max(cw, 300)) * (narrow ? 1.15 : 0.95);
  const canPan = view[2] < BASE[2] - 1 || view[3] < BASE[3] - 1;

  // Zoom toward a point (rx, ry in 0..1 of the viewport), keeping it fixed.
  const zoomTo = (next: number, rx = 0.5, ry = 0.5) => {
    const nz = Math.max(1, Math.min(10, next));
    if (nz === zoom) return;
    const wNew = view[2] * (zoom / nz);
    const hNew = view[3] * (zoom / nz);
    setPan((p) => ({ x: p.x + (rx - 0.5) * (view[2] - wNew), y: p.y + (ry - 0.5) * (view[3] - hNew) }));
    setZoom(nz);
  };
  const resetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };
  // Native wheel listener so we can preventDefault (React's onWheel is passive).
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const r = el.getBoundingClientRect();
      zoomTo(zoom * Math.exp(-e.deltaY * 0.0016), (e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoom, view]);

  const pickFilter = (id: Filter) => {
    setFilter(id);
    setSel(null);
    setTour(false);
    setTourIdx(0);
  };
  const pickRegion = (id: RegionId | "all") => {
    setRegion((cur) => (cur === id ? "all" : id));
    setSel(null);
    setTour(false);
    setTourIdx(0);
  };
  const clearSel = () => {
    setSel(null);
    setTour(false);
  };
  const toggle = (s: NonNullable<Sel>) => {
    setTour(false);
    setSel((cur) => (JSON.stringify(cur) === JSON.stringify(s) ? null : s));
  };

  const tip = (e: React.MouseEvent, text: string, sub?: string) => {
    const r = wrapRef.current?.getBoundingClientRect();
    if (!r) return;
    setHover({ x: e.clientX - r.left, y: e.clientY - r.top, text, sub });
  };

  const sorted = [...routes].sort((a, b) => (b.n ?? 0) - (a.n ?? 0));
  const originIds = [...new Set(routes.map((r) => r.o))];
  const focusMode = !!sel && (sel.kind === "origin" || sel.kind === "dest");

  return (
    <div className="not-prose my-10 rounded-2xl border border-surface-light bg-surface p-4 md:p-8 lg:w-[min(94vw,1200px)] lg:max-w-none lg:relative lg:left-1/2 lg:-translate-x-1/2">
      <div className="mb-5">
        <p className="text-xs font-mono uppercase tracking-widest text-primary mb-1">Interactive map</p>
        <h3 className="text-xl md:text-2xl font-bold text-foreground">Where people are being sent</h3>
        <p className="text-sm text-muted mt-1">
          Documented transfers through {fmtDate(D.asOf)}. Each line runs from a home country to the third country that received the person. Select a country, a line, or a court case.
        </p>
      </div>

      {/* Pathway tabs */}
      <div className="mb-3 inline-flex flex-wrap gap-1 rounded-full border border-surface-light bg-background p-1" role="tablist" aria-label="Legal pathway">
        {FILTERS.map((x) => (
          <button
            key={x.id}
            type="button"
            role="tab"
            aria-selected={filter === x.id}
            onClick={() => pickFilter(x.id)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              filter === x.id ? "bg-surface-light text-foreground" : "text-muted hover:text-foreground"
            }`}
          >
            {x.ps.length < 3 &&
              x.ps.map((p) => <span key={p} className="inline-block w-2 h-2 rounded-full" style={{ background: PATH_STYLE[p].color }} aria-hidden />)}
            {x.tab}
          </button>
        ))}
      </div>
      <p className="text-sm text-muted mb-3 max-w-3xl">{f.sub}</p>

      {/* Region scope */}
      <div className="mb-4 flex flex-wrap items-center gap-1.5">
        <span className="text-[11px] font-mono uppercase tracking-wider text-muted mr-1">Region</span>
        <button
          type="button"
          onClick={() => pickRegion("all")}
          aria-pressed={region === "all"}
          className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
            region === "all" ? "bg-primary text-background" : "border border-surface-light text-muted hover:text-foreground"
          }`}
        >
          Whole world
        </button>
        {REGIONS.map((rg) => {
          const n = regionCounts[rg.id] ?? 0;
          return (
            <button
              key={rg.id}
              type="button"
              disabled={!n}
              onClick={() => pickRegion(rg.id)}
              aria-pressed={region === rg.id}
              title={n ? `${rg.label}: ${n} routes` : `${rg.label}: none in this view`}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors disabled:opacity-30 ${
                region === rg.id ? "bg-primary text-background" : "border border-surface-light text-muted enabled:hover:text-foreground"
              }`}
            >
              {rg.short}
            </button>
          );
        })}
      </div>

      {/* Figures */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <Figure value={fmtN(people)} label="people documented" />
        <Figure value={String(dests.length)} label={dests.length === 1 ? "destination country" : "destination countries"} />
        <Figure value={String(originIds.length)} label="home countries" />
      </div>

      {/* Guided tour */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={tour ? () => setTour(false) : startTour}
          aria-pressed={tour}
          className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
            tour ? "bg-primary text-background" : "border border-surface-light text-foreground hover:border-primary"
          }`}
        >
          {tour ? (
            <>
              <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
                <rect x="1" y="1" width="3" height="8" fill="currentColor" />
                <rect x="6" y="1" width="3" height="8" fill="currentColor" />
              </svg>
              Pause tour
            </>
          ) : (
            <>
              <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
                <path d="M1,1 L9,5 L1,9 Z" fill="currentColor" />
              </svg>
              Play tour
            </>
          )}
        </button>
        {tour && tourId ? (
          <span className="text-xs text-muted">
            Highlighting <b className="text-foreground">{NAME(tourId)}</b> and where its nationals were sent &middot; {(tourIdx % origins.length) + 1} of {origins.length} home countries
          </span>
        ) : (
          <span className="text-xs text-muted">Step through each home country and watch its routes draw, one at a time.</span>
        )}
      </div>

      {/* Map */}
      <div
        ref={wrapRef}
        className="relative rounded-xl border border-surface-light bg-background p-1 md:p-2"
        onMouseLeave={() => setHover(null)}
        onPointerDown={(e) => {
          pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
          if (pointers.current.size === 2) {
            const [a, b] = [...pointers.current.values()];
            pinch.current = { dist: Math.hypot(a.x - b.x, a.y - b.y), zoom };
            drag.current = null;
          } else if (pointers.current.size === 1 && canPan) {
            drag.current = { x: e.clientX, y: e.clientY, pan, moved: false };
          }
        }}
        onPointerMove={(e) => {
          if (!pointers.current.has(e.pointerId)) return;
          pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
          if (pinch.current && pointers.current.size >= 2) {
            const [a, b] = [...pointers.current.values()];
            const dist = Math.hypot(a.x - b.x, a.y - b.y);
            const r = wrapRef.current?.getBoundingClientRect();
            if (pinch.current.dist > 0 && r) {
              zoomTo(pinch.current.zoom * (dist / pinch.current.dist), ((a.x + b.x) / 2 - r.left) / r.width, ((a.y + b.y) / 2 - r.top) / r.height);
            }
            return;
          }
          const g = drag.current;
          if (!g || !wrapRef.current) return;
          const dx = e.clientX - g.x;
          const dy = e.clientY - g.y;
          if (Math.abs(dx) > 5 || Math.abs(dy) > 5) g.moved = true;
          if (!g.moved) return;
          const ux = (dx * view[2]) / wrapRef.current.clientWidth;
          const uy = (dy * view[3]) / wrapRef.current.clientHeight;
          const [lox, hix] = panBounds.current.x;
          const [loy, hiy] = panBounds.current.y;
          setPan({ x: Math.max(lox, Math.min(hix, g.pan.x - ux)), y: Math.max(loy, Math.min(hiy, g.pan.y - uy)) });
        }}
        onPointerUp={(e) => {
          pointers.current.delete(e.pointerId);
          if (pointers.current.size < 2) pinch.current = null;
          if (pointers.current.size === 0) setTimeout(() => (drag.current = null), 0);
        }}
        onPointerCancel={(e) => {
          pointers.current.delete(e.pointerId);
          pinch.current = null;
          drag.current = null;
        }}
        onClickCapture={(e) => {
          if (drag.current?.moved) {
            e.stopPropagation();
            e.preventDefault();
          }
        }}
      >
        <svg
          viewBox={view.map((v) => v.toFixed(2)).join(" ")}
          className="w-full h-auto select-none"
          style={{ touchAction: zoom > 1 ? "none" : "pan-y", cursor: canPan ? (drag.current?.moved ? "grabbing" : "grab") : "default" }}
          role="group"
          aria-label="World map of third country removal routes"
        >
          <rect x={-500} y={-500} width={2000} height={1400} fill="transparent" onClick={clearSel} />
          <path d={W.land} fill="#2c3033" />
          <path d={W.borders} fill="none" stroke="#1b1d1f" strokeWidth={0.6} vectorEffect="non-scaling-stroke" />

          {/* Routes: thick first so thin lines stay visible on top */}
          <g fill="none" strokeLinecap="round">
            {sorted.map((r) => {
              const a = arc(W.points[r.o], W.points[r.d]);
              const on = active(r);
              const key = `${r.o}-${r.d}-${r.p}`;
              const isSel = sel?.kind === "route" && sel.o === r.o && sel.d === r.d && sel.p === r.p;
              return (
                <g key={key}>
                  <motion.path
                    d={a.d}
                    stroke={PATH_STYLE[r.p].color}
                    strokeWidth={widthFor(r.n) * (isSel ? 1.5 : 1)}
                    strokeDasharray={r.n == null ? "3 3" : undefined}
                    vectorEffect="non-scaling-stroke"
                    initial={false}
                    animate={{ opacity: on ? (focusMode ? 0.14 : sel ? 0.95 : 0.6) : focusMode ? 0.04 : 0.07 }}
                    transition={{ duration: 0.3 }}
                  />
                  <path
                    d={a.d}
                    stroke="transparent"
                    strokeWidth={10}
                    vectorEffect="non-scaling-stroke"
                    className="cursor-pointer"
                    onMouseMove={(e) => tip(e, `${NAME(r.o)} to ${NAME(r.d)}`, r.n == null ? "Count not reported" : `${fmtN(r.n)} documented`)}
                    onMouseLeave={() => setHover(null)}
                    onClick={() => toggle({ kind: "route", o: r.o, d: r.d, p: r.p })}
                  />
                </g>
              );
            })}
          </g>

          {/* Court case markers */}
          {showCases &&
            cases.map(({ c, i, hasRoute }) => {
              const pd = W.points[c.d];
              const po = c.o ? W.points[c.o] : null;
              const a = po ? arc(po, pd) : null;
              const at: [number, number] = a ? a.mid : [pd[0] + 9 * k, pd[1] - 9 * k];
              const on =
                !sel ||
                (sel.kind === "case" && sel.i === i) ||
                (sel.kind === "dest" && sel.id === c.d) ||
                (sel.kind === "origin" && sel.id === c.o) ||
                (sel.kind === "route" && sel.d === c.d && sel.o === c.o);
              return (
                <g key={c.name} opacity={on ? 1 : 0.25}>
                  {a && !hasRoute && (
                    <path d={a.d} fill="none" stroke={OUTCOME[c.outcome].color} strokeWidth={1.2} strokeDasharray="1 3" vectorEffect="non-scaling-stroke" />
                  )}
                  <g
                    transform={`translate(${at[0]},${at[1]}) scale(${k})`}
                    className="cursor-pointer"
                    onMouseMove={(e) => tip(e, c.name, `${c.court}. ${OUTCOME[c.outcome].label}`)}
                    onMouseLeave={() => setHover(null)}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggle({ kind: "case", i });
                    }}
                  >
                    <rect x={-5.5} y={-5.5} width={11} height={11} rx={2.5} transform="rotate(45)" fill={OUTCOME[c.outcome].color} stroke="#0f1112" strokeWidth={1.4} />
                    <text y={2.6} textAnchor="middle" fontSize={7.5} fontWeight={700} fill="#0f1112" style={{ pointerEvents: "none" }}>
                      §
                    </text>
                  </g>
                </g>
              );
            })}

          {/* Home countries: hollow rings */}
          {originIds.map((o) => {
            const p = W.points[o];
            const on = !sel || routes.some((r) => r.o === o && active(r));
            return (
              <circle
                key={`o-${o}`}
                cx={p[0]}
                cy={p[1]}
                r={3.4 * k}
                fill="#0f1112"
                stroke="#e5e7eb"
                strokeWidth={1.4}
                vectorEffect="non-scaling-stroke"
                opacity={on ? 1 : 0.2}
                className="cursor-pointer"
                onMouseMove={(e) => tip(e, NAME(o), "Home country")}
                onMouseLeave={() => setHover(null)}
                onClick={() => toggle({ kind: "origin", id: o })}
              />
            );
          })}

          {/* Destinations: pins sized by people received */}
          {dests.map(({ id, n }) => {
            const p = W.points[id];
            if (!p) return null;
            const s = (0.75 + 0.32 * Math.log10(Math.max(n, 2))) * k;
            const on = !sel || routes.some((r) => r.d === id && active(r)) || (sel.kind === "dest" && sel.id === id);
            const color = PATH_STYLE[DEST_BY_ID[id].pathways.find((x) => f.ps.includes(x)) ?? "deal"].color;
            const isSel = sel?.kind === "dest" && sel.id === id;
            return (
              <g
                key={`d-${id}`}
                transform={`translate(${p[0]},${p[1]}) scale(${s})`}
                opacity={on ? 1 : 0.25}
                className="cursor-pointer"
                onMouseMove={(e) => tip(e, NAME(id), `${DEST_BY_ID[id].label} received`)}
                onMouseLeave={() => setHover(null)}
                onClick={() => toggle({ kind: "dest", id })}
              >
                <path d="M0,0 C-2.2,-3.2 -5,-5.6 -5,-9 A5,5 0 1 1 5,-9 C5,-5.6 2.2,-3.2 0,0 Z" fill={color} stroke={isSel ? "#fff" : "#0f1112"} strokeWidth={isSel ? 1.6 : 1} vectorEffect="non-scaling-stroke" />
                <circle cy={-9} r={1.9} fill="#0f1112" />
              </g>
            );
          })}

          {/* Clickable continent labels, shown only in the world overview */}
          {region === "all" &&
            !sel &&
            !tour &&
            regionLabels.map((rl) => (
              <g
                key={`rl-${rl.id}`}
                transform={`translate(${rl.x},${rl.y}) scale(${k})`}
                className="cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  pickRegion(rl.id);
                }}
                onMouseMove={(e) => tip(e, REGION_LABEL[rl.id], "Click to focus this region")}
                onMouseLeave={() => setHover(null)}
              >
                <rect x={-(rl.label.length * 4.1 + 12)} y={-9} width={rl.label.length * 8.2 + 24} height={18} rx={9} fill="#0f1112" stroke="#8a9099" strokeWidth={1.1} opacity={0.82} />
                <text textAnchor="middle" y={4} fontSize={10.5} fontWeight={700} fill="#e5e7eb" letterSpacing={0.3} style={{ textTransform: "uppercase" }}>
                  {rl.label}
                </text>
              </g>
            ))}

          {/* Focus overlay: animated routes, per-line counts, and country labels */}
          {focusMode &&
            (() => {
              const act = routes.filter(active);
              const mainId = sel!.id;
              const otherId = (r: Route) => (sel!.kind === "origin" ? r.d : r.o);
              const otherIds = [...new Set(act.map(otherId))].filter((id) => id !== mainId);
              const showCounts = act.length <= 26;
              const showNames = act.length <= 14;
              return (
                <g key={`focus-${sel!.kind}-${mainId}`}>
                  {act.map((r) => {
                    const a = arc(W.points[r.o], W.points[r.d]);
                    return (
                      <motion.path
                        key={`fp-${r.o}-${r.d}-${r.p}`}
                        d={a.d}
                        fill="none"
                        stroke={PATH_STYLE[r.p].color}
                        strokeWidth={Math.max(widthFor(r.n), 2.2)}
                        strokeDasharray={r.n == null ? "4 3" : undefined}
                        strokeLinecap="round"
                        vectorEffect="non-scaling-stroke"
                        initial={{ pathLength: 0, opacity: 0.25 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 0.75, ease: "easeInOut" }}
                      />
                    );
                  })}
                  {showCounts &&
                    act.map((r) => {
                      const a = arc(W.points[r.o], W.points[r.d]);
                      return <CountLabel key={`fc-${r.o}-${r.d}-${r.p}`} x={a.mid[0]} y={a.mid[1]} k={k} n={r.n} color={PATH_STYLE[r.p].color} />;
                    })}
                  {showNames && otherIds.map((id) => W.points[id] && <MapLabel key={`fn-${id}`} point={W.points[id]} k={k} text={NAME(id)} dy={13} />)}
                  {W.points[mainId] && <MapLabel point={W.points[mainId]} k={k} text={NAME(mainId)} dy={-15} big />}
                </g>
              );
            })()}
        </svg>

        {/* Hover tooltip */}
        <AnimatePresence>
          {hover && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              className="pointer-events-none absolute z-10 hidden md:block rounded-lg border border-surface-light bg-surface px-3 py-2 shadow-lg max-w-[260px]"
              style={{ left: Math.min(hover.x + 14, (wrapRef.current?.clientWidth ?? 600) - 270), top: hover.y + 14 }}
            >
              <p className="text-sm font-semibold text-foreground leading-snug">{hover.text}</p>
              {hover.sub && <p className="text-xs text-muted mt-0.5">{hover.sub}</p>}
            </motion.div>
          )}
        </AnimatePresence>

        {sel && (
          <button
            type="button"
            onClick={clearSel}
            className="absolute top-2 right-2 md:top-3 md:right-3 rounded-full border border-surface-light bg-surface px-3 py-1 text-xs font-semibold text-muted hover:text-foreground"
          >
            Show whole map
          </button>
        )}

        {/* Zoom controls */}
        <div className="absolute left-2 bottom-2 md:left-3 md:bottom-3 flex flex-col gap-1">
          <ZoomBtn label="Zoom in" onClick={() => zoomTo(zoom * 1.6)} disabled={zoom >= 10}>
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
              <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </ZoomBtn>
          <ZoomBtn label="Zoom out" onClick={() => zoomTo(zoom / 1.6)} disabled={zoom <= 1}>
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
              <path d="M2 7h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </ZoomBtn>
          {(zoom > 1 || pan.x !== 0 || pan.y !== 0) && (
            <ZoomBtn label="Reset zoom" onClick={resetZoom}>
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
                <path d="M3 5V3h2M11 5V3H9M3 9v2h2M11 9v2H9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none" />
              </svg>
            </ZoomBtn>
          )}
        </div>
      </div>

      <p className="mt-2 text-xs text-muted">
        {region === "all"
          ? "Tap a continent label to focus a region. Scroll or pinch to zoom, drag to pan."
          : `Showing routes to or from ${REGION_LABEL[region]}. Scroll or pinch to zoom, drag to pan.`}{" "}
        Tap a pin, a ring, or a line for detail.
      </p>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted">
        <span className="inline-flex items-center gap-1.5">
          <svg width="14" height="14" viewBox="-7 -7 14 14" aria-hidden>
            <circle r="4" fill="#0f1112" stroke="#e5e7eb" strokeWidth="1.5" />
          </svg>
          Home country
        </span>
        <span className="inline-flex items-center gap-1.5">
          <svg width="12" height="16" viewBox="-6 -15 12 16" aria-hidden>
            <path d="M0,0 C-2.2,-3.2 -5,-5.6 -5,-9 A5,5 0 1 1 5,-9 C5,-5.6 2.2,-3.2 0,0 Z" fill="#9ca3af" />
          </svg>
          Destination, sized by people received
        </span>
        <span className="inline-flex flex-wrap items-center gap-x-3 gap-y-1">
          <span>People on a route:</span>
          {[...BUCKETS].reverse().map((b) => (
            <span key={b.label} className="inline-flex items-center gap-1 whitespace-nowrap">
              <svg width="22" height="8" aria-hidden>
                <line x1="1" y1="4" x2="21" y2="4" stroke="#cbd5e1" strokeWidth={b.w} strokeLinecap="round" />
              </svg>
              {b.label}
            </span>
          ))}
          <span className="inline-flex items-center gap-1 whitespace-nowrap">
            <svg width="22" height="8" aria-hidden>
              <line x1="1" y1="4" x2="21" y2="4" stroke="#cbd5e1" strokeWidth={1.1} strokeDasharray="3 3" />
            </svg>
            not reported
          </span>
        </span>
        <button
          type="button"
          onClick={() => setShowCases((v) => !v)}
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-semibold transition-colors ${
            showCases ? "border-surface-light text-foreground" : "border-transparent text-muted hover:text-foreground"
          }`}
          aria-pressed={showCases}
        >
          <svg width="12" height="12" viewBox="-7 -7 14 14" aria-hidden>
            <rect x="-4.5" y="-4.5" width="9" height="9" rx="2" transform="rotate(45)" fill={showCases ? "#e5e7eb" : "#6b7280"} />
          </svg>
          Court cases {showCases ? "shown" : "hidden"}
        </button>
      </div>

      {/* Detail */}
      <div className="mt-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={JSON.stringify(sel) + filter}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            {!sel && <Overview dests={dests} origins={origins} ps={f.ps} cases={cases.map((x) => x.i)} onPick={toggle} />}
            {sel?.kind === "dest" && <DestDetail id={sel.id} routes={routes.filter((r) => r.d === sel.id)} onPick={toggle} />}
            {sel?.kind === "origin" && <OriginDetail id={sel.id} routes={routes.filter((r) => r.o === sel.id)} onPick={toggle} />}
            {sel?.kind === "route" && <RouteDetail r={routes.find((r) => r.o === sel.o && r.d === sel.d && r.p === sel.p)} onPick={toggle} />}
            {sel?.kind === "case" && <CaseDetail i={sel.i} onPick={toggle} />}
          </motion.div>
        </AnimatePresence>
      </div>

      <p className="text-[11px] text-muted mt-6 leading-relaxed">
        Counts are documented minimums, compiled from{" "}
        <a className="underline hover:text-foreground" href={D.sources.tcdw} target="_blank" rel="noreferrer">
          Third Country Deportation Watch
        </a>{" "}
        (as of Sept. 10, 2026), the ICE removal records analyzed by{" "}
        <a className="underline hover:text-foreground" href={D.sources.hrw} target="_blank" rel="noreferrer">
          Human Rights Watch
        </a>
        , and the{" "}
        <a className="underline hover:text-foreground" href={D.sources.uscri} target="_blank" rel="noreferrer">
          USCRI tracker
        </a>
        . A line&apos;s width counts only people whose nationality was reported, so destination totals run higher than the lines into them. Home country means
        nationality, except in the Other view, where it marks the birth country. Some people were later sent on from the destination, often back to the home
        country a U.S. judge had protected them from.
      </p>
    </div>
  );
}

function ZoomBtn({ label, onClick, disabled, children }: { label: string; onClick: () => void; disabled?: boolean; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className="flex h-8 w-8 items-center justify-center rounded-lg border border-surface-light bg-surface/90 text-foreground shadow-sm backdrop-blur transition-colors hover:border-primary hover:text-primary disabled:opacity-35 disabled:hover:border-surface-light disabled:hover:text-foreground"
    >
      {children}
    </button>
  );
}

/** A count pill pinned to a route's midpoint, telling you how many people. */
function CountLabel({ x, y, k, n, color }: { x: number; y: number; k: number; n: number | null; color: string }) {
  const text = n == null ? "?" : fmtN(n);
  const w = text.length * 5.8 + 12;
  return (
    <g transform={`translate(${x},${y}) scale(${k})`} style={{ pointerEvents: "none" }}>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.25 }}>
        <rect x={-w / 2} y={-8.5} width={w} height={17} rx={8.5} fill="#0f1112" stroke={color} strokeWidth={1.3} />
        <text textAnchor="middle" y={3.9} fontSize={10.5} fontWeight={700} fill="#f8fafc">
          {text}
        </text>
      </motion.g>
    </g>
  );
}

/** A country-name label; `big` is the focused country, plain labels are its partners. */
function MapLabel({ point, k, text, dy, big }: { point: [number, number]; k: number; text: string; dy: number; big?: boolean }) {
  const fs = big ? 13 : 9.5;
  const w = text.length * fs * 0.62 + (big ? 20 : 12);
  const h = big ? 22 : 16;
  return (
    <g transform={`translate(${point[0]},${point[1]}) scale(${k})`} style={{ pointerEvents: "none" }}>
      <motion.g initial={{ opacity: 0, y: dy > 0 ? -4 : 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: big ? 0 : 0.2 }}>
        <rect
          x={-w / 2}
          y={dy - h / 2}
          width={w}
          height={h}
          rx={h / 2}
          fill={big ? "#f8fafc" : "#0f1112"}
          stroke={big ? "#0f1112" : "#e5e7eb"}
          strokeWidth={big ? 0 : 1.1}
        />
        <text textAnchor="middle" y={dy + fs * 0.36} fontSize={fs} fontWeight={big ? 800 : 600} fill={big ? "#0f1112" : "#f8fafc"}>
          {text}
        </text>
      </motion.g>
    </g>
  );
}

function Figure({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-lg border border-surface-light bg-background p-3 min-w-0">
      <p className="text-xl md:text-3xl font-semibold text-foreground leading-none tabular-nums">{value}</p>
      <p className="text-[11px] md:text-xs text-muted mt-1.5 leading-snug">{label}</p>
    </div>
  );
}

function Bar({ label, value, max, sub, color, dashed, onClick }: { label: string; value: number | null; max: number; sub?: string; color: string; dashed?: boolean; onClick: () => void }) {
  const pct = value == null ? 0 : Math.max(2, (Math.sqrt(value) / Math.sqrt(max || 1)) * 100);
  return (
    <li>
      <button type="button" onClick={onClick} className="w-full grid grid-cols-[minmax(0,9rem)_1fr_auto] items-center gap-3 py-1 text-left group">
        <span className="text-sm text-foreground truncate group-hover:text-primary">{label}</span>
        <span className="h-2 rounded-full bg-surface-light overflow-hidden">
          {value != null ? (
            <span className="block h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
          ) : (
            <span className="block h-full w-full" style={{ background: `repeating-linear-gradient(90deg, ${color} 0 4px, transparent 4px 8px)`, opacity: dashed ? 0.6 : 1 }} />
          )}
        </span>
        <span className="text-xs text-muted tabular-nums whitespace-nowrap">{value == null ? (sub ?? "not reported") : fmtN(value)}</span>
      </button>
    </li>
  );
}

function ListBlock({ title, children, more }: { title: string; children: React.ReactNode; more?: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <p className="text-[11px] font-mono uppercase tracking-wider text-muted border-b border-surface-light pb-1.5 mb-2">{title}</p>
      <ul>{children}</ul>
      {more}
    </div>
  );
}

function Overview({
  dests,
  origins,
  ps,
  cases,
  onPick,
}: {
  ps: Pathway[];
  dests: { id: string; n: number }[];
  origins: { id: string; n: number; dests: Set<string>; counted: boolean }[];
  cases: number[];
  onPick: (s: NonNullable<Sel>) => void;
}) {
  const [all, setAll] = useState(false);
  const lim = all ? 999 : 8;
  const dMax = dests[0]?.n ?? 1;
  const oMax = origins[0]?.n ?? 1;
  return (
    <div>
      <div className="grid md:grid-cols-2 gap-6">
        <ListBlock title="Destinations, by people received">
          {dests.slice(0, lim).map((d) => (
            <Bar
              key={d.id}
              label={NAME(d.id)}
              value={d.n}
              max={dMax}
              color={PATH_STYLE[DEST_BY_ID[d.id].pathways.find((p) => ps.includes(p)) ?? "deal"].color}
              onClick={() => onPick({ kind: "dest", id: d.id })}
            />
          ))}
        </ListBlock>
        <ListBlock title="Home countries, by people documented">
          {origins.slice(0, lim).map((o) => (
            <Bar
              key={o.id}
              label={NAME(o.id)}
              value={o.counted ? o.n : null}
              sub={`${o.dests.size} ${o.dests.size === 1 ? "destination" : "destinations"}`}
              max={oMax}
              color="#cbd5e1"
              onClick={() => onPick({ kind: "origin", id: o.id })}
            />
          ))}
        </ListBlock>
      </div>
      {(dests.length > 8 || origins.length > 8) && (
        <button type="button" onClick={() => setAll((v) => !v)} className="mt-3 text-xs font-semibold text-primary hover:underline">
          {all ? "Show fewer" : `Show all ${dests.length} destinations and ${origins.length} home countries`}
        </button>
      )}
      {cases.length > 0 && (
        <div className="mt-6">
          <p className="text-[11px] font-mono uppercase tracking-wider text-muted border-b border-surface-light pb-1.5 mb-2">Court cases on these routes</p>
          <div className="flex flex-wrap gap-2">
            {cases.map((i) => {
              const c = D.cases[i];
              return (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => onPick({ kind: "case", i })}
                  className="inline-flex items-center gap-2 rounded-full border border-surface-light px-3 py-1 text-xs text-foreground hover:border-primary"
                >
                  <span className="inline-block w-2 h-2 rotate-45 rounded-[1px]" style={{ background: OUTCOME[c.outcome].color }} aria-hidden />
                  <span className="italic">{c.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function Header({ eyebrow, title, color }: { eyebrow: string; title: string; color?: string }) {
  return (
    <div className="mb-3">
      <p className="text-[11px] font-mono uppercase tracking-wider text-muted">{eyebrow}</p>
      <h4 className="text-lg font-bold text-foreground flex items-center gap-2">
        {color && <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: color }} aria-hidden />}
        {title}
      </h4>
    </div>
  );
}

function CasesOn({ match, onPick }: { match: (c: Case) => boolean; onPick: (s: NonNullable<Sel>) => void }) {
  const list = D.cases.map((c, i) => ({ c, i })).filter(({ c }) => match(c));
  if (!list.length) return null;
  return (
    <div className="mt-5">
      <p className="text-[11px] font-mono uppercase tracking-wider text-muted mb-2">Court cases</p>
      <div className="space-y-2">
        {list.map(({ c, i }) => (
          <button key={c.name} type="button" onClick={() => onPick({ kind: "case", i })} className="block w-full text-left rounded-lg border border-surface-light p-3 hover:border-primary">
            <p className="text-sm text-foreground">
              <span className="italic font-semibold">{c.name}</span> <span className="text-muted">({c.court})</span>
            </p>
            <p className="text-xs text-muted mt-1">{c.text}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

function DestDetail({ id, routes, onPick }: { id: string; routes: Route[]; onPick: (s: NonNullable<Sel>) => void }) {
  const d = DEST_BY_ID[id];
  const rs = [...routes].sort((a, b) => (b.n ?? -1) - (a.n ?? -1));
  const max = Math.max(1, ...rs.map((r) => r.n ?? 0));
  const ps = d.pathways;
  return (
    <div>
      <Header eyebrow="Destination" title={NAME(id)} color={PATH_STYLE[ps[0]].color} />
      <div className="grid sm:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] gap-6">
        <div>
          <p className="text-2xl font-semibold text-foreground">{d.label}</p>
          <p className="text-xs text-muted mt-1">
            {ps.map((p) => PATH_STYLE[p].label).join("; ")}. First documented transfer {fmtDate(d.first)}.
          </p>
          {d.note && <p className="text-sm text-muted mt-3 leading-relaxed">{d.note}</p>}
          <a href={d.url} target="_blank" rel="noreferrer" className="inline-block mt-3 text-xs font-semibold text-primary hover:underline">
            Source ↗
          </a>
        </div>
        <ListBlock title={`Sent from ${rs.length} ${rs.length === 1 ? "country" : "countries"}`}>
          {rs.map((r) => (
            <Bar
              key={r.o + r.p}
              label={NAME(r.o)}
              value={r.n}
              max={max}
              color={PATH_STYLE[r.p].color}
              dashed
              onClick={() => onPick({ kind: "route", o: r.o, d: r.d, p: r.p })}
            />
          ))}
        </ListBlock>
      </div>
      <CasesOn match={(c) => c.d === id} onPick={onPick} />
    </div>
  );
}

function OriginDetail({ id, routes, onPick }: { id: string; routes: Route[]; onPick: (s: NonNullable<Sel>) => void }) {
  const rs = [...routes].sort((a, b) => (b.n ?? -1) - (a.n ?? -1));
  const max = Math.max(1, ...rs.map((r) => r.n ?? 0));
  const total = rs.reduce((s, r) => s + (r.n ?? 0), 0);
  const born = rs.some((r) => r.p === "born");
  return (
    <div>
      <Header eyebrow={born ? "Birth country" : "Home country"} title={NAME(id)} />
      <p className="text-sm text-muted mb-4">
        {total > 0 ? `At least ${fmtN(total)} ${born ? "people born here" : "nationals"} documented` : `${born ? "People born here" : "Nationals"} documented, count not reported`}, sent to {rs.length}{" "}
        {rs.length === 1 ? "country" : "countries"} in this view.
      </p>
      <ListBlock title="Sent to">
        {rs.map((r) => (
          <Bar key={r.d + r.p} label={NAME(r.d)} value={r.n} max={max} color={PATH_STYLE[r.p].color} dashed onClick={() => onPick({ kind: "route", o: r.o, d: r.d, p: r.p })} />
        ))}
      </ListBlock>
      <CasesOn match={(c) => c.o === id} onPick={onPick} />
    </div>
  );
}

function RouteDetail({ r, onPick }: { r: Route | undefined; onPick: (s: NonNullable<Sel>) => void }) {
  if (!r) return null;
  const d = DEST_BY_ID[r.d];
  return (
    <div>
      <Header eyebrow={PATH_STYLE[r.p].label} title={`${NAME(r.o)} to ${NAME(r.d)}`} color={PATH_STYLE[r.p].color} />
      <p className="text-2xl font-semibold text-foreground">{r.n == null ? "Count not reported" : `${fmtN(r.n)} ${r.n === 1 ? "person" : "people"} documented`}</p>
      <dl className="mt-4 grid grid-cols-1 sm:grid-cols-[130px_1fr] gap-x-4 gap-y-2 text-sm">
        <dt className="text-muted">{r.flights.length === 1 ? "Transfer" : "Transfers"}</dt>
        <dd className="text-foreground">{r.flights.map(([date, label]) => label ?? fmtDate(date)).join("; ")}</dd>
        {r.prot && (
          <>
            <dt className="text-muted">Protection</dt>
            <dd className="text-foreground">Reporting says at least some people on these transfers held U.S. protection from return to their home countries.</dd>
          </>
        )}
        <dt className="text-muted">Destination</dt>
        <dd className="text-foreground">
          <button type="button" className="text-primary hover:underline" onClick={() => onPick({ kind: "dest", id: r.d })}>
            {NAME(r.d)}
          </button>
          <span className="text-muted">, {d.label} received</span>
        </dd>
        <dt className="text-muted">Source</dt>
        <dd className="text-foreground">
          {r.src.map((s, i) => (
            <span key={s}>
              {i > 0 && "; "}
              <a className="underline hover:text-primary" href={s === "tcdw" ? d.url : s === "hrw" ? D.sources.hrw : D.sources.uscri} target="_blank" rel="noreferrer">
                {SRC_LABEL[s]}
              </a>
            </span>
          ))}
        </dd>
      </dl>
      <CasesOn match={(c) => c.d === r.d && c.o === r.o} onPick={onPick} />
    </div>
  );
}

function CaseDetail({ i, onPick }: { i: number; onPick: (s: NonNullable<Sel>) => void }) {
  const c = D.cases[i];
  const o = OUTCOME[c.outcome];
  return (
    <div>
      <Header eyebrow={c.court} title={c.name} color={o.color} />
      <p className="text-sm font-semibold" style={{ color: o.color }}>
        {o.label}
      </p>
      <p className="text-sm text-foreground mt-2 leading-relaxed max-w-2xl">{c.text}</p>
      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        {c.o && (
          <button type="button" className="rounded-full border border-surface-light px-3 py-1 text-foreground hover:border-primary" onClick={() => onPick({ kind: "origin", id: c.o! })}>
            Home country: {NAME(c.o)}
          </button>
        )}
        <button type="button" className="rounded-full border border-surface-light px-3 py-1 text-foreground hover:border-primary" onClick={() => onPick({ kind: "dest", id: c.d })}>
          Destination: {NAME(c.d)}
        </button>
      </div>
    </div>
  );
}
