import { TrackLanding } from "./track-landing";

export const metadata = {
  title: "7-Day Gut Journal — MicroType",
  description:
    "Track your dietary practices over a week for a more accurate gut profile than any single quiz.",
};

export default function TrackPage() {
  return (
    <main className="flex min-h-[calc(100vh-3.5rem)] flex-col">
      <TrackLanding />
    </main>
  );
}
