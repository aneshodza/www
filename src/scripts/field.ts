/**
 * The field: a volumetric point lattice rendered in WebGL2, no libraries.
 *
 * Point positions are derived from gl_VertexID, so there are no attribute
 * buffers, no geometry upload and one draw call. The whole scene is ten
 * uniforms written once per frame.
 *
 * The trick the home page is built on: an axis-aligned lattice viewed from
 * directly overhead collapses — every depth layer projects onto the same
 * point, so it reads as a flat two-dimensional grid. Tilting the camera
 * separates the layers and the flat surface unfolds into depth.
 */

type Vec3 = [number, number, number];

const VERT = /* glsl */ `#version 300 es
precision highp float;

uniform mat4  uViewProj;
uniform vec3  uEye;
uniform float uTime;
uniform float uCamY;
uniform vec2  uPointer;     // NDC, (2,2) when absent
uniform float uPointerAmt;
uniform float uDepth;       // 0 surface .. 1 silicon
uniform float uPointScale;
uniform float uAspect;
uniform vec3  uCold;
uniform vec3  uWarm;
uniform float uDensity;     // 0..1, how much of the lattice is lit
uniform float uLayers;
uniform float uRadius;
uniform float uOpen;

out vec4 vColor;

const float GX     = 46.0;
const float GZ     = 46.0;
const float SPACE  = 2.05;
const float LAYH   = 2.35;

float hash(float n) {
  return fract(sin(n * 12.9898) * 43758.5453);
}

void main() {
  float i  = float(gl_VertexID);
  float ix = mod(i, GX);
  float iz = mod(floor(i / GX), GZ);
  float iy = floor(i / (GX * GZ));

  float span = uLayers * LAYH;

  vec3 p;
  float bx = (ix - GX * 0.5 + 0.5) * SPACE;
  float bz = (iz - GZ * 0.5 + 0.5) * SPACE;
  // Wrap the lattice into a band that travels with the camera, so the
  // descent never runs out of machine.
  p.y = -(mod(iy * LAYH - uCamY, span)) + span * 0.5;

  // Each layer is rotated a little further than the one above it. Without
  // this the columns line up and the whole thing collapses into a starburst
  // the moment the camera leaves vertical; with it the lattice reads as a
  // structure, and descending turns it like a screw.
  float lyIdx = (p.y + span * 0.5) / LAYH;
  float tw = lyIdx * 0.052;
  float cs = cos(tw), sn = sin(tw);
  p.x = bx * cs - bz * sn;
  p.z = bx * sn + bz * cs;

  // A slow breath through the structure. Shallow at the surface so the plane
  // still reads as a plane, deeper once the layers open.
  float breathe = 0.11 + uDepth * 0.52;
  p.y += sin(p.x * 0.14 + uTime * 0.42) * cos(p.z * 0.12 - uTime * 0.31) * breathe;
  p.x += sin(p.y * 0.1 + uTime * 0.19) * breathe * 0.5;

  float dist = distance(p, uEye);

  vec4 clip = uViewProj * vec4(p, 1.0);

  // Pointer repulsion, applied in clip space: cheap, and it reads exactly as
  // the field parting around the cursor.
  if (uPointerAmt > 0.001 && clip.w > 0.0) {
    vec2 ndc = clip.xy / clip.w;
    vec2 d = (ndc - uPointer) * vec2(uAspect, 1.0);
    float r = length(d);
    float push = uPointerAmt * 0.19 * exp(-r * r * 7.0);
    clip.xy += normalize(d + 1e-5) * push * vec2(1.0 / uAspect, 1.0) * clip.w;
  }

  float sparkle = hash(ix * 3.1 + iz * 7.7 + iy * 13.3);

  gl_Position = clip;
  gl_PointSize = clamp(uPointScale * mix(0.8, 1.25, sparkle) / max(dist, 0.5), 1.0, 10.0);

  // Colour temperature by absolute depth in the lattice, not by screen
  // position: the field genuinely warms as you descend. The heat arrives late
  // -- most of the descent is still cold -- and the midpoint is re-saturated,
  // because a straight blue-to-amber ramp passes through grey.
  float ly0  = (p.y + span * 0.5) / span;
  float warm = clamp(smoothstep(0.42, 1.0, uDepth) * 1.2 - ly0 * 0.3, 0.0, 1.0);
  vec3 rgb = mix(uCold, uWarm, warm);
  float lum = dot(rgb, vec3(0.2126, 0.7152, 0.0722));
  rgb = mix(vec3(lum), rgb, 1.0 + 0.85 * (1.0 - abs(warm * 2.0 - 1.0)));

  // Hide the wrap seam and hold the far field back. Relative to the camera
  // radius, so it survives the focal-length sweep.
  float dn   = dist / uRadius;
  float near = smoothstep(0.05, 0.3, dn);
  float far  = 1.0 - smoothstep(1.0, 2.25, dn);

  // The reveal. At the surface only one layer is lit, so what you see is a
  // single flat plane. Descending lights the layers underneath it.
  //
  // Measured downward from the top of the wrapping band, so both ends of the
  // wrap get a complete fade. Anything that pops into existence at the seam
  // reads as a flicker -- and at the surface a whole plane crosses it at once.
  float dz   = 1.0 - ly0;
  float band = 0.065 + uOpen * 1.05;
  float open = 1.0 - smoothstep(band * 0.6, band, dz);
  open *= smoothstep(0.0, 0.024, dz) * (1.0 - smoothstep(0.95, 1.0, dz));

  // At the surface the lattice must read as an intact grid, so nothing is
  // culled there; deeper down the thinning is what keeps it legible.
  float cull = step(sparkle, 0.14 + uDensity * 0.86);
  float keep = mix(1.0, cull, smoothstep(0.02, 0.3, uOpen));

  // Weight rather than kill: the grid survives, with texture in it.
  float weight = mix(0.74, 1.0, sparkle);
  float flicker = mix(
    1.0,
    0.82 + 0.18 * sin(uTime * 0.5 + sparkle * 28.0),
    smoothstep(0.02, 0.3, uOpen)
  );

  vColor = vec4(rgb, near * far * open * keep * weight * flicker * 0.95);
}
`;

