import {
  AXIS_LABELS,
  type AxisChoice,
  type AxisKey,
  GUT_PROFILES,
  type GutProfile,
} from "~/lib/quiz-data";

export type { AxisChoice, AxisKey, GutProfile };
export { AXIS_LABELS, GUT_PROFILES };

const CHOICE_WEIGHTS: Record<AxisChoice, number> = {
  a: 3,
  b: 2,
  c: 1,
  d: 0,
};

export interface DailyQuestion {
  id: number;
  axis: AxisKey;
  text: string;
  /** a = healthiest / most positive for that axis, d = least */
  options: { a: string; b: string; c: string; d: string };
}

/** Responses keyed by question id (stored as string keys in JSONB) */
export type DailyAnswers = Record<string, AxisChoice>;

export interface DailyLog {
  day_number: number;
  responses: DailyAnswers;
  logged_at: string;
}

export const DAILY_QUESTIONS: DailyQuestion[] = [
  // ── Diversity (2 questions) ───────────────────────────────────────────────
  {
    id: 1,
    axis: "diversity",
    text: "How many distinct vegetables, fruits, grains, or proteins did you eat today?",
    options: {
      a: "8 or more different types — a genuinely varied day",
      b: "5–7 types — solid variety across the meals",
      c: "3–4 types — my usual selection",
      d: "1–2 types — I stuck to the same familiar foods",
    },
  },
  {
    id: 2,
    axis: "diversity",
    text: "Did today's meals include anything outside your usual diet?",
    options: {
      a: "Yes — I tried several new or different ingredients",
      b: "A bit — one or two new elements in otherwise familiar meals",
      c: "Not really — my usual foods with very minor variation",
      d: "No — the same rotation I always eat",
    },
  },

  // ── Inflammation (3 questions) ────────────────────────────────────────────
  {
    id: 3,
    axis: "inflammation",
    text: "How comfortable was your gut throughout today?",
    options: {
      a: "Completely comfortable — no bloating, pain, or discomfort at all",
      b: "Mostly comfortable — minor and brief discomfort at most",
      c: "Some discomfort — bloating or pain that was noticeable",
      d: "Significant discomfort — gut issues affected my day",
    },
  },
  {
    id: 4,
    axis: "inflammation",
    text: "Did you eat fermented foods today? (yogurt, kefir, kimchi, sauerkraut, kombucha)",
    options: {
      a: "2 or more servings — a strong probiotic day",
      b: "1 serving — got some in",
      c: "A small amount — a spoonful or splash",
      d: "None today",
    },
  },
  {
    id: 5,
    axis: "inflammation",
    text: "How were your energy levels after meals today?",
    options: {
      a: "Consistently stable — no crashes or brain fog after any meal",
      b: "Mostly stable — just a brief dip after one meal",
      c: "Variable — noticeable slumps or fog after eating",
      d: "Poor — crashed or felt foggy after most meals",
    },
  },

  // ── Resilience (2 questions) ──────────────────────────────────────────────
  {
    id: 6,
    axis: "resilience",
    text: "What was your stress level like today?",
    options: {
      a: "Very low — a calm, settled day",
      b: "Mild — manageable background stress",
      c: "Moderate — noticeably stressed for a good part of the day",
      d: "High — a stressful day that affected how I felt physically",
    },
  },
  {
    id: 7,
    axis: "resilience",
    text: "How well did you sleep last night?",
    options: {
      a: "Excellent — woke up refreshed and fully rested",
      b: "Good — slept reasonably well",
      c: "Okay — some disruptions but got through the night",
      d: "Poorly — tired, groggy, or significantly sleep-deprived",
    },
  },

  // ── Fiber (3 questions) ───────────────────────────────────────────────────
  {
    id: 8,
    axis: "fiber",
    text: "How many total servings of vegetables and fruit did you eat today?",
    options: {
      a: "7 or more — plants were the star of every meal",
      b: "5–6 servings — consistently included with meals",
      c: "3–4 servings — some plants but room for more",
      d: "1–2 or fewer — plants barely featured today",
    },
  },
  {
    id: 9,
    axis: "fiber",
    text: "How did your grain choices go today?",
    options: {
      a: "All whole grains — oats, brown rice, whole wheat, quinoa, etc.",
      b: "Mostly whole grains — about 70–80% whole grain",
      c: "About half whole grains, half refined",
      d: "Mostly refined grains — or no grains at all",
    },
  },
  {
    id: 10,
    axis: "fiber",
    text: "Did you eat legumes, nuts, or seeds today?",
    options: {
      a: "Multiple servings — beans, lentils, nuts, or seeds featured prominently",
      b: "One good serving — got a solid portion of fiber-rich plant foods in",
      c: "A small amount — a handful of nuts or a small portion",
      d: "None today",
    },
  },
];

