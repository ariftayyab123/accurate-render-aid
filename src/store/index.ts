import { configureStore, createSelector } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";

import authReducer from "./auth-slice";
import workspaceReducer, { type WorkspaceState } from "./workspace-slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    workspace: workspaceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    // Supabase session objects are plain JSON but carry date-ish fields the
    // strict checks flag; the store stays serialisable in practice.
    getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

/* Memoised selectors — components re-render only when their slice changes. */
export const selectWorkspace = (state: RootState): WorkspaceState => state.workspace.data;
export const selectHydrated = (state: RootState) => state.workspace.hydrated;
export const selectSession = (state: RootState) => state.auth.session;
export const selectAuthStatus = (state: RootState) => state.auth.status;

export const selectUser = createSelector(selectSession, (session) => session?.user ?? null);
export const selectMarket = createSelector(selectWorkspace, (workspace) => workspace.market);
export const selectLanguage = createSelector(selectWorkspace, (workspace) => workspace.language);
export const selectChannels = createSelector(selectWorkspace, (workspace) => workspace.channels);
