import { redirect } from "next/navigation";
import { getUserSessions } from "~/app/actions/auth";
import { getLeaderboard, getUserProgress } from "~/app/actions/gamification";
import { ProfileClient } from "./profile-client";

export const metadata = {
  title: "My Profile — MicroType",
  description: "Your gut health journey: XP, badges, missions, and history.",
};

export default async function ProfilePage() {
  const [progress, leaderboard, sessions] = await Promise.all([
    getUserProgress(),
    getLeaderboard(),
    getUserSessions(),
  ]);

  if (!progress) {
    redirect("/login?next=/profile");
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <ProfileClient
        progress={progress}
        leaderboard={leaderboard}
        sessions={sessions}
      />
    </main>
  );
}
