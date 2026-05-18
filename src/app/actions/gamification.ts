"use server";

import {
  BADGES,
  type Badge,
  calculateGutHealthScore,
  calculateLevel,
  getEarnedQuizBadges,
  getEarnedTrackerBadges,
  getLevelProgress,
  type Level,
  XP_REWARDS,
} from "~/lib/gamification";
import type { AxisKey } from "~/lib/quiz-data";
import { createClient } from "~/lib/supabase/server";
import { type DailyLog, getLongitudinalAxisScores } from "~/lib/tracker-data";

export interface GamificationResult {
  isAuthenticated: boolean;
  newBadges: Badge[];
  xpAwarded: number;
  newLevel: Level | null;
  totalXP: number;
  currentStreak: number;
}

export interface UserProgressData {
  xp: number;
  level: number;
  levelName: string;
  currentStreak: number;
  longestStreak: number;
  quizzesCompleted: number;
  journalsCompleted: number;
  latestProfileCode: string | null;
  latestGutScore: number | null;
  earnedBadgeIds: string[];
  levelPct: number;
  xpToNext: number | null;
}

export interface LeaderboardEntry {
  rank: number;
  level: number;
  xp: number;
  latestProfileCode: string | null;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

async function getEarnedBadgeIds(userId: string): Promise<Set<string>> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("earned_badges")
    .select("badge_id")
    .eq("user_id", userId);
  return new Set((data ?? []).map((r) => r.badge_id as string));
}

function badgeXP(badge: Badge): number {
  const key = `BADGE_${badge.rarity.toUpperCase()}` as keyof typeof XP_REWARDS;
  return XP_REWARDS[key];
}

function computeStreak(logs: DailyLog[]): number {
  const sorted = logs.map((l) => l.day_number).sort((a, b) => a - b);
  let streak = 0;
  for (let i = 1; i <= 7; i++) {
    if (sorted.includes(i)) streak++;
    else break;
  }
  return streak;
}

async function applyGamification(
  userId: string,
  xpDelta: number,
  newBadgeIds: string[],
  extra?: {
    currentStreak?: number;
    longestStreak?: number;
    latestProfileCode?: string;
    latestGutScore?: number;
    quizzesDelta?: number;
    journalsDelta?: number;
  },
): Promise<{ newXP: number; didLevelUp: boolean; newLevelData: Level }> {
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("user_progress")
    .select("xp, level, longest_streak, quizzes_completed, journals_completed")
    .eq("user_id", userId)
    .single();

  const currentXP = (existing?.xp as number | undefined) ?? 0;
  const longestStreak = (existing?.longest_streak as number | undefined) ?? 0;
  const currentQuizzes =
    (existing?.quizzes_completed as number | undefined) ?? 0;
  const currentJournals =
    (existing?.journals_completed as number | undefined) ?? 0;

  const newXP = currentXP + xpDelta;
  const prevLevel = calculateLevel(currentXP);
  const newLevelData = calculateLevel(newXP);

  await supabase.from("user_progress").upsert(
    {
      user_id: userId,
      xp: newXP,
      level: newLevelData.level,
      longest_streak: Math.max(
        longestStreak,
        extra?.currentStreak ?? longestStreak,
      ),
      ...(extra?.currentStreak !== undefined && {
        current_streak: extra.currentStreak,
        last_activity_date: new Date().toISOString().split("T")[0],
      }),
      ...(extra?.latestProfileCode !== undefined && {
        latest_profile_code: extra.latestProfileCode,
      }),
      ...(extra?.latestGutScore !== undefined && {
        latest_gut_score: extra.latestGutScore,
      }),
      ...(extra?.quizzesDelta && {
        quizzes_completed: currentQuizzes + extra.quizzesDelta,
      }),
      ...(extra?.journalsDelta && {
        journals_completed: currentJournals + extra.journalsDelta,
      }),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );

  if (newBadgeIds.length > 0) {
    await supabase.from("earned_badges").upsert(
      newBadgeIds.map((badge_id) => ({ user_id: userId, badge_id })),
      { onConflict: "user_id,badge_id", ignoreDuplicates: true },
    );
  }

  return {
    newXP,
    didLevelUp: newLevelData.level > prevLevel.level,
    newLevelData,
  };
}

// ── Quiz gamification ─────────────────────────────────────────────────────────

export async function awardQuizGamification(
  axisScores: Record<AxisKey, { score: number; max: number }>,
  profileCode: string,
  isRetake: boolean,
): Promise<GamificationResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const earnedSet = getEarnedQuizBadges(axisScores, profileCode, isRetake);
  const gutScore = calculateGutHealthScore(axisScores);
  const xpBase = isRetake ? XP_REWARDS.RETAKE_QUIZ : XP_REWARDS.COMPLETE_QUIZ;

  const allEarnedBadges = BADGES.filter((b) => earnedSet.has(b.id));

  if (!user) {
    const previewXP =
      xpBase + allEarnedBadges.reduce((sum, b) => sum + badgeXP(b), 0);
    return {
      isAuthenticated: false,
      newBadges: allEarnedBadges,
      xpAwarded: previewXP,
      newLevel: null,
      totalXP: 0,
      currentStreak: 0,
    };
  }

  const previousIds = await getEarnedBadgeIds(user.id);
  const newBadgeIds = [...earnedSet].filter((id) => !previousIds.has(id));
  const newBadges = BADGES.filter((b) => newBadgeIds.includes(b.id));
  const xpDelta = xpBase + newBadges.reduce((sum, b) => sum + badgeXP(b), 0);

  const { newXP, didLevelUp, newLevelData } = await applyGamification(
    user.id,
    xpDelta,
    newBadgeIds,
    {
      latestProfileCode: profileCode,
      latestGutScore: gutScore,
      quizzesDelta: 1,
    },
  );

  return {
    isAuthenticated: true,
    newBadges,
    xpAwarded: xpDelta,
    newLevel: didLevelUp ? newLevelData : null,
    totalXP: newXP,
    currentStreak: 0,
  };
}

