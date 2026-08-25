"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { gsap, ensureGsapRegistered, prefersReducedMotion } from "@/lib/motion";
import { TRUST_NUMBERS } from "@/lib/data/site";

/**
 * "Zážeh kapitálu" (§3/00).
 *
 * The monogram draws itself while a counter runs up to the value of
 * completed deals, then the overlay exits with a clip-path wipe along
 * 38.5° — under which the hero is already animating, so there is never a
 * black pause.
 *
 * The overlay is position:fixed and is REMOVED from the DOM when done
 * (never display:none), so it cannot contribute to CLS. Reduced motion
 * and Save-Data skip it entirely.
 */
export function Preloader() {
  // Homepage only. A 2.4s overlay in front of a paid click would be the
  // most expensive animation on the site.
  const isHome = usePathname() === "/";
  const [mounted, setMounted] = useState(isHome);
  const rootRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!isHome) return;
    ensureGsapRegistered();

    const saveData =
      typeof navigator !== "undefined" &&
      (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;

    if (prefersReducedMotion() || saveData) {
      setMounted(false);
      return;
    }

    const root = rootRef.current;
    if (!root) return;

    const isMobile = window.innerWidth < 768;
    const paths = root.querySelectorAll<SVGPathElement>("path");
    const target = TRUST_NUMBERS[0].value;
    const counterValue = { v: 0 };

    document.body.style.overflow = "hidden";

    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = "";
        setMounted(false);
      },
    });

    paths.forEach((path) => {
      const length = path.getTotalLength();
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length, fillOpacity: 0 });
    });

    tl.to(paths, {
      strokeDashoffset: 0,
      duration: isMobile ? 0.55 : 0.85,
      stagger: 0.12,
      ease: "power2.inOut",
    })
      .to(paths, { fillOpacity: 1, duration: 0.35, stagger: 0.06 }, "-=0.35")
      .to(
        counterValue,
        {
          v: target,
          duration: isMobile ? 0.5 : 0.9,
          ease: "power2.out",
          snap: { v: 0.1 },
          onUpdate: () => {
            if (counterRef.current) {
              counterRef.current.textContent = `${counterValue.v.toLocaleString("cs-CZ", {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1,
              })} mld. Kč`;
            }
          },
        },
        "-=0.7"
      )
      // Exit wipe under the identity angle.
      .to(root, {
        clipPath: "polygon(0 0, 160% 0, 240% -100%, 0 -100%)",
        duration: 0.9,
        ease: "expo.inOut",
      })
      .totalDuration(isMobile ? 1.0 : 2.4);

    return () => {
      tl.kill();
      document.body.style.overflow = "";
    };
  }, [isHome]);

  if (!mounted) return null;

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="fixed inset-0 z-[300] flex flex-col items-center justify-center bg-abyss"
      style={{ clipPath: "polygon(0 0, 160% 0, 240% 100%, 0 100%)" }}
    >
      {/* Monogram, inlined so it can be drawn stroke-first. */}
      <svg width="96" height="102" viewBox="0 0 75 80" fill="none" aria-hidden="true">
        <g stroke="#1f8a70" strokeWidth="0.75" fill="#f8f8f8">
          <path d="M35.0487 53.6398L23.4949 64.8478L27.7796 75.5219H41.1293L59.393 30.0242L35.0487 53.6398Z" />
          <path d="M30.3232 43.0534L16.6873 6.3186H0L20.2026 56.6467C23.1791 52.6447 26.5535 48.1125 30.3232 43.0534Z" />
          <path d="M61.4249 4.8154L48.4832 9.6308L54.0906 14.2681C49.6406 20.2292 5.64477 79.1727 5.23181 80L64.2935 22.7058L69.7655 27.2311L72.066 13.6155L74.3666 0L61.4249 4.8154Z" />
        </g>
      </svg>

      <p className="text-label mt-8 text-slate" style={{ letterSpacing: "0.18em" }}>
        Hodnota realizovaných obchodů
      </p>
      <span ref={counterRef} className="text-metric mt-3 text-snow">
        0,0 mld. Kč
      </span>
    </div>
  );
}
