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
      axisLock: null as AxisLock,
      suppressClick: false,
      resetClickTimeout: 0,
    };

    const clearResetClickTimeout = () => {
      if (!touchState.resetClickTimeout) return;
      window.clearTimeout(touchState.resetClickTimeout);
      touchState.resetClickTimeout = 0;
    };

    const resetTouchState = () => {
      touchState.axisLock = null;
      railElement.removeAttribute("data-touch-axis");
    };

    const resetSuppressClick = () => {
      clearResetClickTimeout();
      touchState.suppressClick = false;
    };

    const handleTouchStart = (event: TouchEvent) => {
      if (event.touches.length !== 1) {
        resetTouchState();
        resetSuppressClick();
        return;
      }

      const touch = event.touches[0];
      clearResetClickTimeout();
      touchState.startX = touch.clientX;
      touchState.startY = touch.clientY;
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
          return;
        }

        touchState.axisLock = Math.abs(deltaX) > Math.abs(deltaY) ? "x" : "y";
        railElement.dataset.touchAxis = touchState.axisLock;
      }

      if (touchState.axisLock === "x") {
        touchState.suppressClick = true;
        event.preventDefault();
      }
    };

    const handleTouchEnd = () => {
      resetTouchState();

      if (!touchState.suppressClick) return;

      clearResetClickTimeout();
      touchState.resetClickTimeout = window.setTimeout(() => {
        touchState.suppressClick = false;
        touchState.resetClickTimeout = 0;
      }, 250);
    };

    const handleClickCapture = (event: MouseEvent) => {
      if (!touchState.suppressClick) return;

      event.preventDefault();
      event.stopPropagation();
      resetSuppressClick();
    };

    railElement.addEventListener("touchstart", handleTouchStart, { passive: true });
    railElement.addEventListener("touchmove", handleTouchMove, { passive: false });
    railElement.addEventListener("touchend", handleTouchEnd, { passive: true });
    railElement.addEventListener("touchcancel", handleTouchEnd, { passive: true });
    railElement.addEventListener("click", handleClickCapture, true);

    return () => {
      clearResetClickTimeout();
      railElement.removeEventListener("touchstart", handleTouchStart);
      railElement.removeEventListener("touchmove", handleTouchMove);
      railElement.removeEventListener("touchend", handleTouchEnd);
      railElement.removeEventListener("touchcancel", handleTouchEnd);
      railElement.removeEventListener("click", handleClickCapture, true);
      railElement.removeAttribute("data-touch-axis");
    };
  }, [containerRef, isCoarsePointer]);
}
