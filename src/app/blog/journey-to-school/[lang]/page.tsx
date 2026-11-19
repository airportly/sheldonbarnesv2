import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JourneyToSchool, { languages, type Language } from "@/components/blog/JourneyToSchool";
import { journeyMetadata } from "@/lib/journeyMetadata";

type Props = { params: Promise<{ lang: string }> };
const translated = languages.filter(({ code }) => code !== "en");

export function generateStaticParams() {
  return translated.map(({ code }) => ({ lang: code }));
}

export async function generateMetadata({ params }: Props) {
  const { lang } = await params;
  if (!translated.some(({ code }) => code === lang)) return {};
  return journeyMetadata(lang as Language);
}

export default async function JourneyTranslationPage({ params }: Props) {
  const { lang } = await params;
  if (!translated.some(({ code }) => code === lang)) notFound();
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-6 mb-8 text-sm text-muted">
          <Link href="/blog" className="hover:text-primary">Blog</Link>
        </div>
        <JourneyToSchool language={lang as Language} />
      </main>
      <Footer />
    </>
  );
}
