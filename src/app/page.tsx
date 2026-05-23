import Link from "next/link";
import { HeroBackground } from "~/components/hero-background";
import { LearnMoreSection } from "~/components/learn-more-section";
import { MicrobiomeCarousel } from "~/components/microbiome-carousel";
import {
  FadeUp,
  HeroEntrance,
  SlideIn,
  StaggerContainer,
  StaggerItem,
} from "~/components/motion-wrappers";
import { ProfilesSection } from "~/components/profiles-section";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";

const steps = [
  {
    number: "01",
    title: "Answer 32 questions",
    description:
      "About your diet patterns, digestion, energy levels, stress, and lifestyle. No lab work required.",
  },
  {
    number: "02",
    title: "Get your 4-letter type",
    description:
      "Across four axes: Microbiome Diversity, Inflammation Balance, Resilience, and Dietary Fiber intake.",
  },
  {
    number: "03",
    title: "Unlock your profile",
    description:
      "Receive a detailed breakdown of your gut type, what it means, and a personalised nutrition roadmap.",
  },
];

const axes = [
  {
    axis: "D vs S",
    label: "Diversity",
    desc: "How varied is your microbial community? Diverse microbiomes are linked to stronger immunity and mental health.",
  },
  {
    axis: "B vs I",
    label: "Inflammation",
    desc: "Is your gut environment calm or inflamed? Chronic low-grade inflammation underlies many digestive conditions.",
  },
  {
    axis: "R vs V",
    label: "Resilience",
    desc: "How quickly does your gut recover from disruption — antibiotics, travel, stress, or a bad meal?",
  },
  {
    axis: "H vs L",
    label: "Fiber intake",
    desc: "Fiber is the primary fuel for beneficial bacteria. Your intake pattern shapes which strains thrive.",
  },
];

function LeafSvg({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 7-8 7" />
    </svg>
  );
}

function FlowerSvg({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <circle cx="16" cy="16" r="4" />
      <ellipse cx="16" cy="6" rx="3" ry="5" />
      <ellipse cx="16" cy="26" rx="3" ry="5" />
      <ellipse cx="6" cy="16" rx="5" ry="3" />
      <ellipse cx="26" cy="16" rx="5" ry="3" />
      <ellipse cx="9" cy="9" rx="3" ry="5" transform="rotate(-45 9 9)" />
      <ellipse cx="23" cy="9" rx="3" ry="5" transform="rotate(45 23 9)" />
      <ellipse cx="9" cy="23" rx="3" ry="5" transform="rotate(45 9 23)" />
      <ellipse cx="23" cy="23" rx="3" ry="5" transform="rotate(-45 23 23)" />
    </svg>
  );
}

