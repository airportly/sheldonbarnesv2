import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE = "https://sheldonbarnes.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  title: "Sheldon Barnes | AI-First Engineering Leader & Author",
  description:
    "Engineering leader building AI-first teams in regulated enterprises. Published author of three books on AI leadership, drug discovery, and the modern job search.",
  alternates: { canonical: BASE },
  icons: {
    icon: [
      { url: "/sheldonbarnes-logo.png", type: "image/png" },
      { url: "/favicon.ico", sizes: "32x32" },
    ],
    apple: "/sheldonbarnes-logo.png",
    shortcut: "/sheldonbarnes-logo.png",
  },
  openGraph: {
    title: "Sheldon Barnes | AI-First Engineering Leader & Author",
    description:
      "Engineering leader, AI strategist, and author of three books. Building AI-first teams in regulated enterprises.",
    type: "website",
    url: BASE,
    siteName: "Sheldon Barnes",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sheldon Barnes | AI-First Engineering Leader",
    description:
      "Author of The Platform Inversion. Leading AI-first engineering teams in regulated enterprises.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Sheldon Barnes",
  url: "https://sheldonbarnes.com",
  image: "https://sheldonbarnes.com/author-photo.jpg",
  jobTitle: "Senior Engineering Leader",
  description:
    "AI-first engineering leader, author, and veteran. Building and leading AI-first teams in regulated enterprises.",
  email: "sheldonbarnes@gmail.com",
  address: { "@type": "PostalAddress", addressLocality: "Carmel", addressRegion: "IN", addressCountry: "US" },
  alumniOf: [
    { "@type": "Organization", name: "Purdue University" },
    { "@type": "Organization", name: "Western New England University" },
  ],
  sameAs: [
    "https://linkedin.com/in/sheldonbarnes",
    "https://amazon.com/author/sheldonbarnes",
    "https://www.strava.com/athletes/22309848",
  ],
  knowsAbout: [
    "Artificial Intelligence",
    "AI-First Engineering",
    "Platform Engineering",
    "Agent Orchestration",
    "Drug Discovery",
    "Pharmaceutical R&D",
    "Software Engineering Leadership",
  ],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Sheldon Barnes",
  url: "https://sheldonbarnes.com",
  description:
    "Personal website of Sheldon Barnes, engineering leader, AI strategist, and author.",
  author: { "@type": "Person", name: "Sheldon Barnes" },
};

const booksJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Book",
    name: "The Platform Inversion",
    alternateName:
      "Leading AI-First Engineering Teams from Point Solutions to Intelligent Operating Platforms",
    author: { "@type": "Person", name: "Sheldon Barnes" },
    url: "https://sheldonbarnes.com/books/the-platform-inversion",
    bookFormat: "https://schema.org/EBook",
    datePublished: "2026",
    inLanguage: "en",
    image: "https://sheldonbarnes.com/book-cover.png",
    publisher: { "@type": "Organization", name: "Kindle Direct Publishing" },
    offers: {
      "@type": "Offer",
      url: "https://kdp.amazon.com/amazon-dp-action/us/dualbookshelf.marketplacelink/B0GWW179H6",
      availability: "https://schema.org/InStock",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "Book",
    name: "The $200 Billion Problem",
    alternateName:
      "How AI Is Rewriting Drug Discovery and Closing Pharma's Patent Cliff",
    author: { "@type": "Person", name: "Sheldon Barnes" },
    url: "https://sheldonbarnes.com/books/the-200-billion-problem",
    bookFormat: "https://schema.org/EBook",
    datePublished: "2026",
    inLanguage: "en",
    image: "https://sheldonbarnes.com/pharma-book-cover.png",
    publisher: { "@type": "Organization", name: "Kindle Direct Publishing" },
    offers: [
      {
        "@type": "Offer",
        url: "https://amazon.com/dp/B0F2N6PN3L",
        availability: "https://schema.org/InStock",
      },
      {
        "@type": "Offer",
        url: "http://books.apple.com/us/book/id6761775465",
        availability: "https://schema.org/InStock",
      },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "Book",
    name: "Why You're Not Getting Hired",
    alternateName:
      "The Hidden System Filtering You Out — and How to Beat It",
    author: { "@type": "Person", name: "Sheldon Barnes" },
    url: "https://sheldonbarnes.com/books/why-youre-not-getting-hired",
    bookFormat: "https://schema.org/EBook",
    datePublished: "2026",
    inLanguage: "en",
    image: "https://sheldonbarnes.com/hiring-book-cover.png",
    publisher: { "@type": "Organization", name: "Kindle Direct Publishing" },
    offers: [
      {
        "@type": "Offer",
        url: "https://kdp.amazon.com/amazon-dp-action/us/dualbookshelf.marketplacelink/B0G3HQ9CNM",
        availability: "https://schema.org/InStock",
      },
      {
        "@type": "Offer",
        url: "http://books.apple.com/us/book/id6761774550",
        availability: "https://schema.org/InStock",
      },
    ],
  },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <head>
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Sheldon Barnes Blog"
          href="/feed.xml"
        />
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-EV8SS4PR5L"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-EV8SS4PR5L');`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        {booksJsonLd.map((book, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(book) }}
          />
        ))}
      </head>
      <body>{children}</body>
    </html>
  );
}
