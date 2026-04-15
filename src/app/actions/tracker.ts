"use server";

import { createClient } from "~/lib/supabase/server";
import type { DailyAnswers, DailyLog } from "~/lib/tracker-data";

function generateCode(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from(
    { length: 8 },
    () => chars[Math.floor(Math.random() * chars.length)],
  ).join("");
}

export async function createTrackerSession(): Promise<{
  id: string;
  code: string;
}> {
  const supabase = await createClient();

  // Retry on code collision (extremely unlikely with 8 chars but safe)
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = generateCode();
    const { data, error } = await supabase
      .from("tracker_sessions")
      .insert({ code })
      .select("id, code")
      .single();

    if (!error && data) return data as { id: string; code: string };
    if (error?.code !== "23505") throw error; // only retry on unique violation
  }

  throw new Error("Failed to generate a unique session code.");
}

export async function getTrackerSession(code: string): Promise<{
  session: { id: string; code: string; created_at: string };
  logs: DailyLog[];
} | null> {
  const supabase = await createClient();

  const { data: session, error } = await supabase
    .from("tracker_sessions")
    .select("id, code, created_at")
    .eq("code", code)
    .single();

  if (error || !session) return null;

  const { data: logs } = await supabase
    .from("daily_logs")
    .select("day_number, responses, logged_at")
    .eq("session_id", session.id)
    .order("day_number", { ascending: true });

  return {
    session: session as { id: string; code: string; created_at: string },
    logs: (logs ?? []) as DailyLog[],
  };
}

export async function saveDailyLog(
  sessionId: string,
  dayNumber: number,
  responses: DailyAnswers,
): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase.from("daily_logs").insert({
    session_id: sessionId,
    day_number: dayNumber,
    responses,
  });

  if (error) throw error;
}
