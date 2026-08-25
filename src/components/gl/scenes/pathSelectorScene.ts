import * as THREE from "three";
import type { GLScene, GLSceneFrameArgs } from "@/components/gl/GLStage";
import { COLORS, hexToVec3 } from "@/lib/tokens";

export type PathSelectorHoverState = {
  hovering: boolean;
  accentHex: string;
  mouseX: number; // 0..1, section-local
  mouseY: number; // 0..1, section-local, y-down
};

const VERTEX_SHADER = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uMouse;
  uniform vec3 uNavy;
  uniform vec3 uAccent;
  uniform float uStrength;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;
    vec2 p = uv - uMouse;
    p.x *= uResolution.x / max(uResolution.y, 1.0);
    float d = length(p);
    float glow = smoothstep(0.95, 0.0, d);

    float drift = sin(uv.x * 3.0 + uTime * 0.08) * 0.02 + sin(uv.y * 4.0 - uTime * 0.06) * 0.02;
    vec3 base = uNavy * (0.9 + drift);
    vec3 color = mix(base, uAccent, glow * uStrength * 0.55);

    gl_FragColor = vec4(color, 1.0);
  }
`;

export function buildPathSelectorScene(hoverRef: { current: PathSelectorHoverState }): GLScene {
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  const uniforms = {
    uTime: { value: 0 },
    uResolution: { value: new THREE.Vector2(1, 1) },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uNavy: { value: new THREE.Vector3(...hexToVec3(COLORS.navy)) },
    uAccent: { value: new THREE.Vector3(...hexToVec3(COLORS.emerald)) },
    uStrength: { value: 0 },
  };

  const material = new THREE.ShaderMaterial({
    vertexShader: VERTEX_SHADER,
    fragmentShader: FRAGMENT_SHADER,
    uniforms,
    depthTest: false,
    depthWrite: false,
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
  scene.add(mesh);

  const currentAccent = new THREE.Color(COLORS.emerald);
  const currentMouse = new THREE.Vector2(0.5, 0.5);
  let currentStrength = 0;

  function onFrame({ time, deltaTime, rectPx, dpr }: GLSceneFrameArgs) {
    uniforms.uTime.value = time;
    uniforms.uResolution.value.set(rectPx.width / dpr, rectPx.height / dpr);

    const target = hoverRef.current;
    const ease = 1 - Math.pow(0.001, deltaTime); // ~500ms settle, framerate independent

    currentAccent.lerp(new THREE.Color(target.accentHex), ease);
    currentMouse.x += (target.mouseX - currentMouse.x) * ease;
    currentMouse.y += (1 - target.mouseY - currentMouse.y) * ease; // flip to GL bottom-up
    currentStrength += ((target.hovering ? 1 : 0) - currentStrength) * ease;

    uniforms.uAccent.value.set(currentAccent.r, currentAccent.g, currentAccent.b);
    uniforms.uMouse.value.set(currentMouse.x, currentMouse.y);
    uniforms.uStrength.value = currentStrength;
  }

  return {
    scene,
    camera,
    onFrame,
    dispose() {
      material.dispose();
      mesh.geometry.dispose();
    },
  };
}
