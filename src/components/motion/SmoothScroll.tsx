"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { ensureGsapRegistered, gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/motion";

/**
 * Lenis + ScrollTrigger wiring (§6).
 *
 * ScrollTriggers must not be created before Lenis drives the update loop,
 * so Lenis is started here at the root and every scroll tick pushes
 * ScrollTrigger.update(). Reduced motion disables Lenis entirely and the
 * page falls back to native scrolling with static end-states.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    ensureGsapRegistered();

    if (prefersReducedMotion()) {
      ScrollTrigger.refresh();
      return;
    }

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      // Touch keeps native inertia — hijacking it costs more than it buys.
      syncTouch: false,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // In-page anchors go through Lenis so the easing is the site's own.
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement | null)?.closest?.('a[href^="#"]');
      if (!anchor) return;
      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      const el = document.querySelector(id);
      if (!el) return;
      event.preventDefault();
      lenis.scrollTo(el as HTMLElement, { offset: -88 });
    };
    document.addEventListener("click", onClick);

    ScrollTrigger.refresh();

    return () => {
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
