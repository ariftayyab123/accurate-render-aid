import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";

import { useSession } from "@/lib/auth";

export const Route = createFileRoute("/auth_/callback")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Signing you in — Retained" },
      { name: "description", content: "Completing your sign-in to Retained." },
      { property: "og:title", content: "Signing you in — Retained" },
      { property: "og:description", content: "Completing your sign-in to Retained." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthCallback,
});

/** Where the user wanted to go before signing in; written by the auth page. */
export const NEXT_KEY = "retained.auth.next";

function AuthCallback() {
  const navigate = useNavigate();
  const { session, loading } = useSession();

  useEffect(() => {
    if (loading) return;
    if (!session) {
      navigate({ to: "/auth", replace: true });
      return;
    }
    let next = "";
    try {
      next = window.sessionStorage.getItem(NEXT_KEY) ?? "";
      window.sessionStorage.removeItem(NEXT_KEY);
    } catch {
      next = "";
    }
    if (next.startsWith("/") && !next.startsWith("//")) {
      window.location.replace(next);
      return;
    }
    navigate({ to: "/app", replace: true });
  }, [loading, session, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center gap-2 bg-surface text-sm text-muted-foreground">
      <Loader2 className="size-4 animate-spin" />
      Signing you in…
    </div>
  );
}
