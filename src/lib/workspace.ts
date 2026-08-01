import { useCallback, useMemo, useSyncExternalStore } from "react";

import { ANALYSIS_PERIOD, DEMO_ORDERS } from "@/data/orders";
import { DEMO_OUTLETS, DEMO_RESTAURANT } from "@/data/menu";
import type { ChannelCode, Order } from "@/data/types";

export interface WorkspaceState {
  signedIn: boolean;
  email: string;
  onboardingStep: number;
  onboardingComplete: boolean;
  restaurantName: string;
  city: string;
  outletName: string;
  channels: ChannelCode[];
  dataMode: "demo" | "empty";
  periodDays: number;
}

export const DEFAULT_STATE: WorkspaceState = {
  signedIn: false,
  email: "",
  onboardingStep: 0,
  onboardingComplete: false,
  restaurantName: "",
  city: "",
  outletName: "",
  channels: ["zomato", "swiggy", "direct"],
  dataMode: "demo",
  periodDays: 30,
};

export const DEMO_STATE: WorkspaceState = {
  signedIn: true,
  email: "uday@udayfoods.in",
  onboardingStep: 4,
  onboardingComplete: true,
  restaurantName: DEMO_RESTAURANT.name,
  city: DEMO_RESTAURANT.city,
  outletName: DEMO_OUTLETS[0]!.name,
  channels: ["zomato", "swiggy", "direct"],
  dataMode: "demo",
  periodDays: 30,
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

export function periodStart(days: number) {
  return PERIOD_END - days * 24 * 60 * 60 * 1000;
}

/** Orders visible for the active outlet, period and selected channels. */
export function useDataset() {
  const { state } = useWorkspace();
  return useMemo(() => {
    if (state.dataMode === "empty") return [] as Order[];
    const from = periodStart(state.periodDays);
    return DEMO_ORDERS.filter((order) => {
      const time = new Date(order.placedAt).getTime();
      return time >= from && time <= PERIOD_END && state.channels.includes(order.channel);
    });
  }, [state.dataMode, state.periodDays, state.channels]);
}

export const PERIOD_OPTIONS = [
  { days: 30, label: "Last 30 days" },
  { days: 14, label: "Last 14 days" },
  { days: 7, label: "Last 7 days" },
];