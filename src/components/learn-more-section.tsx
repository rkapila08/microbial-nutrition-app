"use client";

import { GutApp } from "~/components/gut-animation/gut-app";

export function LearnMoreSection() {
  return (
    <div
      style={{ position: "relative", width: "100%", aspectRatio: "16 / 9" }}
      className="overflow-hidden rounded-2xl border border-border shadow-md"
    >
      <GutApp />
    </div>
  );
}
