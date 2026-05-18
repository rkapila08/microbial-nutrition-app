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

const CHARCOAL = "#1f1f1f";
const PURPLE = "#8B8FD4";
const GRAY = "#C8C8C8";

const radarData = [
  { axis: "Diversity", you: 82, avg: 64, low: 40 },
  { axis: "Fiber", you: 75, avg: 55, low: 30 },
  { axis: "Resilience", you: 68, avg: 60, low: 45 },
  { axis: "Inflammation", you: 55, avg: 50, low: 35 },
  { axis: "Immunity", you: 88, avg: 62, low: 42 },
  { axis: "Mood", you: 72, avg: 58, low: 38 },
  { axis: "Metabolism", you: 65, avg: 52, low: 33 },
];

const barData = [
  { month: "Jan", you: 71, avg: 60, low: 38 },
  { month: "Feb", you: 74, avg: 61, low: 39 },
  { month: "Mar", you: 78, avg: 63, low: 40 },
  { month: "Apr", you: 75, avg: 62, low: 37 },
  { month: "May", you: 80, avg: 65, low: 41 },
  { month: "Jun", you: 82, avg: 64, low: 40 },
];

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

export function DashboardCharts() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Radar chart */}
      <div className="rounded-2xl bg-white p-6 dark:bg-card">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Gut Health Axes
        </p>
        <p className="mb-4 text-sm text-muted-foreground">
          Your profile vs. average vs. low-diversity baseline
        </p>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={radarData} outerRadius={100}>
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

      {/* Bar chart */}
      <div className="rounded-2xl p-6">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Monthly Trend
        </p>
        <p className="mb-4 text-sm text-muted-foreground">
          Overall gut score compared across groups
        </p>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData} barCategoryGap="30%" barGap={3}>
            <CartesianGrid vertical={false} stroke="#e5e5e5" strokeWidth={1} />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#9ca3af" }}
            />
            <YAxis hide />
            <Tooltip
              cursor={{ fill: "rgba(0,0,0,0.03)" }}
              contentStyle={{
                background: "white",
                border: "1px solid #e5e5e5",
                borderRadius: 10,
                fontSize: 12,
              }}
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
