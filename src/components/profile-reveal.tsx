"use client";

import { motion } from "motion/react";
import { useEffect, useRef } from "react";
import type { GutProfile } from "~/lib/quiz-data";

// ── Per-profile visual theme ──────────────────────────────────────────

type Theme = {
  bg: string;
  glow: string;
  rgb: readonly [number, number, number];
  accent: string;
};

const THEMES: Record<string, Theme> = {
  DBRH: {
    bg: "linear-gradient(160deg,oklch(0.11 0.07 155),oklch(0.19 0.11 148))",
    glow: "oklch(0.55 0.22 155/0.5)",
    rgb: [52, 211, 153],
    accent: "oklch(0.78 0.22 155)",
  },
  DBRL: {
    bg: "linear-gradient(160deg,oklch(0.11 0.06 185),oklch(0.19 0.1 178))",
    glow: "oklch(0.55 0.18 185/0.5)",
    rgb: [45, 212, 191],
    accent: "oklch(0.78 0.18 185)",
  },
  DBVH: {
    bg: "linear-gradient(160deg,oklch(0.11 0.05 208),oklch(0.18 0.09 200))",
    glow: "oklch(0.55 0.17 205/0.5)",
    rgb: [34, 211, 238],
    accent: "oklch(0.78 0.17 205)",
  },
  DBVL: {
    bg: "linear-gradient(160deg,oklch(0.11 0.05 228),oklch(0.18 0.09 220))",
    glow: "oklch(0.55 0.16 225/0.5)",
    rgb: [56, 189, 248],
    accent: "oklch(0.78 0.16 225)",
  },
  DIRH: {
    bg: "linear-gradient(160deg,oklch(0.12 0.07 125),oklch(0.2 0.12 118))",
    glow: "oklch(0.6 0.22 128/0.5)",
    rgb: [163, 230, 53],
    accent: "oklch(0.8 0.22 128)",
  },
  DIRL: {
    bg: "linear-gradient(160deg,oklch(0.13 0.09 42),oklch(0.21 0.15 35))",
    glow: "oklch(0.7 0.22 50/0.55)",
    rgb: [251, 146, 60],
    accent: "oklch(0.82 0.22 50)",
  },
  DIVH: {
    bg: "linear-gradient(160deg,oklch(0.12 0.08 50),oklch(0.2 0.13 44))",
    glow: "oklch(0.65 0.22 52/0.5)",
    rgb: [249, 115, 22],
    accent: "oklch(0.76 0.22 52)",
  },
  DIVL: {
    bg: "linear-gradient(160deg,oklch(0.13 0.08 68),oklch(0.21 0.13 62))",
    glow: "oklch(0.72 0.2 72/0.5)",
    rgb: [245, 158, 11],
    accent: "oklch(0.82 0.2 72)",
  },
  SBRH: {
    bg: "linear-gradient(160deg,oklch(0.11 0.07 282),oklch(0.19 0.12 275))",
    glow: "oklch(0.6 0.22 282/0.5)",
    rgb: [167, 139, 250],
    accent: "oklch(0.74 0.22 282)",
  },
  SBRL: {
    bg: "linear-gradient(160deg,oklch(0.11 0.07 298),oklch(0.19 0.12 292))",
    glow: "oklch(0.55 0.22 298/0.5)",
    rgb: [192, 132, 252],
    accent: "oklch(0.72 0.22 298)",
  },
  SBVH: {
    bg: "linear-gradient(160deg,oklch(0.11 0.08 318),oklch(0.19 0.13 312))",
    glow: "oklch(0.6 0.24 318/0.5)",
    rgb: [240, 114, 182],
    accent: "oklch(0.75 0.24 318)",
  },
  SBVL: {
    bg: "linear-gradient(160deg,oklch(0.11 0.07 342),oklch(0.19 0.12 336))",
    glow: "oklch(0.65 0.24 345/0.5)",
    rgb: [244, 114, 182],
    accent: "oklch(0.76 0.24 345)",
  },
  SIRH: {
    bg: "linear-gradient(160deg,oklch(0.12 0.09 8),oklch(0.2 0.14 2))",
    glow: "oklch(0.6 0.24 8/0.5)",
    rgb: [251, 113, 133],
    accent: "oklch(0.74 0.24 8)",
  },
  SIRL: {
    bg: "linear-gradient(160deg,oklch(0.12 0.1 22),oklch(0.2 0.15 16))",
    glow: "oklch(0.55 0.26 22/0.5)",
    rgb: [248, 113, 113],
    accent: "oklch(0.72 0.26 22)",
  },
  SIVH: {
    bg: "linear-gradient(160deg,oklch(0.11 0.07 262),oklch(0.19 0.12 255))",
    glow: "oklch(0.6 0.22 262/0.55)",
    rgb: [129, 140, 248],
    accent: "oklch(0.75 0.22 262)",
  },
  SIVL: {
    bg: "linear-gradient(160deg,oklch(0.1 0.04 238),oklch(0.17 0.07 232))",
    glow: "oklch(0.55 0.12 238/0.45)",
    rgb: [148, 163, 184],
    accent: "oklch(0.74 0.12 238)",
  },
};

