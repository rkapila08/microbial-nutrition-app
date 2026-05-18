"use client";

import { useEffect, useState } from "react";
import { getOAuthUrl, signInWithMagicLink } from "~/app/actions/auth";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

const DISMISS_KEY = "save-prompt-dismissed";
const DISMISS_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

interface Props {
  variant: "quiz" | "tracker";
  sessionId?: string;
}

export function SaveProgressPrompt({ variant, sessionId }: Props) {
  const [dismissed, setDismissed] = useState(false);
  const [showMagic, setShowMagic] = useState(false);
  const [email, setEmail] = useState("");
  const [magicSent, setMagicSent] = useState(false);
  const [magicError, setMagicError] = useState("");
  const [oauthError, setOauthError] = useState("");
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(DISMISS_KEY);
    if (stored && Date.now() - Number(stored) < DISMISS_TTL_MS) {
      setDismissed(true);
    }
  }, []);

  if (dismissed) return null;

  function handleDismiss() {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setDismissed(true);
  }

  async function handleOAuth(provider: "google" | "apple") {
    setLoadingProvider(provider);
    setOauthError("");
    const next = variant === "quiz" ? "/track" : window.location.pathname;
    const result = await getOAuthUrl(provider, next, sessionId);
    if (result.url) {
      window.location.href = result.url;
    } else {
      setLoadingProvider(null);
      setOauthError(
        result.error ?? "Sign-in unavailable. Try the magic link below.",
      );
    }
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setLoadingProvider("magic");
    setMagicError("");
    const next = variant === "quiz" ? "/track" : window.location.pathname;
    const result = await signInWithMagicLink(email, next, sessionId);
    if (result.error) {
      setMagicError(result.error);
      setLoadingProvider(null);
    } else {
      setMagicSent(true);
      setLoadingProvider(null);
    }
  }

  const icon = variant === "quiz" ? "💾" : "📱";
  const headline =
    variant === "quiz" ? "Save your gut type" : "Continue on any device";
  const subline =
    variant === "quiz"
      ? "Sign in to access your results from any device and track your progress with the 7-day journal."
      : "Sign in so you never need to bookmark this URL again.";

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h3 className="flex items-center gap-2 font-bold">
            <span>{icon}</span>
            {headline}
          </h3>
          <p className="text-sm text-muted-foreground">{subline}</p>
        </div>
        {variant === "tracker" && (
          <button
            type="button"
            onClick={handleDismiss}
            className="mt-0.5 shrink-0 text-muted-foreground/60 transition-colors hover:text-muted-foreground"
            aria-label="Dismiss"
          >
            ✕
          </button>
        )}
      </div>

      {magicSent ? (
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-3 text-center text-sm">
          <span className="font-semibold text-primary">Check your email ✉️</span>
          <p className="mt-0.5 text-muted-foreground">
            We sent a sign-in link to{" "}
            <span className="font-medium text-foreground">{email}</span>
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {oauthError && (
            <p className="text-xs text-destructive">{oauthError}</p>
          )}
          <div className="grid grid-cols-2 gap-2">
            <Button
              size="sm"
              variant="outline"
              className="rounded-xl text-xs"
              disabled={loadingProvider !== null}
              onClick={() => handleOAuth("google")}
            >
              <svg
                className="mr-1.5 h-3.5 w-3.5 shrink-0"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
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
              {loadingProvider === "google" ? "…" : "Google"}
            </Button>

            <Button
              size="sm"
              variant="outline"
              className="rounded-xl text-xs"
              disabled={loadingProvider !== null}
              onClick={() => handleOAuth("apple")}
            >
              <svg
                className="mr-1.5 h-3.5 w-3.5 shrink-0"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
              </svg>
              {loadingProvider === "apple" ? "…" : "Apple"}
            </Button>
          </div>

          {showMagic ? (
            <form onSubmit={handleMagicLink} className="flex flex-col gap-1.5">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none ring-primary/30 transition-shadow focus:ring-2"
              />
              {magicError && (
                <p className="text-xs text-destructive">{magicError}</p>
              )}
              <Button
                type="submit"
                size="sm"
                variant="outline"
                className="w-full rounded-xl text-xs"
                disabled={loadingProvider !== null}
              >
                {loadingProvider === "magic" ? "Sending…" : "Send magic link ✉️"}
              </Button>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setShowMagic(true)}
              className={cn(
                "text-center text-xs text-muted-foreground underline-offset-2 transition-colors hover:text-foreground hover:underline",
              )}
            >
              or use email magic link
            </button>
          )}
        </div>
      )}
    </div>
  );
}
