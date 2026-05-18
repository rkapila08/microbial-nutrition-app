"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { env } from "~/env";
import { createClient } from "~/lib/supabase/server";

function buildCallbackUrl(next: string, sessionId?: string): string {
  const params = new URLSearchParams({ next });
  if (sessionId) params.set("sessionId", sessionId);
  return `/auth/callback?${params.toString()}`;
}

async function getOrigin(): Promise<string> {
  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost:3000";
  const forwardedProto = headersList.get("x-forwarded-proto");
  const protocol =
    forwardedProto === "http" || forwardedProto === "https"
      ? forwardedProto
      : env.NODE_ENV === "development"
        ? "http"
        : "https";
  return `${protocol}://${host}`;
}

export async function getOAuthUrl(
  provider: "google" | "apple",
  next: string,
  sessionId?: string,
): Promise<{ url: string | null; error: string | null }> {
  const supabase = await createClient();
  const origin = await getOrigin();
  const redirectTo = `${origin}${buildCallbackUrl(next, sessionId)}`;

  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo, skipBrowserRedirect: true },
    });

    if (error) return { url: null, error: error.message };
    if (!data?.url) {
      return {
        url: null,
        error: `OAuth provider did not return a redirect URL for ${redirectTo}.`,
      };
    }

    return { url: data.url, error: null };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected OAuth error.";
    return { url: null, error: message };
  }
}

export async function signInWithMagicLink(
  email: string,
  next: string,
  sessionId?: string,
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const origin = await getOrigin();
  const redirectTo = `${origin}${buildCallbackUrl(next, sessionId)}`;

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: redirectTo, shouldCreateUser: true },
  });

  if (error) return { error: error.message };
  return {};
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function getUserSessions(): Promise<
  { id: string; code: string; created_at: string; dayCount: number }[]
> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: sessions } = await supabase
    .from("tracker_sessions")
    .select("id, code, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (!sessions?.length) return [];

  const sessionIds = sessions.map((s) => s.id);
  const { data: logs } = await supabase
    .from("daily_logs")
    .select("session_id")
    .in("session_id", sessionIds);

  const countMap = new Map<string, number>();
  for (const log of logs ?? []) {
    countMap.set(log.session_id, (countMap.get(log.session_id) ?? 0) + 1);
  }

  return sessions.map((s) => ({
    id: s.id,
    code: s.code,
    created_at: s.created_at,
    dayCount: countMap.get(s.id) ?? 0,
  }));
}
