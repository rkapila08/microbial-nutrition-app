"use client";

import confetti from "canvas-confetti";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  awardQuizGamification,
  type GamificationResult,
  getLeaderboard,
  type LeaderboardEntry,
} from "~/app/actions/gamification";
import { BadgeDisplay } from "~/components/badge-display";
import { BadgeEarnToast } from "~/components/badge-earn-toast";
import { GutHealthScore } from "~/components/gut-health-score";
import { Leaderboard } from "~/components/leaderboard";
import { ProfileReveal } from "~/components/profile-reveal";
import { ShareCard } from "~/components/share-card";
import { Button } from "~/components/ui/button";
import { calculateGutHealthScore } from "~/lib/gamification";
import {
  AXIS_LABELS,
  type AxisChoice,
  type AxisKey,
  calculateResult,
  GUT_PROFILES,
  type GutProfile,
  getAxisScores,
  QUIZ_QUESTIONS,
} from "~/lib/quiz-data";
import { cn } from "~/lib/utils";

type Phase = "intro" | "quiz" | "reveal" | "results";

const AXIS_ORDER: AxisKey[] = [
  "diversity",
  "inflammation",
  "resilience",
  "fiber",
];

const CHOICE_LABELS: AxisChoice[] = ["a", "b", "c", "d"];

export function QuizClient() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, AxisChoice>>({});
  const [selectedChoice, setSelectedChoice] = useState<AxisChoice | null>(null);
  const [isRetake, setIsRetake] = useState(false);
  const [gamification, setGamification] = useState<GamificationResult | null>(
    null,
  );
  const [gamificationLoading, setGamificationLoading] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[] | null>(
    null,
  );
  const gamificationFired = useRef(false);
  const confettiFired = useRef(false);

  const question = QUIZ_QUESTIONS[current];
  const progress = Object.keys(answers).length / QUIZ_QUESTIONS.length;

  useEffect(() => {
    if (phase !== "results") return;

    if (!confettiFired.current) {
      confettiFired.current = true;
      confetti({
        particleCount: 140,
        spread: 110,
        origin: { y: 0.55 },
        colors: ["#22d3ee", "#34d399", "#a78bfa", "#fb923c", "#f0abfc"],
      });
      setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 60,
          spread: 80,
          origin: { x: 0, y: 0.6 },
          colors: ["#22d3ee", "#34d399", "#a78bfa"],
        });
        confetti({
          particleCount: 60,
          angle: 120,
          spread: 80,
          origin: { x: 1, y: 0.6 },
          colors: ["#fb923c", "#f0abfc", "#34d399"],
        });
      }, 250);
    }

    if (!gamificationFired.current) {
      gamificationFired.current = true;
      const code = calculateResult(answers);
      const axisScores = getAxisScores(answers);
      setGamificationLoading(true);
      awardQuizGamification(axisScores, code, isRetake).then((result) => {
        setGamification(result);
        setGamificationLoading(false);
      });
      getLeaderboard().then(setLeaderboard);
    }
  }, [phase, answers, isRetake]);

  function handleAnswer(choice: AxisChoice) {
    if (selectedChoice !== null) return;
    setSelectedChoice(choice);

    setTimeout(() => {
      const newAnswers = { ...answers, [question.id]: choice };
      setAnswers(newAnswers);
      setSelectedChoice(null);

      if (current < QUIZ_QUESTIONS.length - 1) {
        setCurrent((c) => c + 1);
      } else {
        setPhase("reveal");
      }
    }, 380);
  }

  function handleBack() {
    if (current === 0) {
      setPhase("intro");
      return;
    }
    setSelectedChoice(null);
    setCurrent((c) => c - 1);
  }

  function handleRetake() {
    setPhase("intro");
    setCurrent(0);
    setAnswers({});
    setSelectedChoice(null);
    setGamification(null);
    setLeaderboard(null);
    gamificationFired.current = false;
    confettiFired.current = false;
    setIsRetake(true);
  }

  if (phase === "intro") {
    return <IntroScreen onStart={() => setPhase("quiz")} />;
  }

  if (phase === "reveal" || phase === "results") {
    const code = calculateResult(answers);
    const profile =
      GUT_PROFILES.find((p) => p.code === code) ?? GUT_PROFILES[0];

    if (phase === "reveal") {
      return (
        <ProfileReveal
          profile={profile}
          onContinue={() => setPhase("results")}
        />
      );
    }

    const axisScores = getAxisScores(answers);
    const gutScore = calculateGutHealthScore(axisScores);
    return (
      <>
        {gamification && gamification.newBadges.length > 0 && (
          <BadgeEarnToast
            badges={gamification.newBadges}
            xpAwarded={gamification.xpAwarded}
          />
        )}
        <ResultsScreen
          profile={profile}
          axisScores={axisScores}
          gutScore={gutScore}
          gamification={gamification}
          gamificationLoading={gamificationLoading}
          leaderboard={leaderboard}
          onRetake={handleRetake}
        />
      </>
    );
  }

  return (
    <QuizScreen
      question={question}
      questionNumber={current + 1}
      total={QUIZ_QUESTIONS.length}
      progress={progress}
      selectedChoice={selectedChoice}
      existingAnswer={answers[question.id]}
      onAnswer={handleAnswer}
      onBack={handleBack}
    />
  );
}

