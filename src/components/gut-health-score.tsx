"use client";

import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { useEffect, useRef } from "react";
import { cn } from "~/lib/utils";

interface Props {
  score: number;
  size?: "sm" | "md" | "lg";
  label?: string;
}

function getColor(score: number): string {
  if (score >= 80) return "oklch(0.62 0.18 185)";
  if (score >= 60) return "oklch(0.5 0.18 143)";
  if (score >= 40) return "oklch(0.7 0.18 80)";
  return "oklch(0.55 0.22 15)";
}

function getLabel(score: number): string {
  if (score >= 80) return "Thriving";
  if (score >= 60) return "Good";
  if (score >= 40) return "Building";
  return "Starting";
}

const SIZES = {
  sm: { dim: 72, stroke: 6, fontSize: "text-lg", labelSize: "text-[10px]" },
  md: { dim: 96, stroke: 8, fontSize: "text-2xl", labelSize: "text-xs" },
  lg: { dim: 128, stroke: 10, fontSize: "text-3xl", labelSize: "text-sm" },
};

export function GutHealthScore({
  score,
  size = "md",
  label = "Gut Health Score",
}: Props) {
  const { dim, stroke, fontSize, labelSize } = SIZES[size];
  const r = (dim - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const count = useMotionValue(0);
  const displayCount = useTransform(count, (v) => Math.round(v));
  // Use a function transform so the ring arc always maps correctly regardless
  // of the target score value (range-based transform was under-filling the ring)
  const dashOffset = useTransform(count, (v) => circumference * (1 - v / 100));
  const color = getColor(score);

  const prevScore = useRef<number | null>(null);
  useEffect(() => {
    if (prevScore.current === score) return;
    prevScore.current = score;
    const controls = animate(count, score, { duration: 1.2, ease: "easeOut" });
    return controls.stop;
  }, [count, score]);

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative" style={{ width: dim, height: dim }}>
        <svg
          width={dim}
          height={dim}
          viewBox={`0 0 ${dim} ${dim}`}
          className="-rotate-90"
          aria-label={`Gut health score: ${score} out of 100`}
          role="img"
        >
          <circle
            cx={dim / 2}
            cy={dim / 2}
            r={r}
            fill="none"
            stroke="currentColor"
            strokeWidth={stroke}
            className="text-muted"
          />
          <motion.circle
            cx={dim / 2}
            cy={dim / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className={cn("font-black tabular-nums", fontSize)}
            style={{ color }}
          >
            {displayCount}
          </motion.span>
          <span
            className={cn("font-semibold text-muted-foreground", labelSize)}
          >
            {getLabel(score)}
          </span>
        </div>
      </div>
      {label && (
        <span className="text-xs text-center text-muted-foreground">
          {label}
        </span>
      )}
    </div>
  );
}
