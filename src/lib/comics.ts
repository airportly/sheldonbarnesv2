// Featured comic editions (one issue, 24 pages each) rendered to page images
// under /public/comics/<code>/page-NN.jpg. The source PDFs live on the book
// site and are linked for the full reader.

export interface Comic {
  code: "fr" | "ar";
  language: string;
  title: string;
  rtl: boolean;
  pages: number;
  /** Folder under /public holding page-01.jpg … page-NN.jpg. */
  dir: string;
  /** Flags shown on the row label (ISO alpha-2, in /public/flags). */
  flags: { code: string; name: string }[];
  /** Hosted PDF for the "open full comic" link. */
  pdfUrl: string;
}

export const comics: Comic[] = [
  {
    code: "fr",
    language: "French",
    title: "La paix au Moyen-Orient — BD",
    rtl: false,
    pages: 24,
    dir: "/comics/fr",
    flags: [
      { code: "fr", name: "France" },
      { code: "cd", name: "DR Congo" },
    ],
    pdfUrl:
      "https://www.peaceinthemiddleeastbook.com/assets/comic-fr/la-paix-au-moyen-orient-bd-01-fr.pdf",
  },
  {
    code: "ar",
    language: "Arabic",
    title: "السلام في الشرق الأوسط — كوميك",
    rtl: true,
    pages: 24,
    dir: "/comics/ar",
    flags: [
      { code: "sa", name: "Saudi Arabia" },
      { code: "eg", name: "Egypt" },
    ],
    pdfUrl:
      "https://www.peaceinthemiddleeastbook.com/assets/comic-ar/peace-in-the-middle-east-comic-01-ar.pdf",
  },
];

/** Path to a given 1-based page image. */
export function comicPage(c: Comic, page: number): string {
  return `${c.dir}/page-${String(page).padStart(2, "0")}.jpg`;
}

export function comicByCode(code: string): Comic | undefined {
  return comics.find((c) => c.code === code);
}
