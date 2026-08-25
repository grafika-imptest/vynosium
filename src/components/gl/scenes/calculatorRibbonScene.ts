import * as THREE from "three";
import type { GLScene, GLSceneFrameArgs } from "@/components/gl/GLStage";
import { COLORS } from "@/lib/tokens";
import { RIBBON_SAMPLES } from "@/lib/calculator";

export type RibbonTarget = {
  median: number[]; // world-Y, one per sample, already normalized/scaled by the caller
  low: number[];
  high: number[];
};

const SAMPLES = RIBBON_SAMPLES;
const HALF_THICKNESS = 0.018;
const X_MIN = -0.92;
const X_MAX = 0.92;
const COLOR_Y_MIN = -0.55;
const COLOR_Y_MAX = 0.65;

function buildStripGeometry(count: number) {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 2 * 3);
  const colors = new Float32Array(count * 2 * 3);
  const indices: number[] = [];
  for (let i = 0; i < count - 1; i++) {
    const a = i * 2;
    const b = i * 2 + 1;
    const c = (i + 1) * 2;
    const d = (i + 1) * 2 + 1;
    indices.push(a, b, c, b, d, c);
  }
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geometry.setIndex(indices);
  return geometry;
}

export function buildCalculatorRibbonScene(targetRef: { current: RibbonTarget }): GLScene {
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  const bandGeometry = buildStripGeometry(SAMPLES);
  const bandMaterial = new THREE.MeshBasicMaterial({
    color: new THREE.Color(COLORS.steel),
    transparent: true,
    opacity: 0.25,
    depthTest: false,
  });
  const bandMesh = new THREE.Mesh(bandGeometry, bandMaterial);
  scene.add(bandMesh);

  const ribbonGeometry = buildStripGeometry(SAMPLES);
  const ribbonMaterial = new THREE.MeshBasicMaterial({ vertexColors: true, depthTest: false });
  const ribbonMesh = new THREE.Mesh(ribbonGeometry, ribbonMaterial);
  scene.add(ribbonMesh);

  const edgeGeometry = new THREE.BufferGeometry();
  edgeGeometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(SAMPLES * 3), 3));
  const edgeMaterial = new THREE.LineBasicMaterial({ color: new THREE.Color(COLORS.emerald) });
  const edgeLine = new THREE.Line(edgeGeometry, edgeMaterial);
  scene.add(edgeLine);

  const navy = new THREE.Color(COLORS.navy);
  const emerald = new THREE.Color(COLORS.emerald);
  const tmpColor = new THREE.Color();

  // Current (eased) state, seeded flat at 0 until the first target arrives.
  const current: RibbonTarget = {
    median: new Array(SAMPLES).fill(0),
    low: new Array(SAMPLES).fill(0),
    high: new Array(SAMPLES).fill(0),
  };
  let seeded = false;

  function xAt(i: number) {
    return X_MIN + ((X_MAX - X_MIN) * i) / (SAMPLES - 1);
  }

  function writeStrip(
    geometry: THREE.BufferGeometry,
    topValues: number[],
    bottomValues: number[],
    withColor: boolean
  ) {
    const posAttr = geometry.getAttribute("position") as THREE.BufferAttribute;
    const colorAttr = withColor ? (geometry.getAttribute("color") as THREE.BufferAttribute) : null;
    for (let i = 0; i < SAMPLES; i++) {
      const x = xAt(i);
      const top = topValues[i];
      const bottom = bottomValues[i];
      posAttr.setXYZ(i * 2, x, top, 0);
      posAttr.setXYZ(i * 2 + 1, x, bottom, 0);
      if (colorAttr) {
        const tTop = THREE.MathUtils.clamp((top - COLOR_Y_MIN) / (COLOR_Y_MAX - COLOR_Y_MIN), 0, 1);
        const tBottom = THREE.MathUtils.clamp((bottom - COLOR_Y_MIN) / (COLOR_Y_MAX - COLOR_Y_MIN), 0, 1);
        tmpColor.copy(navy).lerp(emerald, tTop);
        colorAttr.setXYZ(i * 2, tmpColor.r, tmpColor.g, tmpColor.b);
        tmpColor.copy(navy).lerp(emerald, tBottom);
        colorAttr.setXYZ(i * 2 + 1, tmpColor.r, tmpColor.g, tmpColor.b);
      }
    }
    posAttr.needsUpdate = true;
    if (colorAttr) colorAttr.needsUpdate = true;
    geometry.computeBoundingSphere();
  }

  function onFrame({ deltaTime }: GLSceneFrameArgs) {
    const target = targetRef.current;
    if (!target.median.length) return;

    if (!seeded) {
      current.median = [...target.median];
      current.low = [...target.low];
      current.high = [...target.high];
      seeded = true;
    }

    const ease = 1 - Math.pow(0.02, deltaTime); // ~0.45s settle
    for (let i = 0; i < SAMPLES; i++) {
      current.median[i] += (target.median[i] - current.median[i]) * ease;
      current.low[i] += (target.low[i] - current.low[i]) * ease;
      current.high[i] += (target.high[i] - current.high[i]) * ease;
    }

    writeStrip(bandGeometry, current.high, current.low, false);

    const top = current.median.map((v) => v + HALF_THICKNESS);
    const bottom = current.median.map((v) => v - HALF_THICKNESS);
    writeStrip(ribbonGeometry, top, bottom, true);

    const edgePos = edgeGeometry.getAttribute("position") as THREE.BufferAttribute;
    for (let i = 0; i < SAMPLES; i++) edgePos.setXYZ(i, xAt(i), top[i], 0.001);
    edgePos.needsUpdate = true;
  }

  return {
    scene,
    camera,
    onFrame,
    dispose() {
      bandGeometry.dispose();
      bandMaterial.dispose();
      ribbonGeometry.dispose();
      ribbonMaterial.dispose();
      edgeGeometry.dispose();
      edgeMaterial.dispose();
    },
  };
}
