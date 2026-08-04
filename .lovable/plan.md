# Auth polish, brand mark, and state layer

## 1. Sign-up form usability
- Add a show/hide (eye) toggle to the password field on both Sign in and Create account.
- Add a **Confirm password** field on Create account with a visibility toggle.
- Validate before submit: passwords must match, minimum 8 characters. Inline error under the field, no toast spam.
- Keep the existing "check your email" confirmation state.

## 2. Brand mark
- Replace the rupee icon with a purpose-built "Retained" mark: an abstract glyph that reads as value kept — a filled portion inside a rounded container (a retained share), rendered in the teal brand token.
- Generate the mark as an image asset, use it on the landing page, the auth brand panel and the app sidebar (no more currency-specific icon per market).
- Update the favicon to the new mark and remove the default one.

## 3. Google sign-in
- Re-run the managed social login configuration so the Google provider is definitely active for this project.
- Fix the sign-in call: `redirect_uri` must be a public same-origin URL (`window.location.origin` or a new `/auth/callback` public route), never a protected path. The intended destination (`next`) gets stored separately and applied only after the session is confirmed.
- Add a `/auth/callback` route that waits for the session and then routes to the saved destination (or `/app`).
- Verify end to end in the preview and report the actual provider error if one remains.

## 4. Redux Toolkit for auth + workspace
- Install `@reduxjs/toolkit` and `react-redux`; mount the store provider in the root route.
- `authSlice`: session, user, status (`idle | loading | authenticated | signedOut`). A single `onAuthStateChange` subscriber dispatches into it — one listener for the whole app.
- `workspaceSlice`: the restaurant/outlet/market/currency/channels/language state currently in `src/lib/workspace.ts`, with async thunks for load and save against the backend.
- Memoized selectors (`createSelector`) for derived values so KPI screens don't recompute on unrelated state changes; components read via typed `useAppSelector`.
- `src/lib/auth.ts` and `src/lib/workspace.ts` become thin wrappers over the store so existing call sites keep working, then get migrated.

## 5. Frontend practices pass
- Route-level code splitting stays with TanStack's file routes; heavy calculation modules memoized with `useMemo`/`createSelector`.
- Stable callbacks where they feed memoized children, `React.memo` on the KPI/channel cards.
- Keep data fetching in loaders/React Query rather than effects; Redux holds session/workspace only, not server cache.

## Technical notes
- Files touched: `src/routes/auth.tsx`, new `src/routes/auth.callback.tsx`, `src/routes/index.tsx`, `src/components/app/app-sidebar.tsx`, `src/routes/__root.tsx`, new `src/store/*`, `src/lib/auth.ts`, `src/lib/workspace.ts`, `public/favicon.png`.
- Redux state is client-only; server functions and RLS remain the source of truth.
