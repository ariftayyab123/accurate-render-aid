import { CalendarDays } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import { DATA_RANGE, PERIOD_OPTIONS, rangeLabel, resolveRange, useWorkspace } from "@/lib/workspace";

/** Friendly period picker: one-tap presets plus an exact from/to range. */
export function DateRangeFilter({ className }: { className?: string }) {
  const { state, update } = useWorkspace();
  const range = resolveRange(state);
  const { t } = useI18n();

  const startValue = state.rangeStart || DATA_RANGE.start;
  const endValue = state.rangeEnd || DATA_RANGE.end;

  return (
    <div className={cn("flex flex-wrap items-center gap-1.5", className)}>
      {PERIOD_OPTIONS.map((option) => {
        const active = !range.custom && state.periodDays === option.days;
        return (
          <Button
            key={option.days}
            type="button"
            size="sm"
            variant={active ? "default" : "outline"}
            className="rounded-full"
            onClick={() => update({ periodDays: option.days, rangeStart: "", rangeEnd: "" })}
          >
            {`${option.days} ${t("range.days")}`}
          </Button>
        );
      })}

      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            size="sm"
            variant={range.custom ? "default" : "outline"}
            className="gap-1.5 rounded-full"
          >
            <CalendarDays className="size-3.5" />
            {range.custom ? rangeLabel(state) : t("range.pickDates")}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-72 space-y-3">
          <div>
            <p className="text-sm font-medium">{t("range.ownDates")}</p>
            <p className="text-xs text-muted-foreground">
              {t("range.available")} {DATA_RANGE.start} – {DATA_RANGE.end}
            </p>
          </div>
          <label className="block space-y-1">
            <span className="text-xs font-medium text-muted-foreground">{t("range.from")}</span>
            <input
              type="date"
              value={startValue}
              min={DATA_RANGE.start}
              max={endValue}
              onChange={(event) =>
                update({ rangeStart: event.target.value, rangeEnd: endValue })
              }
              className="h-9 w-full rounded-md border border-input bg-card px-3 text-sm"
            />
          </label>
          <label className="block space-y-1">
            <span className="text-xs font-medium text-muted-foreground">{t("range.to")}</span>
            <input
              type="date"
              value={endValue}
              min={startValue}
              max={DATA_RANGE.end}
              onChange={(event) =>
                update({ rangeStart: startValue, rangeEnd: event.target.value })
              }
              className="h-9 w-full rounded-md border border-input bg-card px-3 text-sm"
            />
          </label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="w-full"
            onClick={() => update({ rangeStart: "", rangeEnd: "", periodDays: 30 })}
          >
            {t("range.reset")}
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  );
}