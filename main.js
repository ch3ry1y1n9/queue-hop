const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

function resize() {
  const dpr = window.devicePixelRatio || 1;
  const scale = Math.min(window.innerWidth / 1280, window.innerHeight / 720);
  canvas.style.width = (1280 * scale) + 'px';
  canvas.style.height = (720 * scale) + 'px';
  canvas.width = Math.round(1280 * dpr);
  canvas.height = Math.round(720 * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

window.addEventListener('resize', resize);
window.addEventListener('orientationchange', resize);
document.addEventListener('fullscreenchange', resize);

function toLogical(clientX, clientY) {
  const r = canvas.getBoundingClientRect();
  return [
    (clientX - r.left) * 1280 / r.width,
    (clientY - r.top) * 720 / r.height,
  ];
}

function handleClick(lx, ly) {
  if (G.trivia && !G.trivia.result) {
    for (let i = 0; i < G.trivia.optionRects.length; i++) {
      const r = G.trivia.optionRects[i];
      if (lx >= r.x && lx <= r.x + r.w && ly >= r.y && ly <= r.y + r.h) {
        answerTrivia(i);
        return;
      }
    }
    return;
  }
  for (const b of G.buttons) {
    if (lx >= b.x && lx <= b.x + b.w && ly >= b.y && ly <= b.y + b.h) {
      b.action();
      return;
    }
  }
  if (G.screen === 'game' && !G.trivia) onJump();
}

canvas.addEventListener('pointerdown', (e) => {
  e.preventDefault();
  const pos = toLogical(e.clientX, e.clientY);
  handleClick(pos[0], pos[1]);
});

window.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    e.preventDefault();
    if (G.screen === 'game' && !G.trivia) onJump();
  }
});

let lastTs = performance.now();
function loop(ts) {
  const dt = Math.min(0.05, (ts - lastTs) / 1000);
  lastTs = ts;
  try
