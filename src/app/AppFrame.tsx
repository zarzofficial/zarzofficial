import type { ReactNode } from "react";
import { useEffect } from "react";
import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";

export function AppFrame({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Lenis smooth scroll ONLY for desktop (1024px+)
    // On mobile, native scroll is always smoother — no JS interception
    if (window.innerWidth < 1024) return;

    let frameId = 0;
    let disposed = false;
    let lenis: { raf: (time: number) => void; destroy: () => void } | null = null;

    void import("lenis")
      .then(({ default: Lenis }) => {
        if (disposed) return;

        lenis = new Lenis({
          duration: 1.8,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          orientation: "vertical",
          gestureOrientation: "vertical",
          smoothWheel: true,
          wheelMultiplier: 0.8,
          touchMultiplier: 2,
        });

        // Expose for keyboard snap navigation to use lenis.scrollTo directly.
        (window as any).__lenis = lenis;

        function raf(time: number) {
          if (!lenis || disposed) return;
          lenis.raf(time);
          frameId = requestAnimationFrame(raf);
        }

        frameId = requestAnimationFrame(raf);
      })
      .catch((error) => {
        console.error("Lenis failed to load", error);
      });

    return () => {
      disposed = true;
      if (frameId) cancelAnimationFrame(frameId);
      lenis?.destroy();
      delete (window as any).__lenis;
    };
  }, []);

  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary/30 flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
