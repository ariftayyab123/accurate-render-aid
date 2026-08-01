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
import { dataConfidence } from "@/lib/metrics";
import { rangeLabel, useDataset, useWorkspace } from "@/lib/workspace";
import { formatPercent } from "@/lib/format";

export function TopBar() {
  const { state, update, reset } = useWorkspace();
  const orders = useDataset();
  const navigate = useNavigate();
  const confidence = dataConfidence(orders);
  void update;

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-2 border-b border-border bg-background/95 px-3 backdrop-blur">
      <SidebarTrigger />
      <div className="min-w-0">
        <p className="truncate text-sm font-medium leading-tight">
          {state.restaurantName || "Your restaurant"}
        </p>
        <p className="truncate text-xs text-muted-foreground">
          {state.outletName || "Outlet"} · {state.city || "City"}
        </p>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <span className="hidden items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground sm:flex">
          <CalendarDays className="size-3.5 text-primary" />
          {rangeLabel(state)}
        </span>

        <span className="hidden items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground lg:flex">
          <ShieldCheck className="size-3.5 text-positive" />
          {formatPercent(confidence, 0)} from uploads
        </span>

        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={() => toast("Imports arrive in the next phase", {
            description: "Order and settlement uploads are not part of this prototype build.",
          })}
        >
          <Upload className="size-3.5" />
          <span className="hidden sm:inline">Upload</span>
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
              {state.email || "Demo session"}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => {
                reset();
                navigate({ to: "/" });
              }}
            >
              <LogOut className="size-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}