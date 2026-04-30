import type { ReactNode } from "react";
import { useEffect } from "react";
import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";

export function AppFrame({ children }: { children: ReactNode }) {
  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 1024px)");
    let frameId = 0;
    let disposed = false;
    let activationId = 0;
    let importPending = false;
    let lenis: { raf: (time: number) => void; destroy: () => void } | null = null;

    const stopLenis = () => {
      activationId += 1;
      importPending = false;

      if (frameId) {
        cancelAnimationFrame(frameId);
        frameId = 0;
      }

      lenis?.destroy();
      lenis = null;
      delete (window as any).__lenis;
    };

    const startLenis = () => {
      if (lenis || importPending) return;

      const currentActivation = activationId;
      importPending = true;

      void import("lenis")
        .then(({ default: Lenis }) => {
          importPending = false;
          if (disposed || currentActivation !== activationId || !desktopQuery.matches) return;

          lenis = new Lenis({
            duration: 1.8,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: "vertical",
            gestureOrientation: "vertical",
            smoothWheel: true,
            wheelMultiplier: 0.8,
            touchMultiplier: 2,
          });

          (window as any).__lenis = lenis;

          function raf(time: number) {
            if (!lenis || disposed) return;
            lenis.raf(time);
            frameId = requestAnimationFrame(raf);
          }

          frameId = requestAnimationFrame(raf);
        })
        .catch((error) => {
          importPending = false;
          console.error("Lenis failed to load", error);
        });
    };

    const syncLenis = () => {
      if (desktopQuery.matches) {
        startLenis();
      } else {
        stopLenis();
      }
    };

    syncLenis();
    desktopQuery.addEventListener("change", syncLenis);

    return () => {
      disposed = true;
      desktopQuery.removeEventListener("change", syncLenis);
      stopLenis();
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
