export interface BookLink {
  label: string;
  url: string;
  icon: "amazon" | "apple";
}

export interface BookFigure {
  file: string;
  title: string;
}

export interface BookDownload {
  title: string;
  description: string;
  icon: string;
}

export interface Book {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  longDescription: string;
  cover: string;
  links: BookLink[];
  highlights: string[];
  tableOfContents: { part: string; chapters: string[] }[];
  audience: string[];
  keyConcepts: { title: string; description: string }[];
  figures: BookFigure[];
  downloads: BookDownload[];
}

export const books: Book[] = [
  {
    slug: "the-platform-inversion",
    title: "The Platform Inversion",
    subtitle:
      "Leading AI-First Engineering Teams from Point Solutions to Intelligent Operating Platforms",
    description:
      "The operating model for senior engineering leaders who need to move beyond coding assistants and build intelligent platforms that compound value. Written for directors, VPs, and staff-plus engineers in regulated industries.",
    longDescription:
      "Most organizations attempting to become \"AI-first\" are building a portfolio of point solutions when they should be building an intelligent operating platform. Point solutions have a ceiling. Platforms compound. This book provides the complete operating model, including roles, artifacts, ceremonies, metrics, and governance structures, for leaders who need to make that transition under real regulatory scrutiny. It is the book Sheldon Barnes wished someone had handed him the day he started running an AI-first program inside a Fortune 100 enterprise.",
    cover: "/book-cover.png",
    links: [
      { label: "Amazon", url: "https://kdp.amazon.com/amazon-dp-action/us/dualbookshelf.marketplacelink/B0GWW179H6", icon: "amazon" },
    ],
    highlights: [
      "The Digital Work Equivalent (DWE) metric",
      "Six-layer AI-First operating framework",
      "30/60/90 day transformation playbook",
      "Governance for regulated environments",
    ],
    tableOfContents: [
      {
        part: "Part I — The Inversion (Strategy & Theory)",
        chapters: [
          "The Platform Inversion",
          "The 2026 State of Engineering",
          "The Principles of AI-First Leadership",
        ],
      },
      {
        part: "Part II — Requirements in an AI-First World",
        chapters: [
          "From User Stories to Agent Briefs",
          "The New Product Management Discipline",
          "Requirements as Code",
        ],
      },
      {
        part: "Part III — The Artifact Layer",
        chapters: [
          "Context is the Product",
          "The Design System as an Agent Interface",
          "API Documentation and SDKs for Agents",
          "Data Contracts and Shared Foundations",
          "Brand, Voice, and Tone at Scale",
        ],
      },
      {
        part: "Part IV — Platform Thinking",
        chapters: [
          "From Portfolio to Platform",
          "The Internal Developer Platform as Agent Runway",
          "The Evaluation Layer",
        ],
      },
      {
        part: "Part V — The Operating Model",
        chapters: [
          "The AI-First Org Chart",
          "Ceremonies and Cadences",
          "The Developer's New Day",
          "Governance for Regulated Environments",
        ],
      },
      {
        part: "Part VI — Measurement, Budget & Transformation",
        chapters: [
          "Digital Work Equivalents — The New North Star Metric",
          "OKRs, KPIs, and the Executive Dashboard",
          "The AI-First Budget",
          "The Maturity Model",
          "The Three-Wave Transformation Roadmap",
          "Case Studies from Regulated Industries",
          "The Road Ahead",
        ],
      },
    ],
    audience: [
      "Senior Directors and VPs of Engineering",
      "Staff-plus engineers implementing AI-first practices",
      "CTOs and CIOs aligning leadership around AI operating models",
      "Enterprise architects building platform contracts for agents",
      "Leaders in pharma, financial services, healthcare, insurance, energy, and government",
    ],
    keyConcepts: [
      {
        title: "The Platform Inversion",
        description:
          "Point solutions cap out. Platforms compound. The transition from portfolio to platform is the strategic decision that separates organizations that scale AI from those that stall.",
      },
      {
        title: "Digital Work Equivalents (DWE)",
        description:
          "A unit of AI-produced value that a finance organization can defend. The metric for talking to your CFO about the return on an agent workforce.",
      },
      {
        title: "Context is the Product",
        description:
          "Brand books, design systems, SDKs, API docs, and runbooks are now the highest-leverage investments. The code is the output, the context is the product.",
      },
      {
        title: "The Eight Principles",
        description:
          "Context is the Product. Verification over Implementation. Platforms over Projects. Specifications are Executable. Humans Direct, Agents Build. Evals are the New Tests. Compounding over Coverage. Governance is a Feature.",
      },
      {
        title: "Agent Briefs",
        description:
          "Structured artifacts that replace user stories, with intent, constraints, acceptance criteria, linked context, and evaluation hooks that agents can execute without 20 follow-up prompts.",
      },
      {
        title: "The Eval Gate",
        description:
          "Replaces demos. Proves the AI didn't hallucinate edge cases. The real-time enforcement of outcome-based measurement applied to AI-first engineering work.",
      },
    ],
    figures: [
      { file: "Figure 1 - The Productivity Paradox.png", title: "The Productivity Paradox" },
      { file: "Figure 2 - The Compounding Gap.png", title: "The Compounding Gap" },
      { file: "Figure 3 - Eight Principles of AI-First Leadership.png", title: "Eight Principles of AI-First Leadership" },
      { file: "Figure 4 - User Story vs Agent Brief.png", title: "User Story vs Agent Brief" },
      { file: "Figure 5 - The Artifact Ecosystem.png", title: "The Artifact Ecosystem" },
      { file: "Figure 6 - The Eval Gate.png", title: "The Eval Gate" },
      { file: "Figure 7 - The AI-First Org Chart.png", title: "The AI-First Org Chart" },
      { file: "Figure 8 - Ceremony Transformation Map.png", title: "Ceremony Transformation Map" },
      { file: "Figure 9 - The Developers New Day.png", title: "The Developer's New Day" },
      { file: "Figure 10 - Four Pillars of AI-First Governance.png", title: "Four Pillars of AI-First Governance" },
      { file: "Figure 11 - DWE Three Streams and Four Lead Measures.png", title: "DWE: Three Streams & Four Lead Measures" },
      { file: "Figure 12 - OKR Cascade.png", title: "OKR Cascade" },
      { file: "Figure 13 - The AI-First Budget.png", title: "The AI-First Budget" },
      { file: "Figure 14 - The AI-First Maturity Model.png", title: "The AI-First Maturity Model" },
      { file: "Figure 15 - Three-Wave Transformation Roadmap.png", title: "Three-Wave Transformation Roadmap" },
      { file: "Figure 16 - The Big Picture Six-Layer Model.png", title: "The Big Picture: Six-Layer Model" },
    ],
    downloads: [
      { title: "Agent Brief Template", description: "The structured artifact that replaces user stories for agent-driven development.", icon: "A" },
      { title: "QBR Slide Deck", description: "Template for reporting AI impact to the Board.", icon: "Q" },
      { title: "Verification Pack Template", description: "Eval suites and acceptance criteria for gating agent work.", icon: "V" },
      { title: "DWE Calculation Worksheet", description: "Calculate your Digital Work Equivalents and ROI.", icon: "D" },
      { title: "Platform Vision Template", description: "North Star, architecture, value case, roadmap, and governance.", icon: "P" },
    ],
  },
  {
    slug: "the-200-billion-problem",
    title: "The $200 Billion Problem",
    subtitle:
      "How AI Is Rewriting Drug Discovery and Closing Pharma's Patent Cliff",
    description:
      "Between now and 2030, patent protections will expire on drugs generating over $200 billion in annual revenue. This book traces the collision of pharma's greatest financial crisis with the scientific revolution that may be its answer, AI deployed across every stage of how drugs are discovered and developed.",
    longDescription:
      "The pharmaceutical industry is caught between a financial crisis and a scientific revolution. Between now and 2030, patent protections will expire on drugs generating more than $200 billion in annual revenue, three times the size of the previous patent cliff. At the same time, artificial intelligence is being deployed across every stage of how drugs are discovered and developed. This book traces the collision of those two forces, examines the Prediction Stack framework for understanding where drug discovery fails, and maps the convergence of technology companies, pharmaceutical giants, and venture capital betting hundreds of billions on AI being the answer.",
    cover: "/pharma-book-cover.png",
    links: [
      { label: "Amazon", url: "https://amazon.com/dp/B0F2N6PN3L", icon: "amazon" },
      { label: "Apple Books", url: "http://books.apple.com/us/book/id6761775465", icon: "apple" },
    ],
    highlights: [
      "The Prediction Stack — a three-layer framework for understanding drug discovery failure",
      "AI across the full pipeline: target ID, molecule design, digital twins, clinical trials",
      "Platform companies changing the game: Recursion, Insilico, Isomorphic Labs",
      "Big Pharma's AI bets: Roche, Novartis, AstraZeneca, Pfizer, J&J",
      "NVIDIA, Google DeepMind, Anthropic & the quantum frontier",
    ],
    tableOfContents: [
      {
        part: "Part I — The Burning Platform",
        chapters: [
          "The Cliff Edge",
          "The Old Way is Dying",
          "Too Slow, Too Expensive, Too Late",
        ],
      },
      {
        part: "Part II — The AI Arsenal",
        chapters: [
          "The Machine That Reads Biology",
          "Designing Molecules in Silico",
          "The Digital Twin Lab",
          "Smarter Trials, Faster Results",
          "The Regulatory Intelligence Layer",
        ],
      },
      {
        part: "Part III — The Ecosystem",
        chapters: [
          "From Discovery to Wet Lab: Closing the Loop",
          "The Data Problem Nobody Talks About",
          "The Platform Companies Changing the Game",
          "Big Pharma's AI Bets",
          "The Goliaths Enter the Lab: NVIDIA, Google, Anthropic & the Quantum Frontier",
        ],
      },
      {
        part: "Part IV — The Human Dimension",
        chapters: [
          "The Scientist and the Algorithm",
          "The Ethics of Speed",
          "The Cost Revolution",
        ],
      },
      {
        part: "Part V — The Horizon",
        chapters: [
          "The 5-Year Drug",
          "Who Wins, Who Loses",
          "The $200 Billion Answer",
        ],
      },
    ],
    audience: [
      "Pharmaceutical executives and R&D leaders",
      "Biotech founders and investors",
      "Healthcare and life sciences strategists",
      "Technology leaders entering pharma",
      "Anyone interested in the future of drug discovery",
    ],
    keyConcepts: [
      {
        title: "The Patent Cliff",
        description:
          "$200+ billion in annual drug revenue loses patent protection between 2025-2030. About 70 blockbusters, each generating over $1B/year. Three times the size of the previous cliff.",
      },
      {
        title: "The Prediction Stack",
        description:
          "A three-layer framework for understanding where prediction fails in drug discovery, at target selection, molecular design, and clinical outcomes, and how AI addresses each layer.",
      },
      {
        title: "The Cost of Being Wrong",
        description:
          "Most of the $2.6 billion average cost of an approved drug is not the cost of doing science. It is the cost of being wrong, compounded across thousands of failed compounds.",
      },
      {
        title: "173+ AI Programs in Clinical Development",
        description:
          "As of early 2026, at least 173 AI-discovered drug programs are in clinical development. The direction is unmistakable.",
      },
      {
        title: "The Platform Companies",
        description:
          "Recursion, Insilico Medicine, and Isomorphic Labs are building end-to-end AI drug discovery platforms. NVIDIA, Google DeepMind, and Anthropic are providing the computational infrastructure.",
      },
    ],
    figures: [],
    downloads: [],
  },
  {
    slug: "why-youre-not-getting-hired",
    title: "Why You're Not Getting Hired",
    subtitle:
      "The Hidden System Filtering You Out — and How to Beat It",
    description:
      "The hiring process was redesigned by AI and nobody told the candidates. This field manual pulls back the curtain on Applicant Tracking Systems, algorithmic scoring, and AI-powered screening, then gives you a repeatable system to beat them.",
    longDescription:
      "Something is broken in the way we get hired. Qualified, experienced people are submitting hundreds of applications and hearing nothing back. The problem isn't them, it's a system that was redesigned by artificial intelligence without telling candidates the rules changed. Before a human recruiter ever sees your resume, it passes through software that parses, scores, and filters. If you don't score well enough, you don't get rejected — you simply never appear. This book exposes how that system works, introduces proprietary frameworks for scoring yourself the way the system does, and gives you a complete, repeatable playbook for navigating the modern job market.",
    cover: "/hiring-book-cover.png",
    links: [
      { label: "Amazon", url: "https://kdp.amazon.com/amazon-dp-action/us/dualbookshelf.marketplacelink/B0G3HQ9CNM", icon: "amazon" },
      { label: "Apple Books", url: "http://books.apple.com/us/book/id6761774550", icon: "apple" },
    ],
    highlights: [
      "The Resume Match Score (RMS) — measure how well your resume maps to any job description",
      "The Role Fit Score (RFS) — evaluate if a job is right for you before optimizing for it",
      "How ATS platforms parse, score, and filter your application",
      "AI-assisted resume building and standing out in the AI arms race",
      "The complete AI Job Search System — a repeatable playbook",
    ],
    tableOfContents: [
      {
        part: "Part I — Why It's Harder Than Ever to Get Hired",
        chapters: [
          "Why You're Not Getting Hired",
          "The Great Talent Flood",
          "The AI Hiring Shift",
        ],
      },
      {
        part: "Part II — The Hidden System",
        chapters: [
          "The Algorithmic Gatekeeper",
          "Why Your Resume Isn't Being Seen",
          "Job Descriptions Are Algorithms",
        ],
      },
      {
        part: "Part III — How You Are Scored",
        chapters: [
          "The Resume Match Score",
          "Why You're Not Matching (and How to Fix It)",
          "The Role Fit Score",
        ],
      },
      {
        part: "Part IV — Engineering Your Visibility",
        chapters: [
          "AI-Assisted Resume Building",
          "Standing Out in the AI Arms Race",
          "Beyond the Resume — Building Your Signal",
        ],
      },
      {
        part: "Part V — Winning in a Filtered World",
        chapters: [
          "AI Interviews Are Already Here",
          "The Human Advantage",
          "From Seen to Selected",
        ],
      },
      {
        part: "Part VI — The System",
        chapters: [
          "The AI Job Search System",
        ],
      },
    ],
    audience: [
      "Mid-career professionals not getting callbacks despite strong experience",
      "Recent graduates entering the most competitive entry-level market in a generation",
      "Career changers whose experience doesn't translate to ATS-friendly formats",
      "Anyone who hasn't job-searched in a few years and is shocked by how much has changed",
      "People who have been told to \"just keep applying\" and need a better strategy",
    ],
    keyConcepts: [
      {
        title: "The Algorithmic Gatekeeper",
        description:
          "ATS platforms parse your resume, extract data, and feed it into scoring algorithms that rank you against every other applicant. If you don't score well enough, a human never sees you.",
      },
      {
        title: "Resume Match Score (RMS)",
        description:
          "A proprietary framework for measuring how well your resume maps to any job description, and how to systematically improve your score.",
      },
      {
        title: "Role Fit Score (RFS)",
        description:
          "A framework for evaluating whether a job is actually right for you before you spend the energy optimizing for it.",
      },
      {
        title: "You're Not Being Rejected. You're Being Filtered.",
        description:
          "The system's job isn't to find the best candidate. It's to reduce the pile. Understanding this distinction is the first step toward taking your power back.",
      },
      {
        title: "The AI Job Search System",
        description:
          "A complete, repeatable system for navigating the modern job market, one that works with the technology instead of against it.",
      },
    ],
    figures: [],
    downloads: [],
  },
];

export function getBookBySlug(slug: string): Book | undefined {
  return books.find((b) => b.slug === slug);
}
