"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { getLevelProgress } from "~/lib/gamification";
import { cn } from "~/lib/utils";

interface Props {
  xp: number;
  animate?: boolean;
  compact?: boolean;
}

export function XPBar({ xp, animate = true, compact = false }: Props) {
  const { current, next, pct } = getLevelProgress(xp);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [prevLevel, setPrevLevel] = useState(current.level);

  useEffect(() => {
    if (current.level > prevLevel) {
      setShowLevelUp(true);
      setPrevLevel(current.level);
      const t = setTimeout(() => setShowLevelUp(false), 2400);
      return () => clearTimeout(t);
    }
  }, [current.level, prevLevel]);

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-bold text-primary">
          {current.name}
        </span>
        <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
          <motion.div
            className="progress-botanical absolute inset-y-0 left-0 rounded-full"
            initial={animate ? { width: "0%" } : false}
            animate={{ width: `${pct * 100}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
        <span className="text-xs text-muted-foreground">{xp} XP</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AnimatePresence>
            {showLevelUp && (
              <motion.span
                initial={{ opacity: 0, scale: 0.6, y: 4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -4 }}
                className="rounded-full bg-accent px-2 py-0.5 text-xs font-black text-accent-foreground uppercase tracking-wider"
              >
                Level up!
              </motion.span>
            )}
          </AnimatePresence>
          <span className="font-bold text-sm">{current.name}</span>
          <span className="text-xs text-muted-foreground">
            Lv. {current.level}
          </span>
        </div>
        <span className="text-xs text-muted-foreground">
          {xp.toLocaleString()} XP
          {next && (
            <span className="text-muted-foreground/60">
              {" "}
              · {(next.xpRequired - xp).toLocaleString()} to next
            </span>
          )}
        </span>
      </div>

      <div className="relative h-2.5 overflow-hidden rounded-full bg-muted">
        <motion.div
          className={cn(
            "progress-botanical absolute inset-y-0 left-0 rounded-full",
            showLevelUp && "animate-pulse",
          )}
          initial={animate ? { width: "0%" } : false}
          animate={{ width: `${pct * 100}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>

      {!next && (
        <p className="text-xs text-center text-primary font-semibold">
          Maximum level reached — Microbiome Master 🧬
        </p>
      )}
    </div>
  );
}
