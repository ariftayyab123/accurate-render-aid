import { store } from "./index";
import { DEFAULT_STATE, hydrateWorkspace, type WorkspaceState } from "./workspace-slice";

const STORAGE_KEY = "rpi.workspace.v1";

/** Reads the browser copy of the workspace and pushes it into the store once. */
export function hydrateFromStorage() {
  if (typeof window === "undefined" || store.getState().workspace.hydrated) return;
  let stored: Partial<WorkspaceState> = {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) stored = JSON.parse(raw) as Partial<WorkspaceState>;
  } catch {
    stored = {};
  }
  store.dispatch(hydrateWorkspace({ ...DEFAULT_STATE, ...stored }));
}

/** Mirrors workspace changes back to localStorage. */
export function subscribeToStorage() {
  if (typeof window === "undefined") return () => undefined;
  let previous = store.getState().workspace.data;
  return store.subscribe(() => {
    const next = store.getState().workspace.data;
    if (next === previous) return;
    previous = next;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* storage can be unavailable in private modes; state stays in memory */
    }
  });
}