// ── Intro ─────────────────────────────────────────────────

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

function IntroScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hero-botanical"
      />

      <LeafSvg className="pointer-events-none absolute -left-8 top-12 h-48 w-48 rotate-12 text-primary/10" />
      <LeafSvg className="pointer-events-none absolute -right-6 bottom-16 h-36 w-36 -rotate-[25deg] text-accent/15" />
      <FlowerSvg className="pointer-events-none absolute right-16 top-10 h-20 w-20 text-primary/8" />
      <FlowerSvg className="pointer-events-none absolute left-24 bottom-24 h-14 w-14 text-accent/10" />

      <div className="relative mx-auto flex max-w-lg flex-col items-center gap-8 px-4 py-20 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-2 text-primary">
            <LeafSvg className="h-5 w-5" />
            <span className="text-sm font-semibold tracking-wider uppercase">
              MicroType
            </span>
            <LeafSvg className="h-5 w-5 scale-x-[-1]" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">
            Discover Your Gut Type
          </h1>
          <p className="text-lg text-muted-foreground">
            32 questions about your diet, digestion, and lifestyle. No lab work
            required.
          </p>
        </div>

        <div className="grid w-full grid-cols-3 gap-3">
          {["32 questions", "~10 minutes", "16 types"].map((label) => (
            <div
              key={label}
              className="rounded-2xl border border-border bg-card px-3 py-3 text-sm font-semibold shadow-sm"
            >
              {label}
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2.5 text-left text-sm text-muted-foreground">
          {[
            "Four axes: Diversity, Inflammation, Resilience, and Fiber",
            "Matched to one of 16 distinct microbiome profiles",
            "Personalised nutrition roadmap for your specific type",
          ].map((item) => (
            <p key={item} className="flex items-start gap-2.5">
              <LeafSvg className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              {item}
            </p>
          ))}
        </div>

        <Button
          size="lg"
          onClick={onStart}
          className="w-full rounded-2xl px-12 sm:w-auto"
        >
          Start the quiz
        </Button>

        <p className="text-xs text-muted-foreground">
          Backed by research in nutritional microbiology · Not medical advice
        </p>
      </div>
    </div>
  );
}

// ── Quiz question ──────────────────────────────────────────

interface QuizScreenProps {
  question: (typeof QUIZ_QUESTIONS)[number];
  questionNumber: number;
  total: number;
  progress: number;
  selectedChoice: AxisChoice | null;
  existingAnswer: AxisChoice | undefined;
  onAnswer: (choice: AxisChoice) => void;
  onBack: () => void;
}

const AXIS_NAMES: Record<AxisKey, string> = {
  diversity: "Diversity",
  inflammation: "Inflammation",
  resilience: "Resilience",
  fiber: "Fiber",
};

function QuizScreen({
  question,
  questionNumber,
  total,
  progress,
  selectedChoice,
  existingAnswer,
  onAnswer,
  onBack,
}: QuizScreenProps) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="h-1.5 w-full bg-muted">
        <div
          className="progress-botanical h-full rounded-r-full transition-all duration-500"
          style={{ width: `${Math.max(progress * 100, 2)}%` }}
        />
      </div>

      <div className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-7 px-4 py-10">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {questionNumber} / {total}
          </span>
          <span className="rounded-full border border-border bg-muted px-3 py-1 font-mono text-xs font-semibold text-muted-foreground uppercase tracking-widest">
            {AXIS_NAMES[question.axis]}
          </span>
        </div>

        <h2 className="text-xl font-bold leading-snug tracking-tight sm:text-2xl">
          {question.text}
        </h2>

        <div className="flex flex-col gap-3">
          {CHOICE_LABELS.map((choice) => {
            const isSelected = selectedChoice === choice;
            const isExisting =
              existingAnswer === choice && selectedChoice === null;
            const isPending = selectedChoice !== null && !isSelected;

            return (
              <button
                key={choice}
                type="button"
                onClick={() => onAnswer(choice)}
                disabled={selectedChoice !== null}
                className={cn(
                  "flex w-full items-start gap-4 rounded-2xl border-2 p-4 text-left transition-all duration-200",
                  isSelected && "border-primary bg-primary/10 shadow-sm",
                  isExisting && "border-primary/40 bg-primary/5",
                  !isSelected &&
                    !isExisting &&
                    "border-border bg-card hover:border-primary/40 hover:bg-muted/50",
                  isPending && "opacity-35",
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-mono text-xs font-bold transition-colors",
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  {choice.toUpperCase()}
                </span>
                <span className="text-sm leading-relaxed">
                  {question.options[choice]}
                </span>
              </button>
            );
          })}
        </div>

        <div>
          <Button variant="ghost" size="sm" onClick={onBack}>
            ← Back
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Results ────────────────────────────────────────────────

const AXIS_ICONS: Record<AxisKey, string> = {
  diversity: "🦠",
  inflammation: "💚",
  resilience: "🛡️",
  fiber: "🥦",
};

interface AxisInsight {
  tier: string;
  tierColor: string;
  barColor: string;
  message: string;
  action: string;
}

function getAxisInsight(axisKey: AxisKey, pct: number): AxisInsight {
  if (axisKey === "diversity") {
    if (pct >= 0.7)
      return {
        tier: "Excellent",
        tierColor: "text-emerald-600 dark:text-emerald-400",
        barColor: "bg-emerald-500",
        message:
          "Your microbiome diversity is one of your strongest assets. A varied ecosystem means stronger immunity, more stable energy, and better protection against pathogens.",
        action:
          "Keep rotating your plant foods — try adding one new vegetable, grain, or fermented food this week.",
      };
    if (pct >= 0.4)
      return {
        tier: "Moderate",
        tierColor: "text-amber-600 dark:text-amber-400",
        barColor: "bg-amber-500",
        message:
          "Your diversity is in the middle range. This is often the fastest lever to pull — small changes to food variety can noticeably shift your microbiome within weeks.",
        action:
          "Swap one of your usual staple foods for something different this week (e.g., white rice → quinoa, regular yogurt → kefir).",
      };
    return {
      tier: "Needs Attention",
      tierColor: "text-red-600 dark:text-red-400",
      barColor: "bg-red-500",
      message:
        "Diversity is your biggest growth opportunity right now. A less varied microbiome means fewer protective bacterial strains and more vulnerability to digestive disruption.",
      action:
        "Start with one new plant food per week — variety over the long term is more important than quantity short-term.",
    };
  }
  if (axisKey === "inflammation") {
    if (pct >= 0.7)
      return {
        tier: "Well Controlled",
        tierColor: "text-emerald-600 dark:text-emerald-400",
        barColor: "bg-emerald-500",
        message:
          "Your inflammation balance is strong. Your dietary choices are actively keeping gut inflammation at bay, which benefits energy levels, mood, and immune resilience.",
        action:
          "Maintain your anti-inflammatory habits — omega-3s, colourful vegetables, and fermented foods are your allies.",
      };
    if (pct >= 0.4)
      return {
        tier: "Mixed",
        tierColor: "text-amber-600 dark:text-amber-400",
        barColor: "bg-amber-500",
        message:
          "Your inflammation markers are mixed. Some habits are helping, but others may be triggering low-grade gut inflammation that affects digestion, skin, and energy over time.",
        action:
          "Try removing one known inflammatory food this week — processed sugar, refined oils, or alcohol — and observe how you feel.",
      };
    return {
      tier: "Elevated",
      tierColor: "text-red-600 dark:text-red-400",
      barColor: "bg-red-500",
      message:
        "Your score suggests your gut may be in a low-grade inflammatory state. This is very common and very addressable — it's often one of the first things to respond to dietary changes.",
      action:
        "Prioritise anti-inflammatory foods this week: oily fish, turmeric, leafy greens, and extra-virgin olive oil.",
    };
  }
  if (axisKey === "resilience") {
    if (pct >= 0.7)
      return {
        tier: "Strong",
        tierColor: "text-emerald-600 dark:text-emerald-400",
        barColor: "bg-emerald-500",
        message:
          "Your gut bounces back well from disruptions. Travel, stress, and the occasional indulgent meal are less likely to derail your digestion for long periods.",
        action:
          "Protect your resilience with consistent sleep — gut bacteria follow a circadian rhythm and suffer with irregular schedules.",
      };
    if (pct >= 0.4)
      return {
        tier: "Moderate",
        tierColor: "text-amber-600 dark:text-amber-400",
        barColor: "bg-amber-500",
        message:
          "Your gut resilience is moderate — you likely notice digestive struggles during stressful periods or when your routine changes significantly.",
        action:
          "Add a probiotic-rich food daily (live yogurt, kefir, or kombucha) to help stabilise your gut environment.",
      };
    return {
      tier: "Sensitive",
      tierColor: "text-red-600 dark:text-red-400",
      barColor: "bg-red-500",
      message:
        "Your gut shows lower resilience and is more reactive to stress, antibiotics, or dietary disruptions. The good news: resilience responds well to consistent, targeted care.",
      action:
        "Focus on sleep and stress management this week — both directly affect gut permeability and bacterial stability.",
    };
  }
  // fiber
  if (pct >= 0.7)
    return {
      tier: "High",
      tierColor: "text-emerald-600 dark:text-emerald-400",
      barColor: "bg-emerald-500",
      message:
        "Your fiber intake is excellent. Fiber is literally food for your gut bacteria — it fuels production of short-chain fatty acids that protect your gut lining and reduce inflammation.",
      action:
        "Great work — try rotating fiber sources (psyllium, flax, chicory root) to feed different bacterial strains.",
    };
  if (pct >= 0.4)
    return {
      tier: "Moderate",
      tierColor: "text-amber-600 dark:text-amber-400",
      barColor: "bg-amber-500",
      message:
        "Your fiber intake is moderate. Small increases here yield outsized benefits — most people see real improvements in digestion and energy within 2–3 weeks of boosting fiber.",
      action:
        "Add one serving of legumes (beans, lentils, or chickpeas) to your diet every other day this week.",
    };
  return {
    tier: "Low",
    tierColor: "text-red-600 dark:text-red-400",
    barColor: "bg-red-500",
    message:
      "Fiber is your clearest and most impactful opportunity. Most modern diets under-fuel gut bacteria significantly, and the effects compound over time.",
    action:
      "Start today: swap refined grains for whole grains and add a tablespoon of flaxseed or chia to one meal daily.",
  };
}

interface ResultsScreenProps {
  profile: GutProfile;
  axisScores: Record<AxisKey, { score: number; max: number }>;
  gutScore: number;
  gamification: GamificationResult | null;
  gamificationLoading: boolean;
  leaderboard: LeaderboardEntry[] | null;
  onRetake: () => void;
}

function ResultsScreen({
  profile,
  axisScores,
  gutScore,
  gamification,
  gamificationLoading,
  leaderboard,
  onRetake,
}: ResultsScreenProps) {
  const isAnon = gamification && !gamification.isAuthenticated;

  const weakestAxis = AXIS_ORDER.reduce((weakest, axisKey) => {
    const { score, max } = axisScores[axisKey];
    const pct = max > 0 ? score / max : 0.5;
    const { score: ws, max: wm } = axisScores[weakest];
    const weakestPct = wm > 0 ? ws / wm : 0.5;
    return pct < weakestPct ? axisKey : weakest;
  });

  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hero-botanical opacity-60"
      />
      <LeafSvg className="pointer-events-none absolute -right-10 top-10 h-40 w-40 rotate-[-20deg] text-primary/8" />
      <FlowerSvg className="pointer-events-none absolute -left-6 bottom-20 h-28 w-28 text-accent/8" />

      <div className="relative mx-auto flex max-w-xl flex-col gap-10 px-4 py-16">
        {/* Type display */}
        <div className="text-center">
          <div className="mb-2 flex items-center justify-center gap-2 text-muted-foreground">
            <LeafSvg className="h-4 w-4 text-primary" />
            <p className="text-sm font-medium">Your gut type is</p>
            <LeafSvg className="h-4 w-4 scale-x-[-1] text-primary" />
          </div>
          <span
            className={cn(
              "inline-block rounded-2xl px-7 py-3.5 font-mono text-5xl font-black tracking-widest shadow-sm",
              profile.color,
            )}
          >
            {profile.code}
          </span>
          <h1 className="mt-5 text-3xl font-bold tracking-tight">
            {profile.name}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {profile.tagline}
          </p>
        </div>

        {/* Gut Health Score + XP */}
        <div className="flex items-center justify-around rounded-2xl border border-border bg-card p-5 shadow-sm">
          <GutHealthScore score={gutScore} size="md" />
          <div className="h-12 w-px bg-border" />
          <div className="flex flex-col items-center gap-1">
            {gamificationLoading ? (
              <div className="h-8 w-20 animate-pulse rounded-lg bg-muted" />
            ) : gamification ? (
              <>
                <span className="text-2xl font-black text-primary tabular-nums">
                  +{gamification.xpAwarded}
                </span>
                <span className="text-xs text-muted-foreground">XP earned</span>
                {gamification.newLevel && (
                  <span className="mt-1 rounded-full bg-accent/15 px-2 py-0.5 text-xs font-bold text-accent">
                    Level up! {gamification.newLevel.name}
                  </span>
                )}
              </>
            ) : (
              <>
                <span className="text-xl font-black text-primary">100+</span>
                <span className="text-xs text-muted-foreground">
                  XP available
                </span>
              </>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="rounded-2xl border border-border bg-card p-5 text-sm leading-relaxed text-muted-foreground shadow-sm">
          {profile.description}
        </div>

        {/* Personalised axis insights */}
        <div className="flex flex-col gap-4">
          <h2 className="flex items-center gap-2 font-bold">
            <LeafSvg className="h-4 w-4 text-primary" />
            Your personalised gut analysis
          </h2>
          {AXIS_ORDER.map((axisKey) => {
            const { score, max } = axisScores[axisKey];
            const pct = max > 0 ? score / max : 0.5;
            const displayPct = Math.round(pct * 100);
            const labels = AXIS_LABELS[axisKey];
            const insight = getAxisInsight(axisKey, pct);
            const isWeakest = axisKey === weakestAxis;

            return (
              <div
                key={axisKey}
                className={cn(
                  "rounded-2xl border bg-card p-4 shadow-sm flex flex-col gap-3",
                  isWeakest
                    ? "border-amber-300/60 dark:border-amber-700/40"
                    : "border-border",
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{AXIS_ICONS[axisKey]}</span>
                    <span className="font-semibold text-sm">
                      {labels.label}
                    </span>
                    {isWeakest && (
                      <span className="rounded-full bg-amber-100 dark:bg-amber-900/40 px-2 py-0.5 text-xs font-semibold text-amber-700 dark:text-amber-400">
                        Focus area
                      </span>
                    )}
                  </div>
                  <span className={cn("text-xs font-bold", insight.tierColor)}>
                    {insight.tier}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-700",
                        insight.barColor,
                      )}
                      style={{ width: `${displayPct}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold tabular-nums text-muted-foreground w-8 text-right">
                    {displayPct}%
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {insight.message}
                </p>
                <div className="flex items-start gap-2 rounded-xl bg-muted/50 px-3 py-2.5">
                  <span className="text-xs shrink-0 mt-0.5">💡</span>
                  <p className="text-xs font-medium">{insight.action}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recommendations */}
        <div className="flex flex-col gap-4">
          <h2 className="flex items-center gap-2 font-bold">
            <FlowerSvg className="h-4 w-4 text-accent" />
            Your personalised nutrition plan
          </h2>
          <ul className="flex flex-col gap-3">
            {profile.recommendations.map((rec, i) => (
              <li
                key={rec}
                className="flex gap-3 rounded-xl border border-border bg-card p-3.5 text-sm shadow-sm"
              >
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 font-mono text-xs font-bold text-primary">
                  {i + 1}
                </span>
                <span className="text-muted-foreground">{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Badge section */}
        {gamification &&
          (isAnon ? (
            <div className="rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 p-5">
              <div className="mb-3 flex items-center gap-2">
                <span className="text-lg">🔒</span>
                <span className="font-bold text-sm">Unlock your badges</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                You would earn{" "}
                <strong>
                  {gamification.newBadges.length} badge
                  {gamification.newBadges.length !== 1 ? "s" : ""}
                </strong>{" "}
                and <strong>{gamification.xpAwarded} XP</strong> — sign in to
                save your progress.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {gamification.newBadges.map((b) => (
                  <span
                    key={b.id}
                    className="flex items-center gap-1.5 rounded-full border border-border bg-muted/50 px-2.5 py-1 text-xs font-semibold opacity-60 grayscale"
                  >
                    {b.icon} {b.name}
                  </span>
                ))}
              </div>
              <Button asChild size="sm" className="rounded-xl w-full">
                <Link href="/login?next=/quiz">Sign in to save progress</Link>
              </Button>
            </div>
          ) : gamification.newBadges.length > 0 ? (
            <BadgeDisplay
              earnedIds={gamification.newBadges.map((b) => b.id)}
              newIds={gamification.newBadges.map((b) => b.id)}
              showAll={false}
            />
          ) : null)}

        {/* How to earn XP + improve your score */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm flex flex-col gap-4">
          <h2 className="font-bold flex items-center gap-2 text-base">
            <span>⚡</span> How to earn more XP & improve your gut score
          </h2>
          <div className="flex flex-col gap-2">
            {[
              {
                icon: "🔬",
                label: "Complete the Snapshot Quiz",
                xp: "100 XP",
                done: true,
              },
              {
                icon: "📅",
                label: "Log each day of the 7-Day Journal",
                xp: "+50 XP / day",
                done: false,
              },
              {
                icon: "🔥",
                label: "Keep a daily logging streak",
                xp: "+10 XP bonus",
                done: false,
              },
              {
                icon: "🏆",
                label: "Finish all 7 journal days",
                xp: "+200 XP bonus",
                done: false,
              },
              {
                icon: "🏅",
                label: "Earn badges (25–100 XP each)",
                xp: "+up to 100 XP",
                done: false,
              },
            ].map((item) => (
              <div
                key={item.label}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm",
                  item.done
                    ? "bg-primary/5 border border-primary/20"
                    : "bg-muted/40",
                )}
              >
                <span className="text-base shrink-0">{item.icon}</span>
                <span
                  className={cn(
                    "flex-1 text-xs",
                    item.done ? "font-semibold" : "text-muted-foreground",
                  )}
                >
                  {item.label}
                </span>
                <span
                  className={cn(
                    "font-bold tabular-nums text-xs shrink-0",
                    item.done ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  {item.xp}
                </span>
                {item.done && (
                  <span className="text-primary text-xs font-bold">✓</span>
                )}
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            The 7-Day Journal gives a far more accurate gut profile than this
            snapshot — and it's your biggest XP source.
          </p>
          <Button asChild className="rounded-xl w-full">
            <Link href={isAnon ? "/login?next=/track" : "/track"}>
              {isAnon
                ? "Sign in to start your 7-Day Journal"
                : "Start your 7-Day Journal →"}
            </Link>
          </Button>
        </div>

        {/* Leaderboard */}
        {leaderboard !== null && (
          <Leaderboard
            entries={leaderboard}
            currentUserXP={gamification?.totalXP}
          />
        )}
        {leaderboard === null && (
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="h-4 w-32 animate-pulse rounded bg-muted mb-3" />
            <div className="flex flex-col gap-2">
              {(["a", "b", "c", "d", "e"] as const).map((k) => (
                <div
                  key={k}
                  className="h-10 rounded-xl bg-muted/50 animate-pulse"
                />
              ))}
            </div>
          </div>
        )}

        {/* Share card */}
        <ShareCard profile={profile} gutScore={gutScore} />

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <Button asChild className="rounded-xl">
            <Link href="/#profiles">View all 16 profiles</Link>
          </Button>
          <Button variant="outline" className="rounded-xl" onClick={onRetake}>
            Retake the quiz
          </Button>
          {gamification?.isAuthenticated && (
            <Button asChild variant="outline" className="rounded-xl">
              <Link href="/profile">View my profile</Link>
            </Button>
          )}
        </div>

        <p className="text-xs text-muted-foreground">
          This profile is based on self-reported symptoms and behaviours. It is
          not a medical diagnosis.
        </p>
      </div>
    </div>
  );
}
