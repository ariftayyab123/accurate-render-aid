import { useCallback, useEffect, useMemo, useState } from "react";

import { ANALYSIS_PERIOD, DEMO_ORDERS } from "@/data/orders";
import { isFeeTaxRecoverable } from "@/data/markets";
import type { ChannelCode, Order } from "@/data/types";
import { selectChannels, selectHydrated, selectWorkspace, store, useAppSelector } from "@/store";
import {
  DEFAULT_STATE,
  DEMO_STATE,
  loadDemoWorkspace as loadDemoAction,
  patchWorkspace,
  resetWorkspace as resetAction,
  type WorkspaceState,
} from "@/store/workspace-slice";

export type { WorkspaceState };
export { DEFAULT_STATE, DEMO_STATE };

export function updateWorkspace(patch: Partial<WorkspaceState>) {
  store.dispatch(patchWorkspace(patch));
}

export function resetWorkspace() {
  store.dispatch(resetAction());
}

export function loadDemoWorkspace() {
  store.dispatch(loadDemoAction());
}

export function useWorkspace() {
  const state = useAppSelector(selectWorkspace);
  const update = useCallback((patch: Partial<WorkspaceState>) => updateWorkspace(patch), []);
  return { state, update, reset: resetWorkspace, loadDemo: loadDemoWorkspace };
}

/** True only after client hydration, so stored state is never read during SSR render. */
export function useHydrated() {
  const storeHydrated = useAppSelector(selectHydrated);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  // The first client render must match the server render, so gate on mount too.
  return mounted && storeHydrated;
}

const PERIOD_END = new Date(`${ANALYSIS_PERIOD.end}T23:59:59Z`).getTime();
const PERIOD_FIRST = new Date(`${ANALYSIS_PERIOD.start}T00:00:00Z`).getTime();

export const DATA_RANGE = { start: ANALYSIS_PERIOD.start, end: ANALYSIS_PERIOD.end };

export function periodStart(days: number) {
  return PERIOD_END - days * 24 * 60 * 60 * 1000;
}

function clamp(value: number) {
  return Math.min(Math.max(value, PERIOD_FIRST), PERIOD_END);
}

/** Resolved date window for the workspace, whether from a preset or a custom range. */
export function resolveRange(state: WorkspaceState) {
  if (state.rangeStart && state.rangeEnd) {
    const from = new Date(`${state.rangeStart}T00:00:00Z`).getTime();
    const to = new Date(`${state.rangeEnd}T23:59:59Z`).getTime();
    if (!Number.isNaN(from) && !Number.isNaN(to) && from <= to) {
      return { from, to, custom: true as const };
    }
  }

  const isImported = state.dataMode === "imported" && Boolean(state.importedOrders?.length);
  if (isImported) {
    const timestamps = (state.importedOrders || [])
      .map((o) => new Date(o.placedAt).getTime())
      .filter((t) => !Number.isNaN(t));
    if (timestamps.length > 0) {
      const maxTime = Math.max(...timestamps);
      const minTime = Math.min(...timestamps);
      return { from: minTime, to: maxTime, custom: false as const };
    }
  }

  return { from: periodStart(state.periodDays), to: PERIOD_END, custom: false as const };
}

const DATE_FMT = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});

export function rangeLabel(state: WorkspaceState) {
  const range = resolveRange(state);
  if (!range.custom) {
    const days = PERIOD_OPTIONS.find((option) => option.days === state.periodDays)?.days ?? 30;
    const preset = { en: `Last ${days} days`, hi: `पिछले ${days} दिन`, ar: `آخر ${days} يوماً` };
    return preset[state.language] ?? preset.en;
  }
  return `${DATE_FMT.format(new Date(range.from))} – ${DATE_FMT.format(new Date(range.to))}`;
}

export function rangeDays(state: WorkspaceState) {
  const range = resolveRange(state);
  return Math.max(1, Math.round((range.to - range.from) / (24 * 60 * 60 * 1000)));
}

/** Orders visible for the active outlet, period and selected channels. */
export function useDataset() {
  const state = useAppSelector(selectWorkspace);
  const channels = useAppSelector(selectChannels);
  return useMemo(() => {
    if (state.dataMode === "empty") return [] as Order[];

    const isImported = state.dataMode === "imported" && Boolean(state.importedOrders?.length);
    const sourceOrders = isImported ? state.importedOrders! : DEMO_ORDERS;

    if (isImported && !state.rangeStart && !state.rangeEnd) {
      return sourceOrders.filter((order) => channels.includes(order.channel as ChannelCode));
    }

    const { from, to } = resolveRange(state);
    return sourceOrders.filter((order) => {
      const time = new Date(order.placedAt).getTime();
      const inRange = Number.isNaN(time) || (time >= from && time <= to);
      return inRange && channels.includes(order.channel as ChannelCode);
    });
  }, [state.dataMode, state.importedOrders, state.periodDays, state.rangeStart, state.rangeEnd, channels]);
}

export const PERIOD_OPTIONS = [
  { days: 30, label: "Last 30 days" },
  { days: 14, label: "Last 14 days" },
  { days: 7, label: "Last 7 days" },
];

const ANALYSIS_CHANNELS: ChannelCode[] = ["zomato", "swiggy", "direct"];

/** Selected channels the analysis dataset can currently report on. */
export function analysisChannels(state: WorkspaceState): ChannelCode[] {
  return ANALYSIS_CHANNELS.filter((code) => state.channels.includes(code));
}

/** Whether tax charged on platform fees can be reclaimed, per the declared scheme. */
export function feeTaxRecoverable(state: WorkspaceState): boolean {
  return isFeeTaxRecoverable(state.taxScheme);
}
