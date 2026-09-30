"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from "react";

import type { CalculatorSlug, ProducerProfile, ToolProgress } from "@/lib/tools/types";

const PROFILE_KEY = "voomp.producerProfile";
const PROGRESS_KEY = "voomp.toolProgress";

type ProgressMap = Partial<Record<CalculatorSlug, ToolProgress>>;

type State = {
  profile: ProducerProfile;
  progress: ProgressMap;
  /** False until localStorage has been read, so the UI can avoid a hydration flash. */
  ready: boolean;
};

/**
 * localStorage is an external system, so it is modelled as an external store and
 * read through `useSyncExternalStore`. The server snapshot is empty and the
 * hydrated snapshot arrives right after mount — no state updates inside effects,
 * and no hydration mismatch.
 */
const EMPTY: State = { profile: {}, progress: {}, ready: false };

let state: State = EMPTY;
let hydrated = false;
const listeners = new Set<() => void>();

const emit = () => {
  for (const listener of listeners) listener();
};

function read<T extends object>(key: string): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : ({} as T);
  } catch {
    return {} as T;
  }
}

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  state = {
    profile: read<ProducerProfile>(PROFILE_KEY),
    progress: read<ProgressMap>(PROGRESS_KEY),
    ready: true,
  };
}

function persist() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PROFILE_KEY, JSON.stringify(state.profile));
    window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(state.progress));
  } catch {
    // Storage can be unavailable (private mode, quota); the prototype degrades
    // to in-memory state rather than breaking the flow.
  }
}

function commit(next: State) {
  state = next;
  persist();
  emit();
}

function subscribe(listener: () => void) {
  hydrate();
  listeners.add(listener);
  // Hydration may have replaced the snapshot after render; nudge React once.
  listener();
  return () => {
    listeners.delete(listener);
  };
}

const getSnapshot = () => state;
const getServerSnapshot = () => EMPTY;

export function setAnswersGlobal(patch: ProducerProfile) {
  const profile = { ...state.profile };
  for (const [key, value] of Object.entries(patch)) {
    const isEmpty =
      value === undefined || value === "" || (Array.isArray(value) && value.length === 0);
    if (isEmpty) delete profile[key as keyof ProducerProfile];
    else Object.assign(profile, { [key]: value });
  }
  commit({ ...state, profile });
}

type Store = State & {
  setAnswers: (patch: ProducerProfile) => void;
  clearFields: (fields: (keyof ProducerProfile)[]) => void;
  setProgress: (slug: CalculatorSlug, value: ToolProgress) => void;
  reset: () => void;
};

const StoreContext = createContext<Store | null>(null);

export function ToolsProvider({ children }: { children: React.ReactNode }) {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setAnswers = useCallback((patch: ProducerProfile) => setAnswersGlobal(patch), []);

  const clearFields = useCallback((fields: (keyof ProducerProfile)[]) => {
    const profile = { ...state.profile };
    for (const field of fields) delete profile[field];
    commit({ ...state, profile });
  }, []);

  const setProgress = useCallback((slug: CalculatorSlug, value: ToolProgress) => {
    commit({ ...state, progress: { ...state.progress, [slug]: value } });
  }, []);

  const reset = useCallback(() => {
    commit({ profile: {}, progress: {}, ready: true });
  }, []);

  const value = useMemo(
    () => ({ ...snapshot, setAnswers, clearFields, setProgress, reset }),
    [snapshot, setAnswers, clearFields, setProgress, reset]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useTools() {
  const store = useContext(StoreContext);
  if (!store) throw new Error("useTools deve ser usado dentro de <ToolsProvider>");
  return store;
}
