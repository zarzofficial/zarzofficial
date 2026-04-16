import { useEffect, useState } from "react";

export function useCoarsePointer() {
  const [isCoarsePointer, setIsCoarsePointer] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(pointer: coarse)").matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(pointer: coarse)");
    const updateMatch = () => setIsCoarsePointer(mediaQuery.matches);

    updateMatch();

    if ("addEventListener" in mediaQuery) {
      mediaQuery.addEventListener("change", updateMatch);
      return () => mediaQuery.removeEventListener("change", updateMatch);
    }

    const legacyMediaQuery = mediaQuery as MediaQueryList & {
      addListener: (listener: (event: MediaQueryListEvent) => void) => void;
      removeListener: (listener: (event: MediaQueryListEvent) => void) => void;
    };

    legacyMediaQuery.addListener(updateMatch);
    return () => legacyMediaQuery.removeListener(updateMatch);
  }, []);

  return isCoarsePointer;
}