const FRAG = /* glsl */ `#version 300 es
precision highp float;

in vec4 vColor;
out vec4 fragColor;

void main() {
  // Round, soft-edged sprite. No texture fetch.
  vec2 c = gl_PointCoord - 0.5;
  float d = dot(c, c);
  if (d > 0.25) discard;
  float a = vColor.a * (1.0 - smoothstep(0.04, 0.25, d));
  fragColor = vec4(vColor.rgb * a, a);
}
`;

/** Critically-ish damped spring. Physical, interruptible, no keyframes. */
class Spring {
  value: number;
  target: number;
  private velocity = 0;

  constructor(
    value: number,
    private readonly stiffness = 90,
    private readonly damping = 17,
  ) {
    this.value = value;
    this.target = value;
  }

  step(dt: number): number {
    // Sub-stepped so a dropped frame cannot make the spring explode.
    const steps = Math.min(6, Math.max(1, Math.ceil(dt / 0.008)));
    const h = dt / steps;
    for (let i = 0; i < steps; i++) {
      const a = (this.target - this.value) * this.stiffness - this.velocity * this.damping;
      this.velocity += a * h;
      this.value += this.velocity * h;
    }
    return this.value;
  }

  jump(v: number): void {
    this.value = v;
    this.target = v;
    this.velocity = 0;
  }

  get settled(): boolean {
    return Math.abs(this.target - this.value) < 1e-4 && Math.abs(this.velocity) < 1e-3;
  }
}

function compile(gl: WebGL2RenderingContext, type: number, src: string): WebGLShader | null {
  const sh = gl.createShader(type);
  if (!sh) return null;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  // Deliberately not read back here: querying COMPILE_STATUS blocks until the
  // driver is done. The link status is polled asynchronously instead.
  return sh;
}

interface ParallelCompile {
  COMPLETION_STATUS_KHR: number;
}