export const TOTAL_DAYS = 7;

// ── Scoring ────────────────────────────────────────────────────────────────

export function calculateLongitudinalResult(logs: DailyLog[]): string {
  const scores: Record<AxisKey, number> = {
    diversity: 0,
    inflammation: 0,
    resilience: 0,
    fiber: 0,
  };
  const maxes: Record<AxisKey, number> = {
    diversity: 0,
    inflammation: 0,
    resilience: 0,
    fiber: 0,
  };

  for (const log of logs) {
    for (const q of DAILY_QUESTIONS) {
      const answer = log.responses[String(q.id)] as AxisChoice | undefined;
      if (answer !== undefined) {
        maxes[q.axis] += 3;
        scores[q.axis] += CHOICE_WEIGHTS[answer];
      }
    }
  }

  const d =
    maxes.diversity > 0 && scores.diversity / maxes.diversity >= 0.5
      ? "D"
      : "S";
  const b =
    maxes.inflammation > 0 && scores.inflammation / maxes.inflammation >= 0.5
      ? "B"
      : "I";
  const r =
    maxes.resilience > 0 && scores.resilience / maxes.resilience >= 0.5
      ? "R"
      : "V";
  const h = maxes.fiber > 0 && scores.fiber / maxes.fiber >= 0.5 ? "H" : "L";

  return `${d}${b}${r}${h}`;
}

/** Per-axis overall scores (for the results breakdown bar) */
export function getLongitudinalAxisScores(
  logs: DailyLog[],
): Record<AxisKey, { score: number; max: number }> {
  const scores: Record<AxisKey, number> = {
    diversity: 0,
    inflammation: 0,
    resilience: 0,
    fiber: 0,
  };
  const maxes: Record<AxisKey, number> = {
    diversity: 0,
    inflammation: 0,
    resilience: 0,
    fiber: 0,
  };

  for (const log of logs) {
    for (const q of DAILY_QUESTIONS) {
      const answer = log.responses[String(q.id)] as AxisChoice | undefined;
      if (answer !== undefined) {
        maxes[q.axis] += 3;
        scores[q.axis] += CHOICE_WEIGHTS[answer];
      }
    }
  }

  return {
    diversity: { score: scores.diversity, max: maxes.diversity },
    inflammation: { score: scores.inflammation, max: maxes.inflammation },
    resilience: { score: scores.resilience, max: maxes.resilience },
    fiber: { score: scores.fiber, max: maxes.fiber },
  };
}

/** Normalized per-day score for each axis (0–1), used for trend sparklines */
export function getDailyTrends(logs: DailyLog[]): Record<AxisKey, number[]> {
  const trends: Record<AxisKey, number[]> = {
    diversity: [],
    inflammation: [],
    resilience: [],
    fiber: [],
  };

  // Sort by day_number so trends are in chronological order
  const sorted = [...logs].sort((a, b) => a.day_number - b.day_number);

  for (const log of sorted) {
    const dayScores: Record<AxisKey, number> = {
      diversity: 0,
      inflammation: 0,
      resilience: 0,
      fiber: 0,
    };
    const dayMaxes: Record<AxisKey, number> = {
      diversity: 0,
      inflammation: 0,
      resilience: 0,
      fiber: 0,
    };

    for (const q of DAILY_QUESTIONS) {
      const answer = log.responses[String(q.id)] as AxisChoice | undefined;
      if (answer !== undefined) {
        dayMaxes[q.axis] += 3;
        dayScores[q.axis] += CHOICE_WEIGHTS[answer];
      }
    }

    for (const axis of Object.keys(trends) as AxisKey[]) {
      trends[axis].push(
        dayMaxes[axis] > 0 ? dayScores[axis] / dayMaxes[axis] : 0,
      );
    }
  }

  return trends;
}
