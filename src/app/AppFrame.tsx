import type { ReactNode } from "react";
import { useEffect } from "react";
import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import Lenis from "lenis";

export function AppFrame({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Lenis smooth scroll ONLY for desktop (1024px+)
    // On mobile, native scroll is always smoother — no JS interception
    if (window.innerWidth < 1024) return;

    const lenis = new Lenis({
      duration: 1.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.8,
      touchMultiplier: 2,
    });

    // Expose for keyboard snap navigation to use lenis.scrollTo directly
    (window as any).__lenis = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
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
