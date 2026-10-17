const SK = {
  ink: '#2b2b2b', red: '#c97b6b', blue: '#7fa6bf',
  gold: '#d9b26a', grey: '#bdb8af', paper: '#ffffff',

  // deterministic pseudo-random so shapes don't fizz
  _seed: 1,
  _rand() {
    this._seed = (this._seed * 9301 + 49297) % 233280;
    return this._seed / 233280;
  },
  _reset(seed) { this._seed = seed || 1; },

  line(ctx, x1, y1, x2, y2, c = SK.ink, w = 3, j = 1) {
    ctx.strokeStyle = c; ctx.lineWidth = w; ctx.lineCap = 'round';
    ctx.beginPath();
    const key = `L${x1.toFixed(0)}_${y1.toFixed(0)}_${x2.toFixed(0)}_${y2.toFixed(0)}`;
    const steps = 6;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const jx = (i > 0 && i < steps) ? (Math.sin(i * 1.7 + x1 * 0.01 + y1 * 0.01) * j) : 0;
      const jy = (i > 0 && i < steps) ? (Math.cos(i * 2.3 + x1 * 0.01 + y1 * 0.01) * j) : 0;
      const px = x1 + (x2 - x1) * t + jx;
      const py = y1 + (y2 - y1) * t + jy;
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.stroke();
  },

  rect(ctx, x, y, w, h, c = SK.ink, lw = 3, j = 2) {
    const jf = (i) => Math.sin(i * 1.9 + x * 0.13 + y * 0.07) * j;
    const pts = [
      [x + jf(1), y + jf(2)],
      [x + w + jf(3), y + jf(4)],
      [x + w + jf(5), y + h + jf(6)],
      [x + jf(7), y + h + jf(8)],
    ];
    ctx.strokeStyle = c; ctx.lineWidth = lw; ctx.lineCap = 'round';
    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
      const a = pts[i], b = pts[(i + 1) % 4];
      for (let s = 0; s <= 5; s++) {
        const t = s / 5;
        const wob = (s > 0 && s < 5) ? Math.sin(s * 2.1 + i + x * 0.05) * j * 0.6 : 0;
        const px = a[0] + (b[0] - a[0]) * t + wob;
        const py = a[1] + (b[1] - a[1]) * t + wob;
        (i === 0 && s === 0) ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
    }
    ctx.closePath(); ctx.stroke();
  },

  circle(ctx, cx, cy, r, c = SK.ink, lw = 3, j = 1.5) {
    ctx.strokeStyle = c; ctx.lineWidth = lw;
    ctx.beginPath();
    const steps = 16;
    const ox = (cx * 0.01 + cy * 0.03) % (Math.PI * 2);
    for (let i = 0; i <= steps; i++) {
      const a = i / steps * Math.PI * 2;
      const rr = r + Math.sin(i * 1.8 + ox) * j;
      const px = cx + Math.cos(a) * rr;
      const py = cy + Math.sin(a) * rr;
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.closePath(); ctx.stroke();
  },

  text(ctx, txt, x, y, s = 28, c = SK.ink, align = 'center') {
    ctx.font = `${s}px "Gaegu", "Patrick Hand", cursive`;
    ctx.fillStyle = c; ctx.textAlign = align; ctx.textBaseline = 'middle';
    ctx.fillText(String(txt).toLowerCase(), x, y);
  },

  dot(ctx, x, y, r, c = SK.ink) {
    ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  },

  alert(ctx, x, y) {
    SK.line(ctx, x, y - 10, x, y + 2, SK.red, 3, 0.5);
    SK.dot(ctx, x, y + 8, 2.2, SK.red);
  },

  star(ctx, x, y, size = 18) {
    ctx.strokeStyle = SK.gold; ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const r = i % 2 === 0 ? size : size * 0.45;
      const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
      const px = x + Math.cos(a) * r;
      const py = y + Math.sin(a) * r;
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.closePath(); ctx.stroke();
  },

  heart(ctx, x, y, size = 18, hollow = false) {
    ctx.strokeStyle = hollow ? SK.grey : SK.red;
    ctx.lineWidth = 3; ctx.lineCap = 'round';
    const s = size / 18;
    ctx.beginPath();
    ctx.moveTo(x, y + 8 * s);
    ctx.bezierCurveTo(x - 12 * s, y - 4 * s, x - 6 * s, y - 12 * s, x, y - 5 * s);
    ctx.bezierCurveTo(x + 6 * s, y - 12 * s, x + 12 * s, y - 4 * s, x, y + 8 * s);
    ctx.stroke();
  },
};
