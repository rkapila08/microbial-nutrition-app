"use client";

import { LEVELS } from "~/lib/gamification";
import { GUT_PROFILES } from "~/lib/quiz-data";
import { cn } from "~/lib/utils";

interface Entry {
  rank: number;
  level: number;
  xp: number;
  latestProfileCode: string | null;
}

interface Props {
  entries: Entry[];
  currentUserXP?: number;
}

function getLevelName(level: number): string {
  return LEVELS.find((l) => l.level === level)?.name ?? "Gut Curious";
}

function getProfileName(code: string | null): string {
  if (!code) return "—";
  return GUT_PROFILES.find((p) => p.code === code)?.name ?? code;
}

const RANK_MEDALS = ["🥇", "🥈", "🥉"];

export function Leaderboard({ entries, currentUserXP }: Props) {
  if (entries.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
        No leaderboard data yet — complete the quiz or journal to appear here!
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
        Global Leaderboard
      </h2>
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="grid grid-cols-[2rem_1fr_auto] gap-x-3 border-b border-border bg-muted/40 px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <span>#</span>
          <span>Profile</span>
          <span>XP</span>
        </div>
        {entries.map((entry) => {
          const isNearCurrentUser =
            currentUserXP !== undefined &&
            Math.abs(entry.xp - currentUserXP) < 50 &&
            entry.rank <= 10;

          return (
            <div
              key={entry.rank}
              className={cn(
                "grid grid-cols-[2rem_1fr_auto] gap-x-3 border-b border-border/50 px-4 py-3 text-sm last:border-0",
                isNearCurrentUser && "bg-primary/5",
              )}
            >
              <span className="font-bold text-muted-foreground">
                {RANK_MEDALS[entry.rank - 1] ?? entry.rank}
              </span>
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="font-semibold text-xs truncate">
                  {getLevelName(entry.level)}
                </span>
                {entry.latestProfileCode && (
                  <span className="text-[11px] text-muted-foreground truncate">
                    {entry.latestProfileCode} ·{" "}
                    {getProfileName(entry.latestProfileCode)}
                  </span>
                )}
              </div>
              <span className="font-bold text-primary tabular-nums">
                {entry.xp.toLocaleString()}
              </span>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-center text-muted-foreground">
        Rankings are anonymous — no personal information is shown.
      </p>
    </div>
  );
}
