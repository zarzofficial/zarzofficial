"use client";

import { useEffect, useRef } from "react";

export function useScrollReveal() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only apply animations on desktop screens (min-width: 768px)
    if (window.innerWidth < 768 || !containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            // Optional: unobserve if you only want it to animate once
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    const elements = containerRef.current.querySelectorAll(".reveal-on-scroll");
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, []);

  return containerRef;
}
