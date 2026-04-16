import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

export function ScrollToTop() {
  const location = useLocation();

  useLayoutEffect(() => {
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

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;

    const resetScrollPosition = () => {
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      window.scrollTo(0, 0);
    };

    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
    document.body.classList.remove("overflow-hidden");
    document.documentElement.classList.remove("overflow-hidden");

    if (window.location.hash) {
      window.history.replaceState(
        window.history.state,
        document.title,
        `${location.pathname}${location.search}`,
      );
    }

    resetScrollPosition();

    let secondFrame = 0;
    const firstFrame = window.requestAnimationFrame(() => {
      resetScrollPosition();
      secondFrame = window.requestAnimationFrame(() => {
        resetScrollPosition();
      });
    });
    const timeoutId = window.setTimeout(() => {
      resetScrollPosition();
    }, 80);

    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
      window.clearTimeout(timeoutId);
    };
  }, [location.pathname]);

  return null;
}