export default function Home() {
  return (
    <main className="flex flex-col">
      {/* Hero */}
      <section className="relative flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center gap-6 overflow-hidden px-4 py-20 text-center">
        <HeroBackground />
        <LeafSvg className="pointer-events-none absolute -left-10 top-16 h-56 w-56 rotate-[15deg] text-primary/10" />
        <LeafSvg className="pointer-events-none absolute -right-8 bottom-20 h-44 w-44 -rotate-[20deg] text-accent/12" />
        <FlowerSvg className="pointer-events-none absolute right-20 top-12 h-24 w-24 text-primary/8" />
        <FlowerSvg className="pointer-events-none absolute left-28 bottom-28 h-16 w-16 text-accent/10" />
        <FlowerSvg className="pointer-events-none absolute left-8 top-1/2 h-10 w-10 -translate-y-1/2 text-primary/6" />

        <div className="relative flex flex-col items-center gap-6">
          <HeroEntrance delay={0.1}>
            <Badge
              variant="outline"
              className="rounded-full px-4 py-1 text-xs font-semibold"
            >
              Free · 10 minutes · No account needed
            </Badge>
          </HeroEntrance>

          <HeroEntrance delay={0.25}>
            <h1 className="max-w-2xl text-5xl font-black tracking-tight sm:text-6xl">
              Discover Your Gut!
            </h1>
          </HeroEntrance>

          <HeroEntrance delay={0.4}>
            <p className="max-w-lg text-lg text-muted-foreground">
              Like Myers-Briggs — but for your gut. Answer 32 questions and get
              matched to one of 16 microbiome profiles, each with a tailored
              nutrition plan.
            </p>
          </HeroEntrance>

          <HeroEntrance delay={0.55}>
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" className="rounded-2xl px-8 shadow-sm">
                <Link href="/quiz">Take the quiz</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-2xl px-8"
              >
                <Link href="#profiles">See all 16 types</Link>
              </Button>
            </div>
          </HeroEntrance>

          <HeroEntrance delay={0.7}>
            <p className="text-sm text-muted-foreground">
              Backed by research in nutritional microbiology · Not medical
              advice
            </p>
          </HeroEntrance>
        </div>
      </section>

      {/* What is the gut microbiome — arc carousel */}
      <section className="border-t border-border px-4 py-20">
        <FadeUp>
          <MicrobiomeCarousel />
        </FadeUp>
        <FadeUp
          delay={0.15}
          className="mx-auto mt-10 max-w-3xl rounded-2xl border border-primary/20 bg-primary/5 p-6 text-center"
        >
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">
              The bottom line:
            </span>{" "}
            gut health is not just about digestion. It is a master regulator of
            immunity, mood, metabolism, and resilience. Understanding your
            personal microbiome profile is one of the highest-leverage steps you
            can take for whole-body health.
          </p>
        </FadeUp>
      </section>

      {/* Learn More — gut animation */}
      <section id="learn-more" className="border-t border-border px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <FadeUp className="mb-10 text-center">
            <h2 className="mb-3 flex items-center justify-center gap-3 text-3xl font-black tracking-tight">
              <LeafSvg className="h-7 w-7 text-primary" />
              Learn More
            </h2>
            <p className="mx-auto max-w-xl text-muted-foreground">
              A 10-scene animated journey through the trillions of microbes
              living inside you — what they do, why they matter, and how your
              choices shape them.
            </p>
          </FadeUp>

          <FadeUp delay={0.1}>
            <LearnMoreSection />
          </FadeUp>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-border bg-muted/40 px-4 py-20">
        <div className="mx-auto max-w-3xl">
          <FadeUp className="mb-12">
            <h2 className="flex items-center justify-center gap-3 text-center text-3xl font-black tracking-tight">
              <LeafSvg className="h-7 w-7 text-primary" />
              How it works
              <LeafSvg className="h-7 w-7 scale-x-[-1] text-primary" />
            </h2>
          </FadeUp>

          <StaggerContainer className="grid gap-8 sm:grid-cols-3">
            {steps.map((step) => (
              <StaggerItem key={step.number}>
                <div className="flex flex-col gap-3">
                  <span className="font-mono text-4xl font-black text-primary/25">
                    {step.number}
                  </span>
                  <h3 className="font-bold">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Two ways to know your gut */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-3xl">
          <FadeUp className="mb-10 text-center">
            <h2 className="mb-3 flex items-center justify-center gap-3 text-3xl font-black tracking-tight">
              <LeafSvg className="h-7 w-7 text-primary" />
              Two ways to know your gut
            </h2>
            <p className="text-muted-foreground">
              Start with the quick quiz, go deeper with the 7-day journal.
            </p>
          </FadeUp>

          <div className="grid gap-5 sm:grid-cols-2">
            <SlideIn direction="left">
              <div className="flex h-full flex-col gap-5 rounded-2xl border border-border bg-card p-7 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-muted font-mono text-sm font-black text-muted-foreground">
                    Q
                  </span>
                  <div>
                    <h3 className="font-black">Snapshot Quiz</h3>
                    <p className="text-xs text-muted-foreground">
                      One-time · ~10 minutes
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Answer 32 questions about your current diet and digestion.
                  Best for getting a quick starting point or comparing to the
                  journal.
                </p>
                <ul className="flex flex-col gap-1.5 text-sm text-muted-foreground">
                  {[
                    "32 questions, all in one sitting",
                    "4-choice answers for accurate scoring",
                    "Instant profile + nutrition plan",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <LeafSvg className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground/50" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button asChild className="mt-auto rounded-xl">
                  <Link href="/quiz">Take the quiz</Link>
                </Button>
              </div>
            </SlideIn>

            <SlideIn direction="right" delay={0.1}>
              <div className="flex h-full flex-col gap-5 rounded-2xl border-2 border-primary/30 bg-primary/5 p-7 shadow-sm">
                <div className="flex items-center gap-3">
                  <FlowerSvg className="h-10 w-10 text-primary" />
                  <div>
                    <h3 className="font-black">7-Day Journal</h3>
                    <p className="text-xs text-muted-foreground">
                      Longitudinal · 2 min/day
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Check in for 10 questions each day. Your profile is built from
                  a week of real data — significantly more accurate than any
                  snapshot.
                </p>
                <ul className="flex flex-col gap-1.5 text-sm text-muted-foreground">
                  {[
                    "10 questions per day over 7 days",
                    "Tracks diet, stress, sleep, and gut comfort",
                    "Day-by-day trends + final profile",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <LeafSvg className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button asChild className="mt-auto rounded-xl">
                  <Link href="/track">Start your journal</Link>
                </Button>
              </div>
            </SlideIn>
          </div>
        </div>
      </section>

      <ProfilesSection />

      {/* Four axes explainer */}
      <section className="border-t border-border bg-muted/40 px-4 py-20">
        <div className="mx-auto max-w-3xl">
          <FadeUp className="mb-12">
            <h2 className="flex items-center justify-center gap-3 text-center text-3xl font-black tracking-tight">
              <LeafSvg className="h-7 w-7 text-primary" />
              The four axes
            </h2>
          </FadeUp>

          <StaggerContainer className="grid gap-5 sm:grid-cols-2">
            {axes.map((item) => (
              <StaggerItem key={item.axis}>
                <div className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-black text-primary">
                      {item.axis}
                    </span>
                    <span className="font-bold">{item.label}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="relative overflow-hidden border-t border-border px-4 py-20 text-center">
        <HeroBackground />
        <LeafSvg className="pointer-events-none absolute -left-6 top-1/2 h-32 w-32 -translate-y-1/2 rotate-12 text-primary/10" />
        <LeafSvg className="pointer-events-none absolute -right-4 bottom-4 h-24 w-24 -rotate-[30deg] text-accent/10" />
        <FadeUp className="relative mx-auto flex max-w-lg flex-col items-center gap-4">
          <h2 className="text-3xl font-black tracking-tight">
            Ready to meet your microbiome?
          </h2>
          <p className="text-muted-foreground">
            Takes 10 minutes. Completely free. No sign-up required.
          </p>
          <Button asChild size="lg" className="rounded-2xl px-10 shadow-sm">
            <Link href="/quiz">Start the quiz</Link>
          </Button>
        </FadeUp>
      </section>
    </main>
  );
}
