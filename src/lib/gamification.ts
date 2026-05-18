import type { AxisKey } from "~/lib/quiz-data";
import {
  type DailyLog,
  getDailyTrends,
  getLongitudinalAxisScores,
} from "~/lib/tracker-data";

// ── XP Rewards ────────────────────────────────────────────────────────────────

export const XP_REWARDS = {
  COMPLETE_QUIZ: 100,
  RETAKE_QUIZ: 25,
  DAILY_LOG: 50,
  COMPLETE_JOURNAL: 200,
  STREAK_BONUS: 10,
  BADGE_COMMON: 25,
  BADGE_RARE: 50,
  BADGE_EPIC: 75,
  BADGE_LEGENDARY: 100,
} as const;

// ── Level system ──────────────────────────────────────────────────────────────

export interface Level {
  level: number;
  name: string;
  xpRequired: number;
}

export const LEVELS: Level[] = [
  { level: 1, name: "Gut Curious", xpRequired: 0 },
  { level: 2, name: "Gut Explorer", xpRequired: 150 },
  { level: 3, name: "Microbiome Apprentice", xpRequired: 400 },
  { level: 4, name: "Gut Practitioner", xpRequired: 800 },
  { level: 5, name: "Microbiome Enthusiast", xpRequired: 1400 },
  { level: 6, name: "Gut Advocate", xpRequired: 2100 },
  { level: 7, name: "Microbiome Scholar", xpRequired: 3000 },
  { level: 8, name: "Gut Optimizer", xpRequired: 4200 },
  { level: 9, name: "Microbiome Expert", xpRequired: 5700 },
  { level: 10, name: "Microbiome Master", xpRequired: 7500 },
];

export function calculateLevel(xp: number): Level {
  let current = LEVELS[0];
  for (const lvl of LEVELS) {
    if (xp >= lvl.xpRequired) current = lvl;
    else break;
  }
  return current;
}

export function getLevelProgress(xp: number): {
  current: Level;
  next: Level | null;
  pct: number;
} {
  const current = calculateLevel(xp);
  const next = LEVELS.find((l) => l.level === current.level + 1) ?? null;
  if (!next) return { current, next: null, pct: 1 };
  const pct =
    (xp - current.xpRequired) / (next.xpRequired - current.xpRequired);
  return { current, next, pct: Math.min(Math.max(pct, 0), 1) };
}

// ── Gut Health Score ──────────────────────────────────────────────────────────

export function calculateGutHealthScore(
  axisScores: Record<string, { score: number; max: number }>,
): number {
  const axes = ["diversity", "inflammation", "resilience", "fiber"];
  let total = 0;
  let count = 0;
  for (const axis of axes) {
    const s = axisScores[axis];
    if (s && s.max > 0) {
      total += s.score / s.max;
      count++;
    }
  }
  return count > 0 ? Math.round((total / count) * 100) : 0;
}

// ── Daily Insight Generator ────────────────────────────────────────────────────

const AXIS_DISPLAY_NAMES: Record<string, string> = {
  diversity: "Diversity",
  inflammation: "Inflammation",
  resilience: "Resilience",
  fiber: "Fiber",
};

type ScoreLevel = "low" | "mid" | "high";

