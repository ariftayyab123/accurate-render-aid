import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { DEMO_OUTLETS, DEMO_RESTAURANT } from "@/data/menu";
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
  dataMode: "demo" | "empty" | "imported";
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
  ...DEFAULT_STATE,
  signedIn: true,
  email: "uday@udayfoods.in",
  onboardingStep: 4,
  onboardingComplete: true,
  restaurantName: DEMO_RESTAURANT.name,
  city: DEMO_RESTAURANT.city,
  outletName: DEMO_OUTLETS[0]!.name,
};

export interface WorkspaceSliceState {
  data: WorkspaceState;
  /** True once the browser-stored workspace has been merged in. */
  hydrated: boolean;
}

const initialState: WorkspaceSliceState = { data: DEFAULT_STATE, hydrated: false };

const workspaceSlice = createSlice({
  name: "workspace",
  initialState,
  reducers: {
    hydrateWorkspace(state, action: PayloadAction<Partial<WorkspaceState>>) {
      state.data = { ...DEFAULT_STATE, ...action.payload };
      state.hydrated = true;
    },
    patchWorkspace(state, action: PayloadAction<Partial<WorkspaceState>>) {
      state.data = { ...state.data, ...action.payload };
    },
    resetWorkspace(state) {
      state.data = DEFAULT_STATE;
    },
    loadDemoWorkspace(state) {
      state.data = DEMO_STATE;
    },
  },
});

export const { hydrateWorkspace, patchWorkspace, resetWorkspace, loadDemoWorkspace } =
  workspaceSlice.actions;

export default workspaceSlice.reducer;
