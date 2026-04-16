import { useEffect, type RefObject } from "react";
import { useCoarsePointer } from "./useCoarsePointer";

type AxisLock = "x" | "y" | null;

export function useHorizontalTouchScroll(containerRef: RefObject<HTMLElement | null>) {
  const isCoarsePointer = useCoarsePointer();

  useEffect(() => {
    const railElement = containerRef.current;
    if (!isCoarsePointer || !railElement) return;

    const touchState = {
      startX: 0,
      startY: 0,
      lastX: 0,
      axisLock: null as AxisLock,
      suppressClick: false,
    };

    const resetTouchState = () => {
      touchState.axisLock = null;
      railElement.removeAttribute("data-touch-axis");
    };

    const handleTouchStart = (event: TouchEvent) => {
      if (event.touches.length !== 1) {
        resetTouchState();
        touchState.suppressClick = false;
        return;
      }

      const touch = event.touches[0];
      touchState.startX = touch.clientX;
      touchState.startY = touch.clientY;
      touchState.lastX = touch.clientX;
      touchState.axisLock = null;
      touchState.suppressClick = false;
      railElement.removeAttribute("data-touch-axis");
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches.length !== 1) return;

      const touch = event.touches[0];
      const deltaX = touch.clientX - touchState.startX;
      const deltaY = touch.clientY - touchState.startY;

      if (!touchState.axisLock) {
        if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) {
          touchState.lastX = touch.clientX;
          return;
        }

        touchState.axisLock = Math.abs(deltaX) > Math.abs(deltaY) ? "x" : "y";
        railElement.dataset.touchAxis = touchState.axisLock;
      }

      if (touchState.axisLock === "x") {
        event.preventDefault();
        touchState.suppressClick = true;
        railElement.scrollBy({ left: touchState.lastX - touch.clientX, behavior: "auto" });
      }

      touchState.lastX = touch.clientX;
    };

    const handleClickCapture = (event: MouseEvent) => {
      if (!touchState.suppressClick) return;

      event.preventDefault();
      event.stopPropagation();
      touchState.suppressClick = false;
    };

    railElement.addEventListener("touchstart", handleTouchStart, { passive: true });
    railElement.addEventListener("touchmove", handleTouchMove, { passive: false });
    railElement.addEventListener("touchend", resetTouchState, { passive: true });
    railElement.addEventListener("touchcancel", resetTouchState, { passive: true });
    railElement.addEventListener("click", handleClickCapture, true);

    return () => {
      railElement.removeEventListener("touchstart", handleTouchStart);
      railElement.removeEventListener("touchmove", handleTouchMove);
      railElement.removeEventListener("touchend", resetTouchState);
      railElement.removeEventListener("touchcancel", resetTouchState);
      railElement.removeEventListener("click", handleClickCapture, true);
      railElement.removeAttribute("data-touch-axis");
    };
  }, [containerRef, isCoarsePointer]);
}
