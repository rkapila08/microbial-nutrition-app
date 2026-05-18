"use client";

import { AnimatePresence, motion } from "motion/react";
import { cn } from "~/lib/utils";

interface Props {
  streak: number;
  pulse?: boolean;
  className?: string;
}

export function StreakCounter({ streak, pulse = false, className }: Props) {
  if (streak === 0) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={streak}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className={cn(
          "flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 dark:border-amber-800/40 dark:bg-amber-950/30",
          pulse && "animate-pulse",
          className,
        )}
      >
        <span className="text-base leading-none">🔥</span>
        <span className="font-bold text-sm text-amber-700 dark:text-amber-400">
          {streak} day{streak === 1 ? "" : "s"}
        </span>
      </motion.div>
    </AnimatePresence>
  );
}
