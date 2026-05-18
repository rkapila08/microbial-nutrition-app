import { Suspense } from "react";
import { LoginClient } from "./login-client";

export const metadata = { title: "Sign in — MicroType" };

export default function LoginPage() {
  return (
    <main className="relative flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center overflow-hidden px-4 py-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hero-botanical"
      />
      <div className="relative w-full max-w-sm rounded-2xl border border-border bg-card/90 p-8 shadow-lg backdrop-blur-sm">
        <Suspense>
          <LoginClient />
        </Suspense>
      </div>
    </main>
  );
}
