import Link from "next/link";
import stories from "@/data/journeyToSchool.json";

export type Language = keyof typeof stories;
export const languages: { code: Language; label: string; locale: string }[] = [
  { code: "en", locale: "en_US", label: "English" },
  { code: "fr", locale: "fr_FR", label: "Français" },
  { code: "he", locale: "he_IL", label: "עברית" },
  { code: "ar", locale: "ar_AR", label: "العربية" },
];
const pages = ["15", "16", "17", "24"];
const afterParagraph = [1, 3, 4, 5];

export function journeyPath(language: Language) {
  return language === "en" ? "/blog/journey-to-school" : `/blog/journey-to-school/${language}`;
}

export default function JourneyToSchool({ language }: { language: Language }) {
  const story = stories[language];

  return (
    <div className="max-w-3xl mx-auto px-6" lang={language} dir={story.dir}>
      <nav aria-label="Article language" className="flex flex-wrap gap-2 mb-10 border-y border-surface-light py-4">
        {languages.map(({ code, label }) => (
          <Link
            key={code}
            href={journeyPath(code)}
            hrefLang={code}
            aria-current={language === code ? "page" : undefined}
            className={`px-4 py-2 rounded-md border text-sm font-semibold transition-colors ${language === code ? "bg-primary text-background border-primary" : "border-surface-light text-foreground hover:border-primary"}`}
          >
            {label}
          </Link>
        ))}
      </nav>
      <article>
        <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-3">{story.kicker}</p>
        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">{story.title}</h1>
        <p className="text-muted text-sm mb-8">{story.byline} · November 18, 2026</p>
        <figure className="mb-10">
          <div className="aspect-[2.15/1] overflow-hidden rounded-xl border border-surface-light">
            {/* The lower panel of page 17 is the chosen hero image. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/journey-to-school/${language}-17.jpg`} alt={story.captions[2]} className="w-full h-full object-cover object-bottom" />
          </div>
        </figure>
        <p className="text-xl md:text-2xl text-foreground leading-relaxed mb-8">{story.lede}</p>
        {story.paragraphs.map((paragraph, index) => {
          const imageIndex = afterParagraph.indexOf(index);
          return (
            <div key={index}>
              <p className="text-lg text-muted leading-relaxed mb-6" dangerouslySetInnerHTML={{ __html: paragraph }} />
              {imageIndex >= 0 && (
                <figure className="my-10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/journey-to-school/${language}-${pages[imageIndex]}.jpg`} alt={story.captions[imageIndex]} loading="lazy" className="w-full max-w-xl mx-auto rounded-lg border border-surface-light" />
                  <figcaption className="text-center text-sm text-muted mt-3">{story.captions[imageIndex]}</figcaption>
                </figure>
              )}
            </div>
          );
        })}
        <p className="border-s-4 border-primary ps-5 text-muted italic mt-10">{story.note}</p>
        <p className="text-sm text-muted mt-10" dangerouslySetInnerHTML={{ __html: story.footer }} />
      </article>
    </div>
  );
}
