"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// After a brief branded intro, collapse the site chrome so the tool owns the
// viewport. Matches the pattern used by the Molecule Viewer.
const CHROME_HIDE_DELAY_MS = 15_000;

const MSG_HIDE = "genome-os:hide-chrome";
const MSG_SHOW = "genome-os:show-chrome";

export default function Viewer() {
  const [chromeVisible, setChromeVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setChromeVisible(false), CHROME_HIDE_DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      if (e.data === MSG_HIDE) setChromeVisible(false);
      else if (e.data === MSG_SHOW) setChromeVisible(true);
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  return (
    <>
      {chromeVisible && <Navbar />}
      <main className={chromeVisible ? "pt-20 md:pt-24" : ""}>
        {chromeVisible && (
          <section className="px-6 pb-3 md:pb-6">
            <div className="max-w-5xl mx-auto text-center">
              <div className="flex items-center justify-center gap-2 mb-2 md:mb-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/sheldonbarnes-logo.png"
                  alt=""
                  aria-hidden="true"
                  className="h-6 md:h-8 w-auto"
                />
                <span className="text-primary font-mono text-sm md:text-base tracking-wide">
                  SheldonBarnes.com
                </span>
              </div>
              <h1 className="text-2xl md:text-5xl font-bold mb-2 md:mb-4">
                GenomeOS — <span className="gradient-text">Chromatin Explorer</span>
              </h1>
              <p className="text-muted text-sm md:text-base max-w-2xl mx-auto">
                Zoom through eight levels of chromatin organization, from the
                whole nucleus down to individual atoms, anchored on the β-globin
                locus. Click any element to learn more, play the mitosis or
                replication animations, or hit <em>Take the tour</em> for a
                narrated walkthrough. Scroll or pinch to zoom.
              </p>
            </div>
          </section>
        )}

        <section className={chromeVisible ? "px-0 md:px-6 pb-8 md:pb-12" : ""}>
          <div
            className={
              chromeVisible
                ? "max-w-7xl mx-auto md:rounded-lg overflow-hidden border-y md:border border-surface-light"
                : ""
            }
          >
            <iframe
              src="/tools/genome-os-viewer/index.html"
              title="GenomeOS — Interactive Chromatin Explorer"
              className={
                chromeVisible
                  ? "block w-full h-[calc(100dvh-11rem)] md:h-[calc(100vh-14rem)] min-h-[480px]"
                  : "block w-full h-[100dvh]"
              }
              allow="autoplay"
            />
          </div>
        </section>
      </main>
      {chromeVisible && <Footer />}
    </>
  );
}
