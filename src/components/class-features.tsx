"use client";

import {
  getStarterKit,
  resolveSkillTree,
  SKILL_BRANCHES,
} from "~/lib/class-data";
import { cn } from "~/lib/utils";

export function StarterKitPanel({
  profileCode,
}: {
  profileCode: string | null;
}) {
  if (!profileCode) {
    return (
      <div className="rounded-2xl border border-border bg-muted/30 p-5 text-center text-sm text-muted-foreground">
        Complete Day 1 to unlock your class starter kit.
      </div>
    );
  }

  const kit = getStarterKit(profileCode);
  if (!kit) return null;

  return (
    <div className="flex flex-col gap-4 animate-fade-in">
      <div>
        <h2 className="flex items-center gap-2 font-bold">
          <span className="text-lg">🎒</span>
          Your starter kit
        </h2>
        <p className="text-sm text-muted-foreground">
          {kit.className}&apos;s starting loadout
        </p>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {kit.items.map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-border bg-card p-4 shadow-sm"
          >
            <span className="text-2xl">{item.icon}</span>
            <p className="mt-2 text-sm font-bold">{item.label}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkillTreePanel({
  profileCode,
  completedDays,
}: {
  profileCode: string | null;
  completedDays: number;
}) {
  if (!profileCode) {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-bold">
            <span className="text-lg">🌳</span>
            Skill tree
          </h2>
          <span className="text-xs text-muted-foreground">0 / 12 unlocked</span>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {SKILL_BRANCHES.map((branch) => (
            <div
              key={branch.branch}
              className="rounded-xl border border-border bg-muted/20 p-4 opacity-50"
            >
              <div className="flex items-center gap-2 text-sm font-bold">
                <span>{branch.icon}</span>
                <span>{branch.label}</span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Start Day 1 to unlock
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const branches = resolveSkillTree(profileCode, completedDays);
  const totalUnlocked = branches.reduce(
    (sum, b) => sum + b.nodes.filter((n) => n.isUnlocked).length,
    0,
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-bold">
          <span className="text-lg">🌳</span>
          Skill tree
        </h2>
        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
          {totalUnlocked} / 12 unlocked
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {branches.map((branch) => {
          const unlockedCount = branch.nodes.filter((n) => n.isUnlocked).length;
          return (
            <div key={branch.branch} className="flex flex-col gap-2">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-1.5 text-sm font-bold">
                  <span>{branch.icon}</span>
                  <span>{branch.branchLabel}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {unlockedCount}/4
                </span>
              </div>

              <div className="relative flex flex-col gap-2 border-l-2 border-border/40 pl-3">
                {branch.nodes.map((node) => (
                  <div
                    key={node.level}
                    className={cn(
                      "rounded-xl border-2 p-3 text-sm transition-all",
                      node.isNew &&
                        "animate-celebrate border-primary/30 bg-card shadow-sm",
                      node.isUnlocked &&
                        !node.isNew &&
                        "border-primary/20 bg-card shadow-sm",
                      !node.isUnlocked &&
                        "border-border bg-muted/20 opacity-40",
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg leading-none">
                          {node.isUnlocked ? node.icon : "🔒"}
                        </span>
                        <span
                          className={cn(
                            "font-semibold leading-tight",
                            node.isUnlocked
                              ? "text-foreground"
                              : "text-muted-foreground",
                          )}
                        >
                          {node.title}
                        </span>
                      </div>
                      {node.isNew && (
                        <span className="shrink-0 rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground">
                          New!
                        </span>
                      )}
                    </div>
                    {node.isUnlocked ? (
                      <p className="mt-1.5 text-xs text-muted-foreground">
                        {node.description}
                      </p>
                    ) : (
                      <p className="mt-1 text-[10px] text-muted-foreground/60">
                        Unlocks Day {node.unlockDay}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
