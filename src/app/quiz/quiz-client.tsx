"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "~/components/ui/button";
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

type Phase = "intro" | "quiz" | "results";

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

  const question = QUIZ_QUESTIONS[current];
  const progress = Object.keys(answers).length / QUIZ_QUESTIONS.length;

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
        setPhase("results");
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
  }

  if (phase === "intro") {
    return <IntroScreen onStart={() => setPhase("quiz")} />;
  }

  if (phase === "results") {
    const code = calculateResult(answers);
    const profile =
      GUT_PROFILES.find((p) => p.code === code) ?? GUT_PROFILES[0];
    const axisScores = getAxisScores(answers);
    return (
      <ResultsScreen
        profile={profile}
        axisScores={axisScores}
        onRetake={handleRetake}
      />
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
      {/* Botanical background blobs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hero-botanical"
      />

      {/* Decorative leaves */}
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
      {/* Progress bar */}
      <div className="h-1.5 w-full bg-muted">
        <div
          className="progress-botanical h-full rounded-r-full transition-all duration-500"
          style={{ width: `${Math.max(progress * 100, 2)}%` }}
        />
      </div>

      <div className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-7 px-4 py-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {questionNumber} / {total}
          </span>
          <span className="rounded-full border border-border bg-muted px-3 py-1 font-mono text-xs font-semibold text-muted-foreground uppercase tracking-widest">
            {AXIS_NAMES[question.axis]}
          </span>
        </div>

        {/* Question */}
        <h2 className="text-xl font-bold leading-snug tracking-tight sm:text-2xl">
          {question.text}
        </h2>

        {/* 4 Options */}
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
                {/* Letter badge */}
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

        {/* Back */}
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

interface ResultsScreenProps {
  profile: GutProfile;
  axisScores: Record<AxisKey, { score: number; max: number }>;
  onRetake: () => void;
}

function ResultsScreen({ profile, axisScores, onRetake }: ResultsScreenProps) {
  return (
    <div className="relative overflow-hidden">
      {/* Subtle botanical background */}
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

        {/* Description */}
        <div className="rounded-2xl border border-border bg-card p-5 text-sm leading-relaxed text-muted-foreground shadow-sm">
          {profile.description}
        </div>

        {/* Axis breakdown */}
        <div className="flex flex-col gap-5">
          <h2 className="flex items-center gap-2 font-bold">
            <LeafSvg className="h-4 w-4 text-primary" />
            Your axis breakdown
          </h2>
          {AXIS_ORDER.map((axisKey) => {
            const { score, max } = axisScores[axisKey];
            const pct = max > 0 ? score / max : 0.5;
            const isPositive = pct >= 0.5;
            const labels = AXIS_LABELS[axisKey];
            const dominantLabel = isPositive
              ? labels.positive
              : labels.negative;
            const displayPct = isPositive
              ? Math.round(pct * 100)
              : Math.round((1 - pct) * 100);

            return (
              <div key={axisKey} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{labels.label}</span>
                  <span className="font-semibold">{dominantLabel}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="progress-botanical h-full rounded-full transition-all duration-700"
                    style={{ width: `${displayPct}%` }}
                  />
                </div>
                <p className="text-right text-xs text-muted-foreground">
                  {displayPct}% match
                </p>
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

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <Button asChild className="rounded-xl">
            <Link href="/#profiles">View all 16 profiles</Link>
          </Button>
          <Button variant="outline" className="rounded-xl" onClick={onRetake}>
            Retake the quiz
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          This profile is based on self-reported symptoms and behaviours. It is
          not a medical diagnosis.
        </p>
      </div>
    </div>
  );
}
