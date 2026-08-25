"use client";

import { useEffect, useRef } from "react";
import { useGLStage, type GLSceneFactory } from "@/components/gl/GLStage";

/**
 * Registers one scene with the global stage and returns the host ref to
 * place on an absolutely positioned, empty div inside the section.
 *
 * `disabled` is true when WebGL is unavailable or motion is reduced; the
 * caller must then render its static fallback. The factory is read from a
 * ref so an inline arrow function does not re-register every render.
 */
export function useGLScene(id: string, factory: GLSceneFactory) {
  const { register, enabled } = useGLStage();
  const hostRef = useRef<HTMLDivElement>(null);
  const factoryRef = useRef(factory);
  factoryRef.current = factory;

  useEffect(() => {
    const el = hostRef.current;
    if (!el || !enabled) return;
    return register(id, el, (renderer) => factoryRef.current(renderer));
  }, [id, register, enabled]);

  return { hostRef, disabled: !enabled };
}
