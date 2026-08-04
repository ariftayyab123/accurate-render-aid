import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Session } from "@supabase/supabase-js";

export type AuthStatus = "loading" | "authenticated" | "signedOut";

export interface AuthSliceState {
  session: Session | null;
  status: AuthStatus;
}

const initialState: AuthSliceState = { session: null, status: "loading" };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    sessionChanged(state, action: PayloadAction<Session | null>) {
      state.session = action.payload;
      state.status = action.payload ? "authenticated" : "signedOut";
    },
  },
});

export const { sessionChanged } = authSlice.actions;

export default authSlice.reducer;
