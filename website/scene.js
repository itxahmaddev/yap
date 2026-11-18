import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

// Shared with main.js: mic levels in, readiness + intro control out.
const YAP = (window.YAP = window.YAP || {});
YAP.mic = YAP.mic || { active: false, level: 0, bands: new Float32Array(7) };

function announceReady() {
  YAP.sceneReady = true;
  window.dispatchEvent(new Event("yap:scene-ready"));
}

const canvas = document.getElementById("scene");
const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;
const isSmall = window.matchMedia("(max-width: 720px)").matches;
const lowPower = isSmall || (navigator.hardwareConcurrency || 8) <= 4;

let renderer;
try {
  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: !isSmall,
    powerPreference: "high-performance",
    stencil: false,
  });
} catch {
  canvas.remove();
  YAP.startIntro = () => {};
  YAP.setTheme = () => {};
  announceReady();
  throw new Error("WebGL unavailable, continuing without the 3D scene");
}

let dprCap = lowPower ? 1.25 : 1.5;
renderer.setPixelRatio(Math.min(window.devicePixelRatio, dprCap));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);
scene.fog = new THREE.Fog(0x000000, 8, 25);

const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
pmrem.dispose();

const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 60);
camera.position.set(0, 0.4, 10);

const key = new THREE.DirectionalLight(0xffffff, 2.2);
key.position.set(5, 8, 6);
scene.add(key);
const rim = new THREE.DirectionalLight(0xffffff, 1.6);
rim.position.set(-6, 3, -8);
scene.add(rim);
const ambient = new THREE.AmbientLight(0xffffff, 0.08);
scene.add(ambient);

/**
 * Capsule material whose cylinder section stretches per instance (aLen) while
 * the round caps stay round. anchorBottom grows bars up from their base.
 */
function capsuleMaterial(params, anchorBottom) {
  const mat = new THREE.MeshStandardMaterial(params);
  mat.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nattribute float aLen;")
      .replace(
        "#include <begin_vertex>",
        `#include <begin_vertex>
        float yapCore = clamp(transformed.y, -0.5, 0.5);
        transformed.y = yapCore * aLen + (transformed.y - yapCore);
        ${anchorBottom ? "transformed.y += aLen * 0.5 + 0.5;" : ""}`,
      );
  };
  return mat;
}

/* ---------------- Mark: seven capsules measured from the Yap logo ---------------- */

const MARK = [
  { x: -2.204, w: 0.515, h: 0.893 },
  { x: -1.462, w: 0.55, h: 1.751 },
  { x: -0.762, w: 0.446, h: 1.408 },
  { x: 0, w: 0.687, h: 3.2 },
  { x: 0.762, w: 0.446, h: 1.408 },
  { x: 1.462, w: 0.55, h: 1.751 },
  { x: 2.197, w: 0.52, h: 0.893 },
];

const markGeo = new THREE.CapsuleGeometry(0.5, 1, 8, isSmall ? 20 : 28);
const markLen = new THREE.InstancedBufferAttribute(
  new Float32Array(MARK.length),
  1,
);
markLen.setUsage(THREE.DynamicDrawUsage);
markGeo.setAttribute("aLen", markLen);

const markMat = capsuleMaterial(
  { color: 0xffffff, metalness: 1, roughness: 0.14, envMapIntensity: 1.25 },
  false,
);
const mark = new THREE.InstancedMesh(markGeo, markMat, MARK.length);
mark.frustumCulled = false;
const markGroup = new THREE.Group();
markGroup.add(mark);
scene.add(markGroup);

const dummy = new THREE.Object3D();
MARK.forEach((b, i) => {
  dummy.position.set(b.x, 0, 0);
  dummy.scale.setScalar(b.w);
  dummy.updateMatrix();
  mark.setMatrixAt(i, dummy.matrix);
});
mark.instanceMatrix.needsUpdate = true;

/* ---------------- Field: a floor of small capsules rippling with sound ---------------- */

