import Link from "next/link";
import { GUT_PROFILES } from "~/lib/quiz-data";

// Per-profile colors and copy from design
const PROFILE_META: Record<
  string,
  { chipBg: string; chipFg: string; rarity: string; body: string }
> = {
  DBRH: {
    chipBg: "#d4e7c8",
    chipFg: "#2a4f1b",
    rarity: "Rare · 4% of population",
    body: "Your gut is a thriving ecosystem. You naturally gravitate toward variety and your microbiome rewards you for it — quietly, reliably, every day.",
  },
  DBRL: {
    chipBg: "#c7e3d6",
    chipFg: "#1f4a36",
    rarity: "Uncommon · 7%",
    body: "You have an impressively diverse and resilient microbiome, but fiber is your missing puzzle piece. The fix is small; the upside is enormous.",
  },
  DBVH: {
    chipBg: "#bfe0e2",
    chipFg: "#1c4448",
    rarity: "Uncommon · 6%",
    body: "You feed your gut beautifully — diverse, balanced, fiber-rich. But recovery fluctuates: stress and sleep show up in the mirror of your microbiome.",
  },
  DBVL: {
    chipBg: "#c2d6e6",
    chipFg: "#1d3a55",
    rarity: "Common · 9%",
    body: "Resilient at your core, but running on fumes. Your microbiome is solid; inconsistency in diet and rest is the thing tugging at the edges.",
  },
  DIRH: {
    chipBg: "#dbe5b8",
    chipFg: "#3d4810",
    rarity: "Common · 8%",
    body: "You have the building blocks of exceptional gut health — variety, resilience, fiber. Calming inflammation is the lever that unlocks all of it.",
  },
  DIRL: {
    chipBg: "#f0d9a8",
    chipFg: "#5a3e0a",
    rarity: "Common · 8%",
    body: "Your microbiome is diverse and bounces back well — qualities that give you a great foundation. More fiber, less inflammation, and you take flight.",
  },
  DIVH: {
    chipBg: "#f4ccaa",
    chipFg: "#5e3413",
    rarity: "Common · 7%",
    body: "You eat impressively well — diverse and fiber-rich — but inflammation and inconsistent recovery suggest your gut is asking for steadier rhythms.",
  },
  DIVL: {
    chipBg: "#f1bf9c",
    chipFg: "#5c2f12",
    rarity: "Common · 7%",
    body: "You have microbial variety many lack, but inflammation, inconsistency, and low fiber are pulling against you. Small anchors will change everything.",
  },
  SBRH: {
    chipBg: "#dfd7ed",
    chipFg: "#3a2f59",
    rarity: "Common · 6%",
    body: "Your gut is attentive to every signal. You eat well and recover well, but your nervous system and microbiome talk to each other constantly.",
  },
  SBRL: {
    chipBg: "#e6d3e2",
    chipFg: "#4a2649",
    rarity: "Common · 7%",
    body: "You've found careful balance with a limited food range, and your gut is stable. Restricted diversity is the ceiling you can quietly lift.",
  },
  SBVH: {
    chipBg: "#f0d4e4",
    chipFg: "#5a1c47",
    rarity: "Common · 6%",
    body: "You feed your gut generously and it shows in your balanced inner environment. Sensitivity is the part of you that needs gentler protection.",
  },
  SBVL: {
    chipBg: "#f4d3d8",
    chipFg: "#5a1f29",
    rarity: "Common · 7%",
    body: "Your gut has a stable foundation but needs more fuel and consistency. Sensitivity means you'll feel the changes quickly — for better and worse.",
  },
  SIRH: {
    chipBg: "#f3c8ca",
    chipFg: "#5a1c20",
    rarity: "Common · 6%",
    body: "You're doing the hard work — eating fiber-rich foods and bouncing back reasonably well — but inflammation is the friction slowing the change.",
  },
  SIRL: {
    chipBg: "#f1c5b8",
    chipFg: "#5a2410",
    rarity: "Common · 7%",
    body: "Your gut is sensitive and dealing with inflammation, but resilience is a real asset. You can rebuild from here — patiently, one habit at a time.",
  },
  SIVH: {
    chipBg: "#d8d0bd",
    chipFg: "#463d20",
    rarity: "Common · 6%",
    body: "Your diet shows real commitment — fiber is there — but sensitivity, inflammation, and variable recovery mean healing comes in slow, real layers.",
  },
  SIVL: {
    chipBg: "#d4cfc1",
    chipFg: "#3d3823",
    rarity: "Common · 9%",
    body: "You're at the most challenging starting point — but also the one with the most transformative potential. Every small change here compounds quickly.",
  },
};

