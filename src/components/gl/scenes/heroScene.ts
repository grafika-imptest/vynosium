import * as THREE from "three";
import type { GLScene, GLSceneFactory } from "@/components/gl/GLStage";
import { VECTOR_ANGLE_RAD } from "@/lib/tokens";

/**
 * Hero depth field (§3/01) and its reprise in the closing CTA (§3/13).
 *
 * Layer order matches the spec: displaced architectural field → shader
 * grain → 240 additive points flowing along the 38.5° monogram vector.
 * The scrim and all text live in the DOM above the canvas.
 *
 * `pointer` and `progress` are refs written by rAF/ScrollTrigger — never
 * React state, so pointer movement costs no re-render (§6 INP).
 */

export interface HeroSceneState {
  /** −1…1 normalised pointer offset. */
  x: number;
  y: number;
  /** 0…1 scroll progress through the section. */
  progress: number;
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
  uniform vec2 uPointer;
  uniform float uAspect;
  uniform float uDrift;
  uniform float uGrain;
  uniform float uAngle;
  uniform float uDark;      // 1.0 = closing CTA (abyss), 0.0 = hero
  uniform float uProgress;

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
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 5; i++) {
      value += amplitude * noise(p);
      p *= 2.02;
      amplitude *= 0.5;
    }
    return value;
  }

  void main() {
    vec2 uv = vUv;
    vec2 p = vec2((uv.x - 0.5) * uAspect, uv.y - 0.5);

    // Parallax: the field drifts against the pointer, never with it.
    p += uPointer * 0.035;

    // Domain warp gives the field the feel of stacked building masses
    // rather than clouds.
    vec2 warp = vec2(fbm(p * 1.7 + uTime * uDrift), fbm(p * 1.7 - uTime * uDrift * 0.8));
    float depth = fbm(p * 2.4 + warp * 0.8);

    // Facets cut along the identity angle — the only diagonal on the site.
    vec2 dir = vec2(cos(uAngle), sin(uAngle));
    float axis = dot(p, dir) * 2.6 + depth * 1.4;
    float facets = smoothstep(0.35, 0.75, fract(axis));
    float ridge = smoothstep(0.94, 1.0, fract(axis));

    vec3 navy = vec3(0.063, 0.165, 0.263);      // #102A43
    vec3 surface = vec3(0.086, 0.196, 0.294);   // #16324B
    vec3 lift = vec3(0.106, 0.227, 0.329);      // #1B3A54
    vec3 emerald = vec3(0.122, 0.541, 0.439);   // #1F8A70

    vec3 color = mix(navy, surface, depth);
    color = mix(color, lift, facets * 0.55);
    color += emerald * ridge * 0.16 * (1.0 - uDark);

    // Depth falloff: the field recedes toward the top of the section.
    color = mix(color, navy * 0.72, smoothstep(0.15, 1.0, uv.y) * 0.55);

    // Closing CTA reprise: same field, exposure pulled down.
    color = mix(color, vec3(0.043, 0.114, 0.180), uDark * 0.75);

    // Scroll dolly darkens the field as the section leaves.
    color *= 1.0 - uProgress * 0.35;

    // Grain is the single detail that stops this reading as a CSS gradient.
    float grain = hash(uv * 900.0 + fract(uTime) * 100.0);
    color += (grain - 0.5) * uGrain;

    gl_FragColor = vec4(color, 1.0);
  }
`;

const POINT_VERTEX = /* glsl */ `
  attribute float aOffset;
  attribute float aSpeed;
  attribute float aScale;

  uniform float uTime;
  uniform float uAngle;
  uniform float uAspect;
  uniform float uConverge;
  uniform float uSize;

  varying float vFade;

  void main() {
    vec2 dir = vec2(cos(uAngle), sin(uAngle));
    vec2 perp = vec2(-dir.y, dir.x);

    // Travel along the monogram vector, wrapping in the same direction.
    float travel = fract(aOffset + uTime * aSpeed * 0.06);
    vec2 pos = perp * (position.x * 1.4) + dir * ((travel - 0.5) * 2.2);

    // In the closing CTA the flow collapses into a single point behind
    // the button — the circle closes where the site opened.
    pos = mix(pos, vec2(0.0, -0.05), uConverge);

    vFade = smoothstep(0.0, 0.15, travel) * (1.0 - smoothstep(0.85, 1.0, travel));

    gl_Position = vec4(pos.x / uAspect, pos.y, 0.0, 1.0);
    gl_PointSize = aScale * uSize;
  }