// Low-poly capsules: they're tiny on screen, so 4×8 segments is plenty.
const COLS = isSmall ? 30 : lowPower ? 46 : 58;
const ROWS = isSmall ? 40 : 44;
const GAP = isSmall ? 0.46 : 0.44;
const FLOOR_Y = -3.1;
const FIELD_W = 0.14;
const fieldCount = COLS * ROWS;

const fieldGeo = new THREE.CapsuleGeometry(0.5, 1, 3, 8);
const fieldLen = new THREE.InstancedBufferAttribute(
  new Float32Array(fieldCount),
  1,
);
fieldLen.setUsage(THREE.DynamicDrawUsage);
fieldGeo.setAttribute("aLen", fieldLen);

const fieldMat = capsuleMaterial(
  { color: 0x8a8a8a, metalness: 0.8, roughness: 0.38, envMapIntensity: 0.55 },
  true,
);
const field = new THREE.InstancedMesh(fieldGeo, fieldMat, fieldCount);
field.frustumCulled = false;

// Precompute everything that doesn't change per frame.
const fDist = new Float32Array(fieldCount);
const fSwirl = new Float32Array(fieldCount);
const fPhase = new Float32Array(fieldCount);
const fFall = new Float32Array(fieldCount);
{
  let n = 0;
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const x = (c - (COLS - 1) / 2) * GAP;
      const z = 3 - r * GAP;
      dummy.position.set(x, FLOOR_Y, z);
      dummy.scale.setScalar(FIELD_W);
      dummy.updateMatrix();
      field.setMatrixAt(n, dummy.matrix);
      const d = Math.hypot(x, (z + 4) * 1.1);
      fDist[n] = d * 1.15;
      fSwirl[n] = Math.atan2(z + 4, x) * 3 + d * 0.2;
      fPhase[n] = Math.random() * Math.PI * 2;
      fFall[n] = Math.exp(-d * 0.11);
      n++;
    }
  }
  field.instanceMatrix.needsUpdate = true;
}
scene.add(field);

/* ---------------- Theme ---------------- */

const THEMES = {
  dark: {
    bg: new THREE.Color(0x000000),
    mark: new THREE.Color(0xffffff),
    markMetal: 1,
    markRough: 0.14,
    field: new THREE.Color(0x8a8a8a),
    fieldMetal: 0.8,
    exposure: 1.05,
    ambient: 0.08,
  },
  light: {
    bg: new THREE.Color(0xfafafa),
    mark: new THREE.Color(0x111111),
    markMetal: 0.35,
    markRough: 0.18,
    field: new THREE.Color(0xbdbdbd),
    fieldMetal: 0.15,
    exposure: 1,
    ambient: 0.5,
  },
};
let themeTarget =
  THEMES[document.documentElement.dataset.theme === "light" ? "light" : "dark"];
let themeMix = 1;
const cur = {
  bg: themeTarget.bg.clone(),
  mark: themeTarget.mark.clone(),
  field: themeTarget.field.clone(),
  markMetal: themeTarget.markMetal,
  markRough: themeTarget.markRough,
  fieldMetal: themeTarget.fieldMetal,
  exposure: themeTarget.exposure,
  ambient: themeTarget.ambient,
};
let start = {
  ...cur,
  bg: cur.bg.clone(),
  mark: cur.mark.clone(),
  field: cur.field.clone(),
};

function applyTheme(k) {
  const lerp = (a, b) => a + (b - a) * k;
  cur.bg.copy(start.bg).lerp(themeTarget.bg, k);
  cur.mark.copy(start.mark).lerp(themeTarget.mark, k);
  cur.field.copy(start.field).lerp(themeTarget.field, k);
  scene.background.copy(cur.bg);
  scene.fog.color.copy(cur.bg);
  markMat.color.copy(cur.mark);
  markMat.metalness = lerp(start.markMetal, themeTarget.markMetal);
  markMat.roughness = lerp(start.markRough, themeTarget.markRough);
  fieldMat.color.copy(cur.field);
  fieldMat.metalness = lerp(start.fieldMetal, themeTarget.fieldMetal);
  renderer.toneMappingExposure = lerp(start.exposure, themeTarget.exposure);
  ambient.intensity = lerp(start.ambient, themeTarget.ambient);
}
applyTheme(1);

