import { DEMO, FLOW, money, pct } from "@/lib/marketing-stats";
import { cn } from "@/lib/utils";
import type { SiteCopy } from "@/lib/site-copy";

export function MoneyFlow({ copy }: { copy: SiteCopy }) {
  const slices = FLOW.filter((step) => step.key !== "sales");

  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-20">
        <h2 className="display text-3xl font-semibold tracking-tight sm:text-4xl">
          {copy.flow.title}
        </h2>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
          {copy.flow.lead}
        </p>

        <div className="mt-10 rounded-2xl border border-border bg-card p-6 sm:p-8">
          <div className="flex items-baseline justify-between gap-4">
            <span className="text-sm font-medium text-muted-foreground">
              {copy.flow.labels['sales']}
            </span>
            <span className="display text-2xl font-semibold tabular">{money(DEMO.sales)}</span>
          </div>

          <div className="mt-5 flex h-4 w-full overflow-hidden rounded-full">
            {slices.map((step) => (
              <span
                key={step.key}
                className={cn(
                  "h-full",
                  step.kind === "kept" ? "bg-primary" : "bg-foreground/20",
                  step.key === "commission" && "bg-foreground/45",
                  step.key === "food" && "bg-foreground/30",
                )}
                style={{ width: `${(step.share * 100).toFixed(2)}%` }}
                title={copy.flow.labels[step.key]}
              />
            ))}
          </div>

          <dl className="mt-8 grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
            {slices.map((step) => (
              <div
                key={step.key}
                className={cn(
                  "flex items-baseline justify-between gap-3 border-b border-border pb-3",
                  step.kind === "kept" && "sm:col-span-2 lg:col-span-3 border-b-0 pt-2",
                )}
              >
                <dt
                  className={cn(
                    "text-sm",
                    step.kind === "kept"
                      ? "font-semibold text-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  {copy.flow.labels[step.key]}
                  <span className="ms-2 text-xs text-muted-foreground">{pct(step.share)}</span>
                </dt>
                <dd
                  className={cn(
                    "tabular text-sm font-medium",
                    step.kind === "kept" && "display text-2xl font-semibold text-primary",
                  )}
                >
                  {step.kind === "kept" ? "" : "− "}
                  {money(step.amount)}
                </dd>
              </div>
            ))}
          </dl>

          <p className="mt-6 text-xs leading-relaxed text-muted-foreground">{copy.flow.note}</p>
        </div>
      </div>
    </section>
  );
}
