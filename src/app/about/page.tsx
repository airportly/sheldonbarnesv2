import type { Metadata } from "next";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";

export const metadata: Metadata = {
  title: "About Sheldon Barnes | From Jamaica to AI Leadership",
  description:
    "The story behind the books. Born in Jamaica, veteran of Operation Enduring Freedom, cyclist, and AI-first engineering leader.",
  alternates: { canonical: "https://www.sheldonbarnes.com/about" },
  openGraph: {
    title: "About Sheldon Barnes",
    description:
      "From a VTech computer in Jamaica to leading AI-first engineering teams at Fortune 100 enterprises.",
    url: "https://www.sheldonbarnes.com/about",
    images: [{ url: "/og/about.jpg", width: 1200, height: 630, alt: "About Sheldon Barnes" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og/about.jpg"],
  },
};

function Section({
  children,
  alt,
}: {
  children: React.ReactNode;
  alt?: boolean;
}) {
  return (
    <section className={`py-16 px-6 ${alt ? "bg-surface/30" : ""}`}>
      <div className="max-w-4xl mx-auto">{children}</div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-16">
        {/* Hero */}
        <section className="px-6 pb-8">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-primary font-mono text-sm tracking-widest uppercase mb-3">
              My Story
            </p>
            <h1 className="text-5xl font-bold mb-4">
              About <span className="text-secondary">Sheldon</span>
            </h1>
            <p className="text-muted text-lg max-w-2xl mx-auto">
              Behind the books, the frameworks, and the engineering leadership
              is a kid from Jamaica who learned to type on a toy computer.
            </p>
          </div>
        </section>

        {/* My Brands */}
        <Section>
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-10">
              My <span className="text-primary">Brands</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <a
                href="https://www.phrmai.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center bg-surface/40 border border-surface-light rounded-2xl p-8 aspect-square hover:border-primary hover:bg-surface transition-all"
                aria-label="PhrmAI"
              >
                <Image
                  src="/phrmai-logo.png"
                  alt="PhrmAI"
                  width={240}
                  height={240}
                  className="object-contain max-h-24 w-auto"
                />
              </a>
              <a
                href="https://www.ackee.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center bg-surface/40 border border-surface-light rounded-2xl p-8 aspect-square hover:border-primary hover:bg-surface transition-all"
                aria-label="Ackee.ai"
              >
                <Image
                  src="/ackee-logo-new.png"
                  alt="Ackee.ai"
                  width={240}
                  height={240}
                  className="object-contain max-h-24 w-auto"
                />
              </a>
              <a
                href="https://www.sheldonbarnes.com"
                className="flex items-center justify-center bg-surface/40 border border-surface-light rounded-2xl p-8 aspect-square hover:border-primary hover:bg-surface transition-all"
                aria-label="Sheldon Barnes"
              >
                <Image
                  src="/sheldonbarnes-logo.png"
                  alt="Sheldon Barnes"
                  width={240}
                  height={240}
                  className="object-contain max-h-24 w-auto"
                />
              </a>
              <a
                href="https://www.mycarmelrealty.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center bg-surface/40 border border-surface-light rounded-2xl p-8 aspect-square hover:border-primary hover:bg-surface transition-all"
                aria-label="Carmel Realty"
              >
                <Image
                  src="/solo-logo.png"
                  alt="Carmel Realty"
                  width={240}
                  height={240}
                  className="object-contain max-h-24 w-auto"
                />
              </a>
            </div>
          </div>
        </Section>

        {/* Jamaica Origins — image LEFT */}
        <Section alt>
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="flex justify-center">
              <Image
                src="/sheldon-jamaica-map.jpeg"
                alt="Jamaica on the globe"
                width={400}
                height={400}
                className="rounded-2xl shadow-xl"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-4">
                Born in <span className="text-primary">Jamaica</span>
              </h2>
              <p className="text-muted leading-relaxed mb-4">
                I was born in Jamaica to parents who were public servants. My
                mother was a teacher. My father was a policeman. They taught me
                the value of discipline, service, and showing up every day
                whether you felt like it or not.
              </p>
              <p className="text-muted leading-relaxed">
                Growing up on the island shaped how I see the world.
                Resourceful, direct, and never taking opportunity for granted.
                The beaches of Ocho Rios, Kingston, and Negril are still where
                I go to recharge.
              </p>
            </div>
          </div>
        </Section>

        {/* First Computer — image RIGHT */}
        <Section>
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">
                Where It All <span className="text-primary">Started</span>
              </h2>
              <p className="text-muted leading-relaxed mb-4">
                My first computer was a VTech PreComputer 1000, a toy
                with a single-line LCD screen and a full QWERTY keyboard. I
                learned to type on that machine. I played every educational game
                it had until the batteries died, replaced them, and kept going.
              </p>
              <p className="text-muted leading-relaxed">
                That little blue computer started something. I went to the High
                School of Science and Technology, where my computer science
                teacher taught us Pascal, C++, Visual Basic, C#, and databases.
                By the time I graduated, I knew I wanted to build things with
                code for the rest of my life.
              </p>
            </div>
            <div className="flex justify-center">
              <Image
                src="/sheldon-first-computer.png"
                alt="VTech PreComputer 1000 — Sheldon's first computer"
                width={450}
                height={300}
                className="rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </Section>

        {/* Dumpster Computer & Computer Club — image LEFT */}
        <Section alt>
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="flex justify-center">
              <Image
                src="/sheldon-computer-club.jpeg"
                alt="Sheldon in the high school computer club"
                width={420}
                height={320}
                className="rounded-2xl shadow-xl"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-4">
                The Dumpster <span className="text-primary">Computer</span>
              </h2>
              <p className="text-muted leading-relaxed mb-4">
                My first real computer wasn&apos;t bought. My brother and I
                found an x86 machine in the dumpster outside a bank near our
                local bookstore. We carried it home, plugged it in, and it
                worked. That dumpster find changed everything.
              </p>
              <p className="text-muted leading-relaxed mb-4">
                We taught ourselves to build computers, tear them apart, and
                put them back together. I discovered Linux, mastered the DOS
                prompt, and became fluent in UNIX systems. Bash, the
                terminal, the command line became my natural habitat. We
                connected to bulletin board systems like Renegade and read
                2600. It was the hacker ethos before I knew what to call it:
                curiosity, resourcefulness, and the belief that if you could
                understand a system, you could make it do anything.
              </p>
              <p className="text-muted leading-relaxed">
                In high school, I joined the computer club, which became my
                second home. While other kids were on the basketball court, I
                was in the lab, writing code, building networks, and
                learning from a community of people who were just as obsessed
                as I was.
              </p>
            </div>
          </div>
        </Section>

        {/* Military Service — image RIGHT */}
        <Section>
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">
                Serving My <span className="text-primary">Country</span>
              </h2>
              <p className="text-muted leading-relaxed mb-4">
                I served in the National Guard, where I deployed during
                Operation Enduring Freedom. It was the hardest thing I&apos;ve
                ever done and the experience that shaped me the most.
              </p>
              <p className="text-muted leading-relaxed mb-4">
                The military taught me how to lead under pressure, how to make
                decisions with incomplete information, and how to take care of
                the people around you before you take care of yourself. Every
                leadership principle I practice today, in engineering, in
                writing, in life, traces back to what I learned in
                uniform.
              </p>
              <p className="text-muted leading-relaxed">
                Coming home was its own battle. The transition back to civilian
                life forced me to confront my mental health in ways I
                wasn&apos;t prepared for. I learned that the discipline the
                military gave me could be redirected, into taking care
                of my mind the way I&apos;d been trained to take care of a
                mission. Exercise became non-negotiable. Cycling became my
                therapy. Vacations to Jamaica became how I recharge. And voices
                like David Goggins on YouTube became the accountability
                partners who reminded me that the fight doesn&apos;t end when
                the deployment does, it just changes terrain.
              </p>
            </div>
            <div className="flex justify-center">
              <div className="grid grid-cols-2 gap-3">
                <Image
                  src="/sheldon-soldier-gun.jpeg"
                  alt="Sheldon in military service"
                  width={200}
                  height={260}
                  className="rounded-xl shadow-lg object-cover w-full h-full"
                />
                <Image
                  src="/sheldon-soldier-baby.jpeg"
                  alt="Sheldon — soldier and father"
                  width={200}
                  height={260}
                  className="rounded-xl shadow-lg object-cover w-full h-full"
                />
              </div>
            </div>
          </div>
        </Section>

        {/* Cycling — image LEFT */}
        <Section alt>
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="flex justify-center">
              <Image
                src="/sheldon-cycling.jpeg"
                alt="Sheldon cycling in USA jersey"
                width={400}
                height={400}
                className="rounded-2xl shadow-xl"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-4">
                Life on <span className="text-primary">Two Wheels</span>
              </h2>
              <p className="text-muted leading-relaxed mb-4">
                Cycling isn&apos;t a hobby for me. It&apos;s how I take care
                of my mental health. After coming home from deployment, I
                needed something that was physically hard enough to quiet the
                noise and structured enough to give the day a purpose. Cycling
                became that thing. Last year I rode over 1,000 miles.
              </p>
              <p className="text-muted leading-relaxed mb-6">
                There&apos;s something about the rhythm of the pedals and the
                open road that clears my head and lets the ideas come through.
                You don&apos;t ride a thousand miles in a year by being
                motivated. You do it by showing up on the days you don&apos;t
                feel like it, which is the same discipline that applies
                to leadership, to writing, and to life.
              </p>
              <a
                href="https://www.strava.com/athletes/22309848"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 border border-primary text-primary font-semibold rounded-lg hover:bg-primary/10 transition-all"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
                </svg>
                Follow Me on Strava
              </a>
            </div>
          </div>
        </Section>

        {/* Learning to Fly — image RIGHT */}
        <Section>
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">
                Learning to <span className="text-primary">Fly</span>
              </h2>
              <p className="text-muted leading-relaxed mb-4">
                If I didn&apos;t have a career in technology, I would have been
                a pilot. A few years ago I started flight training and earned my
                student pilot license. Sitting in the cockpit of a single-engine
                aircraft and knowing that your decisions are the only thing
                between you and the ground is a feeling that never gets old.
              </p>
              <p className="text-muted leading-relaxed mb-4">
                The hardest parts? Learning to use the rudder, on the
                ground and in the air. Landing. Understanding flight patterns
                and traffic. But the real lesson flying teaches you is focus and
                trust. Focus on the procedure. Trust your instruments, even when
                your instincts are screaming something different.
              </p>
              <p className="text-muted leading-relaxed">
                That&apos;s a lesson that translates directly to leadership.
                Build the instruments, the metrics, the evals, the
                dashboards, and then trust them, even when the noise
                around you is loud.
              </p>
            </div>
            <div className="flex justify-center">
              <Image
                src="/sheldon-learning-to-fly.jpeg"
                alt="Sheldon in the cockpit during flight training"
                width={450}
                height={340}
                className="rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </Section>

        {/* Island Life — image LEFT */}
        <Section alt>
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="flex justify-center">
              <Image
                src="/sheldon-snorkeling.jpeg"
                alt="Sheldon snorkeling in Jamaica"
                width={400}
                height={400}
                className="rounded-2xl shadow-xl"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-4">
                Island <span className="text-secondary">Soul</span>
              </h2>
              <p className="text-muted leading-relaxed mb-4">
                No matter how far the career takes me, Jamaica stays in my
                bones. I go back whenever I can, to snorkel the reefs, to
                eat jerk chicken on the beach, and to remember where I came
                from.
              </p>
              <p className="text-muted leading-relaxed">
                The beaches of Ocho Rios, Kingston, and Negril aren&apos;t just
                vacation spots. They&apos;re home. And they&apos;re a reminder
                that the best ideas come when you slow down long enough to let
                the water clear.
              </p>
            </div>
          </div>
        </Section>

        {/* Professional headshot + CTA */}
        <Section>
          <div className="text-center">
            <div className="w-40 h-40 rounded-full overflow-hidden mx-auto mb-8 border-4 border-primary/30">
              <Image
                src="/author-photo.jpg"
                alt="Sheldon Barnes — professional headshot"
                width={160}
                height={160}
                className="w-full h-full object-cover object-top"
              />
            </div>
            <h2 className="text-3xl font-bold mb-4">
              That&apos;s the Short Version
            </h2>
            <p className="text-muted max-w-xl mx-auto mb-8">
              From a VTech computer in Jamaica, through the deserts of the
              Middle East, to leading AI-first engineering teams at Fortune 100
              enterprises, and writing the books I wished someone had
              handed me along the way.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="/books"
                className="px-8 py-3 bg-primary text-background font-semibold rounded-lg hover:bg-primary-light transition-all"
              >
                Read My Books
              </a>
              <a
                href="/#contact"
                className="px-8 py-3 border border-surface-light text-foreground font-semibold rounded-lg hover:border-primary hover:text-primary transition-all"
              >
                Get in Touch
              </a>
            </div>
          </div>
        </Section>
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
