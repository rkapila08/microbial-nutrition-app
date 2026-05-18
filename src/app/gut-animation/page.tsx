import type { Metadata } from "next";
import { GutApp } from "~/components/gut-animation/gut-app";

export const metadata: Metadata = {
  title: "Inside Out — A Short Film About Your Microbiome",
  description:
    "10-scene animated journey through the trillions of microbes that live inside you.",
};

export default function GutAnimationPage() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        overflow: "hidden",
      }}
    >
      <GutApp />
    </div>
  );
}
