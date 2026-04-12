import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Expertise from "@/components/Expertise";
import Author from "@/components/Author";
import Books from "@/components/Books";
import KeyIdeas from "@/components/KeyIdeas";
import Resources from "@/components/Resources";
import AiAssistant from "@/components/AiAssistant";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Expertise />
        <Author />
        <Books />
        <KeyIdeas />
        <Resources />
        <AiAssistant />
        <Contact />
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}

export const metadata: Metadata = {
  title: "Sheldon Barnes | AI-First Engineering Leader & Author",
  description:
    "Engineering leader building AI-first teams in regulated enterprises. Published author of three books on AI leadership, drug discovery, and the modern job search.",
  alternates: { canonical: "https://sheldonbarnes.com" },
  openGraph: {
    title: "Sheldon Barnes | AI-First Engineering Leader & Author",
    description:
      "Engineering leader, AI strategist, and author of three books. Building AI-first teams in regulated enterprises.",
    type: "website",
    url: "https://sheldonbarnes.com",
    siteName: "Sheldon Barnes",
    images: [{ url: "https://sheldonbarnes.com/author-photo.jpg", width: 1200, height: 1200, alt: "Sheldon Barnes — author photo" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sheldon Barnes | AI-First Engineering Leader",
    description:
      "Author of The Platform Inversion. Leading AI-first engineering teams in regulated enterprises.",
    images: ["https://sheldonbarnes.com/author-photo.jpg"],
  },
};
