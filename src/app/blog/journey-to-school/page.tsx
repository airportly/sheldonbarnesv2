import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JourneyToSchool from "@/components/blog/JourneyToSchool";
import { journeyMetadata } from "@/lib/journeyMetadata";

export const metadata = journeyMetadata("en");

export default function JourneyToSchoolPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-6 mb-8 text-sm text-muted">
          <Link href="/blog" className="hover:text-primary">Blog</Link> / The Journey to School
        </div>
        <JourneyToSchool language="en" />
      </main>
      <Footer />
    </>
  );
}
