"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { ensureGsapRegistered, gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/motion";

const LenisContext = createContext<Lenis | null>(null);

export function useLenis() {
  return useContext(LenisContext);
}

/**
 * Wires Lenis into GSAP's ticker and ScrollTrigger's scroller proxy so
 * every scrub/pin in the app reads the same scroll position. Per
 * design.md: ScrollTriggers are only created once Lenis is wired in, and
 * `prefers-reduced-motion` disables inertial scrolling entirely.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    ensureGsapRegistered();

    if (prefersReducedMotion()) {
      // Native scroll only; ScrollTrigger still works off the real scroller.
      ScrollTrigger.defaults({ scroller: window });
      return;
    }

    const instance = new Lenis({
      duration: 1.1,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      touchMultiplier: 1.2,
    });
    lenisRef.current = instance;
    setLenis(instance);

    instance.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => {
      instance.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value) {
        if (value !== undefined) {
          instance.scrollTo(value, { immediate: true });
          return;
        }
        return instance.scroll;
      },
      getBoundingClientRect() {
        return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
      },
    });

    return () => {
      gsap.ticker.remove(tick);
      instance.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
