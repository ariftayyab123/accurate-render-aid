import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, PlayCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DEMO, money, pct } from "@/lib/marketing-stats";
import type { SiteCopy } from "@/lib/site-copy";

export function Hero({ copy, onDemo }: { copy: SiteCopy; onDemo: () => void }) {
  return (
    <section className="border-b border-border bg-surface">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-24">
        <div>
          <p className="inline-flex rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            {copy.hero.eyebrow}
          </p>
          <h1 className="display mt-6 text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.4rem]">
            {copy.hero.title}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {copy.hero.lead}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" className="h-12 gap-2 rounded-full px-6" asChild>
              <Link to="/auth">
                {copy.hero.primary}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 gap-2 rounded-full px-6"
              onClick={onDemo}
            >
              <PlayCircle className="size-4" />
              {copy.hero.secondary}
            </Button>
          </div>

          <ul className="mt-8 grid gap-2 text-sm text-muted-foreground sm:grid-cols-3">
            {copy.hero.trust.map((line) => (
              <li key={line} className="flex items-start gap-2">
                <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                {line}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-3xl border border-border bg-card p-7 shadow-xl sm:p-9">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {copy.hero.cardTitle}
            </span>
            <span className="rounded-full bg-accent px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-accent-foreground">
              Demo
            </span>
          </div>

          <div className="mt-7 space-y-6">
            <div>
              <div className="text-sm text-muted-foreground">{copy.hero.sold}</div>
              <div className="display text-3xl font-semibold tabular tracking-tight">
                {money(DEMO.sales)}
              </div>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${(DEMO.keptMargin * 100).toFixed(1)}%` }}
              />
            </div>

            <div>
              <div className="text-sm text-muted-foreground">{copy.hero.kept}</div>
              <div className="display text-5xl font-semibold tabular tracking-tight text-primary">
                {money(DEMO.kept)}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {pct(DEMO.keptMargin)} {copy.hero.ofSales}
              </p>
            </div>
          </div>

          <p className="mt-7 border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">
            {copy.hero.cardNote}
          </p>
        </div>
      </div>
    </section>
  );
}
