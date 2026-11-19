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
    <div style={{ width: 1200, height: 630, display: "flex", backgroundImage: `url(${dataUrl})`, backgroundSize: "cover", backgroundPosition: "center bottom" }} />,
    { width: 1200, height: 630 },
  );
}
