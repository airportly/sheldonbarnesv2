import type { Metadata } from "next";
import stories from "@/data/journeyToSchool.json";
import { languages, journeyPath, type Language } from "@/components/blog/JourneyToSchool";

const site = "https://www.sheldonbarnes.com";
const descriptions: Record<Language, string> = {
  en: "A reflection on a school bus, a child's drawing, and the ordinary future children in Gaza deserve.",
  fr: "Une réflexion sur un bus scolaire, le dessin d'un enfant et l'avenir ordinaire que méritent les enfants de Gaza.",
  he: "מחשבות על אוטובוס לבית הספר, ציור של ילד והעתיד השגרתי שמגיע לילדי עזה.",
  ar: "تأملات في حافلة مدرسية ورسمة طفل والمستقبل العادي الذي يستحقه أطفال غزة.",
};

export function journeyMetadata(language: Language): Metadata {
  const story = stories[language];
  const url = site + journeyPath(language);
  const image = `${site}/api/journey-social/${language}`;
  const locale = languages.find((item) => item.code === language)!.locale;
  const alternatives = Object.fromEntries(languages.map((item) => [item.code, site + journeyPath(item.code)]));
  return {
    title: `${story.title} | Sheldon Barnes`,
    description: descriptions[language],
    alternates: { canonical: url, languages: { ...alternatives, "x-default": site + journeyPath("en") } },
    openGraph: {
      type: "article", title: story.title, description: descriptions[language], url, locale,
      alternateLocale: languages.filter((item) => item.code !== language).map((item) => item.locale),
      publishedTime: "2026-11-18T12:00:00Z", authors: ["Sheldon Barnes"],
      images: [{ url: image, width: 1200, height: 630, alt: story.captions[2] }],
    },
    twitter: { card: "summary_large_image", title: story.title, description: descriptions[language], images: [image] },
  };
}
