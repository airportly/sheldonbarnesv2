import type { Metadata } from "next";
import Viewer from "./Viewer";

const PAGE_URL = "https://www.sheldonbarnes.com/tools/genome-os";

const SOCIAL_IMAGE = {
  url: "/geek-life-scientific-visual-operating-system.png",
  width: 1200,
  height: 630,
  alt: "GenomeOS — interactive tour of the eight levels of chromatin organization, from the whole nucleus down to individual atoms",
  type: "image/png",
} as const;

export const metadata: Metadata = {
  title: "GenomeOS — Interactive Chromatin Explorer | Sheldon Barnes",
  description:
    "Travel the 8 levels of chromatin organization, from the nucleus down to individual atoms, anchored on the β-globin locus. Watch mitosis, cohesin loop extrusion, transcription, replication and more — with a narrated audio tour.",
  keywords: [
    "chromatin",
    "genome organization",
    "3D genome",
    "β-globin",
    "HBB",
    "mitosis",
    "cohesin",
    "loop extrusion",
    "CTCF",
    "TAD",
    "Hi-C",
    "histone modifications",
    "DNA replication",
    "G-quadruplex",
    "R-loop",
    "epigenetics",
    "education",
    "interactive",
    "audio tour",
    "Sheldon Barnes",
  ],
  authors: [{ name: "Sheldon Barnes", url: "https://www.sheldonbarnes.com" }],
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
    title: "GenomeOS — Interactive Chromatin Explorer",
    description:
      "Eight levels of chromatin organization, from the nucleus to individual atoms. Play mitosis, loop extrusion, transcription, replication — with a narrated audio tour.",
    images: [SOCIAL_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "GenomeOS — Interactive Chromatin Explorer",
    description:
      "Eight levels of chromatin organization, from the nucleus to individual atoms. Interactive + narrated audio tour.",
    images: [SOCIAL_IMAGE.url],
  },
};

export default function GenomeOSPage() {
  return <Viewer />;
}
