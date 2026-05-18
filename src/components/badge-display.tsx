"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { BADGES, type Badge, type BadgeRarity } from "~/lib/gamification";
import { cn } from "~/lib/utils";

interface Props {
  earnedIds: string[];
  newIds?: string[];
  showAll?: boolean;
}

const RARITY_STYLES: Record<BadgeRarity, string> = {
  common: "border-border bg-card",
  rare: "border-blue-300/60 bg-blue-50/50 dark:border-blue-700/40 dark:bg-blue-950/20",
  epic: "border-purple-300/60 bg-purple-50/50 dark:border-purple-700/40 dark:bg-purple-950/20",
  legendary:
    "border-amber-300/60 bg-amber-50/50 dark:border-amber-700/40 dark:bg-amber-950/20",
};

const RARITY_CHIP: Record<BadgeRarity, string> = {
  common: "text-muted-foreground",
  rare: "text-blue-600 dark:text-blue-400",
  epic: "text-purple-600 dark:text-purple-400",
  legendary: "text-amber-600 dark:text-amber-400",
};

const CATEGORIES = [
  { key: "journal", label: "Journal" },
  { key: "streak", label: "Streak" },
  { key: "score", label: "Score" },
  { key: "quiz", label: "Quiz" },
  { key: "explorer", label: "Explorer" },
] as const;

function BadgeCard({
  badge,
  earned,
  isNew,
}: {
  badge: Badge;
  earned: boolean;
  isNew: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={isNew ? { scale: 0, opacity: 0 } : false}
      animate={{ scale: 1, opacity: 1 }}
      transition={
        isNew
          ? { type: "spring", stiffness: 300, damping: 18, delay: 0.1 }
          : undefined
      }
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "relative flex flex-col items-center gap-1.5 rounded-2xl border-2 p-3 text-center transition-all duration-200",
        earned
          ? RARITY_STYLES[badge.rarity]
          : "border-border bg-muted/30 opacity-40 grayscale",
        hovered && earned && "scale-105 shadow-sm",
      )}
    >
      {isNew && (
        <span className="absolute -top-1.5 -right-1.5 rounded-full bg-accent px-1.5 py-0.5 text-[9px] font-black text-accent-foreground uppercase tracking-wider">
          New!
        </span>
      )}
      <span className="text-2xl leading-none">{badge.icon}</span>
      <span className="text-xs font-bold leading-tight">{badge.name}</span>
      {hovered && earned && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-full left-1/2 z-10 mb-2 w-40 -translate-x-1/2 rounded-xl border border-border bg-popover p-2 shadow-lg"
        >
          <p
            className={cn(
              "text-[10px] font-semibold",
              RARITY_CHIP[badge.rarity],
            )}
          >
            {badge.rarity.charAt(0).toUpperCase() + badge.rarity.slice(1)}
          </p>
          <p className="text-[11px] text-muted-foreground leading-snug">
            {badge.description}
          </p>
        </motion.div>
      )}
      {!earned && <span className="text-lg leading-none">🔒</span>}
    </motion.div>
  );
}

export function BadgeDisplay({
  earnedIds,
  newIds = [],
  showAll = true,
}: Props) {
  const [activeCategory, setActiveCategory] = useState<string>("journal");

  const earnedSet = new Set(earnedIds);
  const newSet = new Set(newIds);

  const filtered = BADGES.filter(
    (b) => !showAll || b.category === activeCategory,
  );
  const earned = BADGES.filter((b) => earnedSet.has(b.id));
  const earnedCount = earned.length;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-sm text-muted-foreground uppercase tracking-widest">
          Badges
        </h2>
        <span className="text-xs text-muted-foreground">
          {earnedCount} / {BADGES.length} earned
        </span>
      </div>

      {showAll && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {CATEGORIES.map(({ key, label }) => {
            const categoryBadges = BADGES.filter((b) => b.category === key);
            const earnedInCategory = categoryBadges.filter((b) =>
              earnedSet.has(b.id),
            ).length;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setActiveCategory(key)}
                className={cn(
                  "shrink-0 rounded-full px-3 py-1 text-xs font-semibold transition-colors",
                  activeCategory === key
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80",
                )}
              >
                {label}{" "}
                <span className="opacity-70">
                  {earnedInCategory}/{categoryBadges.length}
                </span>
              </button>
            );
          })}
        </div>
      )}

      <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
        {(showAll ? filtered : earned.slice(0, 8)).map((badge) => (
          <BadgeCard
            key={badge.id}
            badge={badge}
            earned={earnedSet.has(badge.id)}
            isNew={newSet.has(badge.id)}
          />
        ))}
      </div>
    </div>
  );
}
