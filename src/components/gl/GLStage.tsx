"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import * as THREE from "three";
import { GL_BASELINE } from "@/lib/tokens";
import { prefersReducedMotion, prefersSaveData } from "@/lib/motion";

export type GLSceneFrameArgs = {
  time: number;
  deltaTime: number;
  rectPx: { x: number; y: number; width: number; height: number };
  dpr: number;
  accent: THREE.Color;
  lowQuality: boolean;
  pointer: { x: number; y: number }; // normalized -1..1, viewport-relative
};

export type GLScene = {
  scene: THREE.Scene;
  camera: THREE.Camera;
  onFrame: (args: GLSceneFrameArgs) => void;
  onResize?: (width: number, height: number, dpr: number) => void;
  dispose?: () => void;
};

type SceneEntry = {
  scene: GLScene;
  el: HTMLElement;
  active: boolean;
  accent: THREE.Color;
};

type GLStageContextValue = {
  registerScene: (id: string, scene: GLScene, el: HTMLElement) => void;
  unregisterScene: (id: string) => void;
  setSceneActive: (id: string, active: boolean) => void;
  setSceneAccent: (id: string, hex: string) => void;
  disabled: boolean;
};

const GLStageContext = createContext<GLStageContextValue | null>(null);

export function useGLStage() {
  const ctx = useContext(GLStageContext);
  if (!ctx) throw new Error("useGLStage must be used within GLStageProvider");
  return ctx;
}

/**
 * Single global WebGLRenderer for the entire site. Section "scenes"
 * register themselves with a host element; each frame the stage clears
 * once, then draws every currently-visible scene into its own scissor
 * rectangle matched to that host element's screen position. This keeps
 * the whole site to one <canvas>/one GPU context (design.md §6) instead
 * of one per section, which is what tends to crash mobile Safari.
 */
export function GLStageProvider({ children }: { children: React.ReactNode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const scenesRef = useRef<Map<string, SceneEntry>>(new Map());
  const pointerRef = useRef({ x: 0, y: 0 });
  const clockRef = useRef({ start: 0, last: 0 });
  const rafRef = useRef<number | null>(null);
  const frameSamplesRef = useRef<number[]>([]);
  const lowQualityRef = useRef(false);
  const [disabled, setDisabled] = useState(false);

  const registerScene = useCallback((id: string, scene: GLScene, el: HTMLElement) => {
    scenesRef.current.set(id, { scene, el, active: false, accent: new THREE.Color("#1f8a70") });
  }, []);

  const unregisterScene = useCallback((id: string) => {
    const entry = scenesRef.current.get(id);
    entry?.scene.dispose?.();
    scenesRef.current.delete(id);
  }, []);

  const setSceneActive = useCallback((id: string, active: boolean) => {
    const entry = scenesRef.current.get(id);
    if (entry) entry.active = active;
  }, []);

  const setSceneAccent = useCallback((id: string, hex: string) => {
    const entry = scenesRef.current.get(id);
    entry?.accent.set(hex);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion() || prefersSaveData()) {
      setDisabled(true);
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;

    let disposed = false;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.autoClear = false;
    rendererRef.current = renderer;

    const isMobile = window.innerWidth < 768;
    let dpr = Math.min(
      window.devicePixelRatio || 1,
      isMobile ? GL_BASELINE.dprCapMobile : GL_BASELINE.dprCap
    );

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setPixelRatio(dpr);
      renderer.setSize(w, h, false);
      scenesRef.current.forEach(({ scene }) => scene.onResize?.(w, h, dpr));
    };
    resize();
    window.addEventListener("resize", resize);

    const onPointerMove = (e: PointerEvent) => {
      pointerRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointerRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    clockRef.current.start = performance.now();
    clockRef.current.last = clockRef.current.start;

    const frame = (now: number) => {
      if (disposed) return;
      const time = (now - clockRef.current.start) / 1000;
      const deltaTime = (now - clockRef.current.last) / 1000;
      clockRef.current.last = now;

      // Adaptive quality: sample the first 30 frames, then decide once.
      if (frameSamplesRef.current.length < 30) {
        frameSamplesRef.current.push(deltaTime);
      } else if (frameSamplesRef.current.length === 30) {
        const avgDelta =
          frameSamplesRef.current.reduce((a, b) => a + b, 0) / frameSamplesRef.current.length;
        const fps = 1 / avgDelta;
        if (fps < 45 && dpr > 1) {
          dpr = 1;
          renderer.setPixelRatio(dpr);
          renderer.setSize(window.innerWidth, window.innerHeight, false);
          lowQualityRef.current = true;
        }
        frameSamplesRef.current.push(0); // stop sampling
      }

      renderer.setScissorTest(false);
      renderer.clear(true, true, true);
      renderer.setScissorTest(true);

      const vh = window.innerHeight;
      scenesRef.current.forEach(({ scene, el, active, accent }) => {
        if (!active) return;
        const rect = el.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > vh || rect.width <= 0 || rect.height <= 0) return;

        // three.js's setScissor/setViewport take CSS pixels and multiply by
        // the renderer's own pixelRatio internally — do NOT pre-multiply by
        // dpr here or the region ends up scaled by dpr² and scissored
        // off-canvas (this was rendering nothing at any dpr > 1).
        const xCss = Math.round(rect.left);
        const yCss = Math.round(vh - rect.bottom); // WebGL Y is bottom-up
        const widthCss = Math.round(rect.width);
        const heightCss = Math.round(rect.height);

        renderer.setScissor(xCss, yCss, widthCss, heightCss);
        renderer.setViewport(xCss, yCss, widthCss, heightCss);
        scene.onFrame({
          time,
          deltaTime,
          rectPx: {
            x: xCss * dpr,
            y: yCss * dpr,
            width: widthCss * dpr,
            height: heightCss * dpr,
          },
          dpr,
          accent,
          lowQuality: lowQualityRef.current,
          pointer: pointerRef.current,
        });
        renderer.render(scene.scene, scene.camera);
      });

      rafRef.current = requestAnimationFrame(frame);
    };
    rafRef.current = requestAnimationFrame(frame);

    return () => {
      disposed = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      scenesRef.current.forEach(({ scene }) => scene.dispose?.());
      scenesRef.current.clear();
      renderer.dispose();
      rendererRef.current = null;
    };
  }, []);

  return (
    <GLStageContext.Provider
      value={{ registerScene, unregisterScene, setSceneActive, setSceneAccent, disabled }}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 h-screen w-screen"
      />
      {children}
    </GLStageContext.Provider>
  );
}
