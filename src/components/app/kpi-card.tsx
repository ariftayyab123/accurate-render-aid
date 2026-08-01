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

export function KpiCard({ label, value, hint, tone = "default", formula, rows, note }: KpiCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group flex w-full flex-col gap-1 border-b border-border bg-card px-4 py-3 text-left transition-colors hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:border-b-0 md:border-r md:last:border-r-0"
      >
        <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          {label}
          <Calculator className="size-3 opacity-0 transition-opacity group-hover:opacity-70" />
        </span>
        <span className={cn("text-xl font-semibold tabular tracking-tight", toneClass[tone])}>
          {value}
        </span>
        {hint ? <span className="text-xs text-muted-foreground">{hint}</span> : null}
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