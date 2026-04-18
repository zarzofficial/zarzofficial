import { useEffect, useLayoutEffect, useState } from "react";

const useClientLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

// Keep the prerendered markup stable by defaulting to the mobile layout,
// then opt into desktop-only UI before the first client paint.
export function useDesktopViewport() {
  const [isDesktopViewport, setIsDesktopViewport] = useState(false);

  useClientLayoutEffect(() => {
    if (typeof window === "undefined") return;
    setIsDesktopViewport(window.innerWidth >= 1024);
  }, []);

  return isDesktopViewport;
}
