import { useNavigate } from "@tanstack/react-router";
import { CalendarDays, ChevronDown, LogOut, ShieldCheck, Upload } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { supabase } from "@/integrations/supabase/client";
import { dataConfidence } from "@/lib/metrics";
import { rangeLabel, useDataset, useWorkspace } from "@/lib/workspace";
import { formatPercent } from "@/lib/format";
import { useI18n } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/app/language-switcher";

export function TopBar() {
  const { state, reset } = useWorkspace();
  const orders = useDataset();
  const navigate = useNavigate();
  const confidence = dataConfidence(orders);
  const { t } = useI18n();

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-2 border-b border-border bg-background/95 px-3 backdrop-blur">
      <SidebarTrigger />
      <div className="min-w-0">
        <p className="truncate text-sm font-medium leading-tight">
          {state.restaurantName || t("top.yourRestaurant")}
        </p>
        <p className="truncate text-xs text-muted-foreground">
          {state.outletName || t("top.outlet")} · {state.city || t("top.city")}
        </p>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <LanguageSwitcher />
        <span className="hidden items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground sm:flex">
          <CalendarDays className="size-3.5 text-primary" />
          {rangeLabel(state)}
        </span>

        <span className="hidden items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground lg:flex">
          <ShieldCheck className="size-3.5 text-positive" />
          {formatPercent(confidence, 0)} {t("top.fromUploads")}
        </span>

        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={() => toast(t("top.uploadsSoon"), {
            description: t("top.uploadsSoonBody"),
          })}
        >
          <Upload className="size-3.5" />
          <span className="hidden sm:inline">{t("top.upload")}</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-1.5">
              <span className="flex size-6 items-center justify-center rounded-full bg-secondary text-xs font-medium">
                {(state.email || "U").slice(0, 1).toUpperCase()}
              </span>
              <ChevronDown className="size-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="truncate text-xs font-normal text-muted-foreground">
              {state.email || t("top.demoSession")}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={async () => {
                await supabase.auth.signOut();
                reset();
                navigate({ to: "/auth", replace: true });
              }}
            >
              <LogOut className="size-4" />
              {t("top.signOut")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}