"use client";

import { useState } from "react";
import { GutHealthScore } from "~/components/gut-health-score";
import type { GutProfile } from "~/lib/quiz-data";
import { cn } from "~/lib/utils";

interface Props {
  profile: GutProfile;
  gutScore?: number;
  levelName?: string;
  sessionCode?: string;
}

export function ShareCard({
  profile,
  gutScore,
  levelName,
  sessionCode,
}: Props) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const url = sessionCode
      ? `${window.location.origin}/track/${sessionCode}`
      : `${window.location.origin}/quiz`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleShare() {
    const text = `I just discovered my gut type: ${profile.code} — ${profile.name}! ${profile.tagline}`;
    const url = sessionCode
      ? `${window.location.origin}/track/${sessionCode}`
      : `${window.location.origin}/quiz`;

    if (navigator.share) {
      await navigator.share({ title: "My Gut Type", text, url });
    } else {
      await handleCopy();
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div
        className={cn(
          "rounded-2xl border-2 border-border p-5 shadow-sm",
          profile.color,
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold uppercase tracking-widest opacity-70">
              My Gut Type
            </span>
            <span className="font-mono text-4xl font-black tracking-widest">
              {profile.code}
            </span>
            <span className="font-bold text-lg">{profile.name}</span>
            <span className="text-sm opacity-80">{profile.tagline}</span>
            {levelName && (
              <span className="mt-1 rounded-full bg-black/10 px-2.5 py-0.5 text-xs font-semibold w-fit dark:bg-white/10">
                {levelName}
              </span>
            )}
          </div>
          {gutScore !== undefined && (
            <GutHealthScore score={gutScore} size="sm" label="" />
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleShare}
          className="flex-1 rounded-xl border border-border bg-card py-2.5 text-sm font-semibold transition-colors hover:bg-muted"
        >
          Share my type
        </button>
        <button
          type="button"
          onClick={handleCopy}
          className="flex-1 rounded-xl border border-border bg-card py-2.5 text-sm font-semibold transition-colors hover:bg-muted"
        >
          {copied ? "Copied! ✓" : "Copy link"}
        </button>
      </div>
    </div>
  );
}