const AXES = [
  { code: "D / S", label: "Diverse · Sensitive" },
  { code: "B / I", label: "Balanced · Inflamed" },
  { code: "R / V", label: "Resilient · Variable" },
  { code: "H / L", label: "High-fiber · Low-fiber" },
];

function BotanicalMark() {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="mx-auto h-10 w-10 text-primary"
    >
      <circle cx="20" cy="20" r="3.4" fill="currentColor" stroke="none" />
      <path d="M20 16.6 V 6" />
      <path d="M20 23.4 V 34" />
      <path d="M16.6 20 H 6" />
      <path d="M23.4 20 H 34" />
      <circle cx="20" cy="6" r="2" />
      <circle cx="20" cy="34" r="2" />
      <circle cx="6" cy="20" r="2" />
      <circle cx="34" cy="20" r="2" />
      <circle cx="11" cy="11" r="1.4" />
      <circle cx="29" cy="11" r="1.4" />
      <circle cx="11" cy="29" r="1.4" />
      <circle cx="29" cy="29" r="1.4" />
    </svg>
  );
}

function ArrowRight({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M2 6h8M7 3l3 3-3 3" />
    </svg>
  );
}

export function ProfilesSection() {
  return (
    <section
      id="profiles"
      style={{ background: "#f7f3ec" }}
      className="border-t border-border px-4 py-24"
    >
      <div className="mx-auto max-w-[1280px]">
        {/* Header */}
        <header className="mb-18 text-center">
          <BotanicalMark />

          <div className="mt-5 mb-0">
            <span
              className="inline-flex items-center gap-2.5 text-[12px] font-medium uppercase tracking-[0.18em]"
              style={{ color: "#6b6e64" }}
            >
              <span
                className="inline-block h-px w-7"
                style={{ background: "#d8d1bf" }}
              />
              The microbiome typology
            </span>
          </div>

          <h2
            className="mt-4 mb-3 text-[clamp(40px,6.4vw,80px)] leading-[1.02] tracking-[-0.015em]"
            style={{
              fontFamily: "var(--font-instrument-serif), Georgia, serif",
              fontWeight: 400,
              color: "#1a1d1a",
            }}
          >
            All{" "}
            <span
              style={{
                fontStyle: "italic",
                color: "#2f4a2c",
                fontFamily: "var(--font-instrument-serif), Georgia, serif",
              }}
            >
              sixteen profiles
            </span>
          </h2>

          <p
            className="mx-auto max-w-[560px] text-[17px] leading-[1.55]"
            style={{ color: "#6b6e64" }}
          >
            Four axes — diversity, inflammation, resilience, fiber — combine
            into sixteen distinct gut personalities. Take the quiz to find
            yours.
          </p>

          {/* Axis legend */}
          <ul
            className="mx-auto mt-9 flex w-fit max-w-full list-none flex-wrap justify-content-center rounded-full p-1.5"
            style={{
              border: "1px solid #e6e0d2",
              background: "#fdfbf6",
              justifyContent: "center",
              padding: "6px",
            }}
            aria-label="Profile axes"
          >
            {AXES.map((ax, i) => (
              <li key={ax.code} className="flex items-center">
                {i > 0 && (
                  <span
                    className="mx-0 my-1.5 w-px"
                    style={{ background: "#e6e0d2" }}
                    aria-hidden="true"
                  />
                )}
                <span
                  className="whitespace-nowrap rounded-full px-[18px] py-2 text-[13px]"
                  style={{ color: "#6b6e64" }}
                >
                  <b
                    className="mr-1.5"
                    style={{
                      fontFamily: "ui-monospace, monospace",
                      fontSize: 11.5,
                      fontWeight: 600,
                      letterSpacing: "0.04em",
                      color: "#1a1d1a",
                    }}
                  >
                    {ax.code}
                  </b>
                  {ax.label}
                </span>
              </li>
            ))}
          </ul>
        </header>

        {/* Card grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {GUT_PROFILES.map((profile, idx) => {
            const meta = PROFILE_META[profile.code];
            if (!meta) return null;
            const tags = profile.tagline.split(" · ");

            return (
              <Link
                key={profile.code}
                href={`/quiz`}
                className="group relative flex min-h-[280px] flex-col overflow-hidden rounded-[18px] p-[22px_22px_24px] transition-all duration-[220ms] ease-[cubic-bezier(.2,.7,.2,1)] hover:-translate-y-0.5"
                style={
                  {
                    background: "#fdfbf6",
                    border: "1px solid #e6e0d2",
                  } as React.CSSProperties
                }
              >
                {/* color stripe */}
                <div
                  className="absolute inset-x-0 top-0 h-[3px]"
                  style={{ background: meta.chipFg, opacity: 0.35 }}
                />

                {/* top row */}
                <div className="mb-[22px] flex items-center justify-between">
                  <span
                    className="rounded-[6px] px-[10px] pb-1 pt-[5px] font-mono text-[11px] font-medium leading-none tracking-[0.14em]"
                    style={{
                      background: meta.chipBg,
                      color: meta.chipFg,
                    }}
                  >
                    {profile.code}
                  </span>
                  <span
                    className="text-sm"
                    style={{
                      fontFamily: "Georgia, serif",
                      fontStyle: "italic",
                      color: "#8a8c80",
                    }}
                  >
                    {String(idx + 1).padStart(2, "0")} / 16
                  </span>
                </div>

                {/* title */}
                <h3
                  className="mb-3 text-[30px] leading-[1.05] tracking-[-0.005em]"
                  style={{
                    fontFamily: "var(--font-instrument-serif), Georgia, serif",
                    fontWeight: 400,
                    color: "#1a1d1a",
                  }}
                >
                  <span
                    className="mb-0.5 block text-sm not-italic"
                    style={{
                      fontFamily: "Georgia, serif",
                      fontStyle: "italic",
                      fontSize: 14,
                      color: "#6b6e64",
                      letterSpacing: "0.02em",
                    }}
                  >
                    The
                  </span>
                  {profile.name.replace("The ", "")}
                </h3>

                {/* tags */}
                <div className="mb-4 flex flex-wrap">
                  {tags.map((tag, ti) => (
                    <span
                      key={tag}
                      className="py-1 text-[11.5px]"
                      style={{ color: "#3a3d36" }}
                    >
                      {ti > 0 && (
                        <span
                          className="mx-2"
                          style={{ color: "#8a8c80" }}
                          aria-hidden="true"
                        >
                          ·
                        </span>
                      )}
                      {tag}
                    </span>
                  ))}
                </div>

                {/* body */}
                <p
                  className="mb-[18px] flex-1 text-[13.5px] leading-[1.55]"
                  style={{ color: "#6b6e64" }}
                >
                  {meta.body}
                </p>

                {/* footer */}
                <div
                  className="flex items-center justify-between pt-3.5 text-[12px]"
                  style={{
                    borderTop: "1px dashed #e6e0d2",
                    color: "#8a8c80",
                    letterSpacing: "0.02em",
                  }}
                >
                  <span className="flex items-center gap-1.5">
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{
                        background: meta.chipFg,
                        opacity: 0.55,
                      }}
                    />
                    {meta.rarity}
                  </span>
                  <span
                    className="flex items-center gap-1 font-medium transition-colors duration-[220ms] group-hover:text-[#2f4a2c]"
                    style={{ color: "#3a3d36" }}
                  >
                    Read profile
                    <ArrowRight className="h-3 w-3 transition-transform duration-[220ms] group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-[72px] text-center">
          <Link
            href="/quiz"
            className="inline-flex items-center gap-3 rounded-full border px-8 py-4 text-[15px] font-medium tracking-[-0.005em] transition-all duration-200 hover:-translate-y-px"
            style={{
              background: "#1a1d1a",
              color: "#fdfbf6",
              borderColor: "#1a1d1a",
            }}
          >
            Find your type
            <span
              className="flex h-[22px] w-[22px] items-center justify-center rounded-full"
              style={{ background: "rgba(255,255,255,0.12)" }}
            >
              <ArrowRight className="h-3 w-3" />
            </span>
          </Link>
          <p
            className="mt-3.5 text-[15px]"
            style={{
              fontFamily: "Georgia, serif",
              fontStyle: "italic",
              color: "#6b6e64",
            }}
          >
            12 questions · under 3 minutes
          </p>
        </div>
      </div>
    </section>
  );
}
