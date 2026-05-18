"use client";

import type { User } from "@supabase/supabase-js";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { signOut } from "~/app/actions/auth";
import { createClient } from "~/lib/supabase/client";
import { cn } from "~/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/quiz", label: "Snapshot Quiz" },
  { href: "/track", label: "7-Day Journal" },
  { href: "/#learn-more", label: "Learn More" },
];

export function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const displayName =
    (user?.user_metadata?.full_name as string | undefined) ?? user?.email ?? "";
  const initial = displayName[0]?.toUpperCase() ?? "?";

  return (
    <nav className="border-b border-border bg-background">
      <div className="mx-auto flex h-14 max-w-3xl items-center gap-6 px-4">
        <Link href="/" className="font-semibold tracking-tight">
          MicroType
        </Link>

        <div className="flex flex-1 gap-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm transition-colors hover:text-foreground",
                pathname === link.href
                  ? "text-foreground"
                  : "text-muted-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
          {user && (
            <Link
              href="/profile"
              className={cn(
                "text-sm transition-colors hover:text-foreground",
                pathname === "/profile"
                  ? "text-foreground"
                  : "text-muted-foreground",
              )}
            >
              Profile
            </Link>
          )}
        </div>

        <div className="shrink-0">
          {user === undefined ? null : user ? (
            <form action={signOut} className="flex items-center gap-2">
              <Link href="/profile">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/15 font-semibold text-xs text-primary transition-colors hover:bg-primary/25">
                  {initial}
                </span>
              </Link>
              <button
                type="submit"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Sign out
              </button>
            </form>
          ) : (
            <Link
              href="/login"
              className={cn(
                "text-sm transition-colors hover:text-foreground",
                pathname === "/login"
                  ? "text-foreground"
                  : "text-muted-foreground",
              )}
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