YAP.setTheme = (name) => {
  start = {
    bg: cur.bg.clone(),
    mark: cur.mark.clone(),
    field: cur.field.clone(),
    markMetal: markMat.metalness,
    markRough: markMat.roughness,
    fieldMetal: fieldMat.metalness,
    exposure: renderer.toneMappingExposure,
    ambient: ambient.intensity,
  };
  themeTarget = THEMES[name] || THEMES.dark;
  themeMix = reduceMotion ? 1 : 0;
  if (reduceMotion) {
    applyTheme(1);
    requestRender();
  }
};

/* ---------------- Layout, input, scroll ---------------- */

const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
if (window.matchMedia("(hover: hover)").matches) {
  window.addEventListener(
    "pointermove",
    (e) => {
      pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.ty = (e.clientY / window.innerHeight) * 2 - 1;
      if (reduceMotion) requestRender();
    },
    { passive: true },
  );
}

let layout = { x: 2.5, y: 0.75, s: 0.92 };
function resize() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  const aspect = w / h;
  if (aspect > 1.25) layout = { x: 2.45, y: 0.7, s: 0.9 };
  else if (aspect > 0.9) layout = { x: 1.4, y: 1.3, s: 0.75 };
  else layout = { x: 0, y: 1.75, s: 0.56 };
  requestRender();
}
let resizeRaf = 0;
window.addEventListener("resize", () => {
  cancelAnimationFrame(resizeRaf);
  resizeRaf = requestAnimationFrame(resize);
});

const scrollState = { hero: 0, page: 0 };
function readScroll() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  scrollState.hero = Math.min(1, window.scrollY / window.innerHeight);
  scrollState.page = max > 0 ? window.scrollY / max : 0;
  if (reduceMotion) requestRender();
}
window.addEventListener("scroll", readScroll, { passive: true });
readScroll();

/* ---------------- Animation ---------------- */

function speech(t, i) {
  const phrase = Math.max(0, Math.sin(t * 0.9) * 0.8 + 0.45);
  const syl = Math.pow(Math.abs(Math.sin(t * 5.6 + i * 0.7)), 1.6);
  const jitter =
    0.5 + 0.5 * Math.sin(t * 13.1 + i * 2.3) * Math.sin(t * 3.7 - i);
  return Math.min(1, phrase * (0.35 + 0.65 * syl) * (0.6 + 0.4 * jitter));
}

const easeOutBack = (x) =>
  1 + 2.5 * Math.pow(x - 1, 3) + 1.5 * Math.pow(x - 1, 2);

const clockStart = performance.now();
let introStart = -1;
let energy = 0;
const smoothBands = new Float32Array(7);

YAP.startIntro = () => {
  if (introStart < 0) introStart = performance.now();
  requestRender();
};

// Adaptive quality: if the first ~2 seconds run slow, drop resolution.
let perfFrames = 0;
let perfTime = 0;
let lastNow = 0;
let frameSkip = false;
let tick = 0;