const AXIS_TIPS: Record<string, Record<ScoreLevel, string>> = {
  diversity: {
    low: "Eat 5+ different plant foods today — variety is the foundation of a thriving microbiome. Think different colors on your plate: leafy greens, legumes, a fermented food like sauerkraut or kefir.",
    mid: "Add one plant food you haven't eaten this week — a different grain, legume, or fermented food can meaningfully shift your diversity score.",
    high: "Your diversity is strong! Keep rotating your plant foods to maintain your rich ecosystem. Aim for 30 different plants across the week.",
  },
  inflammation: {
    low: "Cut back on ultra-processed foods and sugary drinks today, and add an omega-3 source — salmon, walnuts, or ground flaxseed — to start calming inflammation.",
    mid: "A serving of yogurt, kimchi, or kefir could help. Try swapping at least one processed snack for a whole-food alternative like an apple with almond butter.",
    high: "Your inflammation is well-controlled — keep it up with olive oil, fatty fish, and colorful vegetables rich in antioxidants.",
  },
  resilience: {
    low: "Poor sleep and high stress are the top gut-resilience killers. Prioritise 7–8 hours tonight and try a 5-minute deep-breathing exercise before bed to lower your cortisol.",
    mid: "Protect your sleep window tonight — 7–8 hours is when your gut microbiome actively repairs itself and stress hormones reset.",
    high: "Your gut resilience is strong. Keep managing stress and guarding your sleep window — consistency here compounds over weeks.",
  },
  fiber: {
    low: "Your fiber intake is very low. Target 25–30 g today: start with beans or lentils at lunch, then oats or a whole-grain wrap at dinner. Even one swap makes a measurable difference.",
    mid: "Add an extra serving of legumes, oats, or vegetables to push your fiber score higher. A handful of chickpeas or a side of broccoli adds 5–8 g.",
    high: "Excellent fiber intake — your gut bacteria are thriving on those diverse plant fibres. Keep feeding them.",
  },
};

function getScoreLevel(pct: number): ScoreLevel {
  if (pct < 0.4) return "low";
  if (pct < 0.7) return "mid";
  return "high";
}

export interface DailyInsight {
  headline: string;
  body: string;
  tips: string[];
}