// ── Particle burst ────────────────────────────────────────────────────

function ParticleBurst({ rgb }: { rgb: readonly [number, number, number] }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.scale(dpr, dpr);

    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const [r, g, b] = rgb;

    const particles = Array.from({ length: 130 }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 9 + 3;
      const size = Math.random() * 4 + 1;
      return {
        x: cx + (Math.random() - 0.5) * 40,
        y: cy + (Math.random() - 0.5) * 40,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size,
        life: 1,
        decay: Math.random() * 0.012 + 0.006,
      };
    });

    let raf = 0;
    const tick = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      let any = false;
      for (const p of particles) {
        if (p.life <= 0) continue;
        any = true;
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.965;
        p.vy *= 0.965;
        p.life -= p.decay;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${p.life * 0.85})`;
        ctx.fill();
      }
      if (any) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [rgb]);

  return <canvas ref={ref} className="pointer-events-none fixed inset-0 z-0" />;
}

// ── Shared animation helpers ──────────────────────────────────────────

const draw = (delay = 0, dur = 1.1) => ({
  initial: { pathLength: 0, opacity: 0 },
  animate: { pathLength: 1, opacity: 1 },
  transition: { duration: dur, delay, ease: "easeInOut" as const },
});

const pop = (delay = 0) => ({
  initial: { scale: 0, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  transition: {
    duration: 0.45,
    delay,
    type: "spring" as const,
    stiffness: 260,
    damping: 18,
  },
});

// ── 16 Illustrations ──────────────────────────────────────────────────

function CultivatorIllustration({ c }: { c: string }) {
  const sw = {
    stroke: c,
    strokeWidth: 4,
    strokeLinecap: "round" as const,
    fill: "none",
  };
  return (
    <svg viewBox="0 0 200 200" width={220} height={220} aria-hidden="true">
      <motion.path d="M100 175 L100 100" {...sw} {...draw(0.1)} />
      <motion.path d="M100 130 Q72 118 48 98" {...sw} {...draw(0.2)} />
      <motion.path d="M100 130 Q128 118 152 98" {...sw} {...draw(0.2)} />
      <motion.path d="M100 112 Q78 102 62 84" {...sw} {...draw(0.35)} />
      <motion.path d="M100 112 Q122 102 138 84" {...sw} {...draw(0.35)} />
      <motion.path d="M100 100 L100 70" {...sw} {...draw(0.45)} />
      {[
        [48, 95],
        [152, 95],
        [62, 81],
        [138, 81],
        [100, 67],
      ].map(([x, y], i) => (
        <motion.circle
          key={`leaf-${x}-${y}`}
          cx={x}
          cy={y}
          r={5}
          fill={c}
          {...pop(0.5 + i * 0.08)}
        />
      ))}
      <motion.path
        d="M100 175 Q82 178 68 188"
        {...sw}
        strokeWidth={3}
        {...draw(0.6)}
      />
      <motion.path
        d="M100 175 L100 190"
        {...sw}
        strokeWidth={3}
        {...draw(0.6)}
      />
      <motion.path
        d="M100 175 Q118 178 132 188"
        {...sw}
        strokeWidth={3}
        {...draw(0.6)}
      />
    </svg>
  );
}

function OptimizerIllustration({ c }: { c: string }) {
  const sw = {
    stroke: c,
    strokeWidth: 3.5,
    strokeLinecap: "round" as const,
    fill: "none",
  };
  return (
    <svg viewBox="0 0 200 200" width={220} height={220} aria-hidden="true">
      <motion.path
        d="M100 22 L158 100 L100 178 L42 100 Z"
        {...sw}
        {...draw(0.1, 1.2)}
      />
      <motion.path
        d="M42 100 L158 100"
        {...sw}
        strokeWidth={2}
        {...draw(0.5)}
      />
      <motion.path
        d="M100 22 L100 178"
        {...sw}
        strokeWidth={2}
        {...draw(0.5)}
      />
      <motion.path
        d="M100 22 L71 61 M100 22 L129 61"
        {...sw}
        strokeWidth={2}
        {...draw(0.7)}
      />
      <motion.path
        d="M100 178 L71 139 M100 178 L129 139"
        {...sw}
        strokeWidth={2}
        {...draw(0.7)}
      />
      {[
        [100, 22],
        [158, 100],
        [100, 178],
        [42, 100],
      ].map(([x, y], i) => (
        <motion.circle
          key={`diamond-${x}-${y}`}
          cx={x}
          cy={y}
          r={5}
          fill={c}
          {...pop(0.3 + i * 0.1)}
        />
      ))}
      <motion.circle
        cx={100}
        cy={100}
        r={12}
        stroke={c}
        strokeWidth={2.5}
        fill="none"
        {...pop(0.8)}
      />
    </svg>
  );
}

function NaturalistIllustration({ c }: { c: string }) {
  const sw = {
    stroke: c,
    strokeWidth: 3.5,
    strokeLinecap: "round" as const,
    fill: "none",
  };
  return (
    <svg viewBox="0 0 200 200" width={220} height={220} aria-hidden="true">
      <motion.path
        d="M100 170 Q38 148 28 82 Q46 28 100 35 Q154 28 172 82 Q162 148 100 170"
        {...sw}
        strokeWidth={4}
        {...draw(0.1, 1.3)}
      />
      <motion.path
        d="M100 170 L100 35"
        {...sw}
        strokeWidth={2.5}
        {...draw(0.6)}
      />
      <motion.path
        d="M100 145 Q72 138 52 118"
        {...sw}
        strokeWidth={2}
        {...draw(0.75)}
      />
      <motion.path
        d="M100 145 Q128 138 148 118"
        {...sw}
        strokeWidth={2}
        {...draw(0.75)}
      />
      <motion.path
        d="M100 120 Q76 112 60 95"
        {...sw}
        strokeWidth={2}
        {...draw(0.85)}
      />
      <motion.path
        d="M100 120 Q124 112 140 95"
        {...sw}
        strokeWidth={2}
        {...draw(0.85)}
      />
      <motion.path
        d="M100 95 Q82 86 72 72"
        {...sw}
        strokeWidth={2}
        {...draw(0.95)}
      />
      <motion.path
        d="M100 95 Q118 86 128 72"
        {...sw}
        strokeWidth={2}
        {...draw(0.95)}
      />
      <motion.circle cx={100} cy={35} r={7} fill={c} {...pop(0.5)} />
    </svg>
  );
}

function WarriorIllustration({ c }: { c: string }) {
  const sw = {
    stroke: c,
    strokeWidth: 4,
    strokeLinecap: "round" as const,
    fill: "none",
  };
  return (
    <svg viewBox="0 0 200 200" width={220} height={220} aria-hidden="true">
      <motion.path
        d="M100 22 L158 48 L158 112 Q158 150 100 178 Q42 150 42 112 L42 48 Z"
        {...sw}
        {...draw(0.1, 1.2)}
      />
      <motion.path
        d="M100 22 L100 178"
        {...sw}
        strokeWidth={2.5}
        {...draw(0.6)}
      />
      <motion.path
        d="M100 55 L115 90 L152 90 L124 110 L134 145 L100 125 L66 145 L76 110 L48 90 L85 90 Z"
        stroke={c}
        strokeWidth={2.5}
        fill={`${c}22`}
        {...draw(0.65, 0.9)}
      />
    </svg>
  );
}

function OvercomerIllustration({ c }: { c: string }) {
  const sw = {
    stroke: c,
    strokeWidth: 4,
    strokeLinecap: "round" as const,
    fill: "none",
  };
  return (
    <svg viewBox="0 0 200 200" width={220} height={220} aria-hidden="true">
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => (
        <motion.line
          key={deg}
          x1={100 + Math.cos((deg * Math.PI) / 180) * 32}
          y1={72 + Math.sin((deg * Math.PI) / 180) * 32}
          x2={100 + Math.cos((deg * Math.PI) / 180) * 52}
          y2={72 + Math.sin((deg * Math.PI) / 180) * 52}
          stroke={c}
          strokeWidth={2.5}
          strokeLinecap="round"
          {...draw(i * 0.04, 0.5)}
        />
      ))}
      <motion.circle
        cx={100}
        cy={72}
        r={22}
        stroke={c}
        strokeWidth={3.5}
        fill="none"
        {...pop(0.55)}
      />
      <motion.path
        d="M28 168 L72 78 L100 118 L128 65 L172 168 Z"
        {...sw}
        strokeWidth={4}
        {...draw(0.3, 1.0)}
      />
      <motion.path
        d="M20 168 L180 168"
        {...sw}
        strokeWidth={3}
        {...draw(0.8)}
      />
    </svg>
  );
}

function PhoenixIllustration({ c }: { c: string }) {
  const sw = {
    stroke: c,
    strokeWidth: 4,
    strokeLinecap: "round" as const,
    fill: "none",
  };
  return (
    <svg viewBox="0 0 200 200" width={240} height={240} aria-hidden="true">
      {/* Wings */}
      <motion.path
        d="M100 108 C 58 92 18 48 28 18 C 45 52 72 76 100 90"
        {...sw}
        strokeWidth={4.5}
        {...draw(0.05, 1.0)}
      />
      <motion.path
        d="M100 108 C 142 92 182 48 172 18 C 155 52 128 76 100 90"
        {...sw}
        strokeWidth={4.5}
        {...draw(0.05, 1.0)}
      />
      {/* Secondary wing feathers */}
      <motion.path
        d="M100 100 C 68 88 38 62 22 38"
        stroke={c}
        strokeWidth={2.5}
        strokeLinecap="round"
        fill="none"
        {...draw(0.35, 0.8)}
      />
      <motion.path
        d="M100 100 C 132 88 162 62 178 38"
        stroke={c}
        strokeWidth={2.5}
        strokeLinecap="round"
        fill="none"
        {...draw(0.35, 0.8)}
      />
      {/* Body */}
      <motion.path
        d="M100 90 L100 148"
        {...sw}
        strokeWidth={4}
        {...draw(0.55)}
      />
      {/* Tail feathers */}
      <motion.path
        d="M100 148 C 84 154 68 164 56 180"
        {...sw}
        strokeWidth={3}
        {...draw(0.65)}
      />
      <motion.path
        d="M100 148 L100 182"
        {...sw}
        strokeWidth={3}
        {...draw(0.65)}
      />
      <motion.path
        d="M100 148 C 116 154 132 164 144 180"
        {...sw}
        strokeWidth={3}
        {...draw(0.65)}
      />
      {/* Head flame */}
      <motion.path
        d="M100 90 C 88 74 87 58 94 46 C 97 40 103 40 106 46 C 113 58 112 74 100 90"
        {...sw}
        strokeWidth={3.5}
        {...draw(0.2, 0.9)}
      />
      {/* Crown flames */}
      <motion.path
        d="M94 52 C 90 44 88 34 92 24"
        stroke={c}
        strokeWidth={2.5}
        strokeLinecap="round"
        fill="none"
        {...draw(0.55, 0.6)}
      />
      <motion.path
        d="M100 48 L100 30"
        stroke={c}
        strokeWidth={2.5}
        strokeLinecap="round"
        fill="none"
        {...draw(0.55, 0.6)}
      />
      <motion.path
        d="M106 52 C 110 44 112 34 108 24"
        stroke={c}
        strokeWidth={2.5}
        strokeLinecap="round"
        fill="none"
        {...draw(0.55, 0.6)}
      />
    </svg>
  );
}

function ExplorerIllustration({ c }: { c: string }) {
  const sw = {
    stroke: c,
    strokeWidth: 3.5,
    strokeLinecap: "round" as const,
    fill: "none",
  };
  return (
    <svg viewBox="0 0 200 200" width={220} height={220} aria-hidden="true">
      <motion.circle
        cx={100}
        cy={100}
        r={78}
        {...sw}
        strokeWidth={3}
        {...draw(0.1, 1.0)}
      />
      <motion.circle cx={100} cy={100} r={14} fill={c} {...pop(0.6)} />
      {/* Cardinal points */}
      <motion.path
        d="M100 22 L110 55 L100 48 L90 55 Z"
        stroke={c}
        strokeWidth={2.5}
        fill={`${c}44`}
        {...draw(0.3, 0.7)}
      />
      <motion.path
        d="M100 178 L110 145 L100 152 L90 145 Z"
        stroke={c}
        strokeWidth={2.5}
        fill="none"
        {...draw(0.3, 0.7)}
      />
      <motion.path
        d="M22 100 L55 90 L48 100 L55 110 Z"
        stroke={c}
        strokeWidth={2.5}
        fill="none"
        {...draw(0.4, 0.7)}
      />
      <motion.path
        d="M178 100 L145 90 L152 100 L145 110 Z"
        stroke={c}
        strokeWidth={2.5}
        fill="none"
        {...draw(0.4, 0.7)}
      />
      {/* Cross lines */}
      <motion.line
        x1={100}
        y1={22}
        x2={100}
        y2={86}
        {...sw}
        strokeWidth={2.5}
        {...draw(0.5)}
      />
      <motion.line
        x1={100}
        y1={114}
        x2={100}
        y2={178}
        {...sw}
        strokeWidth={2.5}
        {...draw(0.5)}
      />
      <motion.line
        x1={22}
        y1={100}
        x2={86}
        y2={100}
        {...sw}
        strokeWidth={2.5}
        {...draw(0.5)}
      />
      <motion.line
        x1={114}
        y1={100}
        x2={178}
        y2={100}
        {...sw}
        strokeWidth={2.5}
        {...draw(0.5)}
      />
      {/* Diagonal ticks */}
      {[45, 135, 225, 315].map((deg, i) => (
        <motion.line
          key={deg}
          x1={100 + Math.cos((deg * Math.PI) / 180) * 55}
          y1={100 + Math.sin((deg * Math.PI) / 180) * 55}
          x2={100 + Math.cos((deg * Math.PI) / 180) * 68}
          y2={100 + Math.sin((deg * Math.PI) / 180) * 68}
          {...sw}
          strokeWidth={2}
          {...draw(0.6 + i * 0.05)}
        />
      ))}
    </svg>
  );
}

function DrifterIllustration({ c }: { c: string }) {
  const sw = { stroke: c, strokeLinecap: "round" as const, fill: "none" };
  return (
    <svg viewBox="0 0 200 200" width={220} height={220} aria-hidden="true">
      <motion.path
        d="M18 68 C 45 48 55 88 82 68 C 109 48 119 88 146 68 C 173 48 183 88 182 68"
        {...sw}
        strokeWidth={4.5}
        {...draw(0.1, 1.0)}
      />
      <motion.path
        d="M18 100 C 45 80 55 120 82 100 C 109 80 119 120 146 100 C 173 80 183 120 182 100"
        {...sw}
        strokeWidth={4.5}
        {...draw(0.25, 1.0)}
      />
      <motion.path
        d="M18 132 C 45 112 55 152 82 132 C 109 112 119 152 146 132 C 173 112 183 152 182 132"
        {...sw}
        strokeWidth={4.5}
        {...draw(0.4, 1.0)}
      />
      {[40, 88, 136].map((x, i) => (
        <motion.circle
          key={x}
          cx={x}
          cy={55}
          r={3.5}
          fill={c}
          {...pop(0.7 + i * 0.1)}
        />
      ))}
    </svg>
  );
}

function SensitiveIllustration({ c }: { c: string }) {
  const sw = {
    stroke: c,
    strokeWidth: 3.5,
    strokeLinecap: "round" as const,
    fill: `${c}18`,
  };
  return (
    <svg viewBox="0 0 200 200" width={220} height={220} aria-hidden="true">
      {/* Upper wings */}
      <motion.path
        d="M100 105 C 68 88 30 55 38 22 C 58 38 80 68 100 92"
        {...sw}
        strokeWidth={4}
        {...draw(0.1, 1.0)}
      />
      <motion.path
        d="M100 105 C 132 88 170 55 162 22 C 142 38 120 68 100 92"
        {...sw}
        strokeWidth={4}
        {...draw(0.1, 1.0)}
      />
      {/* Lower wings */}
      <motion.path
        d="M100 112 C 75 115 42 130 35 158 C 58 148 80 130 100 120"
        {...sw}
        strokeWidth={3.5}
        {...draw(0.3, 0.9)}
      />
      <motion.path
        d="M100 112 C 125 115 158 130 165 158 C 142 148 120 130 100 120"
        {...sw}
        strokeWidth={3.5}
        {...draw(0.3, 0.9)}
      />
      {/* Body */}
      <motion.ellipse
        cx={100}
        cy={110}
        rx={6}
        ry={22}
        stroke={c}
        strokeWidth={3}
        fill={c}
        {...pop(0.55)}
      />
      {/* Antennae */}
      <motion.path
        d="M97 90 C 88 72 78 62 68 52"
        stroke={c}
        strokeWidth={2.5}
        fill="none"
        strokeLinecap="round"
        {...draw(0.5, 0.7)}
      />
      <motion.path
        d="M103 90 C 112 72 122 62 132 52"
        stroke={c}
        strokeWidth={2.5}
        fill="none"
        strokeLinecap="round"
        {...draw(0.5, 0.7)}
      />
      <motion.circle cx={67} cy={50} r={4.5} fill={c} {...pop(0.75)} />
      <motion.circle cx={133} cy={50} r={4.5} fill={c} {...pop(0.75)} />
    </svg>
  );
}

function MinimalistIllustration({ c }: { c: string }) {
  const sw = { stroke: c, fill: "none" };
  return (
    <svg viewBox="0 0 200 200" width={220} height={220} aria-hidden="true">
      <motion.circle
        cx={100}
        cy={100}
        r={74}
        {...sw}
        strokeWidth={3}
        {...draw(0.1, 1.1)}
      />
      <motion.circle
        cx={100}
        cy={100}
        r={48}
        {...sw}
        strokeWidth={2.5}
        strokeDasharray="6 4"
        {...draw(0.35, 1.0)}
      />
      <motion.circle
        cx={100}
        cy={100}
        r={22}
        {...sw}
        strokeWidth={3.5}
        {...draw(0.55, 0.8)}
      />
      <motion.circle cx={100} cy={100} r={7} fill={c} {...pop(0.75)} />
      {/* Orbit dot */}
      <motion.circle cx={100} cy={26} r={6} fill={c} {...pop(0.85)} />
      <motion.circle
        cx={174}
        cy={100}
        r={4}
        stroke={c}
        strokeWidth={2}
        fill="none"
        {...pop(0.9)}
      />
    </svg>
  );
}

function NurturerIllustration({ c }: { c: string }) {
  const _sw = {
    stroke: c,
    strokeWidth: 4,
    strokeLinecap: "round" as const,
    fill: "none",
  };
  return (
    <svg viewBox="0 0 200 200" width={220} height={220} aria-hidden="true">
      {/* Rays */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
        <motion.line
          key={deg}
          x1={100 + Math.cos((deg * Math.PI) / 180) * 52}
          y1={100 + Math.sin((deg * Math.PI) / 180) * 52}
          x2={100 + Math.cos((deg * Math.PI) / 180) * 80}
          y2={100 + Math.sin((deg * Math.PI) / 180) * 80}
          stroke={c}
          strokeWidth={3}
          strokeLinecap="round"
          {...draw(0.6 + i * 0.04, 0.4)}
        />
      ))}
      {/* Heart */}
      <motion.path
        d="M100 128 C 62 108 42 82 52 60 C 58 46 76 42 90 52 C 94 55 98 60 100 64 C 102 60 106 55 110 52 C 124 42 142 46 148 60 C 158 82 138 108 100 128 Z"
        stroke={c}
        strokeWidth={4}
        fill={`${c}28`}
        {...draw(0.15, 1.1)}
      />
    </svg>
  );
}

function SeekerIllustration({ c }: { c: string }) {
  const sw = {
    stroke: c,
    strokeWidth: 3.5,
    strokeLinecap: "round" as const,
    fill: "none",
  };
  return (
    <svg viewBox="0 0 200 200" width={220} height={220} aria-hidden="true">
      {/* 8-point star */}
      {[
        0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5, 180, 202.5, 225, 247.5, 270,
        292.5, 315, 337.5,
      ].map((deg, i) => {
        const r = i % 2 === 0 ? 78 : 45;
        return (
          <motion.line
            key={deg}
            x1={100}
            y1={100}
            x2={100 + Math.cos(((deg - 90) * Math.PI) / 180) * r}
            y2={100 + Math.sin(((deg - 90) * Math.PI) / 180) * r}
            stroke={c}
            strokeWidth={i % 2 === 0 ? 3.5 : 2}
            {...draw(0.1 + i * 0.04, 0.6)}
          />
        );
      })}
      {/* Eye */}
      <motion.ellipse
        cx={100}
        cy={100}
        rx={28}
        ry={18}
        {...sw}
        strokeWidth={3.5}
        {...draw(0.55, 0.8)}
      />
      <motion.circle cx={100} cy={100} r={9} fill={c} {...pop(0.8)} />
      <motion.circle cx={100} cy={100} r={3} fill="black" {...pop(0.9)} />
    </svg>
  );
}

function TransformerIllustration({ c }: { c: string }) {
  const sw = {
    stroke: c,
    strokeWidth: 4,
    strokeLinecap: "round" as const,
    fill: "none",
  };
  return (
    <svg viewBox="0 0 200 200" width={220} height={220} aria-hidden="true">
      {/* Cocoon */}
      <motion.ellipse
        cx={100}
        cy={148}
        rx={22}
        ry={34}
        stroke={c}
        strokeWidth={4}
        fill={`${c}18`}
        {...draw(0.1, 0.8)}
      />
      {/* Horizontal wraps */}
      <motion.path
        d="M78 140 Q100 136 122 140"
        {...sw}
        strokeWidth={2.5}
        {...draw(0.4)}
      />
      <motion.path
        d="M80 152 Q100 148 120 152"
        {...sw}
        strokeWidth={2.5}
        {...draw(0.4)}
      />
      {/* Emerging wings */}
      <motion.path
        d="M100 115 C 72 100 38 65 44 35 C 62 55 84 82 100 102"
        stroke={c}
        strokeWidth={4.5}
        fill={`${c}22`}
        strokeLinecap="round"
        {...draw(0.45, 1.0)}
      />
      <motion.path
        d="M100 115 C 128 100 162 65 156 35 C 138 55 116 82 100 102"
        stroke={c}
        strokeWidth={4.5}
        fill={`${c}22`}
        strokeLinecap="round"
        {...draw(0.45, 1.0)}
      />
      <motion.path
        d="M100 120 C 80 118 55 128 46 148"
        stroke={c}
        strokeWidth={3}
        fill="none"
        strokeLinecap="round"
        {...draw(0.65, 0.8)}
      />
      <motion.path
        d="M100 120 C 120 118 145 128 154 148"
        stroke={c}
        strokeWidth={3}
        fill="none"
        strokeLinecap="round"
        {...draw(0.65, 0.8)}
      />
      {/* Body line */}
      <motion.line
        x1={100}
        y1={102}
        x2={100}
        y2={114}
        stroke={c}
        strokeWidth={4}
        strokeLinecap="round"
        {...draw(0.6, 0.4)}
      />
    </svg>
  );
}

function RebuilderIllustration({ c }: { c: string }) {
  const sw = {
    stroke: c,
    strokeWidth: 4,
    strokeLinecap: "round" as const,
    fill: `${c}18`,
  };
  return (
    <svg viewBox="0 0 200 200" width={220} height={220} aria-hidden="true">
      {/* Base */}
      <motion.path
        d="M24 172 L176 172"
        stroke={c}
        strokeWidth={4}
        strokeLinecap="round"
        fill="none"
        {...draw(0.1, 0.7)}
      />
      {/* Left column */}
      <motion.rect
        x={34}
        y={98}
        width={28}
        height={74}
        rx={3}
        {...sw}
        strokeWidth={3.5}
        initial={{ scaleY: 0, opacity: 0 }}
        animate={{ scaleY: 1, opacity: 1 }}
        style={{ originY: 1, originX: 0 }}
        transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
      />
      {/* Center column (tallest) */}
      <motion.rect
        x={86}
        y={52}
        width={28}
        height={120}
        rx={3}
        {...sw}
        strokeWidth={3.5}
        initial={{ scaleY: 0, opacity: 0 }}
        animate={{ scaleY: 1, opacity: 1 }}
        style={{ originY: 1, originX: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
      />
      {/* Right column */}
      <motion.rect
        x={138}
        y={78}
        width={28}
        height={94}
        rx={3}
        {...sw}
        strokeWidth={3.5}
        initial={{ scaleY: 0, opacity: 0 }}
        animate={{ scaleY: 1, opacity: 1 }}
        style={{ originY: 1, originX: 0 }}
        transition={{ duration: 0.75, delay: 0.35, ease: "easeOut" }}
      />
      {/* Capitals */}
      {[
        [28, 95],
        [80, 49],
        [132, 75],
      ].map(([x, y], i) => (
        <motion.path
          key={`cap-${x}-${y}`}
          d={`M${x} ${y + 8} L${x + 8} ${y} L${x + 32} ${y} L${x + 40} ${y + 8}`}
          stroke={c}
          strokeWidth={3}
          fill="none"
          strokeLinecap="round"
          {...draw(0.6 + i * 0.07, 0.5)}
        />
      ))}
    </svg>
  );
}

function HealerIllustration({ c }: { c: string }) {
  const sw = { stroke: c, fill: "none" };
  return (
    <svg viewBox="0 0 200 200" width={240} height={240} aria-hidden="true">
      {/* Outer halo */}
      <motion.circle
        cx={100}
        cy={100}
        r={78}
        {...sw}
        strokeWidth={3.5}
        {...draw(0.1, 1.1)}
      />
      {/* Inner halo */}
      <motion.circle
        cx={100}
        cy={100}
        r={58}
        {...sw}
        strokeWidth={2.5}
        strokeDasharray="5 3"
        {...draw(0.4, 1.0)}
      />
      {/* 12 rays */}
      {Array.from({ length: 12 }, (_, i) => {
        const deg = i * 30 - 90;
        const rad = (deg * Math.PI) / 180;
        return (
          <motion.line
            key={`ray-${deg}`}
            x1={100 + Math.cos(rad) * 82}
            y1={100 + Math.sin(rad) * 82}
            x2={100 + Math.cos(rad) * 108}
            y2={100 + Math.sin(rad) * 108}
            stroke={c}
            strokeWidth={i % 3 === 0 ? 4 : 2.5}
            strokeLinecap="round"
            {...draw(0.5 + i * 0.04, 0.5)}
          />
        );
      })}
      {/* Outer dots at long rays */}
      {[0, 90, 180, 270].map((deg, i) => {
        const rad = ((deg - 90) * Math.PI) / 180;
        return (
          <motion.circle
            key={deg}
            cx={100 + Math.cos(rad) * 118}
            cy={100 + Math.sin(rad) * 118}
            r={5}
            fill={c}
            {...pop(0.7 + i * 0.08)}
          />
        );
      })}
      {/* Center cross */}
      <motion.line
        x1={100}
        y1={78}
        x2={100}
        y2={122}
        stroke={c}
        strokeWidth={4}
        strokeLinecap="round"
        {...draw(0.65, 0.6)}
      />
      <motion.line
        x1={78}
        y1={100}
        x2={122}
        y2={100}
        stroke={c}
        strokeWidth={4}
        strokeLinecap="round"
        {...draw(0.65, 0.6)}
      />
      <motion.circle cx={100} cy={100} r={10} fill={c} {...pop(0.82)} />
    </svg>
  );
}

function WandererIllustration({ c }: { c: string }) {
  const sw = { stroke: c, strokeLinecap: "round" as const, fill: "none" };
  return (
    <svg viewBox="0 0 200 200" width={220} height={220} aria-hidden="true">
      {/* Crescent */}
      <motion.path
        d="M128 42 C 115 36 100 34 86 38 C 60 46 44 72 48 100 C 52 128 76 148 104 148 C 118 148 130 142 138 132 C 122 130 108 120 100 106 C 88 86 90 62 104 48 C 112 40 120 38 128 42 Z"
        stroke={c}
        strokeWidth={4}
        fill={`${c}28`}
        {...draw(0.1, 1.2)}
      />
      {/* Stars */}
      {[
        [148, 55, 7],
        [162, 90, 5],
        [140, 115, 4],
        [170, 45, 4],
        [155, 135, 3.5],
      ].map(([x, y, r], i) => (
        <motion.circle
          key={`star-${x}-${y}`}
          cx={x}
          cy={y}
          r={r}
          fill={c}
          {...pop(0.55 + i * 0.1)}
        />
      ))}
      {/* Star sparkles */}
      {[
        [148, 55],
        [162, 90],
      ].map(([x, y], si) => (
        <g key={`sparkle-${x}-${y}`}>
          <motion.line
            x1={x - 10}
            y1={y}
            x2={x + 10}
            y2={y}
            {...sw}
            strokeWidth={2}
            {...draw(0.7 + si * 0.1, 0.4)}
          />
          <motion.line
            x1={x}
            y1={y - 10}
            x2={x}
            y2={y + 10}
            {...sw}
            strokeWidth={2}
            {...draw(0.7 + si * 0.1, 0.4)}
          />
        </g>
      ))}
      {/* Dotted path */}
      <motion.path
        d="M 55 158 Q 100 175 145 158"
        {...sw}
        strokeWidth={2.5}
        strokeDasharray="5 4"
        {...draw(0.75, 0.9)}
      />
    </svg>
  );
}

// ── Illustration map ──────────────────────────────────────────────────

const ILLUSTRATIONS: Record<
  string,
  (props: { c: string }) => React.JSX.Element
> = {
  DBRH: CultivatorIllustration,
  DBRL: OptimizerIllustration,
  DBVH: NaturalistIllustration,
  DBVL: WarriorIllustration,
  DIRH: OvercomerIllustration,
  DIRL: PhoenixIllustration,
  DIVH: ExplorerIllustration,
  DIVL: DrifterIllustration,
  SBRH: SensitiveIllustration,
  SBRL: MinimalistIllustration,
  SBVH: NurturerIllustration,
  SBVL: SeekerIllustration,
  SIRH: TransformerIllustration,
  SIRL: RebuilderIllustration,
  SIVH: HealerIllustration,
  SIVL: WandererIllustration,
};

// ── Main reveal component ─────────────────────────────────────────────

export function ProfileReveal({
  profile,
  onContinue,
}: {
  profile: GutProfile;
  onContinue: () => void;
}) {
  const theme = THEMES[profile.code] ?? THEMES.SIVL;
  const Illustration = ILLUSTRATIONS[profile.code] ?? WandererIllustration;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden px-4"
      style={{ background: theme.bg }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      <ParticleBurst rgb={theme.rgb} />

      {/* Glow blob */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 520,
          height: 520,
          background: `radial-gradient(circle, ${theme.glow}, transparent 68%)`,
        }}
        initial={{ scale: 0.3, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.0, ease: "easeOut" }}
      />

      {/* Illustration */}
      <motion.div
        className="relative z-10"
        initial={{ scale: 0.4, opacity: 0, rotate: -8 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{
          duration: 0.75,
          delay: 0.15,
          type: "spring",
          stiffness: 180,
          damping: 20,
        }}
      >
        <Illustration c={theme.accent} />
      </motion.div>

      {/* Code */}
      <motion.div
        className="relative z-10 mt-2 font-mono text-6xl font-black tracking-widest sm:text-7xl"
        style={{ color: theme.accent }}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.75, ease: [0.22, 1, 0.36, 1] }}
      >
        {profile.code}
      </motion.div>

      {/* Name */}
      <motion.h1
        className="relative z-10 mt-3 text-center text-3xl font-black tracking-tight text-white sm:text-4xl"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        {profile.name}
      </motion.h1>

      {/* Tagline */}
      <motion.p
        className="relative z-10 mt-2 max-w-xs text-center text-sm text-white/65"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.1 }}
      >
        {profile.tagline}
      </motion.p>

      {/* Continue button */}
      <motion.button
        type="button"
        onClick={onContinue}
        className="relative z-10 mt-8 rounded-2xl px-10 py-3.5 text-sm font-bold text-black shadow-lg transition-opacity hover:opacity-90 active:scale-95"
        style={{ background: theme.accent }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 1.4 }}
      >
        Discover My Profile →
      </motion.button>
    </motion.div>
  );
}
