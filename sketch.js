const SK = {
  ink: '#2b2b2b', red: '#c97b6b', blue: '#7fa6bf',
  gold: '#d9b26a', grey: '#bdb8af', paper: '#ffffff',

  _j(i, seed, amt) {
    let n = (i * 73 + seed * 179 + 31) | 0;
    n = (n ^ (n << 13)) | 0;
    n = (n ^ (n >> 17)) | 0;
    n = (n * 5 + 11) | 0;
    n = n & 0x7fffffff;
    return ((n % 1000) / 1000 - 0.5) * amt;
  },

  line(ctx, x1, y1, x2, y2, c, w, j) {
    c = c || SK.ink; w = w || 3; j = (j === undefined) ? 1 : j;
    ctx.strokeStyle = c; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath();
    const seed = ((x1 * 7 + y1 * 13 + x2 * 17 + y2 * 19) | 0);
    const steps = 5;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const px = x1 + (x2 - x1) * t + ((i > 0 && i < steps) ? SK._j(i, seed, j * 2) : 0);
      const py = y1 + (y2 - y1) * t + ((i > 0 && i < steps) ? SK._j(i + 100, seed, j * 2) : 0);
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.stroke();
  },

  rect(ctx, x, y, w, h, c, lw, j) {
    c = c || SK.ink; lw = lw || 3; j = (j === undefined) ? 1.5 : j;
    ctx.strokeStyle = c; ctx.lineWidth = lw; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const jf = (s) => SK._j(s, ((x + y) | 0), j);
    ctx.beginPath();
    ctx.moveTo(x + jf(1), y + jf(2));
    ctx.lineTo(x + w + jf(3), y + jf(4));
    ctx.lineTo(x + w + jf(5), y + h + jf(6));
    ctx.lineTo(x + jf(7), y + h + jf(8));
    ctx.closePath();
    ctx.stroke();
  },

  circle(ctx, cx, cy, r, c, lw) {
    c = c || SK.ink; lw = lw || 3;
    ctx.strokeStyle = c; ctx.lineWidth = lw;
    ctx.beginPath();
    ctx.ellipse(cx, cy, r * 1.03, r * 0.97, 0, 0, Math.PI * 2);
    ctx.stroke();
  },

  text(ctx, txt, x, y, s, c, align) {
    s = s || 28; c = c || SK.ink; align = align || 'center';
    ctx.font = s + 'px "Gaegu", "Patrick Hand", cursive';
    ctx.fillStyle = c; ctx.textAlign = align; ctx.textBaseline = 'middle';
    ctx.fillText(String(txt), x, y);
  },

  dot(ctx, x, y, r, c) {
    c = c || SK.ink;
    ctx.fillStyle = c;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  },

  alert(ctx, x, y) {
    SK.line(ctx, x, y - 14, x, y + 2, SK.red, 3.5, 0.4);
    SK.dot(ctx, x, y + 12, 3, SK.red);
  },

  star(ctx, x, y, size) {
    size = size || 20;
    ctx.strokeStyle = SK.gold; ctx.lineWidth = 3; ctx.lineCap = 'round';
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const r = (i % 2 === 0) ? size : size * 0.45;
      const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
      const px = x + Math.cos(a) * r, py = y + Math.sin(a) * r;
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.closePath(); ctx.stroke();
  },

  heart(ctx, x, y, size, hollow) {
    size = size || 20;
    ctx.strokeStyle = hollow ? SK.grey : SK.red;
    ctx.lineWidth = 3; ctx.lineCap = 'round';
    const s = size / 18;
    ctx.beginPath();
    ctx.moveTo(x, y + 8 * s);
    ctx.bezierCurveTo(x - 12 * s, y - 4 * s, x - 6 * s, y - 12 * s, x, y - 5 * s);
    ctx.bezierCurveTo(x + 6 * s, y - 12 * s, x + 12 * s, y - 4 * s, x, y + 8 * s);
    ctx.stroke();
  }
};

