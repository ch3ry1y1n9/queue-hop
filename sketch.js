const SK = {
  ink: '#2b2b2b', red: '#c97b6b', blue: '#7fa6bf',
  gold: '#d9b26a', grey: '#bdb8af', paper: '#ffffff',

  // deterministic wobble — same input = same output, no fizz
  _wob(i, seed) {
    const x = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453;
    return (x - Math.floor(x)) - 0.5;
  },

  line(ctx, x1, y1, x2, y2, c = SK.ink, w = 3, j = 1) {
    ctx.strokeStyle = c;
    ctx.lineWidth = w;
    ctx.lineCap = 'round';
    ctx.beginPath();
    const seed = (x1 * 0.13 + y1 * 0.07 + x2 * 0.11 + y2 * 0.05);
    const steps = 6;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const wobX = (i > 0 && i < steps) ? SK._wob(i, seed) * j * 2 : 0;
      const wobY = (i > 0 && i < steps) ? SK._wob(i + 50, seed) * j * 2 : 0;
      const px = x1 + (x2 - x1) * t + wobX;
      const py = y1 + (y2 - y1) * t + wobY;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
  },

  rect(ctx, x, y, w, h, c = SK.ink, lw = 3, j = 2) {
    const seed = x * 0.13 + y * 0.07 + w * 0.03 + h * 0.05;
    const corners = [
      [x, y],
      [x + w, y],
      [x + w, y + h],
      [x, y + h],
    ];
    ctx.strokeStyle = c;
    ctx.lineWidth = lw;
    ctx.lineCap = 'round';
    ctx.beginPath();
    for (let edge = 0; edge < 4; edge++) {
      const a = corners[edge];
      const b = corners[(edge + 1) % 4];
      const steps = 5;
      for (let s = 0; s <= steps; s++) {
        const t = s / steps;
        const wobX = (s > 0 && s < steps) ? SK._wob(edge * 100 + s, seed) * j * 2 : 0;
        const wobY = (s > 0 && s < steps) ? SK._wob(edge * 100 + s + 40, seed) * j * 2 : 0;
        const px = a[0] + (b[0] - a[0]) * t + wobX;
        const py = a[1] + (b[1] - a[1]) * t + wobY;
        if (edge === 0 && s === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
    }
    ctx.closePath();
    ctx.stroke();
  },

  circle(ctx, cx, cy, r, c = SK.ink, lw = 3, j = 1.5) {
    const seed = cx * 0.13 + cy * 0.07 + r * 0.11;
    ctx.strokeStyle = c;
    ctx.lineWidth = lw;
    ctx.beginPath();
    const steps = 20;
    for (let i = 0; i <= steps; i++) {
      const a = (i / steps) * Math.PI * 2;
      const wob = (i > 0 && i < steps) ? SK._wob(i, seed) * j * 2 : 0;
      const rr = r + wob;
      const px = cx + Math.cos(a) * rr;
      const py = cy + Math.sin(a) * rr;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.stroke();
  },

  text(ctx, txt, x, y, s = 28, c = SK.ink, align = 'center') {
    ctx.font = `${s}px "Gaegu", "Patrick Hand", cursive`;
    ctx.fillStyle = c;
    ctx.textAlign = align;
    ctx.textBaseline = 'middle';
    ctx.fillText(String(txt).toLowerCase(), x, y);
  },

  dot(ctx, x, y, r, c = SK.ink) {
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  },

  alert(ctx, x, y) {
    SK.line(ctx, x, y - 10, x, y + 2, SK.red, 3, 0.4);
    SK.dot(ctx, x, y + 8, 2.2, SK.red);
  },

  star(ctx, x, y, size = 18) {
    ctx.strokeStyle = SK.gold;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const r = i % 2 === 0 ? size : size * 0.45;
      const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
      const px = x + Math.cos(a) * r;
      const py = y + Math.sin(a) * r;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.stroke();
  },

  heart(ctx, x, y, size = 18, hollow = false) {
    ctx.strokeStyle = hollow ? SK.grey : SK.red;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    const s = size / 18;
    ctx.beginPath();
    ctx.moveTo(x, y + 8 * s);
    ctx.bezierCurveTo(x - 12 * s, y - 4 * s, x - 6 * s, y - 12 * s, x, y - 5 * s);
    ctx.bezierCurveTo(x + 6 * s, y - 12 * s, x + 12 * s, y - 4 * s, x, y + 8 * s);
    ctx.stroke();
  },
};

const CH = {
  player(ctx, x, y, state = 'idle') {
    const headY = y - 90;
    // legs
    if (state === 'jump') {
      SK.line(ctx, x, y - 30, x - 12, y - 12);
      SK.line(ctx, x, y - 30, x + 12, y - 12);
    } else {
      SK.line(ctx, x, y - 30, x - 10, y);
      SK.line(ctx, x, y - 30, x + 10, y);
    }
    // torso
    SK.line(ctx, x, y - 30, x, y - 70);
    // arms
    SK.line(ctx, x, y - 60, x - 14, y - 45);
    SK.line(ctx, x, y - 60, x + 14, y - 45);
    // head
    SK.circle(ctx, x, headY, 18);
    // hair — 3 short strokes
    SK.line(ctx, x - 12, headY - 12, x - 6, headY - 22, SK.ink, 2);
    SK.line(ctx, x - 4, headY - 18, x + 2, headY - 24, SK.ink, 2);
    SK.line(ctx, x + 6, headY - 14, x + 10, headY - 22, SK.ink, 2);
    // backpack
    SK.rect(ctx, x - 30, y - 70, 12, 24, SK.ink, 2);
    // face
    if (state === 'blush') {
      SK.line(ctx, x - 8, headY - 2, x - 2, headY - 2, SK.ink, 2);
      SK.line(ctx, x + 2, headY - 2, x + 8, headY - 2, SK.ink, 2);
      SK.dot(ctx, x - 10, headY + 6, 3, SK.red);
      SK.dot(ctx, x + 10, headY + 6, 3, SK.red);
    } else {
      SK.dot(ctx, x + 3, headY - 2, 2.2);
      SK.dot(ctx, x + 9, headY - 2, 2.2);
    }
  },

  person(ctx, x, y, member) {
    const headY = y - 80;
    const isLooking = member.state === 'looking';
    // legs
    SK.line(ctx, x, y - 28, x - 8, y);
    SK.line(ctx, x, y - 28, x + 8, y);
    // torso
    SK.line(ctx, x, y - 28, x, y - 64);
    // arms
    SK.line(ctx, x, y - 56, x - 12, y - 40);
    SK.line(ctx, x, y - 56, x + 12, y - 40);
    // head
    SK.circle(ctx, x, headY, 15);

    if (isLooking) {
      SK.circle(ctx, x + 5, headY - 2, 6, SK.ink, 2);
      SK.dot(ctx, x + 5, headY - 2, 2);
      SK.line(ctx, x - 10, headY - 2, x - 4, headY - 2, SK.ink, 2);
    } else {
      // back of head — hair strokes
      SK.line(ctx, x - 8, headY - 8, x - 4, headY - 14, SK.ink, 2);
      SK.line(ctx, x, headY - 8, x + 4, headY - 14, SK.ink, 2);
      SK.line(ctx, x + 6, headY - 8, x + 8, headY - 14, SK.ink, 2);
    }

    if (member.type === 'dozing') {
      SK.text(ctx, 'z', x + 18, headY - 20, 14);
      SK.text(ctx, 'z', x + 26, headY - 30, 18);
      SK.text(ctx, 'z', x + 36, headY - 42, 22);
    }
    if (member.type === 'distracted') {
      SK.rect(ctx, x - 4, y - 52, 8, 12, SK.ink, 2);
      SK.line(ctx, x - 12, y - 48, x - 6, y - 48, SK.blue, 2);
      SK.line(ctx, x + 12, y - 48, x + 6, y - 48, SK.blue, 2);
      SK.line(ctx, x - 3, y - 44, x - 8, y - 42, SK.blue, 2);
    }
    if (member.type === 'paranoid') {
      SK.line(ctx, x - 22, headY - 4, x - 16, headY - 4, SK.ink, 1.5);
      SK.line(ctx, x + 16, headY - 4, x + 22, headY - 4, SK.ink, 1.5);
    }
    if (member.type === 'normal' && !isLooking) {
      SK.rect(ctx, x + 12, y - 52, 6, 10, SK.ink, 2);
    }

    if (member.state === 'alert') SK.alert(ctx, x, headY - 32);
    if (member.hasStar) {
      const bob = Math.sin(performance.now() / 400) * 4;
      SK.star(ctx, x, headY - 50 + bob, 16);
    }
  },
};
