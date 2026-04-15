"use client";

import Link from "next/link";
import { useState } from "react";
import { saveDailyLog } from "~/app/actions/tracker";
import { Button } from "~/components/ui/button";
import {
  AXIS_LABELS,
  type AxisChoice,
  type AxisKey,
  calculateLongitudinalResult,
  DAILY_QUESTIONS,
  type DailyAnswers,
  type DailyLog,
  GUT_PROFILES,
  getDailyTrends,
  getLongitudinalAxisScores,
  TOTAL_DAYS,
} from "~/lib/tracker-data";
import { cn } from "~/lib/utils";

interface Props {
  session: { id: string; code: string; created_at: string };
  initialLogs: DailyLog[];
}

type Phase = "overview" | "checkin" | "results";

const CHOICE_LABELS: AxisChoice[] = ["a", "b", "c", "d"];
const AXIS_ORDER: AxisKey[] = [
  "diversity",
  "inflammation",
  "resilience",
  "fiber",
];

// ── Icons (inline to avoid import overhead) ────────────────────────────────

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

// ── Root component ─────────────────────────────────────────────────────────

export function TrackerClient({ session, initialLogs }: Props) {
  const [logs, setLogs] = useState<DailyLog[]>(initialLogs);
  const [phase, setPhase] = useState<Phase>(() =>
    initialLogs.length >= TOTAL_DAYS ? "results" : "overview",
  );
  const [answers, setAnswers] = useState<DailyAnswers>({});
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<AxisChoice | null>(null);
  const [saving, setSaving] = useState(false);

  const completedDays = logs.length;
  const nextDay = completedDays + 1;
  const question = DAILY_QUESTIONS[currentQ];
  const checkinProgress = currentQ / DAILY_QUESTIONS.length;

  function handleAnswer(choice: AxisChoice) {
    if (selected !== null) return;
    setSelected(choice);

    setTimeout(() => {
      const newAnswers = { ...answers, [String(question.id)]: choice };
      setAnswers(newAnswers);
      setSelected(null);

      if (currentQ < DAILY_QUESTIONS.length - 1) {
        setCurrentQ((q) => q + 1);
      } else {
        // All questions answered — save
        handleSubmit(newAnswers);
      }
    }, 380);
  }

  function handleBack() {
    if (currentQ === 0) {
      setPhase("overview");
      setAnswers({});
      return;
    }
    setSelected(null);
    setCurrentQ((q) => q - 1);
  }

  async function handleSubmit(finalAnswers: DailyAnswers) {
    setSaving(true);
    try {
      await saveDailyLog(session.id, nextDay, finalAnswers);
      const newLog: DailyLog = {
        day_number: nextDay,
        responses: finalAnswers,
        logged_at: new Date().toISOString(),
      };
      const updatedLogs = [...logs, newLog];
      setLogs(updatedLogs);
      setAnswers({});
      setCurrentQ(0);
      setPhase(updatedLogs.length >= TOTAL_DAYS ? "results" : "overview");
    } finally {
      setSaving(false);
    }
  }

  // ── Results ──────────────────────────────────────────────────────────────
  if (phase === "results" && logs.length >= TOTAL_DAYS) {
    const code = calculateLongitudinalResult(logs);
    const profile =
      GUT_PROFILES.find((p) => p.code === code) ?? GUT_PROFILES[0];
    const axisScores = getLongitudinalAxisScores(logs);
    const trends = getDailyTrends(logs);
    return (
      <ResultsView
        sessionCode={session.code}
        profile={profile}
        axisScores={axisScores}
        trends={trends}
        onRetake={() => {
          setLogs([]);
          setPhase("overview");
        }}
      />
    );
  }

  // ── Check-in ─────────────────────────────────────────────────────────────
  if (phase === "checkin") {
    return (
      <CheckinView
        dayNumber={nextDay}
        question={question}
        questionNumber={currentQ + 1}
        total={DAILY_QUESTIONS.length}
        progress={checkinProgress}
        selected={selected}
        existingAnswer={answers[String(question.id)] as AxisChoice | undefined}
        saving={saving}
        onAnswer={handleAnswer}
        onBack={handleBack}
      />
    );
  }

  // ── Overview ─────────────────────────────────────────────────────────────
  return (
    <OverviewView
      sessionCode={session.code}
      logs={logs}
      onStartCheckin={() => {
        setAnswers({});
        setCurrentQ(0);
        setSelected(null);
        setPhase("checkin");
      }}
    />
  );
}

// ── Overview ───────────────────────────────────────────────────────────────

