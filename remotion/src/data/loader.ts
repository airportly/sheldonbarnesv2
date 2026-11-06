/**
 * Single data loader for the video. Reads the same JSON the blog posts use
 * (routes.json, circuits.json) plus the new animation-cases.json, and joins
 * coordinates by ISO3 so case records stay lean and in sync with the posts.
 *
 * The data files live in the website, not this workspace, so the paths reach
 * three directories up. Remotion's bundler resolves these relative imports.
 */
import routesRaw from "../../../src/data/third-country/routes.json";
import circuitsRaw from "../../../src/data/third-country/circuits.json";
import casesRaw from "../../../src/data/third-country/animation-cases.json";

// ---------- source shapes (only the fields we use) ----------

export type Coord = { lon: number; lat: number };
export type CountryRec = { name: string; lon: number; lat: number };

export type Route = {
  o: string; // origin ISO3
  d: string; // destination ISO3
  p: string; // pathway
  n?: number | null; // documented count (minimum)
  prot?: boolean;
  src?: string[];
};

export type Destination = {
  id: string;
  total: number;
  label: string;
  note?: string;
  url?: string;
};

export type Outcome =
  | "removed"
  | "blocked"
  | "allowed"
  | "returned"
  | "sentOnHome";

export type Barred = {
  country: string;
  protectionType: "withholding" | "CAT" | string;
  year: number | null;
};

export type Source = { label: string; url: string };

export type CaseRaw = {
  id: string;
  role: "main" | "rapid";
  name: string;
  court: string;
  date: string | null;
  detained: string | null;
  origin: string | null;
  usLocation: { label: string; lon: number; lat: number } | null;
  barred: Barred | null;
  destination: string;
  via: string | null;
  outcome: Outcome;
  onwardTo: string | null;
  chainReturn: boolean;
  noticeHours: number | null;
  assurances: boolean;
  quote: string | null;
  quoteSource: string | null;
  notes: string;
  sources: Source[];
};

// ---------- parsed, typed data ----------

const routes = routesRaw as {
  asOf: string;
  sources: Record<string, string>;
  countries: Record<string, CountryRec>;
  destinations: Destination[];
  routes: Route[];
  cases: unknown[];
};

const circuits = circuitsRaw as {
  asOf: string;
  scotus: { caseName: string; docket: string; argument: string };
  timeline: { date: string; title?: string; label?: string }[];
};

const casesFile = casesRaw as {
  asOf: string;
  usCentroid: { lon: number; lat: number; label: string };
  sourceUrls: Record<string, string>;
  cases: CaseRaw[];
};

// ---------- joins + accessors ----------

export const COUNTRIES = routes.countries;
export const ROUTES = routes.routes;
export const DESTINATIONS = routes.destinations;
export const US_CENTROID = casesFile.usCentroid;
export const AS_OF = casesFile.asOf;
export const SCOTUS = circuits.scotus;
export const TIMELINE = circuits.timeline;

/** Totals shown in the top bar counters and end card. */
export const TOTALS = {
  people: 25702,
  destinations: 34,
  homeCountries: 77,
  routes: ROUTES.length, // 231 documented
} as const;

export function coordOf(iso3: string | null): Coord | null {
  if (!iso3) return null;
  const c = COUNTRIES[iso3];
  return c ? { lon: c.lon, lat: c.lat } : null;
}

export function nameOf(iso3: string | null): string | null {
  if (!iso3) return null;
  return COUNTRIES[iso3]?.name ?? null;
}

export function destinationOf(iso3: string): Destination | undefined {
  return DESTINATIONS.find((d) => d.id === iso3);
}

/** A case with every coordinate and display name resolved, ready to animate. */
export type ResolvedCase = CaseRaw & {
  index: number; // 1-based position among featured cases
  total: number; // count of featured cases (for CASE 03 / 09)
  usPin: { lon: number; lat: number; label: string }; // falls back to centroid
  originCoord: Coord | null;
  barredCoord: Coord | null;
  destinationCoord: Coord | null;
  viaCoord: Coord | null;
  onwardCoord: Coord | null;
  originName: string | null;
  barredName: string | null;
  destinationName: string | null;
  destinationRec: Destination | undefined;
};

export function resolveCase(c: CaseRaw, index: number, total: number): ResolvedCase {
  const usPin = c.usLocation ?? {
    lon: US_CENTROID.lon,
    lat: US_CENTROID.lat,
    label: US_CENTROID.label, // "LOCATION NOT PUBLIC"
  };
  return {
    ...c,
    index,
    total,
    usPin,
    originCoord: coordOf(c.origin),
    barredCoord: coordOf(c.barred?.country ?? null),
    destinationCoord: coordOf(c.destination),
    viaCoord: coordOf(c.via),
    onwardCoord: coordOf(c.onwardTo),
    originName: nameOf(c.origin),
    barredName: nameOf(c.barred?.country ?? null),
    destinationName: nameOf(c.destination),
    destinationRec: destinationOf(c.destination),
  };
}

const total = casesFile.cases.length;
export const CASES: ResolvedCase[] = casesFile.cases.map((c, i) =>
  resolveCase(c, i + 1, total),
);

export const MAIN_CASES = CASES.filter((c) => c.role === "main");
export const RAPID_CASES = CASES.filter((c) => c.role === "rapid");

export function caseById(id: string): ResolvedCase | undefined {
  return CASES.find((c) => c.id === id);
}