const CH = {
  player(ctx, x, y, state) {
    state = state || 'idle';
    const headR = 24;
    const headY = y - 120;
    if (state === 'jump') {
      SK.line(ctx, x, y - 50, x - 14, y - 10);
      SK.line(ctx, x, y - 50, x + 14, y - 10);
    } else {
      SK.line(ctx, x, y - 50, x - 12, y);
      SK.line(ctx, x, y - 50, x + 12, y);
    }
    SK.line(ctx, x, y - 50, x, y - 95);
    SK.line(ctx, x, y - 85, x - 20, y - 60);
    SK.line(ctx, x, y - 85, x + 20, y - 60);
    SK.circle(ctx, x, headY, headR);
    SK.line(ctx, x - 18, headY - 16, x - 10, headY - 30, SK.ink, 2.5);
    SK.line(ctx, x - 6, headY - 24, x + 2, headY - 32, SK.ink, 2.5);
    SK.line(ctx, x + 8, headY - 20, x + 14, headY - 30, SK.ink, 2.5);
    if (state === 'blush') {
      SK.dot(ctx, x - 12, headY + 6, 4, SK.red);
      SK.dot(ctx, x + 12, headY + 6, 4, SK.red);
      SK.dot(ctx, x + 4, headY - 2, 2.5);
      SK.dot(ctx, x + 11, headY - 2, 2.5);
    } else {
      SK.dot(ctx, x + 4, headY - 2, 2.5);
      SK.dot(ctx, x + 11, headY - 2, 2.5);
    }
  },

  person(ctx, x, y, member) {
    const headR = 20;
    const headY = y - 108;
    const isLooking = member.state === 'looking';
    const isAngry = member.state === 'angry';

    if (member.type === 'staff') {
      SK.line(ctx, x, y - 44, x - 10, y);
      SK.line(ctx, x, y - 44, x + 10, y);
      SK.line(ctx, x, y - 44, x, y - 90);
      SK.line(ctx, x, y - 82, x - 22, y - 105);
      SK.line(ctx, x, y - 82, x + 22, y - 95);
      SK.circle(ctx, x, headY, headR);
      SK.line(ctx, x - 14, headY - 12, x - 8, headY - 22, SK.ink, 2);
      SK.line(ctx, x + 2, headY - 18, x + 8, headY - 22, SK.ink, 2);
      ctx.fillStyle = '#b8e63c';
      ctx.beginPath();
      ctx.moveTo(x - 20, y - 90);
      ctx.lineTo(x + 20, y - 90);
      ctx.lineTo(x + 18, y - 44);
      ctx.lineTo(x - 18, y - 44);
      ctx.closePath();
      ctx.fill();
      SK.rect(ctx, x - 20, y - 90, 40, 46, '#4a7a00', 2.5);
      SK.line(ctx, x - 18, y - 74, x + 18, y - 74, '#ffffff', 3, 0);
      SK.line(ctx, x - 18, y - 60, x + 18, y - 60, '#ffffff', 3, 0);
      SK.line(ctx, x - 6, y - 90, x, y - 70, SK.ink, 2);
      SK.line(ctx, x + 6, y - 90, x, y - 70, SK.ink, 2);
      SK.rect(ctx, x - 5, y - 68, 10, 12, SK.ink, 1.5);
      return;
    }

    if (member.type === 'distracted') {
      SK.line(ctx, x, y - 44, x - 10, y);
      SK.line(ctx, x, y - 44, x + 10, y);
      SK.line(ctx, x, y - 44, x, y - 90);
      SK.line(ctx, x, y - 78, x + 14, y - 70);
      SK.line(ctx, x + 14, y - 70, x + 22, y - 62);
      SK.line(ctx, x, y - 80, x - 14, y - 60);
      SK.circle(ctx, x, headY + 6, headR);
      SK.line(ctx, x - 10, headY - 4, x - 4, headY - 12, SK.ink, 2);
      SK.line(ctx, x + 2, headY - 6, x + 8, headY - 12, SK.ink, 2);
      SK.rect(ctx, x + 18, y - 80, 18, 26, SK.ink, 2.5);
      SK.line(ctx, x + 21, y - 74, x + 33, y - 74, SK.ink, 1.5, 0);
      SK.line(ctx, x + 21, y - 68, x + 33, y - 68, SK.ink, 1.5, 0);
      SK.line(ctx, x + 21, y - 62, x + 28, y - 62, SK.ink, 1.5, 0);
      SK.line(ctx, x + 38, y - 74, x + 46, y - 78, SK.blue, 2.5, 0.4);
      SK.line(ctx, x + 38, y - 66, x + 48, y - 66, SK.blue, 2.5, 0.4);
      SK.line(ctx, x + 38, y - 58, x + 46, y - 54, SK.blue, 2.5, 0.4);
    } else {
      SK.line(ctx, x, y - 44, x - 10, y);
      SK.line(ctx, x, y - 44, x + 10, y);
      SK.line(ctx, x, y - 44, x, y - 90);
      SK.line(ctx, x, y - 80, x - 14, y - 60);
      SK.line(ctx, x, y - 80, x + 14, y - 60);
      SK.circle(ctx, x, headY, headR);

      if (isLooking) {
        SK.circle(ctx, x - 6, headY - 3, 5, SK.ink, 2);
        SK.dot(ctx, x - 6, headY - 3, 2);
        SK.circle(ctx, x + 8, headY - 3, 5, SK.ink, 2);
        SK.dot(ctx, x + 8, headY - 3, 2);
        SK.line(ctx, x - 12, headY - 12, x, headY - 12, SK.ink, 1.5, 0);
        SK.line(ctx, x + 2, headY - 12, x + 14, headY - 12, SK.ink, 1.5, 0);
      } else {
        SK.line(ctx, x - 10, headY - 10, x - 4, headY - 20, SK.ink, 2);
        SK.line(ctx, x, headY - 10, x + 6, headY - 20, SK.ink, 2);
        SK.line(ctx, x + 10, headY - 10, x + 14, headY - 20, SK.ink, 2);
      }
    }

    // angry state — big glaring eye + fire on head
    if (isAngry) {
      SK.circle(ctx, x, headY - 3, 8, SK.red, 2.5);
      SK.dot(ctx, x, headY - 3, 3, SK.ink);
      SK.line(ctx, x - 12, headY - 14, x - 2, headY - 18, SK.red, 2.5, 0);
      SK.line(ctx, x + 2, headY - 18, x + 12, headY - 14, SK.red, 2.5, 0);
      const ft = performance.now() / 200;
      SK.line(ctx, x - 10, headY - 22, x - 12, headY - 36 - Math.sin(ft) * 3, SK.red, 2.5, 0.6);
      SK.line(ctx, x - 2, headY - 22, x - 2, headY - 46 - Math.sin(ft + 1) * 4, SK.red, 3, 0.6);
      SK.line(ctx, x + 6, headY - 22, x + 8, headY - 40 - Math.sin(ft + 2) * 3, SK.red, 2.5, 0.6);
      SK.line(ctx, x + 12, headY - 20, x + 14, headY - 32 - Math.sin(ft + 3) * 3, SK.red, 2, 0.6);
    }

    if (!isLooking && !isAngry && member.type === 'dozing') {
      SK.text(ctx, 'z', x + 24, headY - 18, 22);
      SK.text(ctx, 'z', x + 38, headY - 34, 28);
      SK.text(ctx, 'z', x + 54, headY - 52, 34);
    }

    if (!isLooking && !isAngry && member.type === 'normal') {
      SK.rect(ctx, x + 14, y - 68, 10, 14, SK.ink, 2);
    }

    if (member.state === 'alert') SK.alert(ctx, x, headY - 42);
    if (member.hasStar) {
      const bob = Math.sin(performance.now() / 400) * 4;
      SK.star(ctx, x, headY - 60 + bob, 18);
    }
  }
};
