const SK = {
  ink: '#2b2b2b', red: '#c97b6b', blue: '#7fa6bf',
  gold: '#d9b26a', grey: '#bdb8af', paper: '#ffffff',

  line(ctx, x1, y1, x2, y2, c = SK.ink, w = 3, j = 1) {
    ctx.strokeStyle = c; ctx.lineWidth = w; ctx.lineCap = 'round';
    ctx.beginPath();
    const steps = 8;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const px = x1 + (x2 - x1) * t + (i > 0 && i < steps ? (Math.random() - .5) * j * 2 : 0);
      const py = y1 + (y2 - y1) * t + (i > 0 && i < steps ? (Math.random() - .5) * j * 2 : 0);
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.stroke();
  },

  rect(ctx, x, y, w, h, c = SK.ink, lw = 3, j = 2) {
    const jf = () => (Math.random() - .5) * j * 2;
    const pts = [
      [x + jf(), y + jf()],
      [x + w + jf(), y + jf() * .7],
      [x + w + jf() * .8, y + h + jf()],
      [x + jf() * .7, y + h + jf() * .9],
    ];
    ctx.strokeStyle = c; ctx.lineWidth = lw; ctx.lineCap = 'round';
    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
      const a = pts[i], b = pts[(i + 1) % 4];
      for (let s = 0; s <= 6; s++) {
        const t = s / 6;
        const px = a[0] + (b[0] - a[0]) * t + (s > 0 && s < 6 ? (Math.random() - .5) * j : 0);
        const py = a[1] + (b[1] - a[1]) * t + (s > 0 && s < 6 ? (Math.random() - .5) * j : 0);
        (i === 0 && s === 0) ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
    }
    ctx.closePath(); ctx.stroke();
  },

  circle(ctx, cx, cy, r, c = SK.ink, lw = 3, j = 1.5) {
    ctx.strokeStyle = c; ctx.lineWidth = lw;
    ctx.beginPath();
    const steps = 20;
    for (let i = 0; i <= steps; i++) {
      const a = i / steps * Math.PI * 2;
      const rr = r + (i > 0 && i < steps ? (Math.random() - .5) * j * 2 : 0);
      const px = cx + Math.cos(a) * rr, py = cy + Math.sin(a) * rr;
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
    SK.line(ctx, x, y - 10, x, y + 2, SK.red, 3);
    SK.dot(ctx, x, y + 8, 2.2, SK.red);
  },

  star(ctx, x, y, size = 18) {
    ctx.strokeStyle = SK.gold; ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const r = i % 2 === 0 ? size : size * 0.45;
      const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
      const px = x + Math.cos(a) * r + (Math.random() - .5) * 1.5;
      const py = y + Math.sin(a) * r + (Math.random() - .5) * 1.5;
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

const CH = {
  player(ctx, x, y, state = 'idle') {
    const headY = y - 90;
    SK.line(ctx, x, y - 30, x, y - 70, SK.ink, 3);
    if (state === 'jump') {
      SK.line(ctx, x, y - 30, x - 12, y - 12, SK.ink, 3);
      SK.line(ctx, x, y - 30, x + 12, y - 12, SK.ink, 3);
    } else {
      SK.line(ctx, x, y - 30, x - 10, y, SK.ink, 3);
      SK.line(ctx, x, y - 30, x + 10, y, SK.ink, 3);
    }
    SK.line(ctx, x, y - 60, x - 14, y - 45, SK.ink, 3);
    SK.line(ctx, x, y - 60, x + 14, y - 45, SK.ink, 3);
    SK.circle(ctx, x, headY, 18, SK.ink, 3);
    SK.line(ctx, x - 12, headY - 12, x - 6, headY - 22, SK.ink, 2);
    SK.line(ctx, x - 4, headY - 18, x + 2, headY - 24, SK.ink, 2);
    SK.line(ctx, x + 6, headY - 14, x + 10, headY - 22, SK.ink, 2);
    SK.rect(ctx, x - 30, y - 70, 12, 24, SK.ink, 2);
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
    SK.line(ctx, x, y - 28, x, y - 64, SK.ink, 3);
    SK.line(ctx, x, y - 28, x - 8, y, SK.ink, 3);
    SK.line(ctx, x, y - 28, x + 8, y, SK.ink, 3);
    SK.line(ctx, x, y - 56, x - 12, y - 40, SK.ink, 3);
    SK.line(ctx, x, y - 56, x + 12, y - 40, SK.ink, 3);

    if (!isLooking) {
      SK.circle(ctx, x, headY, 15, SK.ink, 3);
      SK.line(ctx, x - 8, headY - 8, x - 4, headY - 14, SK.ink, 2);
      SK.line(ctx, x, headY - 8, x + 4, headY - 14, SK.ink, 2);
      SK.line(ctx, x + 6, headY - 8, x + 8, headY - 14, SK.ink, 2);
    } else {
      SK.circle(ctx, x, headY, 15, SK.ink, 3);
      SK.circle(ctx, x + 5, headY - 2, 6, SK.ink, 2);
      SK.dot(ctx, x + 5, headY - 2, 2);
      SK.line(ctx, x - 10, headY - 2, x - 4, headY - 2, SK.ink, 2);
    }

    if (member.type === 'dozing') {
      SK.text(ctx, 'z', x + 18, headY - 20, 14, SK.ink);
      SK.text(ctx, 'z', x + 26, headY - 30, 18, SK.ink);
      SK.text(ctx, 'z', x + 36, headY - 42, 22, SK.ink);
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
