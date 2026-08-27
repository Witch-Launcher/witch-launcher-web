// WebGPU 3D hero renderer — monochrome raymarched crystal + fbm aura.
// Falls back gracefully if WebGPU is unavailable.

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
