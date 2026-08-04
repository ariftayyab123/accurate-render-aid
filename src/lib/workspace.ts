import { useCallback, useMemo, useSyncExternalStore } from "react";

import { ANALYSIS_PERIOD, DEMO_ORDERS } from "@/data/orders";
import { DEMO_OUTLETS, DEMO_RESTAURANT } from "@/data/menu";
import type { ChannelCode, Order } from "@/data/types";
import type { MarketCode } from "@/data/markets";

export interface WorkspaceState {
  signedIn: boolean;
  email: string;
  onboardingStep: number;
  onboardingComplete: boolean;
  restaurantName: string;
  city: string;
  market: MarketCode;
  currency: string;
  /** UI language; options depend on the market (en/hi in India, en/ar in the UAE). */
  language: "en" | "hi" | "ar";
  outletName: string;
  channels: string[];
  dataMode: "demo" | "empty";
  periodDays: number;
  /** ISO date (yyyy-mm-dd) custom range. When both are set they override periodDays. */
  rangeStart: string;
  rangeEnd: string;
}

export const DEFAULT_STATE: WorkspaceState = {
  signedIn: false,
  email: "",
  onboardingStep: 0,
  onboardingComplete: false,
  restaurantName: "",
  city: "",
  market: "IN",
  currency: "INR",
  language: "en",
  outletName: "",
  channels: ["zomato", "swiggy", "direct"],
  dataMode: "demo",
  periodDays: 30,
  rangeStart: "",
  rangeEnd: "",
};

export const DEMO_STATE: WorkspaceState = {
  signedIn: true,
  email: "uday@udayfoods.in",
  onboardingStep: 4,
  onboardingComplete: true,
  restaurantName: DEMO_RESTAURANT.name,
  city: DEMO_RESTAURANT.city,
  market: "IN",
  currency: "INR",
  language: "en",
  outletName: DEMO_OUTLETS[0]!.name,
  channels: ["zomato", "swiggy", "direct"],
  dataMode: "demo",
  periodDays: 30,
  rangeStart: "",
  rangeEnd: "",
};

const STORAGE_KEY = "rpi.workspace.v1";

let cache: WorkspaceState | null = null;
const listeners = new Set<() => void>();

function read(): WorkspaceState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    return { ...DEFAULT_STATE, ...(JSON.parse(raw) as Partial<WorkspaceState>) };
  } catch {
    return DEFAULT_STATE;
  }
}

function getSnapshot(): WorkspaceState {
  if (!cache) cache = read();
  return cache;
}

function getServerSnapshot(): WorkspaceState {
  return DEFAULT_STATE;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function updateWorkspace(patch: Partial<WorkspaceState>) {
  cache = { ...getSnapshot(), ...patch };
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
  }
  listeners.forEach((listener) => listener());
}

export function resetWorkspace() {
  cache = DEFAULT_STATE;
  if (typeof window !== "undefined") window.localStorage.removeItem(STORAGE_KEY);
  listeners.forEach((listener) => listener());
}

export function loadDemoWorkspace() {
  updateWorkspace(DEMO_STATE);
}

export function useWorkspace() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const update = useCallback((patch: Partial<WorkspaceState>) => updateWorkspace(patch), []);
  return { state, update, reset: resetWorkspace, loadDemo: loadDemoWorkspace };
}

/** True only after client hydration, so stored state is never read during SSR render. */
export function useHydrated() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
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
    const from = clamp(new Date(`${state.rangeStart}T00:00:00Z`).getTime());
    const to = clamp(new Date(`${state.rangeEnd}T23:59:59Z`).getTime());
    if (!Number.isNaN(from) && !Number.isNaN(to) && from <= to) {
      return { from, to, custom: true as const };
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
    return PERIOD_OPTIONS.find((option) => option.days === state.periodDays)?.label ?? "Last 30 days";
  }
  return `${DATE_FMT.format(new Date(range.from))} – ${DATE_FMT.format(new Date(range.to))}`;
}

export function rangeDays(state: WorkspaceState) {
  const range = resolveRange(state);
  return Math.max(1, Math.round((range.to - range.from) / (24 * 60 * 60 * 1000)));
}

/** Orders visible for the active outlet, period and selected channels. */
export function useDataset() {
  const { state } = useWorkspace();
  return useMemo(() => {
    if (state.dataMode === "empty") return [] as Order[];
    const { from, to } = resolveRange(state);
    return DEMO_ORDERS.filter((order) => {
      const time = new Date(order.placedAt).getTime();
      return time >= from && time <= to && state.channels.includes(order.channel as ChannelCode);
    });
  }, [state.dataMode, state.periodDays, state.rangeStart, state.rangeEnd, state.channels]);
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