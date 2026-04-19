import type { Metadata } from "next";
import Viewer from "./Viewer";

export const metadata: Metadata = {
  title: "AI Voice-Guided Molecule Viewer | Sheldon Barnes",
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
  return <Viewer />;
}
