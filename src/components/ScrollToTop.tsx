import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    if (typeof window === "undefined") return;

    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    return () => {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let frameId = 0;
    let timeoutId = 0;

    if (location.hash) {
      const targetId = decodeURIComponent(location.hash.slice(1));
      const startedAt = window.performance.now();
      let attempts = 0;

      const scrollToTarget = () => {
        const target = document.getElementById(targetId);

        if (target) {
          const lenis = (window as any).__lenis;
          if (lenis?.scrollTo) {
            lenis.scrollTo(target, { immediate: true });
          } else {
            window.scrollTo({
              top: target.getBoundingClientRect().top + window.scrollY,
              left: 0,
              behavior: "auto",
            });
          }
          return;
        }

        attempts += 1;
        if (attempts < 80 && window.performance.now() - startedAt < 5000) {
          timeoutId = window.setTimeout(scrollToTarget, 50);
        }
      };

      frameId = window.requestAnimationFrame(scrollToTarget);
    } else {
      frameId = window.requestAnimationFrame(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      });
    }

    return () => {
      window.cancelAnimationFrame(frameId);
      window.clearTimeout(timeoutId);
    };
  }, [location.hash, location.pathname]);

  return null;
}