export function getDailyInsight(
  todayScores: Record<string, number>,
  prevScores: Record<string, number> | null,
  dayNumber: number,
): DailyInsight {
  const axes = ["diversity", "inflammation", "resilience", "fiber"];

  const overall =
    axes.reduce((sum, a) => sum + (todayScores[a] ?? 0), 0) / axes.length;
  const overallPct = Math.round(overall * 100);

  const sortedAxes = [...axes].sort(
    (a, b) => (todayScores[a] ?? 0) - (todayScores[b] ?? 0),
  );
  const weakest = sortedAxes[0];
  const strongest = sortedAxes[sortedAxes.length - 1];
  const weakestPct = Math.round((todayScores[weakest] ?? 0) * 100);
  const strongestPct = Math.round((todayScores[strongest] ?? 0) * 100);

  const weakTip =
    AXIS_TIPS[weakest]?.[getScoreLevel(todayScores[weakest] ?? 0)] ?? "";

  // ── Day 1 — no previous data ──────────────────────────────────────────────
  if (!prevScores) {
    let body: string;
    if (overall >= 0.7) {
      body = `You're off to a strong start — ${overallPct}% overall. Your ${AXIS_DISPLAY_NAMES[strongest]?.toLowerCase()} leads at ${strongestPct}%, and your ${AXIS_DISPLAY_NAMES[weakest]?.toLowerCase()} at ${weakestPct}% is where the biggest gains await over the next six days.`;
    } else if (overall >= 0.45) {
      body = `Solid baseline — ${overallPct}% overall. Your ${AXIS_DISPLAY_NAMES[strongest]?.toLowerCase()} is your current strength at ${strongestPct}%. Focusing on ${AXIS_DISPLAY_NAMES[weakest]?.toLowerCase()} (${weakestPct}%) will give you the highest-impact improvement this week.`;
    } else {
      body = `You've taken the first step — that's what matters most. At ${overallPct}% overall, there's real room to grow, especially in ${AXIS_DISPLAY_NAMES[weakest]?.toLowerCase()} (${weakestPct}%). Each check-in builds a clearer picture of your gut.`;
    }
    return {
      headline: "Your gut baseline is set.",
      body,
      tips: [weakTip],
    };
  }

  // ── Day 7 — final entry ───────────────────────────────────────────────────
  if (dayNumber === 7) {
    const deltas7 = axes.map((axis) => ({
      axis,
      delta: (todayScores[axis] ?? 0) - (prevScores[axis] ?? 0),
    }));
    const declined7 = deltas7
      .filter((d) => d.delta < -0.05)
      .sort((a, b) => a.delta - b.delta)[0];

    const tips: string[] = [];
    const focusAxis = declined7 ? declined7.axis : weakest;
    const focusTip =
      AXIS_TIPS[focusAxis]?.[getScoreLevel(todayScores[focusAxis] ?? 0)];
    if (focusTip) tips.push(focusTip);

    if (overallPct >= 70) {
      return {
        headline: "You finished strong.",
        body: `Day 7 at ${overallPct}% overall — that consistency is what rewires your microbiome for the long run. Your ${AXIS_DISPLAY_NAMES[strongest]?.toLowerCase()} peaked at ${strongestPct}%. Your full 7-day profile and personalised recommendations are ready below.`,
        tips,
      };
    }
    return {
      headline: "Journal complete — every day counted.",
      body: `You made it to Day 7 at ${overallPct}% overall. Showing up all seven days is the biggest win — you now have real data to act on. Your personalised profile and recommendations are below.`,
      tips,
    };
  }

  // ── Days 2–6 ─────────────────────────────────────────────────────────────
  const deltas = axes.map((axis) => ({
    axis,
    delta: (todayScores[axis] ?? 0) - (prevScores[axis] ?? 0),
  }));

  const prevOverall =
    axes.reduce((sum, a) => sum + (prevScores[a] ?? 0), 0) / axes.length;
  const overallDelta = overall - prevOverall;

  const bestImproved = deltas
    .filter((d) => d.delta > 0.05)
    .sort((a, b) => b.delta - a.delta)[0];

  const worstDeclined = deltas
    .filter((d) => d.delta < -0.05)
    .sort((a, b) => a.delta - b.delta)[0];

  const dayCtx =
    dayNumber === 4
      ? " Halfway there — keep the momentum."
      : dayNumber === 6
        ? " One more day — finish strong."
        : "";

  // Improvement case
  if (bestImproved && overallDelta >= 0) {
    const pct = Math.round(bestImproved.delta * 100);
    const axisNow = Math.round((todayScores[bestImproved.axis] ?? 0) * 100);
    return {
      headline: `+${pct}% on ${AXIS_DISPLAY_NAMES[bestImproved.axis]}.${dayCtx || " Your gut is responding."}`,
      body: `${AXIS_DISPLAY_NAMES[bestImproved.axis]} jumped ${pct}% since yesterday to ${axisNow}%.${dayCtx} Your lowest axis right now is ${AXIS_DISPLAY_NAMES[weakest]?.toLowerCase()} at ${weakestPct}% — that's your biggest lever for tomorrow.`,
      tips: [weakTip],
    };
  }

  // Decline case
  if (worstDeclined) {
    const pct = Math.abs(Math.round(worstDeclined.delta * 100));
    const prevPct = Math.round((prevScores[worstDeclined.axis] ?? 0) * 100);
    const nowPct = Math.round((todayScores[worstDeclined.axis] ?? 0) * 100);
    const tips: string[] = [];
    const declineTip =
      AXIS_TIPS[worstDeclined.axis]?.[
        getScoreLevel(todayScores[worstDeclined.axis] ?? 0)
      ];
    if (declineTip) tips.push(declineTip);
    // Add a second tip for the weakest axis if it's different and also low
    if (
      weakest !== worstDeclined.axis &&
      (todayScores[weakest] ?? 0) < 0.5 &&
      weakTip
    ) {
      tips.push(weakTip);
    }

    const recoverCtx =
      dayNumber === 4
        ? " Three days left — plenty of time to turn it around."
        : dayNumber === 6
          ? " One final day tomorrow — you can finish on a high."
          : "";
    return {
      headline: `${AXIS_DISPLAY_NAMES[worstDeclined.axis]} dipped ${pct}% today.`,
      body: `Your ${AXIS_DISPLAY_NAMES[worstDeclined.axis]?.toLowerCase()} fell from ${prevPct}% to ${nowPct}%.${recoverCtx} Here's what can help:`,
      tips,
    };
  }

  // Stable / high
  if (overall >= 0.65) {
    return {
      headline: `Solid consistency at ${overallPct}%.${dayCtx}`,
      body: `Keeping all four axes in the healthy range day after day is what drives real microbiome change. Your ${AXIS_DISPLAY_NAMES[strongest]?.toLowerCase()} leads at ${strongestPct}% — maintain that as your anchor.`,
      tips: [],
    };
  }

  // Stable / moderate
  return {
    headline: `Day ${dayNumber} done — steady progress.`,
    body: `Overall at ${overallPct}% today. Your ${AXIS_DISPLAY_NAMES[weakest]?.toLowerCase()} at ${weakestPct}% has the most room to grow — targeted changes here will have the biggest impact before Day 7.`,
    tips: [weakTip],
  };
}