function render(now) {
  const dt = lastNow ? now - lastNow : 16;
  lastNow = now;

  if (perfFrames < 120 && introStart > 0) {
    perfFrames++;
    perfTime += dt;
    if (perfFrames === 120 && perfTime / 120 > 22 && dprCap > 1) {
      dprCap = 1;
      renderer.setPixelRatio(1);
      renderer.setSize(window.innerWidth, window.innerHeight, false);
    }
  }

  // Past the hero the scene is a dim backdrop, so 30fps is enough.
  tick++;
  frameSkip = scrollState.hero >= 1 && !YAP.mic.active;
  if (frameSkip && tick % 2) return;

  const t = reduceMotion ? 2.4 : (now - clockStart) / 1000;
  const intro = reduceMotion
    ? 1
    : introStart < 0
      ? 0
      : Math.min(1, (now - introStart) / 1600);

  if (themeMix < 1) {
    themeMix = Math.min(1, themeMix + dt / 650);
    const k =
      themeMix < 0.5
        ? 2 * themeMix * themeMix
        : 1 - Math.pow(-2 * themeMix + 2, 2) / 2;
    applyTheme(k);
  }

  pointer.x += (pointer.tx - pointer.x) * 0.05;
  pointer.y += (pointer.ty - pointer.y) * 0.05;

  const mic = YAP.mic;
  let globalE;
  if (mic.active) {
    for (let i = 0; i < 7; i++)
      smoothBands[i] += (mic.bands[i] - smoothBands[i]) * 0.35;
    globalE = Math.min(1, mic.level * 1.6);
  } else {
    for (let i = 0; i < 7; i++)
      smoothBands[i] += (speech(t, i) - smoothBands[i]) * 0.25;
    globalE = 0.25 + 0.5 * speech(t * 0.7, 3);
  }
  energy += (globalE - energy) * 0.08;

  for (let i = 0; i < MARK.length; i++) {
    const b = MARK[i];
    const local = Math.max(
      0,
      Math.min(1, intro * 1.7 - Math.abs(i - 3) * 0.12),
    );
    const grow = local === 0 ? 0 : easeOutBack(local);
    const voice = mic.active
      ? 0.45 + smoothBands[i] * 1.1
      : 0.78 + smoothBands[i] * 0.34;
    const w = b.w * Math.min(1, Math.max(0.001, grow));
    const height = Math.max(w, b.h * voice * grow);
    dummy.position.set(b.x, 0, 0);
    dummy.scale.setScalar(w);
    dummy.updateMatrix();
    mark.setMatrixAt(i, dummy.matrix);
    markLen.array[i] = Math.max(0, height / w - 1);
  }
  mark.instanceMatrix.needsUpdate = true;
  markLen.needsUpdate = true;
  mark.visible = intro > 0;

  const amp = (0.25 + energy * 1.35) * Math.min(1, intro * 1.4);
  const k = t * 2.4;
  const sw = t * 0.6;
  const sh2 = t * 2.1;
  const arr = fieldLen.array;
  const inv = 1 / FIELD_W;
  const shimmer = 0.06 * Math.min(1, intro * 1.4);
  for (let n = 0; n < fieldCount; n++) {
    const ripple = Math.sin(fDist[n] - k) * 0.5 + 0.5;
    const swirl = Math.sin(fSwirl[n] + sw) * 0.5 + 0.5;
    const h =
      0.02 +
      amp * fFall[n] * (ripple * 0.8 + swirl * 0.25) +
      (Math.sin(sh2 + fPhase[n]) * 0.5 + 0.5) * shimmer;
    arr[n] = h * inv;
  }
  fieldLen.needsUpdate = true;

  const s = scrollState.hero;
  const p = scrollState.page;
  markGroup.position.set(
    layout.x * (1 - s),
    layout.y * (1 - s) - s * 0.5,
    -s * 7,
  );
  markGroup.scale.setScalar(layout.s * (1 - s * 0.15));
  markGroup.rotation.y =
    pointer.x * 0.45 +
    p * Math.PI * 2 +
    (reduceMotion ? 0 : Math.sin(t * 0.35) * 0.12);
  markGroup.rotation.x = pointer.y * 0.18;
  markGroup.rotation.z = -pointer.x * 0.04;

  camera.position.x = pointer.x * 0.6;
  camera.position.y = 0.4 + s * 1.4 - pointer.y * 0.35;
  camera.position.z = 10 - s * 1.5;
  camera.lookAt(0, 0.3 - s * 1.1, 0);
  field.rotation.y = p * 0.6;

  renderer.render(scene, camera);
}

let pending = false;
function requestRender() {
  if (!reduceMotion || pending) return;
  pending = true;
  requestAnimationFrame((now) => {
    pending = false;
    render(now);
  });
}

resize();

// Compile shaders and draw one frame before telling the page we're ready,
// so the reveal never shows a half-built scene.
renderer.compile(scene, camera);
render(performance.now());
announceReady();

if (!reduceMotion) renderer.setAnimationLoop(render);
