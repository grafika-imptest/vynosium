"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { withBasePath } from "@/lib/seo";
import { gsap, ensureGsapRegistered, prefersReducedMotion } from "@/lib/motion";

/**
 * Photographic hero layer with scroll parallax.
 *
 * The photo drifts against the copy, which stays put. Scrubbed to scroll
 * rather than timed, so the depth reads on the way back up as well.
 *
 * Two rules make this safe to put on every hero:
 *
 * 1. The over-scale is an INLINE transform, never a tween. GSAP composes
 *    yPercent on top of it, so a scroll driver that never starts — a frozen
 *    rAF, a stalled ScrollTrigger — leaves a correctly covered frame instead
 *    of a bare edge. Nothing about a hero is allowed to depend on a tween.
 * 2. The scale covers the travel at both ends: TRAVEL of 9% each way needs
 *    1.18, and 1.2 leaves slack for the sub-pixel rounding of a scaled,
 *    translated layer.
 *
 * The scrims stay with the caller: each hero has its own recipe, measured
 * against its own photograph.
 */

const SCALE = 1.2;
/** Drift in percent of the layer height, from -x on entry to +x on exit. */
const TRAVEL = 9;

export function HeroPhoto({
  src,
  priority = false,
  imageClassName = "object-cover object-center",
}: {
  /** Path under /public, without the base path. */
  src: string;
  /** Set on a hero that is the page's LCP element. */
  priority?: boolean;
  imageClassName?: string;
}) {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;
    ensureGsapRegistered();

    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) return;
      const section = layer.parentElement;
      if (!section) return;

      gsap.fromTo(
        layer,
        { yPercent: -TRAVEL },
        {
          yPercent: TRAVEL,
          ease: "none",
          scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: true },
        }
      );
    }, layerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={layerRef}
      aria-hidden="true"
      className="absolute inset-0"
      style={{ transform: `scale(${SCALE})`, willChange: "transform" }}
    >
      {/*
        Decorative: every hero that uses this has a heading naming the thing
        in the picture, so a described image would say it twice.
      */}
      <Image src={withBasePath(src)} alt="" fill priority={priority} sizes="100vw" className={imageClassName} />
    </div>
  );
}