// ── Win lines (shown after quiz completion) ────────────────────────────────

export const WIN_LINES = [
  "Your gut has been trying to tell you something — now you're listening.",
  "Every healthy bite is a vote for the microbiome you want.",
  "You just took the first step toward your healthiest gut.",
  "Science meets self-awareness. You're already ahead of the curve.",
  "Your microbiome is a living ecosystem — and you're its steward.",
  "Small daily choices compound into massive gut health gains.",
  "You now know what your gut has known all along.",
  "This result is the beginning, not the end.",
  "Your gut diversity is worth investing in — and you just did.",
  "Awareness is the first superpower of gut health.",
  "You're not just what you eat — you're what your microbes eat.",
  "The path to a thriving microbiome starts exactly here.",
];

// ── Day-completion positive messages (shown in tracker) ────────────────────

export const DAY_COMPLETE_MESSAGES = [
  "Your microbiome thanks you for showing up today!",
  "Another data point for a healthier you. Keep it going!",
  "Consistency is the foundation of gut health. You've got this.",
  "You're building something meaningful, one day at a time.",
  "Your gut is cheering you on — don't stop now!",
  "Progress, not perfection — and today was definite progress.",
  "Every check-in is an act of self-care. Well done.",
  "Your commitment to your gut health is genuinely inspiring.",
];

// ── Badge definitions ──────────────────────────────────────────────────────

export type BadgeRarity = "common" | "rare" | "epic" | "legendary";

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: BadgeRarity;
  category: "journal" | "streak" | "score" | "quiz" | "explorer";
}

