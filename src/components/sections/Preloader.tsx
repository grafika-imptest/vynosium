"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap, ensureGsapRegistered, prefersReducedMotion, prefersSaveData } from "@/lib/motion";
import { withBasePath } from "@/lib/basePath";

export const PRELOADER_EXIT_EVENT = "vynosium:preloader-exit";

/**
 * "Zážeh kapitálu" — converts the unavoidable first-paint wait into a
 * branded, data-forward moment. Removed from the DOM entirely on
 * completion (never display:none) so it can't affect CLS. Skipped
 * outright under reduced-motion or Save-Data.
 */
export function Preloader() {
  const [mounted, setMounted] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (prefersReducedMotion() || prefersSaveData()) {
      setMounted(false);
      window.dispatchEvent(new CustomEvent(PRELOADER_EXIT_EVENT));
      return;
    }

    ensureGsapRegistered();
    const isMobile = window.innerWidth < 768;
    const cap = isMobile ? 1.0 : 1.4;

    const counterTarget = { value: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        window.dispatchEvent(new CustomEvent(PRELOADER_EXIT_EVENT));
        setTimeout(() => setMounted(false), 950);
      },
    });

    tl.set(markRef.current, {
      clipPath: "polygon(0% 0%, 0% 0%, -20% 100%, 0% 100%)",
    })
      .to(markRef.current, {
        clipPath: "polygon(0% 0%, 120% 0%, 100% 100%, 0% 100%)",
        duration: Math.min(0.9, cap * 0.65),
        ease: "power2.inOut",
      })
      .to(
        counterTarget,
        {
          value: 1.2,
          duration: Math.min(0.9, cap * 0.65),
          ease: "power1.out",
          onUpdate: () => {
            if (counterRef.current) {
              counterRef.current.textContent = counterTarget.value.toFixed(1).replace(".", ",");
            }
          },
        },
        "<"
      )
      .to(rootRef.current, {
        clipPath: "polygon(0% 0%, 130% 0%, 100% 100%, 0% 100%)",
        duration: 0.9,
        ease: "expo.inOut",
      });

    return () => {
      tl.kill();
    };
  }, []);

  if (!mounted) return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 bg-abyss"
      style={{ clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 0%)" }}
      aria-hidden="true"
    >
      <div ref={markRef} className="relative h-24 w-24">
        <Image src={withBasePath("/brand/symbol-color.svg")} alt="" fill priority className="object-contain" />
      </div>
      <div className="flex flex-col items-center gap-2">
        <p className="text-[11px] font-medium text-slate" style={{ letterSpacing: "0.18em" }}>
          CHYTRÁ CESTA K VÝNOSŮM
        </p>
        <p className="font-mono text-sm text-snow">
          <span ref={counterRef}>0,0</span> mld. Kč
        </p>
      </div>
    </div>
  );
}
