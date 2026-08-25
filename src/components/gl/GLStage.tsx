"use client";

import * as THREE from "three";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { prefersReducedMotion } from "@/lib/motion";

/* ============================================================================
   ONE WebGL context for the entire site (§6).
   A fixed, full-viewport canvas holds a single WebGLRenderer. Sections do
   not own canvases — they register a *host element*, and each frame the
   stage renders that section's scene into the host's screen rectangle via
   scissor + viewport. Four contexts would blow the GPU budget and get
   dropped by mobile Safari.
   ========================================================================== */

export interface GLFrame {
  /** Seconds since the stage started. */
  time: number;
  /** Seconds since the previous frame, clamped. */
  delta: number;
  /** Host rectangle in CSS pixels. */
  width: number;
  height: number;
  /** 1 = full quality, lowered automatically on slow devices. */
  quality: number;
}

export interface GLScene {
  scene: THREE.Scene;
  camera: THREE.Camera;
  update(frame: GLFrame): void;
  resize?(width: number, height: number): void;
  dispose(): void;
}

export type GLSceneFactory = (renderer: THREE.WebGLRenderer) => GLScene;

interface Registration {
  id: string;
  el: HTMLElement;
  factory: GLSceneFactory;
  instance?: GLScene;
  lastWidth: number;
  lastHeight: number;
}

interface GLStageValue {
  /** Returns an unregister function. */
  register(id: string, el: HTMLElement, factory: GLSceneFactory): () => void;
  /** False when WebGL is unavailable or motion is reduced — sections then
   *  render their static fallback and never mount shader code. */
  enabled: boolean;
}

const GLStageContext = createContext<GLStageValue | null>(null);

export function useGLStage(): GLStageValue {
  const ctx = useContext(GLStageContext);
  if (!ctx) throw new Error("useGLStage must be used inside <GLStageProvider>");
  return ctx;
}

function detectWebGL(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl2") || canvas.getContext("webgl"))
    );
  } catch {
    return false;
  }
}

export function GLStageProvider({ children }: { children: ReactNode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const registrations = useRef<Map<string, Registration>>(new Map());
  const [enabled, setEnabled] = useState(false);

  const register = useCallback((id: string, el: HTMLElement, factory: GLSceneFactory) => {
    const entry: Registration = { id, el, factory, lastWidth: 0, lastHeight: 0 };
    const renderer = rendererRef.current;
    if (renderer) entry.instance = factory(renderer);
    registrations.current.set(id, entry);

    return () => {
      const existing = registrations.current.get(id);
      existing?.instance?.dispose();
      registrations.current.delete(id);
    };
  }, []);

  useEffect(() => {
    if (!detectWebGL() || prefersReducedMotion()) return;

    // The Map identity is stable for the provider's lifetime; capturing it
    // keeps the cleanup independent of the ref's later value.
    const scenes = registrations.current;
    let renderer: THREE.WebGLRenderer | null = null;
    let raf = 0;
    let disposed = false;
    let quality = 1;
    let dprCap = window.innerWidth < 768 ? 1 : 1.75;
    const clock = new THREE.Clock();

    // Frame budget bookkeeping for the adaptive quality ramp (§6): measure
    // the first 30 frames and step down silently if we cannot hold 45 fps.
    let sampled = 0;
    let sampledTime = 0;
    let idleFrame = 0;

    const start = () => {
      const canvas = canvasRef.current;
      if (!canvas || disposed) return;

      try {
        renderer = new THREE.WebGLRenderer({
          canvas,
          alpha: true,
          antialias: false,
          powerPreference: "high-performance",
        });
      } catch {
        setEnabled(false);
        return;
      }

      renderer.setClearColor(0x000000, 0);
      renderer.autoClear = false;
      renderer.setScissorTest(true);
      rendererRef.current = renderer;

      // Scenes that registered before the renderer existed get built now.
      registrations.current.forEach((entry) => {
        if (!entry.instance && renderer) entry.instance = entry.factory(renderer);
      });

      const resize = () => {
        if (!renderer) return;
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, dprCap) * quality);
        renderer.setSize(window.innerWidth, window.innerHeight, false);
      };
      resize();
      window.addEventListener("resize", resize);

      setEnabled(true);

      const tick = () => {
        raf = requestAnimationFrame(tick);
        if (!renderer || document.hidden) return;

        const delta = Math.min(clock.getDelta(), 0.05);
        const time = clock.getElapsedTime();

        // Idle throttle: when nothing is on screen we still want the loop
        // alive (scroll can bring a scene back any frame) but at half rate.
        const viewportH = window.innerHeight;
        const visible: Registration[] = [];
        registrations.current.forEach((entry) => {
          const rect = entry.el.getBoundingClientRect();
          if (rect.bottom < -100 || rect.top > viewportH + 100 || rect.width < 2) return;
          visible.push(entry);
        });

        if (visible.length === 0) {
          idleFrame++;
          if (idleFrame % 2 === 1) return; // ~30 fps while idle (--gl-idle-fps)
        } else {
          idleFrame = 0;
        }

        if (sampled < 30) {
          sampled++;
          sampledTime += delta;
          if (sampled === 30 && sampledTime / 30 > 1 / 45) {
            quality = 0.65;
            dprCap = 1;
            resize();
          }
        }

        renderer.clear();

        for (const entry of visible) {
          const instance = entry.instance;
          if (!instance) continue;
          const rect = entry.el.getBoundingClientRect();
          const width = rect.width;
          const height = rect.height;
          const bottom = viewportH - rect.bottom;

          if (width !== entry.lastWidth || height !== entry.lastHeight) {
            entry.lastWidth = width;
            entry.lastHeight = height;
            instance.resize?.(width, height);
          }

          renderer.setViewport(rect.left, bottom, width, height);
          renderer.setScissor(rect.left, bottom, width, height);
          instance.update({ time, delta, width, height, quality });
          renderer.render(instance.scene, instance.camera);
        }
      };

      raf = requestAnimationFrame(tick);

      return () => window.removeEventListener("resize", resize);
    };

    // The fold must be complete before the GPU starts working (§6 LCP).
    const hasIdleCallback = typeof window.requestIdleCallback === "function";
    const idle = hasIdleCallback
      ? window.requestIdleCallback(() => start(), { timeout: 900 })
      : window.setTimeout(start, 900);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      if (hasIdleCallback) {
        window.cancelIdleCallback(idle);
      } else {
        window.clearTimeout(idle);
      }
      scenes.forEach((entry) => entry.instance?.dispose());
      renderer?.dispose();
      rendererRef.current = null;
    };
  }, []);

  const value = useMemo<GLStageValue>(() => ({ register, enabled }), [register, enabled]);

  return (
    <GLStageContext.Provider value={value}>
      {/*
        z-index 1 puts the canvas above section backgrounds but below all
        content (which sits at z-index 2+). Outside registered scissor
        rectangles the canvas is fully transparent, so light sections are
        unaffected by it.
      */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[1] h-full w-full"
        style={{ opacity: enabled ? 1 : 0 }}
      />
      {children}
    </GLStageContext.Provider>
  );
}
