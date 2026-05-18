"use client";

import {
  Activity,
  Brain,
  Leaf,
  Moon,
  Shield,
  Sparkles,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { cn } from "~/lib/utils";

const ITEMS = [
  {
    title: "Digestion & Absorption",
    description: "How well you extract nutrients",
    stat: "38 trillion",
    statLabel: "microbial cells in your gut",
    body: "Gut bacteria ferment fibre into vitamins your body can't make alone — including B12 and K2. Their diversity directly determines how much nutrition you extract from every meal.",
    emoji: "🦠",
    gradient: "linear-gradient(145deg, #ecfdf5 0%, #a7f3d0 60%, #6ee7b7 100%)",
    decorHex: "#059669",
    Icon: Leaf,
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-100",
    statColor: "text-emerald-800 bg-emerald-100",
    titleColor: "text-emerald-900",
    descColor: "text-emerald-700",
    bodyColor: "text-emerald-800/80",
    borderColor: "rgba(16,185,129,0.2)",
  },
  {
    title: "Immune Defence",
    description: "70% of immunity lives here",
    stat: "70%",
    statLabel: "of immune cells are gut-based",
    body: "Seventy percent of your immune cells live in the gut, trained daily to tell friend from foe. A balanced microbiome is what separates a system that protects you from one that overreacts.",
    emoji: "🛡️",
    gradient: "linear-gradient(145deg, #eff6ff 0%, #bfdbfe 60%, #93c5fd 100%)",
    decorHex: "#3b82f6",
    Icon: Shield,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-100",
    statColor: "text-blue-800 bg-blue-100",
    titleColor: "text-blue-900",
    descColor: "text-blue-700",
    bodyColor: "text-blue-800/80",
    borderColor: "rgba(59,130,246,0.2)",
  },
  {
    title: "Mood & Mental Health",
    description: "The gut–brain axis",
    stat: "90%",
    statLabel: "of serotonin made in the gut",
    body: "Over 90% of your serotonin is produced in the gut, not the brain. Your microbial balance shapes mood, anxiety, and mental clarity through direct chemical signals to your nervous system.",
    emoji: "🧠",
    gradient: "linear-gradient(145deg, #f5f3ff 0%, #ddd6fe 60%, #c4b5fd 100%)",
    decorHex: "#8b5cf6",
    Icon: Brain,
    iconColor: "text-violet-600",
    iconBg: "bg-violet-100",
    statColor: "text-violet-800 bg-violet-100",
    titleColor: "text-violet-900",
    descColor: "text-violet-700",
    bodyColor: "text-violet-800/80",
    borderColor: "rgba(139,92,246,0.2)",
  },
  {
    title: "Energy & Metabolism",
    description: "Your microbes are your fuel",
    stat: "SCFAs",
    statLabel: "short-chain fatty acids from fibre",
    body: "Gut microbes convert fibre into short-chain fatty acids that fuel your cells directly. An imbalanced microbiome disrupts this process — causing blood sugar swings, fatigue, and stubborn weight gain.",
    emoji: "⚡",
    gradient: "linear-gradient(145deg, #fffbeb 0%, #fde68a 60%, #fcd34d 100%)",
    decorHex: "#d97706",
    Icon: Zap,
    iconColor: "text-amber-600",
    iconBg: "bg-amber-100",
    statColor: "text-amber-800 bg-amber-100",
    titleColor: "text-amber-900",
    descColor: "text-amber-700",
    bodyColor: "text-amber-800/80",
    borderColor: "rgba(245,158,11,0.2)",
  },
  {
    title: "Inflammation Control",
    description: "Your gut lining as a barrier",
    stat: "LGS",
    statLabel: "leaky gut drives systemic inflammation",
    body: "Your gut lining is a one-cell-thick wall separating bacteria from your bloodstream. When it weakens, inflammation spreads silently — surfacing as skin flare-ups, joint pain, and persistent fatigue.",
    emoji: "🌿",
    gradient: "linear-gradient(145deg, #fff1f2 0%, #fecdd3 60%, #fda4af 100%)",
    decorHex: "#f43f5e",
    Icon: Activity,
    iconColor: "text-rose-600",
    iconBg: "bg-rose-100",
    statColor: "text-rose-800 bg-rose-100",
    titleColor: "text-rose-900",
    descColor: "text-rose-700",
    bodyColor: "text-rose-800/80",
    borderColor: "rgba(244,63,94,0.2)",
  },
  {
    title: "Skin Health",
    description: "The gut-skin axis",
    stat: "54%",
    statLabel: "of acne patients show gut dysbiosis",
    body: "Your gut and skin share immune pathways — inflammatory signals from a disrupted microbiome travel directly to the skin. Restoring microbial balance has been clinically shown to reduce acne, eczema, and rosacea from the inside out.",
    emoji: "✨",
    gradient: "linear-gradient(145deg, #fff7ed 0%, #fed7aa 60%, #fdba74 100%)",
    decorHex: "#ea580c",
    Icon: Sparkles,
    iconColor: "text-orange-600",
    iconBg: "bg-orange-100",
    statColor: "text-orange-800 bg-orange-100",
    titleColor: "text-orange-900",
    descColor: "text-orange-700",
    bodyColor: "text-orange-800/80",
    borderColor: "rgba(234,88,12,0.2)",
  },
  {
    title: "Sleep & Hormones",
    description: "Circadian rhythm starts here",
    stat: "24h",
    statLabel: "gut bacteria follow a circadian clock",
    body: "Gut microbes produce melatonin precursors and govern the cortisol rhythm that regulates your sleep cycle. Poor microbial diversity is one of the most underestimated drivers of disrupted sleep and hormonal imbalance.",
    emoji: "🌙",
    gradient: "linear-gradient(145deg, #eef2ff 0%, #c7d2fe 60%, #a5b4fc 100%)",
    decorHex: "#6366f1",
    Icon: Moon,
    iconColor: "text-indigo-600",
    iconBg: "bg-indigo-100",
    statColor: "text-indigo-800 bg-indigo-100",
    titleColor: "text-indigo-900",
    descColor: "text-indigo-700",
    bodyColor: "text-indigo-800/80",
    borderColor: "rgba(99,102,241,0.2)",
  },
];

function MicrobialDecor({ hex }: { hex: string }) {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 280 320"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Large round cell — left */}
      <circle cx="68" cy="88" r="44" fill={hex} fillOpacity="0.13" />
      <circle
        cx="68"
        cy="88"
        r="44"
        fill="none"
        stroke={hex}
        strokeWidth="2"
        strokeOpacity="0.22"
      />
      <circle cx="68" cy="88" r="14" fill={hex} fillOpacity="0.18" />
      {/* Flagella on large cell */}
      <line
        x1="112"
        y1="72"
        x2="132"
        y2="60"
        stroke={hex}
        strokeWidth="1.5"
        strokeOpacity="0.20"
        strokeLinecap="round"
      />
      <line
        x1="112"
        y1="88"
        x2="136"
        y2="88"
        stroke={hex}
        strokeWidth="1.5"
        strokeOpacity="0.17"
        strokeLinecap="round"
      />
      <line
        x1="112"
        y1="104"
        x2="130"
        y2="114"
        stroke={hex}
        strokeWidth="1.5"
        strokeOpacity="0.15"
        strokeLinecap="round"
      />

      {/* Medium round cell — upper right */}
      <circle cx="212" cy="52" r="28" fill={hex} fillOpacity="0.11" />
      <circle
        cx="212"
        cy="52"
        r="28"
        fill="none"
        stroke={hex}
        strokeWidth="1.5"
        strokeOpacity="0.18"
      />
      <circle cx="212" cy="52" r="9" fill={hex} fillOpacity="0.16" />

      {/* Rod bacterium — lower centre, angled */}
      <rect
        x="134"
        y="130"
        width="16"
        height="40"
        rx="8"
        fill={hex}
        fillOpacity="0.13"
        transform="rotate(22 142 150)"
      />
      <rect
        x="134"
        y="130"
        width="16"
        height="40"
        rx="8"
        fill="none"
        stroke={hex}
        strokeWidth="1.5"
        strokeOpacity="0.19"
        transform="rotate(22 142 150)"
      />

      {/* Scattered microbe dots */}
      <circle cx="152" cy="28" r="5.5" fill={hex} fillOpacity="0.17" />
      <circle cx="182" cy="108" r="4" fill={hex} fillOpacity="0.13" />
      <circle cx="38" cy="152" r="6" fill={hex} fillOpacity="0.11" />
      <circle cx="244" cy="128" r="4.5" fill={hex} fillOpacity="0.14" />
      <circle cx="118" cy="164" r="3.5" fill={hex} fillOpacity="0.13" />
      <circle cx="262" cy="72" r="5" fill={hex} fillOpacity="0.10" />
    </svg>
  );
}

