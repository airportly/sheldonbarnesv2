"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const CHROME_HIDE_DELAY_MS = 15_000;

// Messages are exchanged with the iframe via postMessage. Namespaced so we
// don't pick up stray messages from other embeds or extensions.
const MSG_HIDE = "molecule-viewer:hide-chrome";
const MSG_SHOW = "molecule-viewer:show-chrome";

export default function Viewer() {
  const [chromeVisible, setChromeVisible] = useState(true);

  // 15-second branded intro: after the user has had time to see the header,
  // collapse everything around the tool so the viewer owns the viewport.
  useEffect(() => {
    const t = setTimeout(() => setChromeVisible(false), CHROME_HIDE_DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  // Voice commands inside the iframe post up here to toggle the chrome.
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
                AI Voice-Guided{" "}
                <span className="gradient-text">Molecule Viewer</span>
              </h1>
              <p className="text-muted text-sm md:text-base max-w-2xl mx-auto">
                A hands-free 3D viewer for Boltz-2 structure predictions. Tap
                the assistant and ask it to walk a chain, focus a residue,
                launch a guided tour, or say &ldquo;hide top nav&rdquo; for
                fullscreen. Voice commands need Chrome or Edge; click and touch
                work everywhere.
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
              src="/tools/molecule-viewer/index.html"
              title="AI Voice-Guided Molecule Viewer"
              className={
                chromeVisible
                  ? "block w-full h-[calc(100dvh-11rem)] md:h-[calc(100vh-14rem)] min-h-[480px]"
                  : "block w-full h-[100dvh]"
              }
              allow="microphone; autoplay"
            />
          </div>
        </section>
      </main>
      {chromeVisible && <Footer />}
    </>
  );
}
