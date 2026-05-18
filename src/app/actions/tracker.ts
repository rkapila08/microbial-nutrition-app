"use server";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { env } from "~/env";
import { createClient } from "~/lib/supabase/server";
import type { DailyAnswers, DailyLog } from "~/lib/tracker-data";

function createAnonClient() {
  return createSupabaseClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}

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
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Retry on code collision (extremely unlikely with 8 chars but safe)
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = generateCode();
    let { data, error } = await supabase
      .from("tracker_sessions")
      .insert({ code, user_id: user?.id ?? null })
      .select("id, code")
      .single();

    // Support older databases that don't yet have tracker_sessions.user_id.
    if (error?.code === "PGRST204") {
      ({ data, error } = await supabase
        .from("tracker_sessions")
        .insert({ code })
        .select("id, code")
        .single());
    }

    // Support older RLS where only anon inserts are allowed.
    if (error?.code === "42501") {
      const anon = createAnonClient();
      ({ data, error } = await anon
        .from("tracker_sessions")
        .insert({ code })
        .select("id, code")
        .single());
    }

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

  let { data: session, error } = await supabase
    .from("tracker_sessions")
    .select("id, code, created_at")
    .eq("code", code)
    .single();

  // Support older RLS where authenticated users cannot read anon-owned sessions.
  if (error?.code === "42501") {
    const anon = createAnonClient();
    ({ data: session, error } = await anon
      .from("tracker_sessions")
      .select("id, code, created_at")
      .eq("code", code)
      .single());
  }

  if (error || !session) return null;

  let { data: logs } = await supabase
    .from("daily_logs")
    .select("day_number, responses, logged_at")
    .eq("session_id", session.id)
    .order("day_number", { ascending: true });

  // Match session fallback behavior for old RLS policy sets.
  if (!logs) {
    const anon = createAnonClient();
    ({ data: logs } = await anon
      .from("daily_logs")
      .select("day_number, responses, logged_at")
      .eq("session_id", session.id)
      .order("day_number", { ascending: true }));
  }

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
