import * as THREE from "three";
import type { GLScene, GLSceneFactory } from "@/components/gl/GLStage";
import { VECTOR_ANGLE_RAD, hexToRgb } from "@/lib/tokens";

/**
 * Path selector field (§3/03).
 *
 * ONE canvas region sits under the whole 2×2 grid. Hovering a card sends
 * its token colour in as `uAccent` (eased over 500ms) and a radial
 * pressure point follows the cursor — the hover tones the entire room,
 * not the card. Four canvases here would be an LCP crime.
 */

export interface PathSelectorHoverState {
  hovering: boolean;
  accentHex: string;
  /** 0…1 within the section rectangle. */
  mouseX: number;
  mouseY: number;
}

const VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const FRAGMENT = /* glsl */ `
  precision highp float;

  varying vec2 vUv;

  uniform float uTime;
  uniform float uAspect;
  uniform vec2 uMouse;
  uniform float uPressure;
  uniform vec3 uAccent;
  uniform float uAngle;
  uniform float uGrain;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * noise(p);
      p *= 2.05;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    vec2 p = vec2((uv.x - 0.5) * uAspect, uv.y - 0.5);
    vec2 dir = vec2(cos(uAngle), sin(uAngle));

    // Slow fluid drift along the identity vector.
    float flow = fbm(p * 1.6 + dir * uTime * 0.05);
    float bands = fbm(p * 3.1 - dir * uTime * 0.03);

    vec3 navy = vec3(0.063, 0.165, 0.263);
    vec3 surface = vec3(0.086, 0.196, 0.294);
    vec3 color = mix(navy, surface, flow * 0.9 + bands * 0.25);

    // Radial pressure point under the cursor. Accent is capped at 0.22
    // alpha (§1 rule 6: path colours are identifiers, never surfaces).
    vec2 m = vec2((uMouse.x - 0.5) * uAspect, (0.5 - uMouse.y));
    float d = length(p - m);
    float halo = smoothstep(0.75, 0.0, d) * uPressure;
    color = mix(color, uAccent, halo * 0.22);

    // A single hairline of the accent traces the vector through the field.
    float axis = abs(fract(dot(p - m, vec2(-dir.y, dir.x)) * 1.4 + 0.5) - 0.5);
    color += uAccent * smoothstep(0.5, 0.49, axis) * halo * 0.35;

    float grain = hash(uv * 850.0 + fract(uTime) * 90.0);
    color += (grain - 0.5) * uGrain;

    gl_FragColor = vec4(color, 1.0);
  }
`;

export function buildPathSelectorScene(
  state: { current: PathSelectorHoverState }
): GLSceneFactory {
  return (): GLScene => {
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const uniforms = {
      uTime: { value: 0 },
      uAspect: { value: 1 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uPressure: { value: 0 },
      uAccent: { value: new THREE.Vector3(...hexToRgb("#1f8a70")) },
      uAngle: { value: VECTOR_ANGLE_RAD },
      uGrain: { value: 0.03 },
    };

    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.ShaderMaterial({
        vertexShader: VERTEX,
        fragmentShader: FRAGMENT,
        uniforms,
        depthTest: false,
        depthWrite: false,
      })
    );
    scene.add(mesh);

    const accent = new THREE.Vector3(...hexToRgb("#1f8a70"));
    const smoothedMouse = new THREE.Vector2(0.5, 0.5);

    return {
      scene,
      camera,
      update({ time, width, height, delta }) {
        uniforms.uTime.value = time;
        uniforms.uAspect.value = Math.max(width / Math.max(height, 1), 0.001);

        smoothedMouse.x += (state.current.mouseX - smoothedMouse.x) * 0.08;
        smoothedMouse.y += (state.current.mouseY - smoothedMouse.y) * 0.08;
        uniforms.uMouse.value.copy(smoothedMouse);

        // 500ms ease on both the accent colour and the pressure amount
        // (--gl-accent-ease), so the room tones rather than switches.
        const step = Math.min(delta / 0.5, 1);
        const target = new THREE.Vector3(...hexToRgb(state.current.accentHex));
        accent.lerp(target, step);
        uniforms.uAccent.value.copy(accent);

        const targetPressure = state.current.hovering ? 1 : 0;
        uniforms.uPressure.value += (targetPressure - uniforms.uPressure.value) * step;
      },
      dispose() {
        mesh.geometry.dispose();
        (mesh.material as THREE.Material).dispose();
      },
    };
  };
}