export const BADGES: Badge[] = [
  // ── Journal completion (8) ─────────────────────────────────────────────
  {
    id: "first_checkin",
    name: "First Steps",
    description: "Complete your first daily check-in",
    icon: "🌱",
    rarity: "common",
    category: "journal",
  },
  {
    id: "day2",
    name: "Two Days Strong",
    description: "Complete Day 2 of your journal",
    icon: "🌿",
    rarity: "common",
    category: "journal",
  },
  {
    id: "day3",
    name: "Three's a Habit",
    description: "Complete Day 3 of your journal",
    icon: "🍃",
    rarity: "common",
    category: "journal",
  },
  {
    id: "halfway",
    name: "Halfway Hero",
    description: "Reach Day 4 — the turning point",
    icon: "⭐",
    rarity: "rare",
    category: "journal",
  },
  {
    id: "day5",
    name: "Five Alive",
    description: "Complete Day 5 of your journal",
    icon: "🌸",
    rarity: "rare",
    category: "journal",
  },
  {
    id: "almost_there",
    name: "Almost There",
    description: "Complete Day 6 — one day left!",
    icon: "🔥",
    rarity: "rare",
    category: "journal",
  },
  {
    id: "week_warrior",
    name: "Week Warrior",
    description: "Complete the full 7-day gut journal",
    icon: "🏆",
    rarity: "legendary",
    category: "journal",
  },
  {
    id: "comeback_kid",
    name: "Comeback Kid",
    description: "Return to your journal after skipping a day",
    icon: "💪",
    rarity: "rare",
    category: "journal",
  },

  // ── Streak (5) ─────────────────────────────────────────────────────────
  {
    id: "streak_2",
    name: "Back to Back",
    description: "Log 2 days in a row",
    icon: "⚡",
    rarity: "common",
    category: "streak",
  },
  {
    id: "streak_3",
    name: "On A Roll",
    description: "Log 3 consecutive days",
    icon: "🎯",
    rarity: "common",
    category: "streak",
  },
  {
    id: "streak_4",
    name: "Four Strong",
    description: "Log 4 consecutive days without a break",
    icon: "🔗",
    rarity: "common",
    category: "streak",
  },
  {
    id: "streak_5",
    name: "Momentum Builder",
    description: "Log 5 consecutive days",
    icon: "🚀",
    rarity: "rare",
    category: "streak",
  },
  {
    id: "streak_7",
    name: "Unstoppable",
    description: "Complete the full 7-day streak",
    icon: "👑",
    rarity: "legendary",
    category: "streak",
  },

  // ── Score-based (10) ───────────────────────────────────────────────────
  {
    id: "diversity_master",
    name: "Diversity Master",
    description: "Average Diversity score above 75% over 7 days",
    icon: "🦠",
    rarity: "epic",
    category: "score",
  },
  {
    id: "gut_healer",
    name: "Gut Healer",
    description: "Average Inflammation score above 75% over 7 days",
    icon: "💚",
    rarity: "epic",
    category: "score",
  },
  {
    id: "resilience_warrior",
    name: "Resilience Warrior",
    description: "Average Resilience score above 75% over 7 days",
    icon: "🛡️",
    rarity: "epic",
    category: "score",
  },
  {
    id: "fiber_champion",
    name: "Fiber Champion",
    description: "Average Fiber score above 75% over 7 days",
    icon: "🥦",
    rarity: "epic",
    category: "score",
  },
  {
    id: "balanced_profile",
    name: "The Balanced",
    description: "Score above 60% on all four axes across 7 days",
    icon: "⚖️",
    rarity: "epic",
    category: "score",
  },
  {
    id: "peak_performance",
    name: "Peak Performance",
    description: "Score above 75% on all four axes across 7 days",
    icon: "💎",
    rarity: "legendary",
    category: "score",
  },
  {
    id: "perfect_week",
    name: "Perfect Week",
    description: "Complete all 7 days with an avg score above 70%",
    icon: "🌟",
    rarity: "legendary",
    category: "score",
  },
  {
    id: "single_day_hero",
    name: "Superstar Day",
    description: "Score above 80% on all four axes in a single day",
    icon: "✨",
    rarity: "epic",
    category: "score",
  },
  {
    id: "fiber_streak",
    name: "Fiber Focused",
    description: "Score above 70% on Fiber for 5 or more days",
    icon: "🌾",
    rarity: "rare",
    category: "score",
  },
  {
    id: "anti_inflammatory",
    name: "Anti-Inflammatory",
    description: "Score above 70% on Inflammation for 5 or more days",
    icon: "🧘",
    rarity: "rare",
    category: "score",
  },
  {
    id: "diversity_streak",
    name: "Garden of Eden",
    description: "Score above 70% on Diversity for 5 or more days",
    icon: "🌺",
    rarity: "rare",
    category: "score",
  },
  {
    id: "resilience_streak",
    name: "Stress Shield",
    description: "Score above 70% on Resilience for 5 or more days",
    icon: "🛡️",
    rarity: "rare",
    category: "score",
  },
  {
    id: "big_improver",
    name: "Rising Tide",
    description:
      "Improve your overall gut health score by 15+ points from Day 1 to Day 7",
    icon: "📈",
    rarity: "rare",
    category: "score",
  },
  {
    id: "no_weak_link",
    name: "Unbreakable",
    description: "Every single axis stays above 55% across all 7 days",
    icon: "⛓️",
    rarity: "epic",
    category: "score",
  },

  // ── Quiz (9) ───────────────────────────────────────────────────────────
  {
    id: "quiz_complete",
    name: "First Discovery",
    description: "Complete the Snapshot Quiz",
    icon: "🔬",
    rarity: "common",
    category: "quiz",
  },
  {
    id: "quiz_retake",
    name: "Second Opinion",
    description: "Retake the Snapshot Quiz",
    icon: "🔄",
    rarity: "common",
    category: "quiz",
  },
  {
    id: "high_diversity_quiz",
    name: "Rich Ecosystem",
    description: "Score above 80% on Diversity in the quiz",
    icon: "🌈",
    rarity: "epic",
    category: "quiz",
  },
  {
    id: "low_inflammation_quiz",
    name: "Cool & Calm",
    description: "Score above 80% on Inflammation in the quiz",
    icon: "❄️",
    rarity: "epic",
    category: "quiz",
  },
  {
    id: "high_resilience_quiz",
    name: "Iron Gut",
    description: "Score above 80% on Resilience in the quiz",
    icon: "⚓",
    rarity: "epic",
    category: "quiz",
  },
  {
    id: "high_fiber_quiz",
    name: "Fiber Fanatic",
    description: "Score above 80% on Fiber in the quiz",
    icon: "🌽",
    rarity: "epic",
    category: "quiz",
  },
  {
    id: "well_rounded_quiz",
    name: "Well-Rounded",
    description: "Score above 60% on all four axes in the quiz",
    icon: "🎯",
    rarity: "rare",
    category: "quiz",
  },
  {
    id: "perfect_quiz",
    name: "Gut Genius",
    description: "Score above 80% on all four axes in the quiz",
    icon: "🧠",
    rarity: "legendary",
    category: "quiz",
  },
  {
    id: "d_type",
    name: "Diverse Type",
    description: "Achieve a D-axis gut profile in the quiz",
    icon: "🌻",
    rarity: "rare",
    category: "quiz",
  },
  {
    id: "h_type",
    name: "High Fiber Type",
    description: "Achieve an H-axis gut profile in the quiz",
    icon: "🌾",
    rarity: "rare",
    category: "quiz",
  },

  // ── Explorer (5) ───────────────────────────────────────────────────────
  {
    id: "explorer",
    name: "Gut Explorer",
    description: "Start your first 7-Day Journal",
    icon: "🗺️",
    rarity: "common",
    category: "explorer",
  },
  {
    id: "dedicated",
    name: "Dedicated",
    description: "Complete 5 or more days of the journal",
    icon: "🏅",
    rarity: "rare",
    category: "explorer",
  },
  {
    id: "knowledge_seeker",
    name: "Knowledge Seeker",
    description: "Explore all 16 gut profiles",
    icon: "📚",
    rarity: "common",
    category: "explorer",
  },
  {
    id: "habit_builder",
    name: "Habit Builder",
    description: "Complete 4+ journal days while maintaining a 3-day streak",
    icon: "🔄",
    rarity: "rare",
    category: "explorer",
  },
  {
    id: "dual_tracker",
    name: "Dual Tracker",
    description: "Complete both the Quiz and the 7-Day Journal",
    icon: "🎖️",
    rarity: "epic",
    category: "explorer",
  },
  {
    id: "microbiome_master",
    name: "Microbiome Master",
    description: "Complete the quiz and all 7 journal days with high scores",
    icon: "🧬",
    rarity: "legendary",
    category: "explorer",
  },
];

