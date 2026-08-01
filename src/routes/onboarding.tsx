import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { CHANNEL_LABELS, type ChannelCode } from "@/data/types";
import { cn } from "@/lib/utils";
import { useWorkspace } from "@/lib/workspace";

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
const CHANNELS: ChannelCode[] = ["zomato", "swiggy", "direct"];

function Onboarding() {
  const { state, update } = useWorkspace();
  const navigate = useNavigate();
  const [step, setStep] = useState(state.onboardingStep);

  useEffect(() => {
    if (!state.signedIn) navigate({ to: "/" });
  }, [state.signedIn, navigate]);

  const toggleChannel = (channel: ChannelCode) => {
    const next = state.channels.includes(channel)
      ? state.channels.filter((entry) => entry !== channel)
      : [...state.channels, channel];
    update({ channels: next });
  };

  const canContinue =
    (step === 0 && state.restaurantName.trim() !== "" && state.city.trim() !== "") ||
    (step === 1 && state.outletName.trim() !== "") ||
    (step === 2 && state.channels.length > 0) ||
    step === 3;

  const goNext = () => {
    if (step === STEPS.length - 1) {
      update({ onboardingComplete: true, onboardingStep: step });
      navigate({ to: "/app" });
      return;
    }
    const next = step + 1;
    setStep(next);
    update({ onboardingStep: next });
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
                  placeholder="Meerut"
                  onChange={(event) => update({ city: event.target.value })}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Currency is fixed to INR and the analysis timezone to Asia/Kolkata in this
                prototype.
              </p>
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
              {CHANNELS.map((channel) => (
                <label
                  key={channel}
                  className="flex cursor-pointer items-center gap-3 rounded-md border border-border px-3 py-2.5 hover:bg-accent/40"
                >
                  <Checkbox
                    checked={state.channels.includes(channel)}
                    onCheckedChange={() => toggleChannel(channel)}
                  />
                  <span className="text-sm font-medium">{CHANNEL_LABELS[channel]}</span>
                </label>
              ))}
              <div className="flex items-center gap-3 rounded-md border border-dashed border-border px-3 py-2.5 text-sm text-muted-foreground">
                POS connector · coming in a later phase
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Choose how this workspace starts. You can switch later.
              </p>
              {(
                [
                  {
                    mode: "demo" as const,
                    title: "Load the synthetic demo dataset",
                    body: "431 orders across July 2026 with settlements and a 10-item menu. Labelled synthetic everywhere.",
                  },
                  {
                    mode: "empty" as const,
                    title: "Start empty",
                    body: "Screens render with zero data until imports arrive in the next phase.",
                  },
                ]
              ).map((option) => (
                <button
                  key={option.mode}
                  type="button"
                  onClick={() => update({ dataMode: option.mode })}
                  className={cn(
                    "flex w-full items-start gap-3 rounded-md border px-3 py-3 text-left transition-colors",
                    state.dataMode === option.mode
                      ? "border-primary bg-accent/50"
                      : "border-border hover:bg-accent/30",
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 flex size-4 items-center justify-center rounded-full border",
                      state.dataMode === option.mode
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-input",
                    )}
                  >
                    {state.dataMode === option.mode ? <Check className="size-3" /> : null}
                  </span>
                  <span>
                    <span className="block text-sm font-medium">{option.title}</span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      {option.body}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <Button variant="ghost" onClick={goBack} disabled={step === 0} className="gap-1.5">
            <ArrowLeft className="size-4" />
            Back
          </Button>
          <Button onClick={goNext} disabled={!canContinue} className="gap-1.5">
            {step === STEPS.length - 1 ? "Open workspace" : "Continue"}
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}