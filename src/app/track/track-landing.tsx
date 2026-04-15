"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createTrackerSession } from "~/app/actions/tracker";
import { Button } from "~/components/ui/button";

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

export function TrackLanding() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleStart() {
    setLoading(true);
    try {
      const { code } = await createTrackerSession();
      router.push(`/track/${code}`);
    } catch {
      setLoading(false);
    }
  }

  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hero-botanical"
      />
      <LeafSvg className="pointer-events-none absolute -left-8 top-20 h-48 w-48 rotate-12 text-primary/10" />
      <FlowerSvg className="pointer-events-none absolute right-16 top-8 h-24 w-24 text-accent/8" />
      <LeafSvg className="pointer-events-none absolute -right-6 bottom-16 h-36 w-36 -rotate-[25deg] text-primary/8" />

      <div className="relative mx-auto flex max-w-2xl flex-col gap-12 px-4 py-16">
        {/* Hero */}
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-2 text-primary">
            <FlowerSvg className="h-5 w-5" />
            <span className="text-sm font-semibold uppercase tracking-wider">
              7-Day Gut Journal
            </span>
            <FlowerSvg className="h-5 w-5" />
          </div>
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
            Track Your Gut Over a Week
          </h1>
          <p className="max-w-lg text-lg text-muted-foreground">
            The snapshot quiz captures a moment. The 7-day journal reveals how
            your gut actually behaves — across different foods, stress levels,
            and sleep patterns.
          </p>
        </div>

        {/* Comparison */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-muted font-mono text-xs font-black text-muted-foreground">
                Q
              </span>
              <h3 className="font-bold">Snapshot Quiz</h3>
            </div>
            <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
              {[
                "32 questions in one sitting",
                "Captures how you feel right now",
                "Results in ~10 minutes",
                "Great starting point",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <LeafSvg className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground/50" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-4 rounded-2xl border-2 border-primary/30 bg-primary/5 p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <FlowerSvg className="h-8 w-8 text-primary" />
              <h3 className="font-bold">7-Day Journal</h3>
            </div>
            <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
              {[
                "10 quick questions per day",
                "Tracks real patterns over time",
                "~2 minutes per day × 7 days",
                "Significantly more accurate",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <LeafSvg className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* How it works */}
        <div className="flex flex-col gap-6">
          <h2 className="flex items-center gap-2 text-xl font-black tracking-tight">
            <LeafSvg className="h-5 w-5 text-primary" />
            How it works
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                n: "01",
                title: "Start your journal",
                desc: "Get a unique URL you bookmark. No account needed.",
              },
              {
                n: "02",
                title: "Check in each day",
                desc: "Answer 10 questions about what you ate and how you felt. Takes 2 minutes.",
              },
              {
                n: "03",
                title: "Get your profile",
                desc: "After 7 days, your responses are analysed across all four gut axes.",
              },
            ].map((step) => (
              <div key={step.n} className="flex flex-col gap-2">
                <span className="font-mono text-3xl font-black text-primary/25">
                  {step.n}
                </span>
                <h3 className="font-bold">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* What we track */}
        <div className="flex flex-col gap-4">
          <h2 className="flex items-center gap-2 text-xl font-black tracking-tight">
            <LeafSvg className="h-5 w-5 text-primary" />
            What we track each day
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              {
                axis: "D/S",
                label: "Diversity",
                desc: "Food variety and exposure to new ingredients",
              },
              {
                axis: "B/I",
                label: "Inflammation",
                desc: "Gut comfort, energy after meals, fermented foods",
              },
              {
                axis: "R/V",
                label: "Resilience",
                desc: "Stress levels and sleep quality as gut proxies",
              },
              {
                axis: "H/L",
                label: "Fiber",
                desc: "Vegetable servings, whole grains, legumes, nuts",
              },
            ].map((item) => (
              <div
                key={item.axis}
                className="flex items-start gap-3 rounded-xl border border-border bg-card p-4"
              >
                <span className="font-mono text-xs font-black text-primary">
                  {item.axis}
                </span>
                <div>
                  <p className="text-sm font-semibold">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col items-center gap-3 text-center">
          <Button
            size="lg"
            onClick={handleStart}
            disabled={loading}
            className="rounded-2xl px-12 shadow-sm"
          >
            {loading ? "Starting your journal…" : "Start your 7-day journal"}
          </Button>
          <p className="text-xs text-muted-foreground">
            You'll get a unique URL to bookmark and return to each day. No
            account required.
          </p>
        </div>
      </div>
    </div>
  );
}
