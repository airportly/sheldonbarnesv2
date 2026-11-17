// Data for the "Peace in the Middle East" feature on the home page.
// Sourced from the book's own site (peaceinthemiddleeastbook.com) and its
// localized editions. Covers are the localized second-edition covers mirrored
// into /public.

export interface PeaceEdition {
  /** ISO 639-1 code, used for the chip label and `lang`/`dir` attributes. */
  code: "en" | "fr" | "ar" | "he";
  /** English name of the language. */
  language: string;
  /** The title as printed on that edition's cover. */
  nativeTitle: string;
  /** Right-to-left script (Arabic, Hebrew). */
  rtl: boolean;
  /** Localized cover in /public. */
  cover: string;
  /** Where the chip links — that language's page on the book site. */
  href: string;
  /** Short format availability line. */
  formats: string;
  /** Flags shown on the chip: flagcdn/ISO alpha-2 code + display name. */
  countries: { code: string; name: string }[];
}

export const peaceBook = {
  title: "Peace in the Middle East",
  subtitle:
    "A New Blueprint for Israel, a Palestinian State, and Lasting Stability",
  edition: "Second edition — revised and expanded",
  blurb:
    "A systems-level blueprint for lasting peace, now published in four languages. Rewritten after the war with Iran, it builds one concrete proposal — the Gulf-to-Gulf Accord — on five pillars that have to stand at the same time.",
  siteUrl: "https://www.peaceinthemiddleeastbook.com",
  heroCover: "/peace-in-the-middle-east-cover.jpg",
  editions: [
    {
      code: "en",
      language: "English",
      nativeTitle: "Peace in the Middle East",
      rtl: false,
      cover: "/peace-in-the-middle-east-cover.jpg",
      href: "https://www.peaceinthemiddleeastbook.com",
      formats: "Kindle · Audible",
      countries: [
        { code: "us", name: "United States" },
        { code: "gb", name: "United Kingdom" },
      ],
    },
    {
      code: "fr",
      language: "French",
      nativeTitle: "La paix au Moyen-Orient",
      rtl: false,
      cover: "/peace-in-the-middle-east-cover-fr.jpg",
      href: "https://www.peaceinthemiddleeastbook.com/fr/",
      formats: "Kindle",
      countries: [
        { code: "fr", name: "France" },
        { code: "cd", name: "DR Congo" },
      ],
    },
    {
      code: "ar",
      language: "Arabic",
      nativeTitle: "السلام في الشرق الأوسط",
      rtl: true,
      cover: "/peace-in-the-middle-east-cover-ar.jpg",
      href: "https://www.peaceinthemiddleeastbook.com/ar/",
      formats: "Kindle",
      countries: [
        { code: "sa", name: "Saudi Arabia" },
        { code: "eg", name: "Egypt" },
      ],
    },
    {
      code: "he",
      language: "Hebrew",
      nativeTitle: "שלום במזרח התיכון",
      rtl: true,
      cover: "/peace-in-the-middle-east-cover-he.jpg",
      href: "https://www.peaceinthemiddleeastbook.com/he/",
      formats: "On the book site",
      countries: [
        { code: "il", name: "Israel" },
        { code: "us", name: "United States" },
      ],
    },
  ] satisfies PeaceEdition[],
} as const;
