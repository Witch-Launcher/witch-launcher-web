// WebGPU 3D hero renderer — monochrome raymarched crystal + fbm aura.
// Falls back gracefully if WebGPU is unavailable.

const WGSL = /* wgsl */ `
struct U {
  res   : vec2f,
  time  : f32,
  scroll: f32,
  mouse : vec2f,
  pad0  : f32,
  pad1  : f32,
};
@group(0) @binding(0) var<uniform> u : U;

fn hash(p: vec3f) -> f32 {
  var q = fract(p * 0.3183099 + vec3f(0.1, 0.2, 0.3));
  q += dot(q, q.yzx + 19.19);
  return fract((q.x + q.y) * q.z);
}
fn noise(x: vec3f) -> f32 {
  let i = floor(x); let f = fract(x);
  let u2 = f * f * (3.0 - 2.0 * f);
  let n000 = hash(i + vec3f(0.0,0.0,0.0));
  let n100 = hash(i + vec3f(1.0,0.0,0.0));
  let n010 = hash(i + vec3f(0.0,1.0,0.0));
  let n110 = hash(i + vec3f(1.0,1.0,0.0));
  let n001 = hash(i + vec3f(0.0,0.0,1.0));
  let n101 = hash(i + vec3f(1.0,0.0,1.0));
  let n011 = hash(i + vec3f(0.0,1.0,1.0));
  let n111 = hash(i + vec3f(1.0,1.0,1.0));
  let nx00 = mix(n000, n100, u2.x);
  let nx10 = mix(n010, n110, u2.x);
  let nx01 = mix(n001, n101, u2.x);
  let nx11 = mix(n011, n111, u2.x);
  let nxy0 = mix(nx00, nx10, u2.y);
  let nxy1 = mix(nx01, nx11, u2.y);
  return mix(nxy0, nxy1, u2.z);
}
fn fbm(p: vec3f) -> f32 {
  var v = 0.0; var a = 0.5; var q = p;
  for (var i = 0; i < 5; i = i + 1) {
    v += a * noise(q);
    q = q * 2.02;
    a *= 0.5;
  }
  return v;
}

fn rotY(a: f32) -> mat3x3f {
  let c = cos(a); let s = sin(a);
  return mat3x3f(c, 0.0, s, 0.0, 1.0, 0.0, -s, 0.0, c);
}
fn rotX(a: f32) -> mat3x3f {
  let c = cos(a); let s = sin(a);
  return mat3x3f(1.0, 0.0, 0.0, 0.0, c, -s, 0.0, s, c);
}

fn sdOctahedron(p: vec3f, s: f32) -> f32 {
  var q = abs(p);
  let m = q.x + q.y + q.z - s;
  var o: vec3f;
  if (3.0 * q.x < m) { o = q.xyz; }
  else if (3.0 * q.y < m) { o = q.yzx; }
  else if (3.0 * q.z < m) { o = q.zxy; }
  else { return m * 0.57735027; }
  let k = clamp(0.5 * (o.z - o.y + s), 0.0, s);
  return length(vec3f(o.x, o.y - s + k, o.z - k));
}
fn sdTorus(p: vec3f, t: vec2f) -> f32 {
  let q = vec2f(length(p.xz) - t.x, p.y);
  return length(q) - t.y;
}

fn map(pin: vec3f) -> f32 {
  var p = rotY(u.time * 0.35) * rotX(0.5 + u.mouse.y * 1.2) * pin;
  // faceted gem (octahedron with subtle displacement)
  let disp = 0.04 * sin(p.x * 6.0) * sin(p.y * 6.0) * sin(p.z * 6.0);
  let gem = sdOctahedron(p, 1.0 + disp) - 0.04;
  // aura ring
  let ring = sdTorus(p, vec2f(1.7, 0.05));
  return min(gem, ring);
}

fn calcNormal(p: vec3f) -> vec3f {
  let e = vec2f(0.001, 0.0);
  return normalize(vec3f(
    map(p + e.xyy) - map(p - e.xyy),
    map(p + e.yxy) - map(p - e.yxy),
    map(p + e.yyx) - map(p - e.yyx)
  ));
}

fn background(uv: vec2f, rd: vec3f) -> vec3f {
  let n = fbm(rd * 3.0 + vec3f(0.0, u.time * 0.05, 0.0));
  let n2 = fbm(rd * 7.0 - vec3f(u.time * 0.03, 0.0, 0.0));
  var c = vec3f(0.02) + vec3f(n * 0.10) + vec3f(n2 * 0.04);
  // soft central glow
  let g = exp(-3.0 * length(uv));
  c += vec3f(g * 0.10);
  return c;
}

@vertex
fn vs(@builtin(vertex_index) vid: u32) -> @builtin(position) vec4f {
  var p = array<vec2f, 3>(vec2f(-1.0, -1.0), vec2f(3.0, -1.0), vec2f(-1.0, 3.0));
  return vec4f(p[vid], 0.0, 1.0);
}

@fragment
fn fs(@builtin(position) fc: vec4f) -> @location(0) vec4f {
  let uv = (fc.xy - 0.5 * u.res) / u.res.y;
  let t = u.time;

  let ang = t * 0.18 + u.mouse.x * 3.2;
  let dist = 3.3 - u.scroll * 1.6;
  let ro = vec3f(sin(ang) * dist, 0.2 + u.mouse.y * 1.0, cos(ang) * dist);
  let ta = vec3f(0.0, 0.0, 0.0);
  let fwd = normalize(ta - ro);
  let right = normalize(cross(vec3f(0.0, 1.0, 0.0), fwd));
  let up = cross(fwd, right);
  let rd = normalize(fwd * 1.4 + uv.x * right + uv.y * up);

  var p = ro;
  var d = 0.0;
  var hit = false;
  for (var i = 0; i < 96; i = i + 1) {
    let s = map(p);
    if (s < 0.001) { hit = true; break; }
    d += s;
    p += rd * s;
    if (d > 14.0) { break; }
  }

  var col = vec3f(0.0);
  var alpha = 0.0;
  if (hit) {
    let n = calcNormal(p);
    let lig = normalize(vec3f(0.5, 0.8, 0.4));
    let diff = clamp(dot(n, lig), 0.0, 1.0);
    let fres = pow(1.0 - clamp(dot(n, -rd), 0.0, 1.0), 3.0);
    let spec = pow(clamp(dot(reflect(-lig, n), -rd), 0.0, 1.0), 24.0);
    var c = vec3f(diff * 0.45 + 0.10);
    c += vec3f(fres) * 0.85;
    c += vec3f(spec) * 0.6;
    // depth fade
    c *= exp(-0.06 * d);
    let luma = max(c.r, max(c.g, c.b));
    alpha = clamp(0.55 + 0.45 * luma, 0.0, 1.0);
    col = c;
  }
  // premultiplied alpha -> transparent over the video background
  return vec4f(col * alpha, alpha);
}
`;