// ── Mission / Quest definitions ────────────────────────────────────────────

export interface Mission {
  id: string;
  title: string;
  description: string;
  icon: string;
  target: number;
  unit: string;
  category: "days" | "streak";
}

export const MISSIONS: Mission[] = [
  {
    id: "first_checkin",
    title: "First Steps",
    description: "Complete your first daily check-in",
    icon: "🌱",
    target: 1,
    unit: "day",
    category: "days",
  },
  {
    id: "three_days",
    title: "Gut Check",
    description: "Complete 3 daily check-ins",
    icon: "📅",
    target: 3,
    unit: "days",
    category: "days",
  },
  {
    id: "five_days",
    title: "Dedicated",
    description: "Complete 5 daily check-ins",
    icon: "⭐",
    target: 5,
    unit: "days",
    category: "days",
  },
  {
    id: "full_week",
    title: "Full Journey",
    description: "Complete all 7 days of your gut journal",
    icon: "🏆",
    target: 7,
    unit: "days",
    category: "days",
  },
  {
    id: "streak_3",
    title: "Consistency Check",
    description: "Log 3 consecutive days in a row",
    icon: "🔥",
    target: 3,
    unit: "streak",
    category: "streak",
  },
  {
    id: "streak_5",
    title: "Momentum",
    description: "Maintain a 5-day logging streak",
    icon: "⚡",
    target: 5,
    unit: "streak",
    category: "streak",
  },
  {
    id: "streak_7",
    title: "Perfect Run",
    description: "Complete all 7 days consecutively — no gaps",
    icon: "👑",
    target: 7,
    unit: "streak",
    category: "streak",
  },
];

