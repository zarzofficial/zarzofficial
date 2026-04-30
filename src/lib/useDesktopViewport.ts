import { useSyncExternalStore } from "react";

const desktopQuery = "(min-width: 1024px)";

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};

  const mediaQuery = window.matchMedia(desktopQuery);

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
  return typeof window !== "undefined" && window.matchMedia(desktopQuery).matches;
}

// Keep the prerendered markup stable by defaulting to the mobile layout,
// then opt into desktop-only UI when the media query matches.
export function useDesktopViewport() {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