/** Waits for a program to finish linking without blocking the main thread. */
function whenLinked(gl: WebGL2RenderingContext, prog: WebGLProgram): Promise<void> {
  const ext = gl.getExtension('KHR_parallel_shader_compile') as ParallelCompile | null;
  if (!ext) {
    // No async path: yield one frame so the wait lands outside first input.
    return new Promise((r) => requestAnimationFrame(() => r()));
  }
  return new Promise((resolve) => {
    let tries = 0;
    const poll = () => {
      if (tries++ > 300 || gl.getProgramParameter(prog, ext.COMPLETION_STATUS_KHR)) {
        resolve();
        return;
      }
      requestAnimationFrame(poll);
    };
    requestAnimationFrame(poll);
  });
}

function perspective(out: Float32Array, fovy: number, aspect: number, near: number, far: number) {
  const f = 1 / Math.tan(fovy / 2);
  out.fill(0);
  out[0] = f / aspect;
  out[5] = f;
  out[11] = -1;
  out[10] = (far + near) / (near - far);
  out[14] = (2 * far * near) / (near - far);
}

function lookAt(out: Float32Array, eye: Vec3, center: Vec3, up: Vec3) {
  let zx = eye[0] - center[0], zy = eye[1] - center[1], zz = eye[2] - center[2];
  let len = Math.hypot(zx, zy, zz) || 1;
  zx /= len; zy /= len; zz /= len;

  let xx = up[1] * zz - up[2] * zy;
  let xy = up[2] * zx - up[0] * zz;
  let xz = up[0] * zy - up[1] * zx;
  len = Math.hypot(xx, xy, xz) || 1;
  xx /= len; xy /= len; xz /= len;

  const yx = zy * xz - zz * xy;
  const yy = zz * xx - zx * xz;
  const yz = zx * xy - zy * xx;

  out[0] = xx; out[1] = yx; out[2] = zx; out[3] = 0;
  out[4] = xy; out[5] = yy; out[6] = zy; out[7] = 0;
  out[8] = xz; out[9] = yz; out[10] = zz; out[11] = 0;
  out[12] = -(xx * eye[0] + xy * eye[1] + xz * eye[2]);
  out[13] = -(yx * eye[0] + yy * eye[1] + yz * eye[2]);
  out[14] = -(zx * eye[0] + zy * eye[1] + zz * eye[2]);
  out[15] = 1;
}

function multiply(out: Float32Array, a: Float32Array, b: Float32Array) {
  for (let c = 0; c < 4; c++) {
    const b0 = b[c * 4]!, b1 = b[c * 4 + 1]!, b2 = b[c * 4 + 2]!, b3 = b[c * 4 + 3]!;
    out[c * 4] = a[0]! * b0 + a[4]! * b1 + a[8]! * b2 + a[12]! * b3;
    out[c * 4 + 1] = a[1]! * b0 + a[5]! * b1 + a[9]! * b2 + a[13]! * b3;
    out[c * 4 + 2] = a[2]! * b0 + a[6]! * b1 + a[10]! * b2 + a[14]! * b3;
    out[c * 4 + 3] = a[3]! * b0 + a[7]! * b1 + a[11]! * b2 + a[15]! * b3;
  }
}

/**
 * Pixels of scrolling that one full page `range` unfolds over. Raise it to
 * slow the whole background effect down, lower it to speed it up; nothing
 * else about the motion changes.
 */
const SCROLL_SPAN = 1900;