// ── Streak calculation ─────────────────────────────────────────────────────

export function calculateStreak(logs: DailyLog[]): number {
  if (logs.length === 0) return 0;
  const dayNumbers = new Set(logs.map((l) => l.day_number));
  let streak = 0;
  for (let day = 1; day <= 7; day++) {
    if (dayNumbers.has(day)) streak++;
    else break;
  }
  return streak;
}

// ── Tracker badge checking ─────────────────────────────────────────────────

export function getEarnedTrackerBadges(logs: DailyLog[]): Set<string> {
  const earned = new Set<string>();
  if (logs.length === 0) return earned;

  const completedDays = logs.length;
  const streak = calculateStreak(logs);

  earned.add("explorer");
  if (completedDays >= 1) earned.add("first_checkin");
  if (completedDays >= 2) earned.add("day2");
  if (completedDays >= 3) earned.add("day3");
  if (completedDays >= 4) earned.add("halfway");
  if (completedDays >= 5) {
    earned.add("day5");
    earned.add("dedicated");
  }
  if (completedDays >= 6) earned.add("almost_there");
  if (completedDays >= 7) earned.add("week_warrior");

  if (streak >= 2) earned.add("streak_2");
  if (streak >= 3) earned.add("streak_3");
  if (streak >= 4) earned.add("streak_4");
  if (streak >= 5) earned.add("streak_5");
  if (streak >= 7) earned.add("streak_7");

  if (completedDays >= 4 && streak >= 3) earned.add("habit_builder");

  const dayNums = logs.map((l) => l.day_number).sort((a, b) => a - b);
  for (let i = 1; i < dayNums.length; i++) {
    if (dayNums[i] - dayNums[i - 1] > 1) {
      earned.add("comeback_kid");
      break;
    }
  }

  if (completedDays >= 7) {
    const axisScores = getLongitudinalAxisScores(logs);
    const axes: AxisKey[] = [
      "diversity",
      "inflammation",
      "resilience",
      "fiber",
    ];

    const pcts = axes.map((axis) => {
      const { score, max } = axisScores[axis];
      return max > 0 ? score / max : 0;
    });

    const [divPct, inflPct, resPct, fibPct] = pcts;

    if (divPct > 0.75) earned.add("diversity_master");
    if (inflPct > 0.75) earned.add("gut_healer");
    if (resPct > 0.75) earned.add("resilience_warrior");
    if (fibPct > 0.75) earned.add("fiber_champion");

    if (pcts.every((p) => p > 0.6)) earned.add("balanced_profile");
    if (pcts.every((p) => p > 0.75)) earned.add("peak_performance");

    const avgAll = pcts.reduce((a, b) => a + b, 0) / pcts.length;
    if (avgAll > 0.7) earned.add("perfect_week");

    const trends = getDailyTrends(logs);

    trends.diversity.forEach((_, i) => {
      if (
        trends.diversity[i] > 0.8 &&
        trends.inflammation[i] > 0.8 &&
        trends.resilience[i] > 0.8 &&
        trends.fiber[i] > 0.8
      ) {
        earned.add("single_day_hero");
      }
    });

    if (trends.fiber.filter((s) => s > 0.7).length >= 5)
      earned.add("fiber_streak");
    if (trends.inflammation.filter((s) => s > 0.7).length >= 5)
      earned.add("anti_inflammatory");
    if (trends.diversity.filter((s) => s > 0.7).length >= 5)
      earned.add("diversity_streak");
    if (trends.resilience.filter((s) => s > 0.7).length >= 5)
      earned.add("resilience_streak");

    // Rising Tide: overall score improves ≥15 points from Day 1 to Day 7
    const day1Overall =
      axes.reduce((sum, a) => sum + (trends[a][0] ?? 0), 0) / axes.length;
    const day7Overall =
      axes.reduce((sum, a) => sum + (trends[a][trends[a].length - 1] ?? 0), 0) /
      axes.length;
    if (day7Overall - day1Overall >= 0.15) earned.add("big_improver");

    // Unbreakable: every axis on every day above 55%
    const allScores = axes.flatMap((a) => trends[a]);
    if (allScores.every((s) => s > 0.55)) earned.add("no_weak_link");
  }

  return earned;
}

