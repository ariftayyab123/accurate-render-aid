import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { MARKETS, marketConfig } from "@/data/markets";
import { defaultLanguageForMarket } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { useSession } from "@/lib/auth";
import { saveWorkspaceForUser } from "@/lib/workspace-sync";
import { useHydrated, useWorkspace } from "@/lib/workspace";
import { UploadZone } from "@/components/app/upload-zone";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Set up your restaurant — Retained" },
      {
        name: "description",
        content:
          "Add your restaurant, outlet and selling channels, then load data to generate your first profitability view.",
      },
      { property: "og:title", content: "Set up your restaurant — Retained" },
      {
        property: "og:description",
        content: "Four short steps from account to first contribution-margin analysis.",
      },
    ],
  }),
  component: Onboarding,
});

const STEPS = ["Restaurant", "Outlet", "Channels", "Data"];

function Onboarding() {
  const { state, update } = useWorkspace();
  const hydrated = useHydrated();
  const navigate = useNavigate();
  const { session, loading } = useSession();
  const [step, setStep] = useState(state.onboardingStep);
  const [saving, setSaving] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const market = marketConfig(state.market);

  useEffect(() => {
    if (hydrated && !loading && !session) navigate({ to: "/auth" });
  }, [hydrated, loading, session, navigate]);

  useEffect(() => {
    if (hydrated) setStep(state.onboardingStep);
    // Only sync once the stored step is available after hydration.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  const toggleChannel = (channel: string) => {
    const next = state.channels.includes(channel)
      ? state.channels.filter((entry) => entry !== channel)
      : [...state.channels, channel];
    update({ channels: next });
  };

  const selectMarket = (code: string) => {
    const config = marketConfig(code);
    update({
      market: config.code,
      currency: config.currency,
      language: defaultLanguageForMarket(config.code),
      channels: config.channels.map((channel) => channel.code),
      dataMode: config.demoReady ? state.dataMode : "empty",
    });
  };

  const canContinue =
    (step === 0 && state.restaurantName.trim() !== "" && state.city.trim() !== "") ||
    (step === 1 && state.outletName.trim() !== "") ||
    (step === 2 && state.channels.length > 0) ||
    step === 3;

  const goNext = async () => {
    const userId = session?.user.id;
    if (step === STEPS.length - 1) {
      const finished = { ...state, onboardingComplete: true, onboardingStep: step };
      update({ onboardingComplete: true, onboardingStep: step });
      if (userId) {
        setSaving(true);
        try {
          await saveWorkspaceForUser(userId, finished);
        } finally {
          setSaving(false);
        }
      }
      navigate({ to: "/app" });
      return;
    }
    const next = step + 1;
    setStep(next);
    update({ onboardingStep: next });
    if (userId) void saveWorkspaceForUser(userId, { ...state, onboardingStep: next });
  };

  const goBack = () => {
    const previous = Math.max(0, step - 1);
    setStep(previous);
    update({ onboardingStep: previous });
  };

  return (
    <div className="min-h-screen bg-surface">
      <div className="mx-auto max-w-2xl px-6 py-12">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          Step {step + 1} of {STEPS.length} · {STEPS[step]}
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">Set up your workspace</h1>
        <Progress value={((step + 1) / STEPS.length) * 100} className="mt-4 h-1" />

        <div className="mt-8 rounded-lg border border-border bg-card p-6">
          {step === 0 ? (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="restaurant">Restaurant name</Label>
                <Input
                  id="restaurant"
                  value={state.restaurantName}
                  placeholder="Uday Foods"
                  onChange={(event) => update({ restaurantName: event.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={state.city}
                  placeholder={market.cityPlaceholder}
                  onChange={(event) => update({ city: event.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Where do you operate?</Label>
                <div className="grid gap-2 sm:grid-cols-2">
                  {MARKETS.map((option) => (
                    <button
                      key={option.code}
                      type="button"
                      onClick={() => selectMarket(option.code)}
                      className={cn(
                        "rounded-md border px-3 py-2.5 text-left transition-colors",
                        state.market === option.code
                          ? "border-primary bg-accent/50"
                          : "border-border hover:bg-accent/30",
                      )}
                    >
                      <span className="block text-sm font-medium">{option.label}</span>
                      <span className="mt-0.5 block text-xs text-muted-foreground">
                        {option.currencyLabel}
                      </span>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  This sets your currency and the delivery apps we ask about next.
                </p>
              </div>
            </div>
          ) : null}

          {step === 1 ? (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="outlet">Outlet name</Label>
                <Input
                  id="outlet"
                  value={state.outletName}
                  placeholder="Shastri Nagar"
                  onChange={(event) => update({ outletName: event.target.value })}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Additional outlets can be added later; analysis stays outlet-aware from the start.
              </p>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Selected channels decide which imports and mappings you will be asked for.
              </p>
              {market.channels.map((channel) => (
                <label
                  key={channel.code}
                  className="flex cursor-pointer items-center gap-3 rounded-md border border-border px-3 py-2.5 hover:bg-accent/40"
                >
                  <Checkbox
                    checked={state.channels.includes(channel.code)}
                    onCheckedChange={() => toggleChannel(channel.code)}
                  />
                  <span className="text-sm font-medium">{channel.label}</span>
                </label>
              ))}
              <div className="flex items-center gap-3 rounded-md border border-dashed border-border px-3 py-2.5 text-sm text-muted-foreground">
                POS connector · coming in a later phase
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="space-y-6">
              <div>
                <h3 className="font-medium">Upload your first settlement</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Drop a Zomato or Swiggy settlement CSV here. We'll parse it instantly to show your real payout vs the stated total.
                </p>
              </div>

              {uploadedFile ? (
                <div className="rounded-md border border-primary bg-primary/5 p-4 text-center">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check className="h-5 w-5" />
                  </div>
                  <h4 className="mt-3 font-medium text-primary">File parsed successfully!</h4>
                  <p className="mt-1 text-sm text-muted-foreground">{uploadedFile.name}</p>
                  <p className="mt-3 text-xs text-muted-foreground">
                    In a full implementation, the live reconciliation summary (net payout vs. platform stated) would appear here.
                  </p>
                </div>
              ) : (
                <UploadZone
                  title="Upload Settlement CSV"
                  description="Supports standard Zomato & Swiggy portal exports"
                  onFileSelect={async (file) => {
                    setSaving(true);
                    try {
                      const text = await file.text();
                      const isSwiggy = file.name.toLowerCase().includes("swiggy");
                      
                      let result;
                      if (isSwiggy) {
                        const { parseSwiggySettlement } = await import("@/lib/parsers/swiggy");
                        result = await parseSwiggySettlement(text);
                      } else {
                        const { parseZomatoSettlement } = await import("@/lib/parsers/zomato");
                        result = await parseZomatoSettlement(text);
                      }
                      
                      console.log("Onboarding parsed:", result);
                      setUploadedFile(file);
                      update({ dataMode: "imported" });
                    } catch (e: any) {
                      console.error("Parse failed", e);
                      alert(`Failed to parse file: ${e.message}`);
                    } finally {
                      setSaving(false);
                    }
                  }}
                />
              )}

              <div className="flex items-center gap-4 py-2">
                <div className="h-px flex-1 bg-border"></div>
                <span className="text-xs text-muted-foreground">OR</span>
                <div className="h-px flex-1 bg-border"></div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setUploadedFile(null);
                  update({ dataMode: "demo" });
                  goNext();
                }}
                className="w-full text-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Skip for now (use demo data)
              </button>
            </div>
          ) : null}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <Button variant="ghost" onClick={goBack} disabled={step === 0} className="gap-1.5">
            <ArrowLeft className="size-4" />
            Back
          </Button>
          <Button onClick={goNext} disabled={!canContinue || saving} className="gap-1.5">
            {step === STEPS.length - 1 ? "Open workspace" : "Continue"}
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}