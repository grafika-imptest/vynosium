import * as THREE from "three";
import type { GLScene, GLSceneFactory } from "@/components/gl/GLStage";

/**
 * Compound-growth ribbon behind the calculator (§3/08).
 *
 * Real geometry, not an SVG chart: vertices are recomputed from the model
 * and eased toward their targets at 0.12/frame. The fill is a *core*
 * gradient mapped in the fragment shader by world-space Y — the gradient
 * therefore describes value, it is not decoration. The P10–P90 scenario
 * band renders behind it in steel at 0.25 alpha, because a projection
 * that can only rise is marketing.
 *
 * The component writes normalised clip-space Y values (−1…1) into
 * `target`. Nothing here ever touches React.
 */

export interface RibbonTarget {
  median: number[];
  low: number[];
  high: number[];
}

const BASE_Y = -0.85;
const LERP = 0.12;

const FILL_VERTEX = /* glsl */ `
  varying float vY;
  void main() {
    vY = position.y;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const FILL_FRAGMENT = /* glsl */ `
  precision mediump float;
  varying float vY;
  uniform float uBloom;

  void main() {
    // Navy at the base → emerald at the peak (§5 core gradient).
    float t = clamp((vY - (-0.85)) / 1.5, 0.0, 1.0);
    vec3 navy = vec3(0.063, 0.165, 0.263);
    vec3 mid = vec3(0.086, 0.314, 0.420);
    vec3 emerald = vec3(0.122, 0.541, 0.439);
    vec3 color = mix(navy, mid, smoothstep(0.0, 0.46, t));
    color = mix(color, emerald, smoothstep(0.46, 1.0, t));
    color += emerald * uBloom * 0.25;
    gl_FragColor = vec4(color, 0.92);
  }
`;

const BAND_VERTEX = /* glsl */ `
  void main() {
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const BAND_FRAGMENT = /* glsl */ `
  precision mediump float;
  void main() {
    // Steel @0.25 — the scenario band must read as context, not as data.
    gl_FragColor = vec4(0.282, 0.396, 0.506, 0.25);
  }
`;

function stripIndices(count: number): number[] {
  const indices: number[] = [];
  for (let i = 0; i < count - 1; i++) {
    const a = i * 2;
    indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
  }
  return indices;
}

export function buildCalculatorRibbonScene(target: { current: RibbonTarget }): GLSceneFactory {
  return (): GLScene => {
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const count = Math.max(target.current.median.length, 2);
    const xs = Array.from({ length: count }, (_, i) => -0.94 + (i / (count - 1)) * 1.88);

    // Current (eased) values — targets are written by the component.
    const median = new Float32Array(count).fill(BASE_Y);
    const low = new Float32Array(count).fill(BASE_Y);
    const high = new Float32Array(count).fill(BASE_Y);

    /* ---- Fill: baseline → median curve ---- */
    const fillPositions = new Float32Array(count * 2 * 3);
    const fillGeometry = new THREE.BufferGeometry();
    fillGeometry.setAttribute("position", new THREE.BufferAttribute(fillPositions, 3));
    fillGeometry.setIndex(stripIndices(count));
    const fillUniforms = { uBloom: { value: 0 } };
    const fill = new THREE.Mesh(
      fillGeometry,
      new THREE.ShaderMaterial({
        vertexShader: FILL_VERTEX,
        fragmentShader: FILL_FRAGMENT,
        uniforms: fillUniforms,
        transparent: true,
        depthTest: false,
        depthWrite: false,
      })
    );

    /* ---- Scenario band: P10 → P90 ---- */
    const bandPositions = new Float32Array(count * 2 * 3);
    const bandGeometry = new THREE.BufferGeometry();
    bandGeometry.setAttribute("position", new THREE.BufferAttribute(bandPositions, 3));
    bandGeometry.setIndex(stripIndices(count));
    const band = new THREE.Mesh(
      bandGeometry,
      new THREE.ShaderMaterial({
        vertexShader: BAND_VERTEX,
        fragmentShader: BAND_FRAGMENT,
        transparent: true,
        depthTest: false,
        depthWrite: false,
      })
    );

    /* ---- 1px emerald edge tracing the median ---- */
    const edgePositions = new Float32Array(count * 3);
    const edgeGeometry = new THREE.BufferGeometry();
    edgeGeometry.setAttribute("position", new THREE.BufferAttribute(edgePositions, 3));
    const edge = new THREE.Line(
      edgeGeometry,
      new THREE.LineBasicMaterial({ color: 0x1f8a70, transparent: true, opacity: 0.95 })
    );

    scene.add(band, fill, edge);

    let idleTime = 0;
    let lastSignature = 0;

    return {
      scene,
      camera,
      update({ delta, time }) {
        const t = target.current;

        // A changed model retriggers the 0.2s emerald bloom and resets the
        // idle timer; otherwise the ribbon breathes ±0.5% so the section
        // never looks frozen (§3/08).
        const signature = t.median.reduce((acc, v, i) => acc + v * (i + 1), 0);
        if (Math.abs(signature - lastSignature) > 0.0001) {
          lastSignature = signature;
          fillUniforms.uBloom.value = 1;
          idleTime = 0;
        } else {
          idleTime += delta;
          fillUniforms.uBloom.value = Math.max(fillUniforms.uBloom.value - delta / 0.2, 0);
        }

        const breathe = idleTime > 6 ? Math.sin(time * 1.2) * 0.005 : 0;

        for (let i = 0; i < count; i++) {
          const tm = (t.median[i] ?? BASE_Y) * (1 + breathe);
          const tl = t.low[i] ?? BASE_Y;
          const th = t.high[i] ?? BASE_Y;

          median[i] += (tm - median[i]) * LERP;
          low[i] += (tl - low[i]) * LERP;
          high[i] += (th - high[i]) * LERP;

          const x = xs[i];
          const f = i * 6;
          fillPositions[f] = x;
          fillPositions[f + 1] = BASE_Y;
          fillPositions[f + 3] = x;
          fillPositions[f + 4] = median[i];

          bandPositions[f] = x;
          bandPositions[f + 1] = low[i];
          bandPositions[f + 3] = x;
          bandPositions[f + 4] = high[i];

          edgePositions[i * 3] = x;
          edgePositions[i * 3 + 1] = median[i];
        }

        fillGeometry.attributes.position.needsUpdate = true;
        bandGeometry.attributes.position.needsUpdate = true;
        edgeGeometry.attributes.position.needsUpdate = true;
      },
      dispose() {
        fillGeometry.dispose();
        bandGeometry.dispose();
        edgeGeometry.dispose();
        (fill.material as THREE.Material).dispose();
        (band.material as THREE.Material).dispose();
        (edge.material as THREE.Material).dispose();
      },
    };
  };
}
