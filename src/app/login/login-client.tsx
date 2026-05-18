"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { getOAuthUrl, signInWithMagicLink } from "~/app/actions/auth";
import { Button } from "~/components/ui/button";

function LeafSvg({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 7-8 7" />
    </svg>
  );
}

export function LoginClient() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/track";
  const sessionId = searchParams.get("sessionId") ?? undefined;
  const hasError = searchParams.get("error") === "auth_failed";

  const [email, setEmail] = useState("");
  const [magicSent, setMagicSent] = useState(false);
  const [magicError, setMagicError] = useState("");
  const [oauthError, setOauthError] = useState("");
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  async function handleOAuth(provider: "google") {
    setLoadingProvider(provider);
    setOauthError("");
    const result = await getOAuthUrl(provider, next, sessionId);
    if (result.url) {
      window.location.href = result.url;
    } else {
      setLoadingProvider(null);
      setOauthError(
        result.error ??
          "Google sign-in is not available. Check that the provider is enabled in your Supabase project, or use the magic link below.",
      );
    }
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setLoadingProvider("magic");
    setMagicError("");
    const result = await signInWithMagicLink(email, next, sessionId);
    if (result.error) {
      setMagicError(result.error);
      setLoadingProvider(null);
    } else {
      setMagicSent(true);
      setLoadingProvider(null);
    }
  }

  return (
    <div className="w-full">
      <div className="mb-8 flex flex-col items-center gap-2 text-center">
        <div className="flex items-center gap-2 text-primary">
          <LeafSvg className="h-5 w-5" />
          <span className="text-sm font-semibold uppercase tracking-wider">
            MicroType
          </span>
          <LeafSvg className="h-5 w-5 scale-x-[-1]" />
        </div>
        <h1 className="text-2xl font-black tracking-tight">
          Sign in to save your progress
        </h1>
        <p className="text-sm text-muted-foreground">
          Access your journal from any device.
        </p>
      </div>

      {(hasError || oauthError) && (
        <div className="mb-4 rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-center text-sm text-destructive">
          {oauthError || "Sign-in failed. Please try again."}
        </div>
      )}

      <div className="flex flex-col gap-3">
        <Button
          size="lg"
          variant="outline"
          className="w-full rounded-xl"
          disabled={loadingProvider !== null}
          onClick={() => handleOAuth("google")}
        >
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          {loadingProvider === "google"
            ? "Redirecting…"
            : "Continue with Google"}
        </Button>

        <div className="relative flex items-center gap-3 py-1">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted-foreground">or</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        {magicSent ? (
          <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 text-center">
            <p className="font-semibold text-primary">Check your email ✉️</p>
            <p className="mt-1 text-sm text-muted-foreground">
              We sent a sign-in link to{" "}
              <span className="font-medium text-foreground">{email}</span>
            </p>
          </div>
        ) : (
          <form onSubmit={handleMagicLink} className="flex flex-col gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm outline-none ring-primary/30 transition-shadow focus:ring-2"
            />
            {magicError && (
              <p className="text-xs text-destructive">{magicError}</p>
            )}
            <Button
              type="submit"
              variant="outline"
              className="w-full rounded-xl"
              disabled={loadingProvider !== null}
            >
              {loadingProvider === "magic" ? "Sending…" : "Send magic link"}
            </Button>
          </form>
        )}
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Your data is never shared or sold.
      </p>
    </div>
  );
}