/** Smoothstep between two edges. */
function ease(a: number, b: number, x: number): number {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

const hexToRgb = (hex: string): Vec3 => {
  const h = hex.trim().replace('#', '');
  const n = parseInt(h.length === 3 ? h.replace(/./g, (c) => c + c) : h, 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

export interface FieldOptions {
  /** Depth at the top of this page, 0 surface .. 1 silicon. */
  base: number;
  /** How much further the page descends over its full scroll. */
  range: number;
  /** How loud the field is on this page. Reading pages render cheaper. */
  strength: number;
}

export interface FieldHandle {
  destroy(): void;
  configure(opts: FieldOptions): void;
}

export async function mountField(
  canvas: HTMLCanvasElement,
  initial: FieldOptions,
): Promise<FieldHandle | null> {
  const gl = canvas.getContext('webgl2', {
    alpha: true,
    antialias: false,
    depth: false,
    premultipliedAlpha: true,
    powerPreference: 'low-power',
  });
  if (!gl) return null;

  const vs = compile(gl, gl.VERTEX_SHADER, VERT);
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return null;

  const prog = gl.createProgram()!;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);

  await whenLinked(gl, prog);

  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.warn(gl.getProgramInfoLog(prog), gl.getShaderInfoLog(vs), gl.getShaderInfoLog(fs));
    return null;
  }
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  gl.useProgram(prog);

  const u = {
    viewProj: gl.getUniformLocation(prog, 'uViewProj'),
    eye: gl.getUniformLocation(prog, 'uEye'),
    time: gl.getUniformLocation(prog, 'uTime'),
    camY: gl.getUniformLocation(prog, 'uCamY'),
    pointer: gl.getUniformLocation(prog, 'uPointer'),
    pointerAmt: gl.getUniformLocation(prog, 'uPointerAmt'),
    depth: gl.getUniformLocation(prog, 'uDepth'),
    pointScale: gl.getUniformLocation(prog, 'uPointScale'),
    aspect: gl.getUniformLocation(prog, 'uAspect'),
    cold: gl.getUniformLocation(prog, 'uCold'),
    warm: gl.getUniformLocation(prog, 'uWarm'),
    density: gl.getUniformLocation(prog, 'uDensity'),
    layers: gl.getUniformLocation(prog, 'uLayers'),
    radius: gl.getUniformLocation(prog, 'uRadius'),
    open: gl.getUniformLocation(prog, 'uOpen'),
  };

  // Budget. The field is a soft point cloud, so it gains nothing from a 2x
  // backing store; resolution is the dominant per-frame cost because the
  // canvas is a full-viewport fixed layer the compositor re-uploads every
  // frame. Pages that composite it faintly render it cheaper still.
  const coarse = matchMedia('(pointer: coarse)').matches;
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
  const lean = coarse || mem <= 4;
  const showpiece = initial.strength >= 1 && !lean;

  const layers = lean ? 16 : showpiece ? 26 : 18;
  const density = lean ? 0.62 : showpiece ? 0.58 : 0.56;
  const count = 46 * 46 * layers;
  const span = layers * 2.35;
  const dprCap = showpiece ? 1.5 : 1.25;

  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  gl.disable(gl.DEPTH_TEST);
  gl.enable(gl.BLEND);

  const proj = new Float32Array(16);
  const view = new Float32Array(16);
  const viewProj = new Float32Array(16);

  const still = !matchMedia('(prefers-reduced-motion: no-preference)').matches;

  // Camera state. Every one of these is a spring, so scroll, pointer and
  // theme changes interrupt each other cleanly instead of fighting.
  const sDescent = new Spring(initial.base, 42, 13);
  const sYaw = new Spring(0, 26, 11);
  const sTiltX = new Spring(0, 34, 12);
  const sPointer = new Spring(0, 90, 16);

  let opts = initial;
  let pointerX = 2;
  let pointerY = 2;
  let camY = 0;
  let dpr = 1;
  let width = 0;
  let height = 0;
  let raf = 0;
  let last = 0;
  let clock = 0;
  let running = false;
  let visible = true;
  let aspect = 1;
  let cold: Vec3 = [0.23, 0.36, 1];
  let warm: Vec3 = [1, 0.6, 0.18];
  let lastDepthWrite = -1;

  function readTheme() {
    const cs = getComputedStyle(document.documentElement);
    const c = cs.getPropertyValue('--signal').trim();
    const w = cs.getPropertyValue('--ember').trim();
    if (c) cold = hexToRgb(c);
    if (w) warm = hexToRgb(w);
    // Dark mode glows (additive); light mode is ink laid onto porcelain.
    const isDark = document.documentElement.classList.contains('dark');
    gl!.blendFunc(gl!.ONE, isDark ? gl!.ONE : gl!.ONE_MINUS_SRC_ALPHA);
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, dprCap);
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    width = Math.round(w * dpr);
    height = Math.round(h * dpr);
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    gl!.viewport(0, 0, width, height);
    aspect = w / h;
  }

  /** The still frame is held at a three-quarter view: a photogram, never flat. */
  function stillDepth(o: FieldOptions): number {
    return Math.max(0.34, o.base + scrollProgress() * o.range);
  }

  /**
   * How far through this page's descent the scroll position is, 0..1.
   *
   * Measured against a fixed distance rather than the page's own height: with
   * normalised progress a short page runs its whole descent over very few
   * pixels, which is what made the field feel like it was racing. One full
   * `range` now always unfolds over SCROLL_SPAN pixels, so the rate is the
   * same everywhere and is a single number to tune.
   */
  function scrollProgress(): number {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (max <= 4) return 0;
    return Math.min(1, Math.max(0, window.scrollY / SCROLL_SPAN));
  }

  function draw(dt: number) {
    clock += dt;

    const descent = still ? sDescent.target : sDescent.step(dt);
    const yaw = still ? sYaw.target : sYaw.step(dt);
    const tiltX = still ? sTiltX.target : sTiltX.step(dt);
    const pAmt = still ? 0 : sPointer.step(dt);

    // Pitch runs from all-but-vertical (the lattice collapses into a flat
    // grid) to almost horizontal (maximum apparent depth). The focal length
    // opens as the camera closes in -- a dolly zoom, so the surface does not
    // just tilt, it swells open.
    // Two curves, not one. The camera tips early and fast so the plane is
    // seen obliquely before anything under it lights up; the layers open
    // afterwards, which is what turns a tilted plane into a volume.
    const e = ease(0, 0.3, descent) * 0.62 + ease(0.26, 1, descent) * 0.38;
    const open = ease(0.0, 0.8, descent);

    const pitch = ((89.4 - e * 74.5) * Math.PI) / 180;
    const fov = (23 + e * 34) * (Math.PI / 180);
    const aspectPull = Math.min(1.85, Math.max(1, 0.92 / aspect));
    const radius = (152 - e * 124) * aspectPull;
    const spin = clock * 0.0075;
    const yawA = yaw + 0.42 + spin + e * 0.35;

    perspective(proj, fov, aspect, Math.max(0.4, radius * 0.02), radius * 4.5);
    // Point size in pixels for a sphere of fixed world radius under the
    // current lens, so the field keeps its density as the lens sweeps.
    const pointPx = ((lean ? 0.185 : 0.235) * height) / (2 * Math.tan(fov / 2));

    // The lattice only travels once it has opened. While a single plane is
    // lit, moving it reads as that plane sliding away and a new one snapping
    // in behind -- so the travel rides the same curve as the reveal, squared
    // to ramp in gently once there are enough layers to hide the handoff.
    camY = open * open * span * 0.55;

    const cp = Math.cos(pitch + tiltX * 0.12);
    const sp = Math.sin(pitch + tiltX * 0.12);
    const eye: Vec3 = [
      Math.sin(yawA) * cp * radius,
      sp * radius,
      Math.cos(yawA) * cp * radius,
    ];
    const target: Vec3 = [0, -e * 6, 0];

    lookAt(view, eye, target, [0, 1, 0]);
    multiply(viewProj, proj, view);

    gl!.clearColor(0, 0, 0, 0);
    gl!.clear(gl!.COLOR_BUFFER_BIT);

    gl!.uniformMatrix4fv(u.viewProj, false, viewProj);
    gl!.uniform3f(u.eye, eye[0], eye[1], eye[2]);
    gl!.uniform1f(u.time, clock);
    gl!.uniform1f(u.camY, camY);
    gl!.uniform2f(u.pointer, pointerX, pointerY);
    gl!.uniform1f(u.pointerAmt, pAmt);
    gl!.uniform1f(u.depth, descent);
    gl!.uniform1f(u.pointScale, pointPx);
    gl!.uniform1f(u.aspect, aspect);
    gl!.uniform3f(u.cold, cold[0], cold[1], cold[2]);
    gl!.uniform3f(u.warm, warm[0], warm[1], warm[2]);
    gl!.uniform1f(u.density, density);
    gl!.uniform1f(u.layers, layers);
    gl!.uniform1f(u.radius, radius);
    gl!.uniform1f(u.open, open);

    gl!.drawArrays(gl!.POINTS, 0, count);

    const q = Math.round(descent * 90) / 90;
    if (q !== lastDepthWrite) {
      lastDepthWrite = q;
      document.documentElement.style.setProperty('--depth', String(q));
    }
  }

  function frame(now: number) {
    raf = requestAnimationFrame(frame);
    sDescent.target = opts.base + scrollProgress() * opts.range;
    const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
    last = now;
    draw(dt);
  }

  /** Restarts the loop after it has been parked by a hidden tab. */
  function wake() {
    if (still) return;
    if (!running) start();
  }

  function start() {
    if (running || still || !visible) return;
    running = true;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  }

  function stop() {
    if (!raf) return;
    cancelAnimationFrame(raf);
    raf = 0;
    running = false;
  }

  let scrollQueued = 0;
  function onScroll() {
    if (!still) {
      wake();
      return;
    }
    if (scrollQueued) return;
    // The still version tracks position, it just does not animate.
    scrollQueued = requestAnimationFrame(() => {
      scrollQueued = 0;
      sDescent.jump(stillDepth(opts));
      draw(0);
    });
  }

  /** Aims the repulsion at a viewport point. */
  function aimPointer(x: number, y: number, touch: boolean) {
    pointerX = (x / window.innerWidth) * 2 - 1;
    pointerY = 1 - (y / window.innerHeight) * 2;
    sPointer.target = 1;
    // A finger gets the same parting as a cursor with less of the parallax
    // torque: matching it on a phone swings the whole viewport.
    sYaw.target = pointerX * (touch ? 0.16 : 0.34);
    sTiltX.target = pointerY * (touch ? 0.24 : 0.5);
    wake();
  }

  function releasePointer() {
    sPointer.target = 0;
    sYaw.target = 0;
    sTiltX.target = 0;
    wake();
  }

  function onPointerMove(ev: PointerEvent) {
    if (still || ev.pointerType !== 'mouse') return;
    aimPointer(ev.clientX, ev.clientY, false);
  }

  // Touch is handled through touch events rather than pointer events: the
  // browser fires pointercancel the instant a touch is claimed as a scroll,
  // which would drop the field the moment a finger started moving.
  function onTouch(ev: TouchEvent) {
    if (still) return;
    const t = ev.touches[0];
    if (t) aimPointer(t.clientX, t.clientY, true);
  }

  function onTouchEnd() {
    if (still) return;
    releasePointer();
  }

  function onPointerLeave() {
    releasePointer();
  }

  const onVisibility = () => {
    visible = document.visibilityState === 'visible';
    if (visible) start();
    else stop();
  };

  const themeObserver = new MutationObserver(() => {
    readTheme();
    if (still) draw(0);
    else wake();
  });

  const ro = new ResizeObserver(() => {
    resize();
    if (still) draw(0);
    else wake();
  });

  readTheme();
  resize();
  ro.observe(canvas);
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  document.addEventListener('visibilitychange', onVisibility);
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('touchstart', onTouch, { passive: true });
  window.addEventListener('touchmove', onTouch, { passive: true });
  window.addEventListener('touchend', onTouchEnd, { passive: true });
  window.addEventListener('touchcancel', onTouchEnd, { passive: true });
  document.addEventListener('pointerleave', onPointerLeave);

  if (still) {
    // One frame, held at a three-quarter view: a photogram of the lattice.
    sDescent.jump(stillDepth(initial));
    draw(0);
  } else {
    start();
  }

  return {
    destroy() {
      stop();
      ro.disconnect();
      themeObserver.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('touchstart', onTouch);
      window.removeEventListener('touchmove', onTouch);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', onTouchEnd);
      document.removeEventListener('pointerleave', onPointerLeave);
      gl.deleteProgram(prog);
      gl.deleteVertexArray(vao);
    },
    configure(next: FieldOptions) {
      opts = next;
      if (still) {
        sDescent.jump(stillDepth(next));
        draw(0);
      } else {
        sDescent.target = next.base + scrollProgress() * next.range;
        wake();
      }
    },
  };
}
