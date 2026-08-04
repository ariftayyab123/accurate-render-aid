import { useEffect, useState } from "react";

import { supabase } from "@/integrations/supabase/client";
import type { MarketCode } from "@/data/markets";
import { DEFAULT_STATE, updateWorkspace, type WorkspaceState } from "@/lib/workspace";

/** Pulls the signed-in owner's saved workspace into the local store. */
export async function loadWorkspaceForUser(userId: string, email: string) {
  const { data, error } = await supabase
    .from("workspaces")
    .select(
      "restaurant_name, city, market, currency, outlet_name, channels, data_mode, onboarding_step, onboarding_complete",
    )
    .eq("owner_id", userId)
    .maybeSingle();

  if (error) throw error;

  if (!data) {
    updateWorkspace({ ...DEFAULT_STATE, signedIn: true, email });
    return false;
  }

  updateWorkspace({
    signedIn: true,
    email,
    restaurantName: data.restaurant_name,
    city: data.city,
    market: data.market as MarketCode,
    currency: data.currency,
    outletName: data.outlet_name,
    channels: data.channels ?? [],
    dataMode: data.data_mode === "empty" ? "empty" : "demo",
    onboardingStep: data.onboarding_step,
    onboardingComplete: data.onboarding_complete,
  });
  return data.onboarding_complete;
}

/** Saves the workspace setup for the signed-in owner. */
export async function saveWorkspaceForUser(userId: string, state: WorkspaceState) {
  const { error } = await supabase.from("workspaces").upsert(
    {
      owner_id: userId,
      restaurant_name: state.restaurantName,
      city: state.city,
      market: state.market,
      currency: state.currency,
      outlet_name: state.outletName,
      channels: state.channels,
      data_mode: state.dataMode,
      onboarding_step: state.onboardingStep,
      onboarding_complete: state.onboardingComplete,
    },
    { onConflict: "owner_id" },
  );
  if (error) throw error;
}

/** Loads the remote workspace once per signed-in session. */
export function useWorkspaceLoader(userId: string | undefined, email: string | undefined) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!userId) {
      setLoaded(false);
      return;
    }
    let active = true;
    loadWorkspaceForUser(userId, email ?? "")
      .catch(() => undefined)
      .finally(() => {
        if (active) setLoaded(true);
      });
    return () => {
      active = false;
    };
  }, [userId, email]);

  return loaded;
}