`;

const POINT_FRAGMENT = /* glsl */ `
  precision mediump float;
  varying float vFade;
  uniform vec3 uColor;
  uniform float uOpacity;

  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    float soft = 1.0 - smoothstep(0.0, 0.5, d);
    gl_FragColor = vec4(uColor, soft * vFade * uOpacity);
  }
`;

const POINT_COUNT = 240;

export function buildHeroScene(
  state: { current: HeroSceneState },
  mode: "hero" | "finale" = "hero"
): GLSceneFactory {
  return (): GLScene => {
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const fieldUniforms = {
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uAspect: { value: 1 },
      uDrift: { value: 0.06 }, // --gl-drift
      uGrain: { value: 0.035 }, // --gl-grain
      uAngle: { value: VECTOR_ANGLE_RAD },
      uDark: { value: mode === "finale" ? 1 : 0 },
      uProgress: { value: 0 },
    };

    const field = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.ShaderMaterial({
        vertexShader: VERTEX,
        fragmentShader: FRAGMENT,
        uniforms: fieldUniforms,
        depthTest: false,
        depthWrite: false,
      })
    );
    scene.add(field);

    const positions = new Float32Array(POINT_COUNT * 3);
    const offsets = new Float32Array(POINT_COUNT);
    const speeds = new Float32Array(POINT_COUNT);
    const scales = new Float32Array(POINT_COUNT);

    for (let i = 0; i < POINT_COUNT; i++) {
      positions[i * 3] = Math.random() * 2 - 1; // lateral spread
      offsets[i] = Math.random();
      speeds[i] = 0.5 + Math.random() * 1.4;
      scales[i] = 1 + Math.random() * 2.2;
    }

    const pointGeometry = new THREE.BufferGeometry();
    pointGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    pointGeometry.setAttribute("aOffset", new THREE.BufferAttribute(offsets, 1));
    pointGeometry.setAttribute("aSpeed", new THREE.BufferAttribute(speeds, 1));
    pointGeometry.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));

    const pointUniforms = {
      uTime: { value: 0 },
      uAngle: { value: VECTOR_ANGLE_RAD },
      uAspect: { value: 1 },
      uConverge: { value: 0 },
      uSize: { value: 1.4 },
      uColor: { value: new THREE.Color(0x1f8a70) },
      uOpacity: { value: 0.18 }, // §3/01: emerald at 0.18 alpha
    };

    const points = new THREE.Points(
      pointGeometry,
      new THREE.ShaderMaterial({
        vertexShader: POINT_VERTEX,
        fragmentShader: POINT_FRAGMENT,
        uniforms: pointUniforms,
        transparent: true,
        depthTest: false,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
    );
    scene.add(points);

    // Pointer follows with lerp .06 — the drift must lag the hand.
    const smoothed = new THREE.Vector2(0, 0);

    return {
      scene,
      camera,
      update({ time, width, height, quality }) {
        const aspect = Math.max(width / Math.max(height, 1), 0.001);
        fieldUniforms.uAspect.value = aspect;
        pointUniforms.uAspect.value = aspect;
        fieldUniforms.uTime.value = time;
        pointUniforms.uTime.value = time;

        smoothed.x += (state.current.x - smoothed.x) * 0.06;
        smoothed.y += (state.current.y - smoothed.y) * 0.06;
        fieldUniforms.uPointer.value.set(smoothed.x, smoothed.y);

        fieldUniforms.uProgress.value = state.current.progress;
        pointUniforms.uSize.value = 1.4 * Math.max(quality, 0.6) * Math.min(window.devicePixelRatio, 2);
        pointUniforms.uConverge.value =
          mode === "finale" ? Math.min(state.current.progress * 1.4, 1) : 0;
      },
      dispose() {
        field.geometry.dispose();
        (field.material as THREE.Material).dispose();
        pointGeometry.dispose();
        (points.material as THREE.Material).dispose();
      },
    };
  };
}
