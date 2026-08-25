"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap, ensureGsapRegistered, prefersReducedMotion } from "@/lib/motion";

/**
 * The restrained reveal used on light sections: fade + 12px rise, nothing
 * else. Light is the document mode — sections with less movement than
 * their neighbours read as more honest (§5 motion law).
 *
 * Children render normally in the server HTML; this only tweens them, so
 * nothing depends on JS for the content to exist.
 */
export function Reveal({
  children,
  selector,
  stagger = 0.06,
  className,
}: {
  children: ReactNode;
  /** Optional child selector to stagger; defaults to the wrapper itself. */
  selector?: string;
  stagger?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    ensureGsapRegistered();

    const ctx = gsap.context(() => {
      const targets = selector ? el.querySelectorAll(selector) : [el];
      gsap.fromTo(
        targets,
        { y: 12, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.6,
          stagger,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 82%" },
        }
      );
    }, ref);

    return () => ctx.revert();
  }, [selector, stagger]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
