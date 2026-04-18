import type { ReactNode } from "react";
import { useEffect } from "react";
import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import Lenis from "lenis";

export function AppFrame({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Add buttery smooth momentum scrolling only for desktop wheel/trackpad
    const lenis = new Lenis({
      duration: 1.8, // Make it very slow & smooth as requested
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.8, // Slightly reduce scroll jump speed
      touchMultiplier: 2, // Keep touch fast
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
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
