"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { AxisKey } from "~/lib/tracker-data";

const GREEN = "#3d6b3d";
const PREV = "#8B8FD4";
const MUTED = "#d1d5db";

const AXIS_DISPLAY: Record<AxisKey, string> = {
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

type Props = {
  trends: Record<AxisKey, number[]>;
};

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
      style={{ fontSize: 11, fontWeight: 500, fill: "#6b7280" }}
    >
      {payload.value}
    </text>
  );
}

export function JournalCharts({ trends }: Props) {
  const dayCount = trends.diversity?.length ?? 0;
  const todayIdx = dayCount - 1; // index of the most recent day logged
  const prevIdx = todayIdx - 1; // index of the day before
  const hasPrev = prevIdx >= 0;

  // Radar: today vs yesterday (0–100 scale)
  const radarData = AXIS_ORDER.map((axis) => {
    const days = trends[axis] ?? [];
    return {
      axis: AXIS_DISPLAY[axis],
      today: Math.round((days[todayIdx] ?? 0) * 100),
      yesterday: hasPrev ? Math.round((days[prevIdx] ?? 0) * 100) : null,
    };
  });

  // Bar: one bar per day = average of all 4 axis scores that day
  const barData = Array.from({ length: dayCount }, (_, i) => {
    const avg =
      AXIS_ORDER.reduce((sum, axis) => sum + (trends[axis]?.[i] ?? 0), 0) /
      AXIS_ORDER.length;
    return {
      day: `Day ${i + 1}`,
      score: Math.round(avg * 100),
      isFinal: i === todayIdx,
    };
  });

  const todayLabel = `Day ${todayIdx + 1}`;
  const prevLabel = `Day ${prevIdx + 1}`;

  return (
    <div className="flex flex-col gap-6">
      {/* Adaptive radar */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Gut Health Axes
        </p>
        <p className="mb-4 text-sm text-muted-foreground">
          {hasPrev
            ? `${todayLabel} vs ${prevLabel} — see how each axis shifted`
            : "Your gut health profile across all four axes"}
        </p>

        <ResponsiveContainer width="100%" height={280}>
          <RadarChart data={radarData} outerRadius={90}>
            <PolarGrid stroke="#e5e5e5" strokeWidth={1} gridType="circle" />
            <PolarAngleAxis
              dataKey="axis"
              tick={<RadarLabel />}
              tickLine={false}
            />
            {hasPrev && (
              <Radar
                name={prevLabel}
                dataKey="yesterday"
                stroke={PREV}
                fill={PREV}
                fillOpacity={0.15}
                strokeWidth={1.5}
                strokeDasharray="4 3"
              />
            )}
            <Radar
              name={todayLabel}
              dataKey="today"
              stroke={GREEN}
              fill={GREEN}
              fillOpacity={0.22}
              strokeWidth={2}
            />
            <Tooltip
              contentStyle={{
                background: "white",
                border: "1px solid #e5e5e5",
                borderRadius: 10,
                fontSize: 12,
              }}
              formatter={(value) => [`${value ?? 0}%`]}
            />
          </RadarChart>
        </ResponsiveContainer>

        <div className="mt-3 flex flex-wrap items-center justify-center gap-5">
          <div className="flex items-center gap-1.5">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ background: GREEN }}
            />
            <span className="text-xs text-muted-foreground">
              {todayLabel} (final)
            </span>
          </div>
          {hasPrev && (
            <div className="flex items-center gap-1.5">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{
                  background: PREV,
                  outline: "2px dashed #8B8FD4",
                  outlineOffset: 2,
                }}
              />
              <span className="text-xs text-muted-foreground">
                {prevLabel} (previous)
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 7-day trend bar chart */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          7-Day Trend
        </p>
        <p className="mb-4 text-sm text-muted-foreground">
          Overall gut health score per day (0–100)
        </p>

        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={barData} barCategoryGap="32%" barGap={2}>
            <CartesianGrid vertical={false} stroke="#e5e5e5" strokeWidth={1} />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#9ca3af" }}
            />
            <YAxis hide domain={[0, 100]} />
            <ReferenceLine
              y={50}
              stroke="#e5e5e5"
              strokeDasharray="4 3"
              label={{
                value: "avg",
                position: "right",
                fontSize: 10,
                fill: "#9ca3af",
              }}
            />
            <Tooltip
              cursor={{ fill: "rgba(0,0,0,0.03)" }}
              contentStyle={{
                background: "white",
                border: "1px solid #e5e5e5",
                borderRadius: 10,
                fontSize: 12,
              }}
              formatter={(value) => [`${value ?? 0}%`, "Score"]}
            />
            <Bar dataKey="score" name="Score" radius={[4, 4, 0, 0]}>
              {barData.map((entry) => (
                <Cell
                  key={entry.day}
                  fill={entry.isFinal ? GREEN : MUTED}
                  fillOpacity={entry.isFinal ? 1 : 0.75}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        <div className="mt-3 flex flex-wrap items-center justify-center gap-5">
          <div className="flex items-center gap-1.5">
            <span
              className="inline-block h-2.5 w-2.5 rounded-sm"
              style={{ background: GREEN }}
            />
            <span className="text-xs text-muted-foreground">Final day</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className="inline-block h-2.5 w-2.5 rounded-sm"
              style={{ background: MUTED }}
            />
            <span className="text-xs text-muted-foreground">Previous days</span>
          </div>
        </div>
      </div>
    </div>
  );
}
