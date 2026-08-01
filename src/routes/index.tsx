import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, IndianRupee, LineChart, ReceiptText, Wallet } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loadDemoWorkspace, updateWorkspace } from "@/lib/workspace";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Retained — know what your restaurant keeps" },
      {
        name: "description",
        content:
          "Upload menu, order and settlement data and see channel-normalised contribution for every order and dish.",
      },
      { property: "og:title", content: "Retained — know what your restaurant keeps" },
      {
        property: "og:description",
        content:
          "Channel-normalised contribution margin for independent restaurants and cloud kitchens.",
      },
    ],
  }),
  component: Landing,
});

const HIGHLIGHTS = [
  {
    icon: ReceiptText,
    title: "Every deduction, itemised",
    body: "Commission, GST on fees, payment charges, ad allocation and adjustments — separated per order.",
  },
  {
    icon: LineChart,
    title: "Channel-normalised margins",
    body: "Compare what Zomato, Swiggy and your direct channel actually retained, not just what they sold.",
  },
  {
    icon: Wallet,
    title: "Dish-level contribution",
    body: "Find the popular dish with a weak margin before you print the next menu.",
  },
];

function Landing() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const startSetup = (event: React.FormEvent) => {
    event.preventDefault();
    updateWorkspace({ signedIn: true, email: email.trim() || "owner@restaurant.in" });
    navigate({ to: "/onboarding" });
  };

  const openDemo = () => {
    loadDemoWorkspace();
    navigate({ to: "/app" });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-2 px-6">
          <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <IndianRupee className="size-4" />
          </span>
          <span className="text-sm font-semibold">Retained</span>
          <span className="ml-2 rounded border border-border px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
            Prototype
          </span>
          <Button variant="ghost" size="sm" className="ml-auto" onClick={openDemo}>
            View demo workspace
          </Button>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-12 px-6 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:py-20">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            For independent restaurants, cafés and cloud kitchens
          </p>
          <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            How much money did you actually retain from each channel, order and dish?
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Retained turns your menu, order and settlement files into channel-normalised
            contribution margin. Every figure opens its own calculation, and nothing is presented
            as audited profit.
          </p>

          <dl className="mt-10 grid gap-6 sm:grid-cols-3">
            {HIGHLIGHTS.map((highlight) => (
              <div key={highlight.title}>
                <highlight.icon className="size-4 text-primary" />
                <dt className="mt-2 text-sm font-medium">{highlight.title}</dt>
                <dd className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {highlight.body}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-base font-semibold tracking-tight">Create your workspace</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Prototype sign-in. No password, no data leaves this browser.
          </p>
          <form className="mt-5 space-y-4" onSubmit={startSetup}>
            <div className="space-y-1.5">
              <Label htmlFor="email">Work email</Label>
              <Input
                id="email"
                type="email"
                placeholder="owner@restaurant.in"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <Button type="submit" className="w-full gap-1.5">
              Start setup
              <ArrowRight className="size-4" />
            </Button>
          </form>

          <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            or
            <span className="h-px flex-1 bg-border" />
          </div>

          <Button variant="outline" className="w-full" onClick={openDemo}>
            Load demo restaurant
          </Button>
          <p className="mt-3 text-xs text-muted-foreground">
            Uday Foods, Shastri Nagar Meerut — 431 synthetic orders across July 2026. Figures are
            test fixtures, not market data.
          </p>
        </div>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-6 text-xs text-muted-foreground">
          Contribution and margin are estimates based on the data you supply. Retained never labels
          them as net profit.
        </div>
      </footer>
    </div>
  );
}