export function GutImpactSelector() {
  const [active, setActive] = useState(0);

  return (
    <>
      {/* Desktop: expanding panel selector */}
      <div className="hidden md:flex w-full h-[440px] items-stretch overflow-hidden rounded-2xl border border-border shadow-md">
        {ITEMS.map((item, i) => {
          const { Icon } = item;
          const isActive = i === active;

          return (
            <motion.button
              key={item.title}
              type="button"
              onClick={() => setActive(i)}
              className="relative flex flex-col justify-end overflow-hidden cursor-pointer select-none"
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.45,
                ease: "easeOut",
                delay: 0.06 + i * 0.09,
              }}
              style={{
                flex: isActive ? "7 1 0%" : "1 1 0%",
                minWidth: "42px",
                background: item.gradient,
                transition: "flex 700ms cubic-bezier(0.4,0,0.2,1)",
                borderRight:
                  i < ITEMS.length - 1
                    ? `1px solid ${item.borderColor}`
                    : "none",
              }}
            >
              {/* SVG microbe illustrations */}
              <MicrobialDecor hex={item.decorHex} />

              {/* Emoji — centred in panel; shifts up when active */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                animate={{ paddingBottom: isActive ? 96 : 0 }}
                transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
              >
                <motion.span
                  className="select-none leading-none"
                  animate={{
                    fontSize: isActive ? "68px" : "30px",
                    opacity: isActive ? 0.88 : 0.72,
                    y: isActive ? [0, -7, 0] : 0,
                  }}
                  transition={
                    isActive
                      ? {
                          fontSize: { duration: 0.55, ease: [0.4, 0, 0.2, 1] },
                          opacity: { duration: 0.4 },
                          y: {
                            repeat: Number.POSITIVE_INFINITY,
                            duration: 3,
                            ease: "easeInOut",
                            delay: 0.6,
                          },
                        }
                      : {
                          fontSize: { duration: 0.55, ease: [0.4, 0, 0.2, 1] },
                          opacity: { duration: 0.4 },
                          y: { duration: 0.3 },
                        }
                  }
                  style={{ filter: "drop-shadow(0 3px 10px rgba(0,0,0,0.12))" }}
                >
                  {item.emoji}
                </motion.span>
              </motion.div>

              {/* Bottom fade — active only */}
              {isActive && (
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(255,255,255,0.62) 0%, transparent 55%)",
                  }}
                />
              )}

              {/* Bottom content — fully hidden when inactive so narrow panels stay clean */}
              <div
                className="relative z-10 flex flex-col gap-2 px-3.5 pb-4"
                style={{
                  opacity: isActive ? 1 : 0,
                  pointerEvents: isActive ? "auto" : "none",
                  transition: "opacity 400ms ease",
                }}
              >
                {/* Stat + label */}
                <div
                  className="flex flex-col gap-0.5"
                  style={{
                    transform: isActive ? "translateY(0)" : "translateY(6px)",
                    transition: "transform 400ms ease",
                  }}
                >
                  <span
                    className={cn(
                      "inline-flex self-start rounded-full px-2 py-0.5 text-[11px] font-bold",
                      item.statColor,
                    )}
                  >
                    {item.stat}
                  </span>
                  <span
                    className={cn("text-[10px] font-medium", item.descColor)}
                  >
                    {item.statLabel}
                  </span>
                </div>

                {/* Body text */}
                <div
                  className="overflow-hidden"
                  style={{
                    maxHeight: isActive ? "90px" : "0px",
                    transition: "max-height 500ms ease",
                  }}
                >
                  <p
                    className={cn(
                      "text-[12px] leading-relaxed",
                      item.bodyColor,
                    )}
                  >
                    {item.body}
                  </p>
                </div>

                {/* Icon + label row */}
                <div className="flex items-center gap-2.5">
                  <div
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-full shadow-sm border border-white/60",
                      item.iconBg,
                    )}
                  >
                    <Icon size={16} className={item.iconColor} />
                  </div>
                  <div
                    className="flex min-w-0 flex-col overflow-hidden"
                    style={{
                      opacity: isActive ? 1 : 0,
                      transform: isActive
                        ? "translateX(0)"
                        : "translateX(12px)",
                      transition: "all 500ms ease",
                    }}
                  >
                    <span
                      className={cn(
                        "truncate text-sm font-bold",
                        item.titleColor,
                      )}
                    >
                      {item.title}
                    </span>
                    <span className={cn("truncate text-xs", item.descColor)}>
                      {item.description}
                    </span>
                  </div>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Mobile: stacked cards */}
      <div className="flex flex-col gap-3 md:hidden">
        {ITEMS.map((item, i) => {
          const { Icon } = item;
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.45, ease: "easeOut" }}
              className="flex gap-3.5 rounded-2xl border border-border p-4 shadow-sm overflow-hidden relative"
              style={{ background: item.gradient }}
            >
              {/* SVG microbe watermark */}
              <div className="absolute inset-0 opacity-40 pointer-events-none">
                <MicrobialDecor hex={item.decorHex} />
              </div>

              <div
                className={cn(
                  "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/60",
                  item.iconBg,
                )}
              >
                <Icon size={18} className={item.iconColor} />
              </div>
              <div className="relative z-10 flex flex-col gap-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={cn("font-bold text-sm", item.titleColor)}>
                    {item.title}
                  </span>
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.5 text-[10px] font-bold shrink-0",
                      item.statColor,
                    )}
                  >
                    {item.stat}
                  </span>
                </div>
                <p className={cn("text-xs leading-relaxed", item.bodyColor)}>
                  {item.body}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </>
  );
}
