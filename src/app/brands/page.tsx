import type { Metadata } from "next";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";

export const metadata: Metadata = {
  title: "My Brands | Sheldon Barnes",
  description: "The brands Sheldon Barnes builds and operates.",
  alternates: { canonical: "https://www.sheldonbarnes.com/brands" },
  openGraph: {
    title: "My Brands | Sheldon Barnes",
    description: "The brands Sheldon Barnes builds and operates.",
    url: "https://www.sheldonbarnes.com/brands",
  },
};

export default function BrandsPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-16">
        <section className="px-6 pb-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-4">
              My <span className="text-primary">Brands</span>
            </h1>
          </div>
        </section>

        <section className="py-12 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <a
                href="https://www.phrmai.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center bg-surface/40 border border-surface-light rounded-2xl p-8 aspect-square hover:border-primary hover:bg-surface transition-all"
                aria-label="PhrmAI"
              >
                <Image
                  src="/phrmai-logo-solo.png"
                  alt="PhrmAI"
                  width={240}
                  height={240}
                  className="object-contain max-h-24 w-auto"
                />
              </a>
              <a
                href="https://www.ackee.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center bg-surface/40 border border-surface-light rounded-2xl p-8 aspect-square hover:border-primary hover:bg-surface transition-all"
                aria-label="Ackee.ai"
              >
                <Image
                  src="/ackee-logo-new.png"
                  alt="Ackee.ai"
                  width={240}
                  height={240}
                  className="object-contain max-h-24 w-auto"
                />
              </a>
              <a
                href="https://www.sheldonbarnes.com"
                className="flex items-center justify-center bg-surface/40 border border-surface-light rounded-2xl p-8 aspect-square hover:border-primary hover:bg-surface transition-all"
                aria-label="Sheldon Barnes"
              >
                <Image
                  src="/sheldonbarnes-logo.png"
                  alt="Sheldon Barnes"
                  width={240}
                  height={240}
                  className="object-contain max-h-24 w-auto"
                />
              </a>
              <a
                href="https://www.mycarmelrealty.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center bg-surface/40 border border-surface-light rounded-2xl p-8 aspect-square hover:border-primary hover:bg-surface transition-all"
                aria-label="Carmel Realty"
              >
                <Image
                  src="/solo-logo.png"
                  alt="Carmel Realty"
                  width={240}
                  height={240}
                  className="object-contain max-h-24 w-auto"
                />
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
