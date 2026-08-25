"use client";

import { useGLScene } from "@/components/gl/useGLScene";
import { buildHeroScene } from "@/components/gl/scenes/heroScene";

/**
 * Fallback for prefers-reduced-motion / Save-Data / no-WebGL: a static
 * gradient at the same 38.5° identity angle, no motion. Per design.md §6:
 * "layout is designed to be complete even without motion."
 */
function StaticFallback() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0"
      style={{
        background:
          "linear-gradient(38.5deg, #0b1d2e 0%, #102a43 55%, #16506b 82%, #1f8a70 130%)",
      }}
    />
  );
}

export function HeroDepthField() {
  const { hostRef, disabled } = useGLScene("hero-depth-field", buildHeroScene);

  if (disabled) return <StaticFallback />;

  return <div ref={hostRef} aria-hidden="true" className="absolute inset-0" />;
}
