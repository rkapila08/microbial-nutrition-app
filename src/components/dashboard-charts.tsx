"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { AxisKey } from "~/lib/quiz-data";

const CHARCOAL = "#1f1f1f";
const PURPLE = "#8B8FD4";
const GRAY = "#C8C8C8";

const AVG_BENCHMARK = 62;
const LOW_BENCHMARK = 35;

const SHORT_AXIS_LABELS: Record<AxisKey, string> = {
  diversity: "Diversity",
  inflammation: "Inflammation",
  resilience: "Resilience",
  fiber: "Fiber",
};

const AXIS_ORDER: AxisKey[] = [
  "diversity",
  "inflammation",
  "resilience",
  "fiber",
];

interface JournalChartsProps {
  axisScores: Record<AxisKey, { score: number; max: number }>;
  trends: Record<AxisKey, number[]>;
}

function RadarLabel({
  x,
  y,
  payload,
}: {
  x?: number;
  y?: number;
  payload?: { value: string };
}) {
  if (x === undefined || y === undefined || !payload) return null;
  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      dominantBaseline="central"
      className="fill-muted-foreground"
      style={{ fontSize: 11, fontWeight: 500 }}
    >
      {payload.value}
    </text>
  );
}

export function JournalCharts({ axisScores, trends }: JournalChartsProps) {
  const radarData = AXIS_ORDER.map((key) => {
    const { score, max } = axisScores[key];
    const pct = max > 0 ? Math.round((score / max) * 100) : 50;
    return {
      axis: SHORT_AXIS_LABELS[key],
      you: pct,
      avg: AVG_BENCHMARK,
      low: LOW_BENCHMARK,
    };
  });

  const numDays = Math.max(...AXIS_ORDER.map((k) => trends[k].length), 0);
  const barData = Array.from({ length: numDays }, (_, i) => {
    const dayScores = AXIS_ORDER.map((k) => trends[k][i] ?? 0);
    const composite = Math.round(
      (dayScores.reduce((a, b) => a + b, 0) / dayScores.length) * 100,
    );
    return {
      day: `Day ${i + 1}`,
      you: composite,
      avg: AVG_BENCHMARK,
      low: LOW_BENCHMARK,
    };
  });

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Radar chart */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Gut Health Axes
        </p>
        <p className="mb-4 text-sm text-muted-foreground">
          Your profile vs. average vs. low-diversity baseline
        </p>
        <ResponsiveContainer width="100%" height={280}>
          <RadarChart data={radarData} outerRadius={95}>
            <PolarGrid stroke="#e5e5e5" strokeWidth={1} gridType="circle" />
            <PolarAngleAxis
              dataKey="axis"
              tick={<RadarLabel />}
              tickLine={false}
            />
            <Radar
              name="Low diversity"
              dataKey="low"
              stroke={GRAY}
              fill={GRAY}
              fillOpacity={0.25}
              strokeWidth={1.5}
            />
            <Radar
              name="Average"
              dataKey="avg"
              stroke={PURPLE}
              fill={PURPLE}
              fillOpacity={0.2}
              strokeWidth={1.5}
            />
            <Radar
              name="You"
              dataKey="you"
              stroke={CHARCOAL}
              fill={CHARCOAL}
              fillOpacity={0.12}
              strokeWidth={2}
            />
            <Tooltip
              contentStyle={{
                background: "white",
                border: "1px solid #e5e5e5",
                borderRadius: 10,
                fontSize: 12,
              }}
              formatter={(value) => [`${value}%`, undefined]}
            />
          </RadarChart>
        </ResponsiveContainer>
        <div className="mt-4 flex items-center justify-center gap-5">
          {[
            { color: CHARCOAL, label: "You" },
            { color: PURPLE, label: "Average" },
            { color: GRAY, label: "Low diversity" },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ background: color }}
              />
              <span className="text-xs text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bar chart — day-by-day composite */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          7-Day Trend
        </p>
        <p className="mb-4 text-sm text-muted-foreground">
          Composite gut score per day vs. benchmarks
        </p>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={barData} barCategoryGap="30%" barGap={3}>
            <CartesianGrid vertical={false} stroke="#e5e5e5" strokeWidth={1} />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#9ca3af" }}
            />
            <YAxis hide domain={[0, 100]} />
            <Tooltip
              cursor={{ fill: "rgba(0,0,0,0.03)" }}
              contentStyle={{
                background: "white",
                border: "1px solid #e5e5e5",
                borderRadius: 10,
                fontSize: 12,
              }}
              formatter={(value) => [`${value}%`, undefined]}
            />
            <Bar
              dataKey="low"
              name="Low diversity"
              fill={GRAY}
              radius={[3, 3, 0, 0]}
            />
            <Bar
              dataKey="avg"
              name="Average"
              fill={PURPLE}
              radius={[3, 3, 0, 0]}
            />
            <Bar
              dataKey="you"
              name="You"
              fill={CHARCOAL}
              radius={[3, 3, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 flex items-center justify-center gap-5">
          {[
            { color: CHARCOAL, label: "You" },
            { color: PURPLE, label: "Average" },
            { color: GRAY, label: "Low diversity" },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <span
                className="inline-block h-2.5 w-2.5 rounded-sm"
                style={{ background: color }}
              />
              <span className="text-xs text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
