"use client";

import confetti from "canvas-confetti";
import Link from "next/link";
import { useState } from "react";
import {
  awardTrackerGamification,
  type GamificationResult,
} from "~/app/actions/gamification";
import { saveDailyLog } from "~/app/actions/tracker";
import { BadgeDisplay } from "~/components/badge-display";
import { BadgeEarnToast } from "~/components/badge-earn-toast";
import { GutHealthScore } from "~/components/gut-health-score";
import { MissionProgress } from "~/components/mission-progress";
import { ShareCard } from "~/components/share-card";
import { StreakCounter } from "~/components/streak-counter";
import { Button } from "~/components/ui/button";
import {
  calculateGutHealthScore,
  calculateStreak,
  type DailyInsight,
  getDailyInsight,
} from "~/lib/gamification";
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

type Phase = "overview" | "checkin" | "insight" | "results";

const CHOICE_LABELS: AxisChoice[] = ["a", "b", "c", "d"];
const AXIS_ORDER: AxisKey[] = [
  "diversity",
  "inflammation",
  "resilience",
  "fiber",
];
const CHOICE_WEIGHTS: Record<AxisChoice, number> = { a: 3, b: 2, c: 1, d: 0 };

function computeDayAxisScores(answers: DailyAnswers): Record<AxisKey, number> {
  const scores: Record<AxisKey, number> = {
    diversity: 0,
    inflammation: 0,
    resilience: 0,
    fiber: 0,
  };
  const maxes: Record<AxisKey, number> = {
    diversity: 0,
    inflammation: 0,
    resilience: 0,
    fiber: 0,
  };
  for (const q of DAILY_QUESTIONS) {
    const answer = answers[String(q.id)] as AxisChoice | undefined;
    if (answer !== undefined) {
      maxes[q.axis] += 3;
      scores[q.axis] += CHOICE_WEIGHTS[answer];
    }
  }
  return {
    diversity: maxes.diversity > 0 ? scores.diversity / maxes.diversity : 0,
    inflammation:
      maxes.inflammation > 0 ? scores.inflammation / maxes.inflammation : 0,
    resilience: maxes.resilience > 0 ? scores.resilience / maxes.resilience : 0,
    fiber: maxes.fiber > 0 ? scores.fiber / maxes.fiber : 0,
  };
}

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

function LockSvg({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
    </svg>
  );
}

