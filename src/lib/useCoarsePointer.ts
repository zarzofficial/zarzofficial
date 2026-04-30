import { useSyncExternalStore } from "react";

const coarsePointerQuery = "(pointer: coarse)";

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};

  const mediaQuery = window.matchMedia(coarsePointerQuery);

  if ("addEventListener" in mediaQuery) {
    mediaQuery.addEventListener("change", callback);
    return () => mediaQuery.removeEventListener("change", callback);
  }

  const legacyMediaQuery = mediaQuery as MediaQueryList & {
    addListener: (listener: () => void) => void;
    removeListener: (listener: () => void) => void;
  };

  legacyMediaQuery.addListener(callback);
  return () => legacyMediaQuery.removeListener(callback);
}

function getSnapshot() {
  return typeof window !== "undefined" && window.matchMedia(coarsePointerQuery).matches;
}

export function useCoarsePointer() {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
