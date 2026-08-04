import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";

import { supabase } from "@/integrations/supabase/client";

export interface SessionState {
  session: Session | null;
  loading: boolean;
}

/** Client-side session state, kept fresh by Supabase auth events. */
export function useSession(): SessionState {
  const [state, setState] = useState<SessionState>({ session: null, loading: true });

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setState({ session, loading: false });
    });
    supabase.auth.getSession().then(({ data: current }) => {
      setState({ session: current.session, loading: false });
    });
    return () => data.subscription.unsubscribe();
  }, []);

  return state;
}