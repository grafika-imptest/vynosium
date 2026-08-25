"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap, ensureGsapRegistered, prefersReducedMotion, prefersSaveData } from "@/lib/motion";
import { withBasePath } from "@/lib/basePath";

export const PRELOADER_EXIT_EVENT = "vynosium:preloader-exit";

/**
 * Minimal brand hold: just the monogram, fading in and out. Removed from
 * the DOM entirely on completion (never display:none) so it can't affect
 * CLS, and skipped outright under reduced-motion or Save-Data.
 */
export function Preloader() {
  const [mounted, setMounted] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion() || prefersSaveData()) {
      setMounted(false);
      window.dispatchEvent(new CustomEvent(PRELOADER_EXIT_EVENT));
      return;
    }

    ensureGsapRegistered();

    const tl = gsap.timeline({
      onComplete: () => {
        window.dispatchEvent(new CustomEvent(PRELOADER_EXIT_EVENT));
        setMounted(false);
      },
    });

    tl.fromTo(
      markRef.current,
      { opacity: 0, scale: 0.96 },
      { opacity: 1, scale: 1, duration: 0.6, ease: "power2.out" }
    )
      .to({}, { duration: 0.25 })
      .to(rootRef.current, { opacity: 0, duration: 0.5, ease: "power2.inOut" });

    return () => {
      tl.kill();
    };
  }, []);

  if (!mounted) return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-abyss"
      aria-hidden="true"
    >
      <div ref={markRef} className="relative h-24 w-24 opacity-0">
        <Image src={withBasePath("/brand/symbol-color.svg")} alt="" fill priority className="object-contain" />
      </div>
    </div>
  );
}
