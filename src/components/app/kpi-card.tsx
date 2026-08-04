import { useState, type ReactNode } from "react";
import { Calculator } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

export interface CalcRow {
  label: string;
  value: string;
  emphasis?: boolean;
  source?: "Imported" | "Estimated" | "Manual" | "Missing";
}

interface KpiCardProps {
  label: string;
  value: string;
  hint?: string;
  caption?: string;
  size?: "default" | "hero";
  tone?: "default" | "positive" | "negative" | "warning";
  formula: string;
  rows: CalcRow[];
  note?: ReactNode;
}

const toneClass = {
  default: "text-foreground",
  positive: "text-positive",
  negative: "text-negative",
  warning: "text-warning",
};

export function KpiCard({
  label,
  value,
  hint,
  caption,
  size = "default",
  tone = "default",
  formula,
  rows,
  note,
}: KpiCardProps) {
  const [open, setOpen] = useState(false);
  const { t } = useI18n();

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "group flex h-full w-full flex-col gap-1 rounded-xl border border-border bg-card p-5 text-left transition-colors hover:border-primary/40 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          size === "hero" && "gap-2 bg-accent p-6",
        )}
      >
        <span
          className={cn(
            "flex items-center gap-1.5 text-sm font-medium text-muted-foreground",
            size === "hero" && "text-base text-accent-foreground",
          )}
        >
          {label}
        </span>
        <span
          className={cn(
            "display text-2xl font-semibold tabular tracking-tight",
            size === "hero" && "text-4xl sm:text-5xl",
            toneClass[tone],
          )}
        >
          {value}
        </span>
        {caption ? (
          <span
            className={cn(
              "text-sm leading-relaxed text-muted-foreground",
              size === "hero" && "max-w-md text-base text-foreground/80",
            )}
          >
            {caption}
          </span>
        ) : null}
        {hint ? <span className="text-xs text-muted-foreground">{hint}</span> : null}
        <span className="mt-auto inline-flex items-center gap-1 pt-3 text-xs font-medium text-primary">
          <Calculator className="size-3.5" />
          {t("kpi.explain")}
        </span>
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>{label}</SheetTitle>
            <SheetDescription>{formula}</SheetDescription>
          </SheetHeader>
          <div className="px-4 pb-6">
            <dl className="divide-y divide-border border-y border-border">
              {rows.map((row) => (
                <div key={row.label} className="flex items-center justify-between gap-4 py-2.5">
                  <dt
                    className={cn(
                      "text-sm",
                      row.emphasis ? "font-medium text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {row.label}
                    {row.source ? (
                      <span className="ml-2 rounded border border-border px-1 text-[10px] uppercase tracking-wide text-muted-foreground">
                        {row.source}
                      </span>
                    ) : null}
                  </dt>
                  <dd
                    className={cn(
                      "text-sm tabular",
                      row.emphasis ? "font-semibold" : "text-foreground",
                    )}
                  >
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
            {note ? <p className="mt-4 text-xs text-muted-foreground">{note}</p> : null}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}