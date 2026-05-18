"use client";

import Link from "next/link";
import type {
  LeaderboardEntry,
  UserProgressData,
} from "~/app/actions/gamification";
import { BadgeDisplay } from "~/components/badge-display";
import { GutHealthScore } from "~/components/gut-health-score";
import { Leaderboard } from "~/components/leaderboard";
import { MissionProgress } from "~/components/mission-progress";
import { Button } from "~/components/ui/button";
import { XPBar } from "~/components/xp-bar";
import { GUT_PROFILES } from "~/lib/quiz-data";
import { cn } from "~/lib/utils";

interface Session {
  id: string;
  code: string;
  created_at: string;
  dayCount: number;
}

interface Props {
  progress: UserProgressData;
  leaderboard: LeaderboardEntry[];
  sessions: Session[];
}

const LEVEL_EMOJIS: Record<number, string> = {
  1: "🌱",
  2: "🌿",
  3: "🍃",
  4: "🌸",
  5: "🌺",
  6: "🌻",
  7: "🦠",
  8: "🧬",
  9: "⭐",
  10: "👑",
};

export function ProfileClient({ progress, leaderboard, sessions }: Props) {
  const latestProfile = progress.latestProfileCode
    ? GUT_PROFILES.find((p) => p.code === progress.latestProfileCode)
    : null;

  const emoji = LEVEL_EMOJIS[progress.level] ?? "🌱";

  // Build minimal DailyLog-compatible structure for missions (using completed journal count as proxy)
  // Missions only need log counts; we use sessions to derive completion
  const missionProxyLogs = Array.from(
    { length: Math.min(progress.journalsCompleted * 7, 7) },
    (_, i) => ({
      day_number: i + 1,
      responses: {} as Record<string, "a" | "b" | "c" | "d">,
      logged_at: new Date().toISOString(),
    }),
  );

  return (
    <div className="flex flex-col gap-8">
      {/* Hero */}
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-primary/20 bg-primary/10 text-4xl">
            {emoji}
          </div>
          <div className="flex flex-1 flex-col gap-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-bold text-primary">
                {progress.levelName}
              </span>
              <span className="text-xs text-muted-foreground">
                Level {progress.level}
              </span>
            </div>
            <XPBar xp={progress.xp} animate />
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            {
              label: "Current Streak",
              value: `${progress.currentStreak}d 🔥`,
              highlight: progress.currentStreak > 0,
            },
            { label: "Longest Streak", value: `${progress.longestStreak}d` },
            {
              label: "Journals Done",
              value: String(progress.journalsCompleted),
            },
            {
              label: "Quizzes Taken",
              value: String(progress.quizzesCompleted),
            },
          ].map(({ label, value, highlight }) => (
            <div
              key={label}
              className={cn(
                "rounded-xl border border-border bg-card p-3 text-center",
                highlight &&
                  "border-amber-300/50 bg-amber-50/50 dark:border-amber-700/30 dark:bg-amber-950/20",
              )}
            >
              <p className="text-lg font-black">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Gut Health Score + Latest Profile */}
      {(progress.latestGutScore !== null || latestProfile) && (
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-widest">
            Latest Assessment
          </h2>
          <div className="flex items-center gap-6">
            {progress.latestGutScore !== null && (
              <GutHealthScore
                score={progress.latestGutScore}
                size="lg"
                label="Gut Health Score"
              />
            )}
            {latestProfile && (
              <div className="flex flex-col gap-1.5">
                <span
                  className={cn(
                    "inline-block rounded-xl px-4 py-2 font-mono text-2xl font-black tracking-widest",
                    latestProfile.color,
                  )}
                >
                  {latestProfile.code}
                </span>
                <span className="font-bold">{latestProfile.name}</span>
                <span className="text-xs text-muted-foreground">
                  {latestProfile.tagline}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Badges */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <BadgeDisplay earnedIds={progress.earnedBadgeIds} showAll />
      </div>

      {/* Missions */}
      {missionProxyLogs.length > 0 && (
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <MissionProgress logs={missionProxyLogs} />
        </div>
      )}

      {/* Journal history */}
      {sessions.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
            Journal History
          </h2>
          <div className="flex flex-col gap-2">
            {sessions.map((s, i) => {
              const date = new Date(s.created_at);
              return (
                <Link
                  key={s.id}
                  href={`/track/${s.code}`}
                  className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">
                      {s.dayCount >= 7 ? "🏆" : s.dayCount > 0 ? "📅" : "🌱"}
                    </span>
                    <div>
                      <p className="text-sm font-semibold">
                        7-Day Journal #{sessions.length - i}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {date.toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {s.dayCount}/7 days
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Leaderboard */}
      <Leaderboard entries={leaderboard} currentUserXP={progress.xp} />

      {/* CTAs */}
      <div className="flex flex-wrap gap-3">
        <Button asChild className="rounded-xl">
          <Link href="/quiz">Take the snapshot quiz</Link>
        </Button>
        <Button asChild variant="outline" className="rounded-xl">
          <Link href="/track">Start 7-day journal</Link>
        </Button>
      </div>
    </div>
  );
}
