import type { Metadata } from "next";
import Viewer from "./Viewer";

const PAGE_URL =
  "https://sheldonbarnes.com/tools/ai-voice-guided-molecule-viewer";

const SOCIAL_IMAGE = {
  url: "/openfold3-nvidia-ai-enterprise-viewer.jpeg",
  width: 796,
  height: 1024,
  alt: "Voice-guided molecule viewer rendering an OpenFold3 protein-DNA complex prediction delivered via NVIDIA AI Enterprise",
  type: "image/jpeg",
} as const;

export const metadata: Metadata = {
  title: "AI Voice-Guided Molecule Viewer | Sheldon Barnes",
  description:
    "Hands-free 3D molecular viewer for Boltz-2 structure predictions. Ask the assistant to walk a protein chain, focus a residue, or launch a guided tour — powered by Mol* and browser speech recognition.",
  keywords: [
    "molecule viewer",
    "protein viewer",
    "voice-guided",
    "Mol*",
    "Boltz-2",
    "structure prediction",
    "AI",
    "drug discovery",
    "BioNeMo",
  ],
  authors: [{ name: "Sheldon Barnes", url: "https://sheldonbarnes.com" }],
  creator: "Sheldon Barnes",
  publisher: "Sheldon Barnes",
  alternates: { canonical: PAGE_URL },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    siteName: "Sheldon Barnes",
    locale: "en_US",
    url: PAGE_URL,
    title: "AI Voice-Guided Molecule Viewer",
    description:
      "Voice-driven 3D molecular viewer for Boltz-2 structure predictions. Guided tours, chain walks, and per-residue focus — hands-free.",
    images: [SOCIAL_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Voice-Guided Molecule Viewer",
    description:
      "Voice-driven 3D molecular viewer for Boltz-2 structure predictions. Hands-free.",
    images: [SOCIAL_IMAGE.url],
  },
};

export default function MoleculeViewerPage() {
  return <Viewer />;
}
