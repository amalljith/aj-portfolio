// No loop/listeners of its own: the cursor's single RAF advances this renderer.
export default class ShatterTrail {
  constructor(canvas, color) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
    if (!this.ctx) throw new Error("Canvas 2D is unavailable");
    this.color = color;
    this.particles = Array.from({ length: 36 }, () => ({ alive: false }));
    this.samples = Array.from({ length: 64 }, () => ({ x: 0, y: 0, time: 0 }));
    this.head = this.count = this.serial = 0;
    this.vx = this.vy = this.carry = 0;
    this.previous = this.bounds = null;
    this.lastBurst = -Infinity;
    this.resize();
  }

  resize() {
    this.width = innerWidth; this.height = innerHeight;
    this.dpr = Math.min(devicePixelRatio || 1, 2);
    this.canvas.width = Math.ceil(this.width * this.dpr);
    this.canvas.height = Math.ceil(this.height * this.dpr);
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.reset();
  }

  reset() {
    this.head = this.count = this.carry = this.vx = this.vy = 0;
    this.previous = null;
    this.particles.forEach((p) => { p.alive = false; });
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.bounds = null;
    this.lastBurst = -Infinity;
  }

  sample(x, y, time) {
    const slot = this.samples[(this.head + this.count) % this.samples.length];
    slot.x = x; slot.y = y; slot.time = time;
    if (this.count < this.samples.length) this.count++;
    else this.head = (this.head + 1) % this.samples.length;
  }

  spawn(x, y, tx, ty, speed, now, budget, burst = false) {
    const active = this.particles.filter((p) => p.alive);
    let p = this.particles.find((entry) => !entry.alive);
    if (active.length >= budget) p = active.reduce((oldest, entry) => entry.born < oldest.born ? entry : oldest);
    if (!p) return;
    const n = ++this.serial;
    // Deterministic variation, coordinated to the path tangent rather than
    // random screen positions. Speed adapts size, spread and lifetime together.
    const variation = (n * 0.61803398875) % 1;
    const side = n % 2 ? 1 : -1;
    const energy = Math.min(1, speed / 2.4);
    const spread = (burst ? 7 : 2) + variation * (burst ? 8 : 4 + energy * 5);
    const behind = burst ? 0 : 6 + energy * 4;
    Object.assign(p, {
      alive: true, born: now, delay: (n % 3) * 7,
      life: (burst ? 200 : 240 + energy * 260) + variation * 60,
      x: x - tx * behind, y: y - ty * behind,
      dx: -tx * (6 + energy * 16) - ty * side * spread,
      dy: -ty * (6 + energy * 16) + tx * side * spread,
      size: burst ? 3 + variation * 3 : 2.5 + energy * (1 + variation * 3),
      angle: side * variation * 0.1 * energy, turn: side * (0.05 + variation * 0.15) * energy,
    });
  }

  burst(x, y, now, minimal, limited) {
    if (now - this.lastBurst < 80) return;
    this.lastBurst = now;
    const speed = Math.hypot(this.vx, this.vy);
    const tx = speed > 0.05 ? this.vx / speed : 0.6;
    const ty = speed > 0.05 ? this.vy / speed : 0.8;
    const count = limited || minimal ? 3 : 7;
    for (let i = 0; i < count; i++) this.spawn(x, y, tx, ty, speed, now + i * 4, minimal ? 10 : limited ? 12 : 36, true);
  }

  update(now, point, { minimal, label, limited }) {
    const budget = minimal ? 10 : limited ? 12 : 36;
    let emitted = 0;
    while (this.count) {
      const sample = this.samples[this.head];
      this.head = (this.head + 1) % this.samples.length; this.count--;
      const previous = this.previous;
      if (previous) {
        const dt = sample.time - previous.time;
        const dx = sample.x - previous.x, dy = sample.y - previous.y;
        const distance = Math.hypot(dx, dy);
        if (dt > 0 && dt < 90 && distance > 0) {
          const blend = 1 - Math.exp(-dt / 42);
          this.vx += (dx / dt - this.vx) * blend;
          this.vy += (dy / dt - this.vy) * blend;
          const speed = Math.min(3, Math.hypot(this.vx, this.vy));
          const energy = Math.min(1, speed / 2.4);
          const spacing = (minimal ? 26 : 18) - energy * (minimal ? 7 : 11);
          const adaptiveBudget = Math.min(budget, 14 + Math.round(energy * 22));
          const remaining = Math.min(distance, 110);
          let travel = spacing - this.carry;
          if (!label && speed > (minimal ? 0.35 : 0.2)) {
            while (travel <= remaining) {
              const fraction = 1 - (remaining - travel) / distance;
              const px = previous.x + dx * fraction, py = previous.y + dy * fraction;
              if (emitted < (minimal || limited ? 2 : 3 + Math.floor(energy * 3)) && Math.hypot(px - point.x, py - point.y) < 150) {
                this.spawn(px, py, dx / distance, dy / distance, speed, now, adaptiveBudget); emitted++;
              }
              travel += spacing;
            }
            this.carry = (this.carry + remaining) % spacing;
          } else this.carry = 0;
        } else { this.vx = this.vy = this.carry = 0; }
      }
      this.previous = { x: sample.x, y: sample.y, time: sample.time };
    }

    const ctx = this.ctx;
    if (this.bounds) ctx.clearRect(this.bounds.x, this.bounds.y, this.bounds.w, this.bounds.h);
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity, alive = 0;
    ctx.fillStyle = this.color;
    for (const p of this.particles) {
      if (!p.alive) continue;
      if (++alive > budget) { p.alive = false; continue; }
      const t = (now - p.born - p.delay) / p.life;
      const separation = Math.hypot(p.x - point.x, p.y - point.y);
      if (t >= 1 || separation > 620) { p.alive = false; continue; }
      if (t < 0) continue;
      const ease = 1 - Math.pow(1 - t, 3);
      const x = p.x + p.dx * ease, y = p.y + p.dy * ease;
      const size = p.size * (1 - 0.65 * t * t);
      ctx.globalAlpha = Math.min(1, t / 0.025) * Math.pow(1 - t, 0.9) * 0.95 * Math.min(1, (620 - separation) / 220);
      ctx.save(); ctx.translate(Math.round(x), Math.round(y)); ctx.rotate(p.angle + p.turn * ease);
      ctx.fillRect(-size / 2, -size / 2, size, size);
      ctx.restore();
      minX = Math.min(minX, x - 10); minY = Math.min(minY, y - 10);
      maxX = Math.max(maxX, x + 10); maxY = Math.max(maxY, y + 10);
    }
    ctx.globalAlpha = 1;
    this.bounds = minX === Infinity ? null : { x: minX, y: minY, w: maxX - minX, h: maxY - minY };
    return this.particles.some((p) => p.alive);
  }

  destroy() { this.reset(); this.canvas.width = this.canvas.height = 0; }
}