// ── Quiz badge checking ────────────────────────────────────────────────────

export function getEarnedQuizBadges(
  axisScores: Record<AxisKey, { score: number; max: number }>,
  profileCode: string,
  isRetake: boolean,
): Set<string> {
  const earned = new Set<string>();
  earned.add("quiz_complete");
  if (isRetake) earned.add("quiz_retake");

  const axes: AxisKey[] = ["diversity", "inflammation", "resilience", "fiber"];
  const pcts = axes.map((axis) => {
    const { score, max } = axisScores[axis];
    return max > 0 ? score / max : 0;
  });

  const [divPct, inflPct, resPct, fibPct] = pcts;
  if (divPct > 0.8) earned.add("high_diversity_quiz");
  if (inflPct > 0.8) earned.add("low_inflammation_quiz");
  if (resPct > 0.8) earned.add("high_resilience_quiz");
  if (fibPct > 0.8) earned.add("high_fiber_quiz");
  if (pcts.every((p) => p > 0.6)) earned.add("well_rounded_quiz");
  if (pcts.every((p) => p > 0.8)) earned.add("perfect_quiz");

  if (profileCode.startsWith("D")) earned.add("d_type");
  if (profileCode.endsWith("H")) earned.add("h_type");

  return earned;
}

// ── Mission progress ───────────────────────────────────────────────────────

export function getMissionProgress(logs: DailyLog[]): Record<string, number> {
  const streak = calculateStreak(logs);
  const completedDays = logs.length;

  return {
    first_checkin: Math.min(completedDays, 1),
    three_days: Math.min(completedDays, 3),
    five_days: Math.min(completedDays, 5),
    full_week: Math.min(completedDays, 7),
    streak_3: Math.min(streak, 3),
    streak_5: Math.min(streak, 5),
    streak_7: Math.min(streak, 7),
  };
}
