import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

export const runtime = "nodejs";

const supported = new Set(["en", "fr", "he", "ar"]);

export async function GET(_request: Request, { params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!supported.has(lang)) return new Response("Not found", { status: 404 });

  const bytes = await readFile(path.join(process.cwd(), "public", "journey-to-school", `${lang}-17.jpg`));
  const dataUrl = `data:image/jpeg;base64,${bytes.toString("base64")}`;

  return new ImageResponse(
    <div style={{ display: "flex", position: "relative", width: 1200, height: 630, overflow: "hidden" }}>
      {/* The last comic panel begins near the lower third of each 800×1200 page. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={dataUrl} width={1375} height={2063} style={{ position: "absolute", top: -1433, left: -87, width: 1375, height: 2063 }} alt="" />
    </div>,
    { width: 1200, height: 630 },
  );
}