export class HeroWebGPU {
  constructor(canvas, onFallback) {
    this.canvas = canvas;
    this.onFallback = onFallback;
    this.mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    this.scroll = 0;
    this.running = false;
    this.supported = false;
  }

  async init() {
    if (!('gpu' in navigator)) { this._fallback('no-navigator'); return false; }
    let adapter;
    try { adapter = await navigator.gpu.requestAdapter(); }
    catch (e) { this._fallback('adapter-error'); return false; }
    if (!adapter) { this._fallback('no-adapter'); return false; }
    let device;
    try { device = await adapter.requestDevice(); }
    catch (e) { this._fallback('device-error'); return false; }
    this.device = device;
    this.ctx = this.canvas.getContext('webgpu');
    this.format = navigator.gpu.getPreferredCanvasFormat();
    this.ctx.configure({ device, format: this.format, alphaMode: 'premultiplied' });

    const module = device.createShaderModule({ code: WGSL });
    this.pipeline = device.createRenderPipeline({
      layout: 'auto',
      vertex: { module, entryPoint: 'vs' },
      fragment: { module, entryPoint: 'fs', targets: [{ format: this.format }] },
      primitive: { topology: 'triangle-list' },
    });

    this.uniformData = new ArrayBuffer(32);
    this.uniformView = new Float32Array(this.uniformData);
    this.uniformBuffer = device.createBuffer({
      size: 32,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    this.bindGroup = device.createBindGroup({
      layout: this.pipeline.getBindGroupLayout(0),
      entries: [{ binding: 0, resource: { buffer: this.uniformBuffer } }],
    });

    this.supported = true;
    this._resize();
    this._bindEvents();
    return true;
  }

  _fallback(reason) {
    if (this.onFallback) this.onFallback(reason);
  }

  _resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.max(1, Math.floor(this.canvas.clientWidth * dpr));
    const h = Math.max(1, Math.floor(this.canvas.clientHeight * dpr));
    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = w; this.canvas.height = h;
    }
    if (this.ctx) this.ctx.configure({ device: this.device, format: this.format, alphaMode: 'premultiplied' });
  }

  _bindEvents() {
    const c = this.canvas;
    let dragging = false, lx = 0, ly = 0;
    c.addEventListener('pointerdown', (e) => { dragging = true; lx = e.clientX; ly = e.clientY; c.setPointerCapture(e.pointerId); });
    c.addEventListener('pointerup', (e) => { dragging = false; });
    c.addEventListener('pointermove', (e) => {
      if (dragging) {
        this.mouse.tx += (e.clientX - lx) * 0.005;
        this.mouse.ty += (e.clientY - ly) * 0.005;
        this.mouse.ty = Math.max(-0.9, Math.min(0.9, this.mouse.ty));
        lx = e.clientX; ly = e.clientY;
      }
    });
    window.addEventListener('resize', () => this._resize());
    window.addEventListener('scroll', () => {
      const max = document.body.scrollHeight - window.innerHeight;
      this.scroll = max > 0 ? window.scrollY / max : 0;
    }, { passive: true });
  }

  start() {
    if (!this.supported) return;
    this.running = true;
    this.startTime = performance.now();
    const loop = () => {
      if (!this.running) return;
      this._frame();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  stop() { this.running = false; }

  _frame() {
    const now = performance.now();
    const t = (now - this.startTime) / 1000;
    // smooth mouse
    this.mouse.x += (this.mouse.tx - this.mouse.x) * 0.08;
    this.mouse.y += (this.mouse.ty - this.mouse.y) * 0.08;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = this.canvas.width, h = this.canvas.height;
    this.uniformView[0] = w;
    this.uniformView[1] = h;
    this.uniformView[2] = t;
    this.uniformView[3] = this.scroll;
    this.uniformView[4] = this.mouse.x;
    this.uniformView[5] = this.mouse.y;
    this.uniformView[6] = 0;
    this.uniformView[7] = 0;
    this.device.queue.writeBuffer(this.uniformBuffer, 0, this.uniformData);

    const encoder = this.device.createCommandEncoder();
    const view = this.ctx.getCurrentTexture().createView();
    const pass = encoder.beginRenderPass({
      colorAttachments: [{ view, clearValue: { r: 0, g: 0, b: 0, a: 0 }, loadOp: 'clear', storeOp: 'store' }],
    });
    pass.setPipeline(this.pipeline);
    pass.setBindGroup(0, this.bindGroup);
    pass.draw(3);
    pass.end();
    this.device.queue.submit([encoder.finish()]);
  }
}
