"use client";

import { useEffect, useRef } from "react";
import { useGLStage, type GLScene } from "@/components/gl/GLStage";

/**
 * Registers a Three.js scene with the global GLStage, keyed to a host
 * element's on-screen rect. The scene only renders while its host
 * intersects the viewport. Returns a ref to attach to that host element.
 */
export function useGLScene(id: string, factory: () => GLScene, deps: unknown[] = []) {
  const { registerScene, unregisterScene, setSceneActive, disabled } = useGLStage();
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (disabled) return;
    const el = hostRef.current;
    if (!el) return;

    const scene = factory();
    registerScene(id, scene, el);

    const observer = new IntersectionObserver(
      ([entry]) => setSceneActive(id, entry.isIntersecting),
      { rootMargin: "10% 0px" }
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      unregisterScene(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, disabled, ...deps]);

  return { hostRef, disabled };
}
