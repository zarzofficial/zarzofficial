import { useEffect, useState } from "react";

// Keep the prerendered markup stable by defaulting to the mobile layout,
// then opt into desktop-only UI after the first client paint.
export function useDesktopViewport() {
  const [isDesktopViewport, setIsDesktopViewport] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setIsDesktopViewport(window.innerWidth >= 1024);
  }, []);

  return isDesktopViewport;
}