function OverviewView({
  sessionCode,
  logs,
  onStartCheckin,
}: {
  sessionCode: string;
  logs: DailyLog[];
  onStartCheckin: () => void;
}) {
  const completedDays = logs.length;
  const nextDay = completedDays + 1;
  const allDone = completedDays >= TOTAL_DAYS;

  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hero-botanical opacity-50"
      />
      <LeafSvg className="pointer-events-none absolute -right-8 top-12 h-40 w-40 -rotate-12 text-primary/8" />

      <div className="relative mx-auto flex max-w-xl flex-col gap-8 px-4 py-12">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-muted-foreground">
            <FlowerSvg className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-widest">
              7-Day Gut Journal
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tight">
            {allDone ? "Journal complete!" : `Day ${nextDay} of ${TOTAL_DAYS}`}
          </h1>
          <p className="text-sm text-muted-foreground">
            Your code:{" "}
            <span className="font-mono font-bold text-foreground">
              {sessionCode}
            </span>{" "}
            · Bookmark this page to return daily
          </p>
        </div>

        {/* 7-day progress */}
        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
            Week progress
          </h2>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: TOTAL_DAYS }, (_, i) => {
              const day = i + 1;
              const log = logs.find((l) => l.day_number === day);
              const isToday = day === completedDays + 1 && !allDone;
              return (
                <div
                  key={day}
                  className={cn(
                    "flex flex-col items-center gap-1.5 rounded-xl border-2 py-2.5 transition-colors",
                    log
                      ? "border-primary/30 bg-primary/10"
                      : isToday
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border bg-muted/30",
                  )}
                >
                  {log ? (
                    <FlowerSvg className="h-5 w-5 text-primary" />
                  ) : (
                    <LeafSvg
                      className={cn(
                        "h-5 w-5",
                        isToday ? "text-primary" : "text-muted-foreground/30",
                      )}
                    />
                  )}
                  <span
                    className={cn(
                      "text-xs font-bold",
                      log
                        ? "text-primary"
                        : isToday
                          ? "text-foreground"
                          : "text-muted-foreground/50",
                    )}
                  >
                    {day}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="text-sm text-muted-foreground">
            {completedDays === 0
              ? "Complete your first daily check-in to start."
              : `${completedDays} of ${TOTAL_DAYS} days complete.${completedDays < TOTAL_DAYS ? " Come back tomorrow for the next one." : ""}`}
          </p>
        </div>

        {/* Past logs summary */}
        {logs.length > 0 && (
          <div className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
              Completed days
            </h2>
            <div className="flex flex-col gap-2">
              {logs.map((log) => {
                const date = new Date(log.logged_at);
                const answeredCount = Object.keys(log.responses).length;
                return (
                  <div
                    key={log.day_number}
                    className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <FlowerSvg className="h-4 w-4 text-primary" />
                      <span className="text-sm font-semibold">
                        Day {log.day_number}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
                        {answeredCount}/{DAILY_QUESTIONS.length} answers
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {date.toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* CTA */}
        {!allDone ? (
          <Button
            size="lg"
            onClick={onStartCheckin}
            className="rounded-2xl shadow-sm"
          >
            {completedDays === 0
              ? "Start Day 1 check-in"
              : `Start Day ${nextDay} check-in`}
          </Button>
        ) : (
          <Button
            size="lg"
            onClick={() => {
              onStartCheckin();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="rounded-2xl shadow-sm"
          >
            View your results
          </Button>
        )}
      </div>
    </div>
  );
}

// ── Daily check-in ─────────────────────────────────────────────────────────

const AXIS_NAMES: Record<AxisKey, string> = {
  diversity: "Diversity",
  inflammation: "Inflammation",
  resilience: "Resilience",
  fiber: "Fiber",
};

interface CheckinViewProps {
  dayNumber: number;
  question: (typeof DAILY_QUESTIONS)[number];
  questionNumber: number;
  total: number;
  progress: number;
  selected: AxisChoice | null;
  existingAnswer: AxisChoice | undefined;
  saving: boolean;
  onAnswer: (choice: AxisChoice) => void;
  onBack: () => void;
}

function CheckinView({
  dayNumber,
  question,
  questionNumber,
  total,
  progress,
  selected,
  existingAnswer,
  saving,
  onAnswer,
  onBack,
}: CheckinViewProps) {
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
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
              Day {dayNumber}
            </span>
            <span className="text-sm text-muted-foreground">
              {questionNumber} / {total}
            </span>
          </div>
          <span className="rounded-full border border-border bg-muted px-3 py-1 font-mono text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {AXIS_NAMES[question.axis]}
          </span>
        </div>

        {/* Question */}
        <h2 className="text-xl font-bold leading-snug tracking-tight sm:text-2xl">
          {question.text}
        </h2>

        {/* Options */}
        {saving ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="flex flex-col items-center gap-3 text-muted-foreground">
              <FlowerSvg className="h-10 w-10 animate-pulse text-primary" />
              <p className="text-sm font-medium">Saving Day {dayNumber}…</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {CHOICE_LABELS.map((choice) => {
              const isSelected = selected === choice;
              const isExisting = existingAnswer === choice && selected === null;
              const isPending = selected !== null && !isSelected;

              return (
                <button
                  key={choice}
                  type="button"
                  onClick={() => onAnswer(choice)}
                  disabled={selected !== null}
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
        )}

        <div>
          <Button variant="ghost" size="sm" onClick={onBack} disabled={saving}>
            ← Back
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Longitudinal results ───────────────────────────────────────────────────

interface ResultsViewProps {
  sessionCode: string;
  profile: (typeof GUT_PROFILES)[number];
  axisScores: Record<AxisKey, { score: number; max: number }>;
  trends: Record<AxisKey, number[]>;
  onRetake: () => void;
}

function ResultsView({
  sessionCode,
  profile,
  axisScores,
  trends,
  onRetake,
}: ResultsViewProps) {
  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hero-botanical opacity-60"
      />
      <LeafSvg className="pointer-events-none absolute -right-10 top-10 h-40 w-40 -rotate-[20deg] text-primary/8" />
      <FlowerSvg className="pointer-events-none absolute -left-6 bottom-20 h-28 w-28 text-accent/8" />

      <div className="relative mx-auto flex max-w-xl flex-col gap-10 px-4 py-16">
        {/* Type badge */}
        <div className="text-center">
          <div className="mb-1 flex items-center justify-center gap-2 text-muted-foreground">
            <FlowerSvg className="h-4 w-4 text-primary" />
            <p className="text-xs font-semibold uppercase tracking-widest">
              7-Day Longitudinal Profile
            </p>
            <FlowerSvg className="h-4 w-4 text-primary" />
          </div>
          <div className="mb-2 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <LeafSvg className="h-4 w-4 text-primary" />
            <p>Your gut type is</p>
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
          <h1 className="mt-5 text-3xl font-black tracking-tight">
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

        {/* Axis breakdown + trend */}
        <div className="flex flex-col gap-6">
          <h2 className="flex items-center gap-2 font-black">
            <LeafSvg className="h-4 w-4 text-primary" />
            7-day axis breakdown
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
            const sparklineDays = trends[axisKey].map((score, idx) => ({
              day: idx + 1,
              score,
            }));

            return (
              <div key={axisKey} className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{labels.label}</span>
                  <span className="font-semibold">{dominantLabel}</span>
                </div>

                {/* Overall bar */}
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="progress-botanical h-full rounded-full transition-all duration-700"
                    style={{ width: `${displayPct}%` }}
                  />
                </div>
                <p className="text-right text-xs text-muted-foreground">
                  {displayPct}% match · averaged over 7 days
                </p>

                {/* Daily sparkline */}
                <div className="flex items-end gap-1 pt-1">
                  {sparklineDays.map(({ day, score }) => (
                    <div
                      key={`${axisKey}-day-${day}`}
                      className="flex flex-1 flex-col items-center gap-0.5"
                    >
                      <div className="w-full rounded-sm bg-muted overflow-hidden">
                        <div
                          className="progress-botanical rounded-sm"
                          style={{
                            height: "24px",
                            transform: `scaleY(${score})`,
                            transformOrigin: "bottom",
                          }}
                        />
                      </div>
                      <span className="text-[10px] text-muted-foreground">
                        {day}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-center text-muted-foreground">
                  Day-by-day scores (higher = healthier for this axis)
                </p>
              </div>
            );
          })}
        </div>

        {/* Recommendations */}
        <div className="flex flex-col gap-4">
          <h2 className="flex items-center gap-2 font-black">
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

        {/* Session info */}
        <div className="rounded-xl border border-border bg-muted/40 p-4 text-sm">
          <p className="font-semibold">Your journal code</p>
          <p className="font-mono text-lg tracking-widest text-primary">
            {sessionCode}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Bookmark <span className="font-mono">/track/{sessionCode}</span> to
            return to this journal.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <Button asChild className="rounded-xl">
            <Link href="/#profiles">View all 16 profiles</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-xl">
            <Link href="/quiz">Take the snapshot quiz</Link>
          </Button>
          <Button
            variant="ghost"
            className="rounded-xl text-muted-foreground"
            onClick={onRetake}
          >
            Start a new journal
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          Based on self-reported daily practices. Not a medical diagnosis.
        </p>
      </div>
    </div>
  );
}
