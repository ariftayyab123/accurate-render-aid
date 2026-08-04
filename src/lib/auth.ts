import type { Session } from "@supabase/supabase-js";

import { selectAuthStatus, selectSession, selectUser, useAppSelector } from "@/store";

export interface SessionState {
  session: Session | null;
  loading: boolean;
}

/** Session state from the Redux store, fed by the single auth listener. */
export function useSession(): SessionState {
  const session = useAppSelector(selectSession);
  const status = useAppSelector(selectAuthStatus);
  return { session, loading: status === "loading" };
}

export function useAuthUser() {
  return useAppSelector(selectUser);
}
