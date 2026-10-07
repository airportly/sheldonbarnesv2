"use client";

import { useState } from "react";

/**
 * A Bluebook citation rendered from [text, italic] segments, with a one tap
 * copy button. Copies plain text (italics cannot survive a plain clipboard).
 */
export type CiteSegments = [string, boolean][];

export default function Cite({ segs, className = "" }: { segs: CiteSegments; className?: string }) {
  const [copied, setCopied] = useState(false);
  const plain = segs.map(([t]) => t).join("");
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(plain);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      /* clipboard unavailable; the text stays selectable */
    }
  };
  return (
    <span className={`inline ${className}`}>
      <span className="select-all">
        {segs.map(([t, it], i) => (it ? <em key={i}>{t}</em> : <span key={i}>{t}</span>))}
      </span>{" "}
      <button
        type="button"
        onClick={copy}
        className="inline-flex align-baseline items-center px-1.5 py-0 rounded border border-surface-light text-[10px] font-semibold text-muted hover:text-primary hover:border-primary transition-colors not-italic"
        aria-label="Copy citation"
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </span>
  );
}
