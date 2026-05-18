import type { Metadata } from "next";
import { HeroBackground } from "~/components/hero-background";
import { MicrobiomeIsland } from "~/components/microbiome-island";

export const metadata: Metadata = {
  title: "Showcase — MicroType",
};

export default function ShowcasePage() {
  return (
    <main className="relative flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center gap-8 overflow-hidden px-4 py-20">
      <HeroBackground />

      <div className="relative z-10 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Component Showcase
        </p>
        <h1 className="mt-2 text-2xl font-black tracking-tight">
          Microbiome Profile Island
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Click to expand · Navigate between states
        </p>
      </div>

      <div className="relative z-10">
        <MicrobiomeIsland profileCode="DBRH" />
      </div>

      <div className="relative z-10 flex flex-wrap justify-center gap-2">
        {["DBRH", "DBRL", "SIRH", "SIVL", "DIRH", "SBVH"].map((code) => (
          <span
            key={code}
            className="rounded-full border border-border bg-card px-3 py-1 font-mono text-xs text-muted-foreground"
          >
            {code}
          </span>
        ))}
      </div>
    </main>
  );
}