// Returns true if the last completed log was today — next day locked until midnight
function isNextDayLocked(logs: DailyLog[]): boolean {
  if (logs.length === 0) return false;
  const lastLog = logs[logs.length - 1];
  const lastDate = new Date(lastLog.logged_at);
  const now = new Date();
  return (
    lastDate.getFullYear() === now.getFullYear() &&
    lastDate.getMonth() === now.getMonth() &&
    lastDate.getDate() === now.getDate()
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
  const [gamification, setGamification] = useState<GamificationResult | null>(
    null,
  );
  const [todayInsight, setTodayInsight] = useState<DailyInsight | null>(null);
  const [todayDayScores, setTodayDayScores] = useState<Record<
    AxisKey,
    number
  > | null>(null);
  const [completedDayNumber, setCompletedDayNumber] = useState(0);

  const completedDays = logs.length;
  const nextDay = completedDays + 1;
  const allDone = completedDays >= TOTAL_DAYS;
  const locked = !allDone && isNextDayLocked(logs);
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

      // Compute today's axis scores for insight
      const todayScores = computeDayAxisScores(finalAnswers);
      const prevLog = logs.length > 0 ? logs[logs.length - 1] : null;
      const prevScores = prevLog
        ? computeDayAxisScores(prevLog.responses)
        : null;
      const insight = getDailyInsight(todayScores, prevScores, nextDay);
      setTodayDayScores(todayScores);
      setTodayInsight(insight);
      setCompletedDayNumber(nextDay);

      // Award gamification in the background
      awardTrackerGamification(updatedLogs).then((result) => {
        setGamification(result);
        if (result.newBadges.length > 0 || result.xpAwarded > 0) {
          confetti({
            particleCount: 80,
            spread: 80,
            origin: { y: 0.5 },
            colors: ["#22d3ee", "#34d399", "#a78bfa", "#fb923c", "#f472b6"],
          });
        }
      });

      setAnswers({});
      setCurrentQ(0);
      setPhase("insight");
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
    const gutScore = calculateGutHealthScore(axisScores);
    return (
      <>
        {gamification && gamification.newBadges.length > 0 && (
          <BadgeEarnToast
            badges={gamification.newBadges}
            xpAwarded={gamification.xpAwarded}
          />
        )}
        <ResultsView
          sessionCode={session.code}
          profile={profile}
          axisScores={axisScores}
          trends={trends}
          gutScore={gutScore}
          gamification={gamification}
          onRetake={() => {
            setLogs([]);
            setGamification(null);
            setPhase("overview");
          }}
        />
      </>
    );
  }

  // ── Insight (post check-in) ───────────────────────────────────────────────
  if (phase === "insight" && todayDayScores && todayInsight) {
    const isJournalComplete = logs.length >= TOTAL_DAYS;
    return (
      <>
        {gamification && gamification.newBadges.length > 0 && (
          <BadgeEarnToast
            badges={gamification.newBadges}
            xpAwarded={gamification.xpAwarded}
          />
        )}
        <InsightView
          dayNumber={completedDayNumber}
          todayScores={todayDayScores}
          insight={todayInsight}
          gamification={gamification}
          onContinue={() =>
            setPhase(isJournalComplete ? "results" : "overview")
          }
        />
      </>
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
      locked={locked}
      onStartCheckin={() => {
        if (locked) return;
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
  locked,
  onStartCheckin,
}: {
  sessionCode: string;
  logs: DailyLog[];
  locked: boolean;
  onStartCheckin: () => void;
}) {
  const completedDays = logs.length;
  const nextDay = completedDays + 1;
  const allDone = completedDays >= TOTAL_DAYS;
  const streak = calculateStreak(logs);

  // Trending profile
  const trendingCode =
    logs.length > 0 ? calculateLongitudinalResult(logs) : null;
  const trendingProfile = trendingCode
    ? GUT_PROFILES.find((p) => p.code === trendingCode)
    : null;

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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground">
              <FlowerSvg className="h-4 w-4 text-primary" />
              <span className="text-xs font-semibold uppercase tracking-widest">
                7-Day Gut Journal
              </span>
            </div>
            {streak > 0 && <StreakCounter streak={streak} />}
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
              const isDayLocked = isToday && locked;
              return (
                <div
                  key={day}
                  className={cn(
                    "flex flex-col items-center gap-1.5 rounded-xl border-2 py-2.5 transition-colors",
                    log
                      ? "border-primary/30 bg-primary/10"
                      : isDayLocked
                        ? "border-amber-400/40 bg-amber-50/20 dark:border-amber-600/30 dark:bg-amber-950/20"
                        : isToday
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-border bg-muted/30",
                  )}
                >
                  {log ? (
                    <FlowerSvg className="h-5 w-5 text-primary" />
                  ) : isDayLocked ? (
                    <LockSvg className="h-5 w-5 text-amber-500 dark:text-amber-400" />
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
                        : isDayLocked
                          ? "text-amber-600 dark:text-amber-400"
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
              : locked
                ? `${completedDays} of ${TOTAL_DAYS} days complete. Day ${nextDay} unlocks at midnight.`
                : `${completedDays} of ${TOTAL_DAYS} days complete.${completedDays < TOTAL_DAYS ? " Come back tomorrow for the next one." : ""}`}
          </p>
        </div>

        {/* Trending profile */}
        {trendingProfile && completedDays > 0 && completedDays < TOTAL_DAYS && (
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
            <div className="flex items-center gap-2 mb-1">
              <LeafSvg className="h-4 w-4 text-primary" />
              <span className="text-xs font-semibold text-primary uppercase tracking-widest">
                Trending Profile
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  "rounded-xl px-3 py-1.5 font-mono text-xl font-black tracking-widest",
                  trendingProfile.color,
                )}
              >
                {trendingProfile.code}
              </span>
              <div>
                <p className="font-bold text-sm">{trendingProfile.name}</p>
                <p className="text-xs text-muted-foreground">
                  Based on {completedDays} day{completedDays !== 1 ? "s" : ""} —
                  may change as you log more
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Mission progress */}
        {logs.length > 0 && <MissionProgress logs={logs} compact />}

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
        {allDone ? (
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
        ) : locked ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 rounded-2xl border border-amber-300/60 bg-amber-50/40 px-4 py-3.5 dark:border-amber-700/40 dark:bg-amber-950/25">
              <LockSvg className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Day {nextDay} is locked
                </p>
                <p className="text-xs text-muted-foreground">
                  Unlocks at 12:00 AM · One check-in per calendar day
                </p>
              </div>
            </div>
            <Button
              size="lg"
              disabled
              className="rounded-2xl shadow-sm cursor-not-allowed"
            >
              <LockSvg className="mr-2 h-4 w-4" />
              Available at midnight
            </Button>
          </div>
        ) : (
          <Button
            size="lg"
            onClick={onStartCheckin}
            className="rounded-2xl shadow-sm"
          >
            {completedDays === 0
              ? "Start Day 1 check-in"
              : `Start Day ${nextDay} check-in`}
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
      <div className="h-1.5 w-full bg-muted">
        <div
          className="progress-botanical h-full rounded-r-full transition-all duration-500"
          style={{ width: `${Math.max(progress * 100, 2)}%` }}
        />
      </div>

      <div className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-7 px-4 py-10">
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

        <h2 className="text-xl font-bold leading-snug tracking-tight sm:text-2xl">
          {question.text}
        </h2>

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

// ── Insight view (post check-in) ───────────────────────────────────────────

interface InsightViewProps {
  dayNumber: number;
  todayScores: Record<AxisKey, number>;
  insight: DailyInsight;
  gamification: GamificationResult | null;
  onContinue: () => void;
}

function InsightView({
  dayNumber,
  todayScores,
  insight,
  gamification,
  onContinue,
}: InsightViewProps) {
  const isAnon = gamification && !gamification.isAuthenticated;

  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hero-botanical opacity-50"
      />
      <div className="relative mx-auto flex max-w-xl flex-col gap-6 px-4 py-12">
        {/* Header */}
        <div className="text-center">
          <div className="mb-1 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5">
            <span className="text-lg">🌸</span>
            <span className="text-sm font-bold text-primary">
              Day {dayNumber} Complete!
            </span>
          </div>
        </div>

        {/* XP & streak */}
        {gamification && (
          <div className="flex items-center justify-center gap-4">
            {gamification.xpAwarded > 0 && (
              <div className="flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-4 py-2">
                <span className="font-black text-primary text-lg">
                  +{gamification.xpAwarded}
                </span>
                <span className="text-sm text-muted-foreground">XP</span>
              </div>
            )}
            {gamification.currentStreak > 1 && (
              <StreakCounter streak={gamification.currentStreak} pulse />
            )}
            {gamification.newLevel && (
              <div className="flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-4 py-2">
                <span className="text-sm font-bold text-accent">
                  ⬆ {gamification.newLevel.name}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Daily insight */}
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <LeafSvg className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold text-primary uppercase tracking-widest">
              Today's Insight
            </span>
          </div>
          <p className="font-bold text-base leading-snug text-foreground">
            {insight.headline}
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {insight.body}
          </p>
          {insight.tips.length > 0 && (
            <ul className="flex flex-col gap-2 mt-1">
              {insight.tips.map((tip) => (
                <li
                  key={tip}
                  className="flex items-start gap-2 rounded-xl border border-primary/15 bg-background/60 px-3 py-2.5 text-sm leading-relaxed text-foreground"
                >
                  <span className="mt-0.5 shrink-0 text-primary">→</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Today's axis scores */}
        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
            Today's scores
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {AXIS_ORDER.map((axis) => {
              const score = todayScores[axis] ?? 0;
              const pct = Math.round(score * 100);
              return (
                <div
                  key={axis}
                  className="rounded-xl border border-border bg-card p-3"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-muted-foreground">
                      {AXIS_NAMES[axis]}
                    </span>
                    <span className="text-xs font-bold text-foreground">
                      {pct}%
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="progress-botanical h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Anonymous teaser */}
        {isAnon && (
          <div className="rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">🔒</span>
              <span className="font-bold text-sm">
                Sign in to save your streak
              </span>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              You'd earn{" "}
              <strong>
                {gamification.newBadges.length} badge
                {gamification.newBadges.length !== 1 ? "s" : ""}
              </strong>{" "}
              and <strong>{gamification.xpAwarded} XP</strong> — sign in to
              track across devices.
            </p>
            <Button
              asChild
              size="sm"
              variant="outline"
              className="rounded-xl w-full"
            >
              <Link
                href={`/login?next=/track/${window?.location?.pathname?.split("/track/")?.[1] ?? ""}`}
              >
                Sign in to save progress
              </Link>
            </Button>
          </div>
        )}

        <Button
          size="lg"
          onClick={onContinue}
          className="rounded-2xl shadow-sm"
        >
          Continue
        </Button>
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
  gutScore: number;
  gamification: GamificationResult | null;
  onRetake: () => void;
}

function ResultsView({
  sessionCode,
  profile,
  axisScores,
  trends,
  gutScore,
  gamification,
  onRetake,
}: ResultsViewProps) {
  const isAnon = gamification && !gamification.isAuthenticated;

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

        {/* Gut Health Score + XP */}
        <div className="flex items-center justify-around rounded-2xl border border-border bg-card p-5 shadow-sm">
          <GutHealthScore score={gutScore} size="md" />
          <div className="h-12 w-px bg-border" />
          <div className="flex flex-col items-center gap-1">
            {gamification && gamification.xpAwarded > 0 ? (
              <>
                <span className="text-2xl font-black text-primary tabular-nums">
                  +{gamification.xpAwarded}
                </span>
                <span className="text-xs text-muted-foreground">XP earned</span>
                {gamification.newLevel && (
                  <span className="mt-1 rounded-full bg-accent/15 px-2 py-0.5 text-xs font-bold text-accent">
                    ⬆ {gamification.newLevel.name}
                  </span>
                )}
              </>
            ) : (
              <>
                <span className="text-xl font-black text-primary">350+</span>
                <span className="text-xs text-muted-foreground">XP earned</span>
              </>
            )}
          </div>
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
            const sparklineDays = trends[axisKey].map((s, idx) => ({
              day: idx + 1,
              score: s,
            }));

            return (
              <div key={axisKey} className="flex flex-col gap-2">
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
                  {displayPct}% match · averaged over 7 days
                </p>

                <div className="flex items-end gap-1 pt-1">
                  {sparklineDays.map(({ day, score: s }) => (
                    <div
                      key={`${axisKey}-day-${day}`}
                      className="flex flex-1 flex-col items-center gap-0.5"
                    >
                      <div className="w-full rounded-sm bg-muted overflow-hidden">
                        <div
                          className="progress-botanical rounded-sm"
                          style={{
                            height: "24px",
                            transform: `scaleY(${s})`,
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

        {/* Badges */}
        {gamification?.newBadges && gamification.newBadges.length > 0 && (
          <BadgeDisplay
            earnedIds={gamification.newBadges.map((b) => b.id)}
            newIds={gamification.newBadges.map((b) => b.id)}
            showAll={false}
          />
        )}

        {/* Anonymous teaser */}
        {isAnon && (
          <div className="rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">🔒</span>
              <span className="font-bold text-sm">Save your 7-day results</span>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Sign in to save your profile, track future journals, and unlock{" "}
              {gamification.newBadges.length} badge
              {gamification.newBadges.length !== 1 ? "s" : ""}.
            </p>
            <Button asChild size="sm" className="rounded-xl">
              <Link href="/login?next=/profile">Sign in & save progress</Link>
            </Button>
          </div>
        )}

        {/* Share card */}
        <ShareCard
          profile={profile}
          gutScore={gutScore}
          sessionCode={sessionCode}
        />

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
          {gamification?.isAuthenticated && (
            <Button asChild variant="outline" className="rounded-xl">
              <Link href="/profile">View my profile</Link>
            </Button>
          )}
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