// ── Tracker gamification ──────────────────────────────────────────────────────

export async function awardTrackerGamification(
  logs: DailyLog[],
): Promise<GamificationResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const earnedSet = getEarnedTrackerBadges(logs);
  const isComplete = logs.length >= 7;
  const streak = computeStreak(logs);

  const axisScores = getLongitudinalAxisScores(logs);
  const gutScore = calculateGutHealthScore(axisScores);

  const xpBase =
    XP_REWARDS.DAILY_LOG +
    (isComplete ? XP_REWARDS.COMPLETE_JOURNAL : 0) +
    (streak > 1 ? XP_REWARDS.STREAK_BONUS : 0);

  const allEarnedBadges = BADGES.filter((b) => earnedSet.has(b.id));

  if (!user) {
    const previewXP =
      xpBase + allEarnedBadges.reduce((sum, b) => sum + badgeXP(b), 0);
    return {
      isAuthenticated: false,
      newBadges: allEarnedBadges,
      xpAwarded: previewXP,
      newLevel: null,
      totalXP: 0,
      currentStreak: streak,
    };
  }

  const previousIds = await getEarnedBadgeIds(user.id);
  const newBadgeIds = [...earnedSet].filter((id) => !previousIds.has(id));
  const newBadges = BADGES.filter((b) => newBadgeIds.includes(b.id));
  const xpDelta = xpBase + newBadges.reduce((sum, b) => sum + badgeXP(b), 0);

  const { newXP, didLevelUp, newLevelData } = await applyGamification(
    user.id,
    xpDelta,
    newBadgeIds,
    {
      currentStreak: streak,
      latestGutScore: gutScore,
      journalsDelta: isComplete ? 1 : 0,
    },
  );

  return {
    isAuthenticated: true,
    newBadges,
    xpAwarded: xpDelta,
    newLevel: didLevelUp ? newLevelData : null,
    totalXP: newXP,
    currentStreak: streak,
  };
}

// ── Profile page data ─────────────────────────────────────────────────────────

export async function getUserProgress(): Promise<UserProgressData | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [{ data: progress }, { data: badges }] = await Promise.all([
    supabase.from("user_progress").select("*").eq("user_id", user.id).single(),
    supabase.from("earned_badges").select("badge_id").eq("user_id", user.id),
  ]);

  const xp = (progress?.xp as number | undefined) ?? 0;
  const { current, next, pct } = getLevelProgress(xp);

  return {
    xp,
    level: current.level,
    levelName: current.name,
    currentStreak: (progress?.current_streak as number | undefined) ?? 0,
    longestStreak: (progress?.longest_streak as number | undefined) ?? 0,
    quizzesCompleted: (progress?.quizzes_completed as number | undefined) ?? 0,
    journalsCompleted:
      (progress?.journals_completed as number | undefined) ?? 0,
    latestProfileCode:
      (progress?.latest_profile_code as string | null | undefined) ?? null,
    latestGutScore:
      (progress?.latest_gut_score as number | null | undefined) ?? null,
    earnedBadgeIds: (badges ?? []).map((b) => b.badge_id as string),
    levelPct: pct,
    xpToNext: next ? next.xpRequired - xp : null,
  };
}

// ── Leaderboard ───────────────────────────────────────────────────────────────

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  const supabase = await createClient();

  const { data } = await supabase.rpc("get_leaderboard", { limit_n: 10 });

  if (!data) return [];

  return (
    data as Array<{
      rank: number;
      level: number;
      xp: number;
      latest_profile_code: string | null;
    }>
  ).map((row) => ({
    rank: Number(row.rank),
    level: row.level,
    xp: row.xp,
    latestProfileCode: row.latest_profile_code,
  }));
}
