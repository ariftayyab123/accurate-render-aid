import { useEffect, type ReactNode } from "react";
import { Provider } from "react-redux";

import { supabase } from "@/integrations/supabase/client";
import { store } from "./index";
import { sessionChanged } from "./auth-slice";
import { hydrateFromStorage, subscribeToStorage } from "./persist";

/** Single place where browser state enters the store: storage + auth events. */
function StoreEffects() {
  useEffect(() => {
    hydrateFromStorage();
    const unsubscribeStorage = subscribeToStorage();

    // One auth listener for the whole app; every consumer reads the store.
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      store.dispatch(sessionChanged(session));
    });
    void supabase.auth.getSession().then(({ data: current }) => {
      store.dispatch(sessionChanged(current.session));
    });

    return () => {
      unsubscribeStorage();
      data.subscription.unsubscribe();
    };
  }, []);

  return null;
}

export function AppStoreProvider({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <StoreEffects />
      {children}
    </Provider>
  );
}
