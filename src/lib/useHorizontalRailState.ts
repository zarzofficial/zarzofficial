import { startTransition, useEffect, useRef, useState, type RefObject } from "react";

type HorizontalRailStateOptions = {
  threshold?: number;
  dependencyKey?: string | number;
  onProgress?: (progress: number) => void;
};

export function useHorizontalRailState(
  railRef: RefObject<HTMLElement | null>,
  {
    threshold = 10,
    dependencyKey,
    onProgress,
  }: HorizontalRailStateOptions = {},
) {
  const [edgeState, setEdgeState] = useState({ isAtStart: true, isAtEnd: false });
  const onProgressRef = useRef(onProgress);
  const metricsRef = useRef({
    isAtStart: true,
    isAtEnd: false,
    maxScroll: 0,
    scrollFrameId: 0,
    measureFrameId: 0,
  });

  useEffect(() => {
    onProgressRef.current = onProgress;
  }, [onProgress]);

  useEffect(() => {
    const railElement = railRef.current;
    if (!railElement || typeof window === "undefined") return;

    const metrics = metricsRef.current;

    const publishState = () => {
      const currentScroll = Math.min(metrics.maxScroll, Math.abs(railElement.scrollLeft));
      const progress = metrics.maxScroll === 0 ? 0 : currentScroll / metrics.maxScroll;
      const nextIsAtStart = currentScroll <= threshold;
      const nextIsAtEnd = currentScroll >= metrics.maxScroll - threshold;

      onProgressRef.current?.(progress);

      if (metrics.isAtStart === nextIsAtStart && metrics.isAtEnd === nextIsAtEnd) {
        return;
      }

      metrics.isAtStart = nextIsAtStart;
      metrics.isAtEnd = nextIsAtEnd;

      startTransition(() => {
        setEdgeState({ isAtStart: nextIsAtStart, isAtEnd: nextIsAtEnd });
      });
    };

    const measureRail = () => {
      metrics.measureFrameId = 0;
      metrics.maxScroll = Math.max(0, railElement.scrollWidth - railElement.clientWidth);
      publishState();
    };

    const queueMeasure = () => {
      if (metrics.measureFrameId) return;

      metrics.measureFrameId = window.requestAnimationFrame(() => {
        measureRail();
      });
    };

    const queueScrollSync = () => {
      if (metrics.scrollFrameId) return;

      metrics.scrollFrameId = window.requestAnimationFrame(() => {
        metrics.scrollFrameId = 0;
        publishState();
      });
    };

    const resizeObserver =
      typeof ResizeObserver === "undefined" ? null : new ResizeObserver(() => queueMeasure());

    resizeObserver?.observe(railElement);
    queueMeasure();
    railElement.addEventListener("scroll", queueScrollSync, { passive: true });
    window.addEventListener("resize", queueMeasure, { passive: true });

    return () => {
      if (metrics.scrollFrameId) {
        window.cancelAnimationFrame(metrics.scrollFrameId);
        metrics.scrollFrameId = 0;
      }

      if (metrics.measureFrameId) {
        window.cancelAnimationFrame(metrics.measureFrameId);
        metrics.measureFrameId = 0;
      }

      resizeObserver?.disconnect();
      railElement.removeEventListener("scroll", queueScrollSync);
      window.removeEventListener("resize", queueMeasure);
    };
  }, [dependencyKey, railRef, threshold]);

  return edgeState;
}
