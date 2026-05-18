import { redirect } from "next/navigation";
import { getTrackerSession } from "~/app/actions/tracker";
import { TrackerClient } from "./tracker-client";

interface Props {
  params: Promise<{ code: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { code } = await params;
  return {
    title: `7-Day Journal · ${code.toUpperCase()} — MicroType`,
    description: "Your personal 7-day gut tracking journal.",
  };
}

export default async function TrackerPage({ params }: Props) {
  const { code } = await params;
  const data = await getTrackerSession(code);

  if (!data) redirect("/track");

  return (
    <main className="flex min-h-[calc(100vh-3.5rem)] flex-col">
      <TrackerClient session={data.session} initialLogs={data.logs} />
    </main>
  );
}
