"use client";

import type { Variants } from "motion/react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useState } from "react";
import { CLASS_STARTER_KITS } from "~/lib/class-data";
import { GUT_PROFILES } from "~/lib/quiz-data";
import { cn } from "~/lib/utils";

type IslandState = "collapsed" | "home" | "about" | "tips";

const DIMENSIONS: Record<IslandState, { width: string; borderRadius: string }> =
  {
    collapsed: { width: "15rem", borderRadius: "2rem" },
    home: { width: "16rem", borderRadius: "1.75rem" },
    about: { width: "min(24rem, calc(100vw - 2rem))", borderRadius: "1.25rem" },
    tips: { width: "min(22rem, calc(100vw - 2rem))", borderRadius: "1.25rem" },
  };

const contentVariants: Variants = {
  hidden: { opacity: 0, scale: 0.92, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.25, delay: 0.15, ease: "easeOut" as const },
  },
  exit: {
    opacity: 0,
    scale: 0.94,
    filter: "blur(3px)",
    transition: { duration: 0.1, ease: "easeIn" as const },
  },
};

const SAGE_GREEN = "oklch(0.68 0.18 142)";

function Avatar({ size = "sm" }: { size?: "sm" | "lg" }) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-zinc-800",
        size === "lg" ? "h-14 w-14 text-2xl" : "h-8 w-8 text-base",
      )}
    >
      🦠
    </div>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="ml-auto flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-zinc-400 transition-colors hover:text-white"
      aria-label="Back"
    >
      <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M8 2L4 6l4 4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

function CollapsedContent({ onExpand }: { onExpand: () => void }) {
  return (
    <motion.div
      key="collapsed"
      variants={contentVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="flex h-32 flex-col items-center justify-center gap-4 p-6"
    >
      <Avatar size="lg" />
      <button
        type="button"
        onClick={onExpand}
        className="flex h-10 w-10 items-center justify-center rounded-full text-white transition-opacity hover:opacity-80"
        style={{ backgroundColor: SAGE_GREEN }}
        aria-label="Expand profile"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M3 8h10M8 3l5 5-5 5"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </motion.div>
  );
}

function HomeContent({
  profileName,
  onCollapse,
  onAbout,
  onTips,
}: {
  profileName: string;
  onCollapse: () => void;
  onAbout: () => void;
  onTips: () => void;
}) {
  return (
    <motion.div
      key="home"
      variants={contentVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="flex h-14 items-center gap-2 px-3"
    >
      <button
        type="button"
        onClick={onCollapse}
        className="shrink-0 transition-opacity hover:opacity-70"
        aria-label="Collapse"
      >
        <Avatar size="sm" />
      </button>
      <span className="min-w-0 flex-1 truncate text-xs font-semibold text-white">
        {profileName}
      </span>
      <button
        type="button"
        onClick={onAbout}
        className="shrink-0 rounded-full bg-orange-500/80 px-2.5 py-1 text-xs font-medium text-white transition-opacity hover:opacity-80"
      >
        About
      </button>
      <button
        type="button"
        onClick={onTips}
        className="shrink-0 rounded-full bg-blue-500/80 px-2.5 py-1 text-xs font-medium text-white transition-opacity hover:opacity-80"
      >
        Tips
      </button>
    </motion.div>
  );
}

function AboutContent({
  profileName,
  profileCode,
  description,
  tagline,
  onBack,
}: {
  profileName: string;
  profileCode: string;
  description: string;
  tagline: string;
  onBack: () => void;
}) {
  return (
    <motion.div
      key="about"
      variants={contentVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="flex flex-col gap-4 p-5"
    >
      <div className="flex items-center gap-2">
        <Avatar size="sm" />
        <span className="text-sm font-bold text-white">{profileName}</span>
        <span className="rounded bg-zinc-800 px-2 py-0.5 font-mono text-xs text-zinc-400">
          {profileCode}
        </span>
        <BackButton onClick={onBack} />
      </div>
      <div className="border-t border-zinc-800" />
      <p className="text-sm leading-relaxed text-zinc-300">{description}</p>
      <p className="text-xs text-zinc-500">{tagline}</p>
    </motion.div>
  );
}

function TipsContent({
  profileName,
  profileCode,
  items,
  onBack,
}: {
  profileName: string;
  profileCode: string;
  items: Array<{ icon: string; label: string; description: string }>;
  onBack: () => void;
}) {
  return (
    <motion.div
      key="tips"
      variants={contentVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="flex flex-col gap-4 p-5"
    >
      <div className="flex items-center gap-2">
        <Avatar size="sm" />
        <span className="text-sm font-bold text-white">{profileName}</span>
        <span className="rounded bg-zinc-800 px-2 py-0.5 font-mono text-xs text-zinc-400">
          {profileCode}
        </span>
        <BackButton onClick={onBack} />
      </div>
      <div className="border-t border-zinc-800" />
      <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
        Starter Kit
      </p>
      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <motion.button
            key={item.label}
            type="button"
            initial="rest"
            whileHover="hovered"
            className="flex items-center gap-2 rounded-full bg-zinc-800 px-3 py-2 text-left transition-colors hover:bg-zinc-700"
          >
            <span className="text-lg">{item.icon}</span>
            <span className="text-sm font-medium text-white">{item.label}</span>
            <motion.span
              variants={{
                rest: { width: 0, opacity: 0 },
                hovered: {
                  width: "auto",
                  opacity: 1,
                  transition: { duration: 0.2, ease: "easeOut" as const },
                },
              }}
              className="overflow-hidden whitespace-nowrap text-xs text-zinc-400"
            >
              — {item.description}
            </motion.span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

interface MicrobiomeIslandProps {
  profileCode?: string;
  className?: string;
}

export function MicrobiomeIsland({
  profileCode = "DBRH",
  className,
}: MicrobiomeIslandProps) {
  const [state, setState] = useState<IslandState>("collapsed");

  const profile =
    GUT_PROFILES.find((p) => p.code === profileCode) ?? GUT_PROFILES[0];
  const kit =
    CLASS_STARTER_KITS.find((k) => k.code === profileCode) ??
    CLASS_STARTER_KITS[0];

  const { width, borderRadius } = DIMENSIONS[state];

  return (
    <LayoutGroup>
      <motion.div
        layout
        layoutId="island-container"
        transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
        className={cn("bg-zinc-950 shadow-2xl", className)}
        style={{ width, borderRadius }}
      >
        <AnimatePresence mode="wait">
          {state === "collapsed" && (
            <CollapsedContent onExpand={() => setState("home")} />
          )}
          {state === "home" && (
            <HomeContent
              profileName={profile.name}
              onCollapse={() => setState("collapsed")}
              onAbout={() => setState("about")}
              onTips={() => setState("tips")}
            />
          )}
          {state === "about" && (
            <AboutContent
              profileName={profile.name}
              profileCode={profile.code}
              description={profile.description}
              tagline={profile.tagline}
              onBack={() => setState("home")}
            />
          )}
          {state === "tips" && (
            <TipsContent
              profileName={profile.name}
              profileCode={profile.code}
              items={kit.items}
              onBack={() => setState("home")}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </LayoutGroup>
  );
}
