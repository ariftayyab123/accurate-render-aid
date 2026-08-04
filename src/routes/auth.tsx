import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, IndianRupee, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { lovable } from "@/integrations/lovable/index";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/lib/auth";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Retained" },
      {
        name: "description",
        content:
          "Create your Retained account or sign in to see what your restaurant keeps from every channel, order and dish.",
      },
      { property: "og:title", content: "Sign in — Retained" },
      {
        property: "og:description",
        content: "Owner accounts for restaurants in India and the UAE.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { session, loading } = useSession();
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [busy, setBusy] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);

  useEffect(() => {
    if (!loading && session) navigate({ to: "/app" });
  }, [loading, session, navigate]);

  const signIn = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) {
      toast.error("Could not sign you in", { description: error.message });
      return;
    }
    navigate({ to: "/app" });
  };

  const signUp = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { full_name: fullName },
      },
    });
    setBusy(false);
    if (error) {
      toast.error("Could not create your account", { description: error.message });
      return;
    }
    if (data.session) {
      navigate({ to: "/onboarding" });
      return;
    }
    setCheckEmail(true);
  };

  const googleSignIn = async () => {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setBusy(false);
      toast.error("Google sign-in failed", { description: String(result.error.message ?? "") });
      return;
    }
    if (result.redirected) return;
    setBusy(false);
    navigate({ to: "/app" });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-6 py-12">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <IndianRupee className="size-4" />
          </span>
          <span className="display text-lg font-semibold">Retained</span>
        </div>
        <h1 className="display mt-6 text-2xl font-semibold tracking-tight">
          {mode === "signin" ? "Welcome back" : "Create your owner account"}
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          One account per restaurant owner. Your setup is saved to your account, so you can open it
          from any device.
        </p>

        <div className="mt-6 rounded-xl border border-border bg-card p-6">
          {checkEmail ? (
            <div className="space-y-3 text-sm">
              <p className="font-medium">Check your email</p>
              <p className="text-muted-foreground">
                We sent a confirmation link to {email}. Open it to activate your account, then come
                back and sign in.
              </p>
              <Button variant="outline" className="w-full" onClick={() => setCheckEmail(false)}>
                Back to sign in
              </Button>
            </div>
          ) : (
            <>
              <Button
                variant="outline"
                className="w-full gap-2"
                onClick={googleSignIn}
                disabled={busy}
              >
                Continue with Google
              </Button>

              <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
                <span className="h-px flex-1 bg-border" />
                or use email
                <span className="h-px flex-1 bg-border" />
              </div>

              <Tabs value={mode} onValueChange={setMode}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="signin">Sign in</TabsTrigger>
                  <TabsTrigger value="signup">Create account</TabsTrigger>
                </TabsList>

                <TabsContent value="signin">
                  <form className="mt-4 space-y-4" onSubmit={signIn}>
                    <div className="space-y-1.5">
                      <Label htmlFor="signin-email">Email</Label>
                      <Input
                        id="signin-email"
                        type="email"
                        required
                        autoComplete="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="signin-password">Password</Label>
                      <Input
                        id="signin-password"
                        type="password"
                        required
                        autoComplete="current-password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                      />
                    </div>
                    <Button type="submit" className="w-full gap-1.5" disabled={busy}>
                      {busy ? <Loader2 className="size-4 animate-spin" /> : null}
                      Sign in
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup">
                  <form className="mt-4 space-y-4" onSubmit={signUp}>
                    <div className="space-y-1.5">
                      <Label htmlFor="signup-name">Your name</Label>
                      <Input
                        id="signup-name"
                        required
                        autoComplete="name"
                        value={fullName}
                        onChange={(event) => setFullName(event.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        required
                        autoComplete="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="signup-password">Password</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        required
                        minLength={8}
                        autoComplete="new-password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">At least 8 characters.</p>
                    </div>
                    <Button type="submit" className="w-full gap-1.5" disabled={busy}>
                      {busy ? <Loader2 className="size-4 animate-spin" /> : null}
                      Create account
                      <ArrowRight className="size-4" />
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </div>
    </div>
  );
}