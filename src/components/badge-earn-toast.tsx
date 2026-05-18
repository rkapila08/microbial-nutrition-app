"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import type { Badge, BadgeRarity } from "~/lib/gamification";
import { cn } from "~/lib/utils";

interface Props {
  badges: Badge[];
  xpAwarded: number;
  onDismiss?: () => void;
}

const RARITY_STYLES: Record<BadgeRarity, string> = {
  common: "border-border bg-card",
  rare: "border-blue-300/60 bg-blue-50 dark:border-blue-700/40 dark:bg-blue-950/40",
  epic: "border-purple-300/60 bg-purple-50 dark:border-purple-700/40 dark:bg-purple-950/40",
  legendary:
    "border-amber-300/60 bg-amber-50 dark:border-amber-700/40 dark:bg-amber-950/40",
};

const RARITY_LABEL: Record<BadgeRarity, string> = {
  common: "Common",
  rare: "Rare",
  epic: "Epic",
  legendary: "Legendary ✨",
};

export function BadgeEarnToast({ badges, xpAwarded, onDismiss }: Props) {
  const [visible, setVisible] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => {
      if (currentIndex < badges.length - 1) {
        setCurrentIndex((i) => i + 1);
      } else {
        setVisible(false);
        onDismiss?.();
      }
    }, 3000);
    return () => clearTimeout(t);
  }, [currentIndex, badges.length, onDismiss]);

  if (badges.length === 0) return null;

  const badge = badges[currentIndex];
  if (!badge) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: 80, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 80, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed right-4 top-4 z-50 w-72"
        >
          <div
            className={cn(
              "flex items-start gap-3 rounded-2xl border-2 p-4 shadow-lg",
              RARITY_STYLES[badge.rarity],
            )}
          >
            <span className="text-3xl leading-none shrink-0">{badge.icon}</span>
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Badge Earned!
              </span>
              <span className="font-bold text-sm truncate">{badge.name}</span>
              <span className="text-xs text-muted-foreground leading-snug">
                {badge.description}
              </span>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-[10px] font-semibold text-muted-foreground">
                  {RARITY_LABEL[badge.rarity]}
                </span>
                {currentIndex === 0 && xpAwarded > 0 && (
                  <motion.span
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold text-primary"
                  >
                    +{xpAwarded} XP
                  </motion.span>
                )}
              </div>
            </div>
            {badges.length > 1 && (
              <span className="shrink-0 text-[10px] text-muted-foreground">
                {currentIndex + 1}/{badges.length}
              </span>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
