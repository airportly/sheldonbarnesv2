export interface Category {
  slug: string;
  name: string;
  description: string;
}

export const categories: Category[] = [
  {
    slug: "ai-drug-discovery",
    name: "AI Drug Discovery",
    description:
      "How artificial intelligence is reshaping pharmaceutical R&D — from protein folding to longitudinal patient data and the dark proteome.",
  },
  {
    slug: "ai-engineering-leadership",
    name: "AI-First Engineering Leadership",
    description:
      "Operating models, team structures, and governance for engineering leaders building AI-first organizations in regulated enterprises.",
  },
  {
    slug: "career-and-hiring",
    name: "Career & Hiring",
    description:
      "How AI is rewriting hiring — applicant tracking, algorithmic scoring, and how candidates can adapt.",
  },
  {
    slug: "industry-analysis",
    name: "Industry Analysis",
    description:
      "Frameworks and analysis for senior leaders navigating AI's impact on regulated industries.",
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
