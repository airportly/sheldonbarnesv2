import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";

export const metadata: Metadata = {
  title: "Contact Sheldon Barnes | Let's Connect",
  description:
    "Get in touch with Sheldon Barnes, engineering leader, author, and AI strategist. Available for senior leadership roles, speaking, and collaboration.",
  alternates: { canonical: "https://www.sheldonbarnes.com/contact" },
  openGraph: {
    title: "Contact Sheldon Barnes",
    description:
      "Connect with Sheldon on LinkedIn, email, or Strava.",
    url: "https://www.sheldonbarnes.com/contact",
    images: [{ url: "/og/contact.jpg", width: 1200, height: 630, alt: "Contact Sheldon Barnes" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og/contact.jpg"],
  },
};

const links = [
  {
    title: "LinkedIn",
    description: "Connect professionally, see my experience, and follow my posts on AI-first engineering leadership.",
    url: "https://linkedin.com/in/sheldonbarnes",
    cta: "Connect on LinkedIn",
    color: "secondary" as const,
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
      </svg>
    ),
  },
  {
    title: "Email",
    description: "For speaking inquiries, collaboration opportunities, or just to say hello.",
    url: "mailto:sheldonbarnes@gmail.com",
    cta: "Send an Email",
    color: "primary" as const,
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <path d="M22 6l-10 7L2 6" />
      </svg>
    ),
  },
  {
    title: "Strava",
    description: "Follow my rides. Last year I cycled over 1,000 miles. Cycling is how I take care of my mental health.",
    url: "https://www.strava.com/athletes/22309848",
    cta: "Follow on Strava",
    color: "primary" as const,
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
      </svg>
    ),
  },
];

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <p className="text-primary font-mono text-sm tracking-widest uppercase mb-3">
              Get In Touch
            </p>
            <h1 className="text-5xl font-bold mb-4">
              Let&apos;s <span className="text-primary">Connect</span>
            </h1>
            <p className="text-muted text-lg max-w-2xl mx-auto">
              Whether you&apos;re hiring, collaborating, booking a speaker, or
              just want to talk about AI-first engineering, I&apos;d love
              to hear from you.
            </p>
          </div>

          {/* What I'm Looking For */}
          <div className="p-8 rounded-2xl bg-surface border border-surface-light mb-12">
            <h2 className="text-2xl font-bold mb-4">What I&apos;m Looking For</h2>
            <p className="text-muted leading-relaxed mb-6">
              I&apos;m seeking a <strong className="text-foreground">Senior Director</strong> role
              where I can lead the transition to AI-first engineering at scale.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { label: "Industries", value: "Pharma, healthcare, financial services, insurance, or any regulated enterprise" },
                { label: "Focus", value: "AI-first engineering teams, platform transformation, agent orchestration" },
                { label: "Culture", value: "Mission-driven organizations that take compliance seriously and want to lead" },
                { label: "Impact", value: "Building platforms that compound, not portfolios that cap out" },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-2">
                  <span className="text-primary mt-0.5 shrink-0">&#9656;</span>
                  <div>
                    <span className="text-sm font-semibold text-foreground">{item.label}: </span>
                    <span className="text-sm text-muted">{item.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Cards */}
          <div className="space-y-6 mb-12">
            {links.map((link) => (
              <a
                key={link.title}
                href={link.url}
                target={link.url.startsWith("mailto") ? undefined : "_blank"}
                rel={link.url.startsWith("mailto") ? undefined : "noopener noreferrer"}
                className="flex items-center gap-6 p-6 rounded-2xl bg-surface border border-surface-light hover:border-primary/40 transition-all group"
              >
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center shrink-0 ${
                  link.color === "secondary" ? "bg-secondary/10 text-secondary" : "bg-primary/10 text-primary"
                }`}>
                  {link.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold group-hover:text-primary transition-colors">
                    {link.title}
                  </h3>
                  <p className="text-sm text-muted">{link.description}</p>
                </div>
                <div className={`hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm shrink-0 ${
                  link.color === "secondary"
                    ? "border border-secondary text-secondary group-hover:bg-secondary/10"
                    : "border border-primary text-primary group-hover:bg-primary/10"
                } transition-all`}>
                  {link.cta}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M7 17L17 7M17 7H7M17 7v10" />
                  </svg>
                </div>
              </a>
            ))}
          </div>

          {/* Resume */}
          <div className="text-center p-8 rounded-2xl bg-primary/5 border border-primary/20">
            <h3 className="text-xl font-bold mb-2">Looking for my resume?</h3>
            <p className="text-muted mb-6">
              Download a PDF copy or connect with me on LinkedIn for the full picture.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="/downloads/Sheldon-Barnes-Resume.pdf"
                download
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-background font-semibold rounded-lg hover:bg-primary-light transition-all"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                </svg>
                Download Resume
              </a>
              <a
                href="https://linkedin.com/in/sheldonbarnes"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 border border-secondary text-secondary font-semibold rounded-lg hover:bg-secondary/10 transition-all"
              >
                View on LinkedIn
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
