"use client";

import { motion } from "motion/react";
import { getMissionProgress, MISSIONS } from "~/lib/gamification";
import type { DailyLog } from "~/lib/tracker-data";
import { cn } from "~/lib/utils";

interface Props {
  logs: DailyLog[];
  compact?: boolean;
}

export function MissionProgress({ logs, compact = false }: Props) {
  const progress = getMissionProgress(logs);

  const activeMissions = MISSIONS.filter(
    (m) => (progress[m.id] ?? 0) < m.target,
  ).slice(0, compact ? 3 : MISSIONS.length);

  const completedMissions = MISSIONS.filter(
    (m) => (progress[m.id] ?? 0) >= m.target,
  );

  if (MISSIONS.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
        Missions
      </h2>

      {completedMissions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {completedMissions.map((m) => (
            <span
              key={m.id}
              className="flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary"
            >
              {m.icon} {m.title} ✓
            </span>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-2.5">
        {activeMissions.map((mission) => {
          const current = progress[mission.id] ?? 0;
          const pct = Math.min(current / mission.target, 1);
          const isComplete = pct >= 1;

          return (
            <div
              key={mission.id}
              className={cn(
                "rounded-xl border border-border bg-card p-3",
                isComplete && "border-primary/30 bg-primary/5",
              )}
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-base leading-none">{mission.icon}</span>
                  <span className="text-sm font-semibold">{mission.title}</span>
                  {isComplete && (
                    <span className="text-xs text-primary font-bold">✓</span>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">
                  {current}/{mission.target} {mission.unit}
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                <motion.div
                  className="progress-botanical h-full rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: `${pct * 100}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
              </div>
              {!isComplete && !compact && (
                <p className="mt-1 text-xs text-muted-foreground">
                  {mission.description}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
