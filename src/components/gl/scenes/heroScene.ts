import * as THREE from "three";
import type { GLScene, GLSceneFrameArgs } from "@/components/gl/GLStage";
import { COLORS, GL_BASELINE, VECTOR_ANGLE_RAD, hexToVec3 } from "@/lib/tokens";

/**
 * Hero "depth field": a procedural architectural-atmosphere shader
 * (design.md calls for a displaced architecture photograph as albedo —
 * no licensed photography has been supplied yet, so this is a shader
 * placeholder in the same palette/behaviour, swappable for a real
 * uDepth/uAlbedo texture pair later without touching the section code)
 * plus the 240-point capital flow field rising along the 38.5° identity
 * vector, plus a film-grain pass. All three share one scissor rect.
 */

const VERTEX_SHADER = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const FIELD_FRAGMENT_SHADER = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uPointer;
  uniform vec3 uColorNavy;
  uniform vec3 uColorEmerald;
  uniform float uDrift;
  uniform float uGrain;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }

  void main() {
    vec2 uv = vUv;
    vec2 p = uv * 2.0 - 1.0;
    p.x *= uResolution.x / max(uResolution.y, 1.0);

    vec2 drift = uPointer * 0.045 + vec2(sin(uTime * 0.05), cos(uTime * 0.04)) * uDrift;
    vec2 q = p + drift;

    float angle = radians(38.5);
    vec2 rq = vec2(q.x * cos(angle) - q.y * sin(angle), q.x * sin(angle) + q.y * cos(angle));
    float linesV = smoothstep(0.0, 0.02, abs(fract(rq.x * 4.0) - 0.5) - 0.47);
    float linesH = smoothstep(0.0, 0.02, abs(fract(rq.y * 7.0) - 0.5) - 0.47);
    float structure = 1.0 - min(linesV, 1.0) * 0.5 - min(linesH, 1.0) * 0.2;

    float depth = smoothstep(1.3, -0.2, length(p - vec2(0.15, -0.1)));

    vec3 base = mix(uColorNavy * 0.55, uColorNavy, depth);
    base = mix(base, uColorEmerald, depth * 0.14 * structure);

    float grain = (hash(uv * uResolution.xy + uTime) - 0.5) * uGrain;
    vec3 color = base + grain;

    gl_FragColor = vec4(color, 1.0);
  }
`;

export function buildHeroScene(): GLScene {
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  const fieldUniforms = {
    uTime: { value: 0 },
    uResolution: { value: new THREE.Vector2(1, 1) },
    uPointer: { value: new THREE.Vector2(0, 0) },
    uColorNavy: { value: new THREE.Vector3(...hexToVec3(COLORS.navy)) },
    uColorEmerald: { value: new THREE.Vector3(...hexToVec3(COLORS.emerald)) },
    uDrift: { value: GL_BASELINE.drift as number },
    uGrain: { value: GL_BASELINE.grain as number },
  };

  const fieldMaterial = new THREE.ShaderMaterial({
    vertexShader: VERTEX_SHADER,
    fragmentShader: FIELD_FRAGMENT_SHADER,
    uniforms: fieldUniforms,
    depthTest: false,
    depthWrite: false,
  });
  const fieldMesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), fieldMaterial);
  fieldMesh.renderOrder = 0;
  scene.add(fieldMesh);

  const POINT_COUNT = 240;
  const positions = new Float32Array(POINT_COUNT * 3);
  const seeds = new Float32Array(POINT_COUNT);
  const lanes = new Float32Array(POINT_COUNT);
  for (let i = 0; i < POINT_COUNT; i++) {
    seeds[i] = Math.random();
    lanes[i] = (Math.random() - 0.5) * 2.4;
    positions[i * 3] = 0;
    positions[i * 3 + 1] = 0;
    positions[i * 3 + 2] = 0;
  }
  const pointsGeometry = new THREE.BufferGeometry();
  pointsGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const pointsMaterial = new THREE.PointsMaterial({
    color: new THREE.Color(COLORS.emerald),
    size: 0.012,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.18,
    blending: THREE.AdditiveBlending,
    depthTest: false,
    depthWrite: false,
  });
  const points = new THREE.Points(pointsGeometry, pointsMaterial);
  points.renderOrder = 1;
  scene.add(points);

  const dir = new THREE.Vector2(Math.cos(VECTOR_ANGLE_RAD), Math.sin(VECTOR_ANGLE_RAD));
  const travel = 2.6;

  function onFrame({ time, rectPx, dpr, pointer, lowQuality }: GLSceneFrameArgs) {
    fieldUniforms.uTime.value = time;
    fieldUniforms.uResolution.value.set(rectPx.width / dpr, rectPx.height / dpr);
    fieldUniforms.uPointer.value.set(pointer.x, pointer.y);
    fieldUniforms.uGrain.value = lowQuality ? 0 : GL_BASELINE.grain;

    const speed = 0.16;
    const activeCount = lowQuality ? POINT_COUNT / 2 : POINT_COUNT;
    const posAttr = pointsGeometry.getAttribute("position") as THREE.BufferAttribute;
    for (let i = 0; i < POINT_COUNT; i++) {
      if (i >= activeCount) {
        posAttr.setXYZ(i, 0, 100, 0); // park offscreen
        continue;
      }
      const t = (time * speed + seeds[i] * travel) % travel;
      const along = -1.4 + t;
      const x = dir.x * along + lanes[i] * -dir.y * 0.5;
      const y = dir.y * along + lanes[i] * dir.x * 0.5;
      posAttr.setXYZ(i, x, y, 0);
    }
    posAttr.needsUpdate = true;
  }

  return {
    scene,
    camera,
    onFrame,
    dispose() {
      fieldMaterial.dispose();
      fieldMesh.geometry.dispose();
      pointsGeometry.dispose();
      pointsMaterial.dispose();
    },
  };
}
