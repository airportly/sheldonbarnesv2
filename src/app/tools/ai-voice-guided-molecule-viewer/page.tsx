import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "AI Voice-Guided Molecule Viewer — Director's Toolkit | Sheldon Barnes",
  description:
    "Hands-free 3D molecular viewer for Boltz-2 structure predictions. Ask the assistant to walk a protein chain, focus a residue, or launch a guided tour — powered by Mol* and browser speech recognition.",
  alternates: {
    canonical: "https://sheldonbarnes.com/tools/ai-voice-guided-molecule-viewer",
  },
  openGraph: {
    title: "AI Voice-Guided Molecule Viewer",
    description:
      "Voice-driven 3D molecular viewer for Boltz-2 structure predictions. Guided tours, chain walks, and per-residue focus — hands-free.",
    url: "https://sheldonbarnes.com/tools/ai-voice-guided-molecule-viewer",
    images: [
      {
        url: "/og/books.jpg",
        width: 1200,
        height: 630,
        alt: "AI Voice-Guided Molecule Viewer",
      },
    ],
  },
  twitter: { card: "summary_large_image", images: ["/og/books.jpg"] },
};

export default function MoleculeViewerPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20 md:pt-24">
        <section className="px-6 pb-3 md:pb-6">
          <div className="max-w-5xl mx-auto text-center">
            <p className="text-primary font-mono text-xs md:text-sm tracking-widest uppercase mb-2 md:mb-3">
              Director&apos;s Toolkit
            </p>
            <h1 className="text-2xl md:text-5xl font-bold mb-2 md:mb-4">
              AI Voice-Guided <span className="gradient-text">Molecule Viewer</span>
            </h1>
            <p className="text-muted text-sm md:text-base max-w-2xl mx-auto">
              A hands-free 3D viewer for Boltz-2 structure predictions. Tap the assistant
              and ask it to walk a chain, focus a residue, or launch a guided tour — all
              rendered with Mol* in your browser. Voice commands need Chrome or Edge;
              click and touch work everywhere.
            </p>
          </div>
        </section>

        <section className="px-0 md:px-6 pb-8 md:pb-12">
          <div className="max-w-7xl mx-auto md:rounded-lg overflow-hidden border-y md:border border-surface-light">
            <iframe
              src="/tools/molecule-viewer/index.html"
              title="AI Voice-Guided Molecule Viewer"
              className="block w-full h-[calc(100dvh-11rem)] md:h-[calc(100vh-14rem)] min-h-[480px]"
              allow="microphone; autoplay"
            />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
