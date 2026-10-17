function render(ctx) {
  ctx.fillStyle = SK.paper;
  ctx.fillRect(0, 0, 1280, 720);
  G.buttons = [];

  if (G.screen === 'title') renderTitle(ctx);
  else if (G.screen === 'mode') renderMode(ctx);
  else if (G.screen === 'briefing') renderBriefing(ctx);
  else if (G.screen === 'tutorial') renderTutorial(ctx);
  else if (G.screen === 'game') renderGame(ctx);
  else if (G.screen === 'success') renderSuccess(ctx);
  else if (G.screen === 'fail') renderFail(ctx);
}

function btn(ctx, x, y, w, h, label, action) {
  SK.rect(ctx, x, y, w, h, SK.ink, 3);
  SK.text(ctx, label, x + w / 2, y + h / 2, 30);
  G.buttons.push({ x, y, w, h, action });
}

/* ---------------- TITLE ---------------- */

function renderTitle(ctx) {
  const t = performance.now() / 1000;

  SK.text(ctx, 'queue hop', 640, 140, 72);
  SK.text(ctx, 'hku station · exit a', 640, 210, 34);

  SK.line(ctx, 0, 560, 1280, 560, SK.ink, 2, 0.8);

  const walkIn = Math.min(1, t / 2);
  const px = -100 + (CONFIG.playerX + 100) * walkIn;
  CH.player(ctx, px, 560, 'idle');

  SK.circle(ctx, 640, 400, 30, SK.ink, 2.5);
  SK.line(ctx, 640, 400, 640, 380, SK.ink, 2.5);
  SK.line(ctx, 640, 400, 660, 400, SK.ink, 2.5);
  SK.text(ctx, '8:50', 720, 400, 34);

  SK.text(ctx, 'you are queuing for the lift at exit a.', 640, 470, 26);
  SK.text(ctx, 'class check-in is at 9:00 sharp.', 640, 500, 26);
  SK.text(ctx, 'jump the queue when people are not looking.', 640, 530, 26);

  SK.text(ctx, 'this game is fictional. please queue properly in real life.', 640, 690, 20, SK.ink);

  SK.rect(ctx, 540, 590, 200, 70, SK.ink, 3);
  SK.text(ctx, 'start', 640, 625, 32);
  G.buttons.push({
    x: 540, y: 590, w: 200, h: 70,
    action: () => { requestFullscreen(); G.screen = 'mode'; }
  });

  SK.rect(ctx, 40, 40, 80, 80, SK.ink, 2);
  SK.text(ctx, G.soundOn ? '♪' : '×', 80, 80, 36);
  G.buttons.push({
    x: 40, y: 40, w: 80, h: 80,
    action: () => { G.soundOn = !G.soundOn; saveSound(); }
  });
}

/* ---------------- MODE ---------------- */

function renderMode(ctx) {
  SK.text(ctx, 'choose your queue', 640, 140, 44);

  SK.rect(ctx, 330, 290, 620, 100, SK.ink, 3);
  SK.text(ctx, 'easy — exit A1 line', 640, 320, 30);
  SK.text(ctx, '~65 people', 640, 360, 22);
  G.buttons.push({ x: 330, y: 290, w: 620, h: 100, action: () => { startGame('easy'); } });

  SK.rect(ctx, 330, 420, 620, 100, SK.ink, 3);
  SK.text(ctx, 'hard — exit A2 line', 640, 450, 30);
  SK.text(ctx, '~100 people', 640, 490, 22);
  G.buttons.push({ x: 330, y: 420, w: 620, h: 100, action: () => { startGame('hard'); } });

  btn(ctx, 60, 630, 160, 60, 'back', () => { G.screen = 'title'; });
  SK.text(ctx, 'this game is fictional. please queue properly in real life.', 640, 690, 18);
}

/* ---------------- BRIEFING ---------------- */

function renderBriefing(ctx) {
  SK.circle(ctx, 640, 130, 30, SK.ink, 2.5);
  SK.line(ctx, 640, 130, 640, 110, SK.ink, 2.5);
  SK.line(ctx, 640, 130, 660, 130, SK.ink, 2.5);
  SK.text(ctx, '8:50', 720, 130, 34);

  SK.rect(ctx, 440, 220, 400, 100, SK.ink, 3);
  SK.circle(ctx, 500, 270, 18, SK.ink, 2);
  SK.text(ctx, 'people ahead: ' + G.total, 680, 270, 30);

  SK.text(ctx, 'class check-in at 9:00 sharp.', 640, 380, 30);
  SK.text(ctx, 'reach the front before 8:55.', 640, 430, 30);

  btn(ctx, 540, 530, 220, 70, 'how to play', () => { G.screen = 'tutorial'; G.tutorialPage = 0; });
  btn(ctx, 540, 620, 220, 60, 'start queuing', () => { G.screen = 'game'; });
}

/* ---------------- TUTORIAL ---------------- */

function renderTutorial(ctx) {
  SK.text(ctx, 'how to play', 640, 80, 44);
  SK.text(ctx, 'use space on desktop, or tap anywhere on your phone, to jump', 640, 130, 22);

  if (G.tutorialPage === 0) {
    const cards = [
      { type: 'looking', label: "looking — don't jump" },
      { type: 'dozing', label: 'dozing — safest to pass' },
      { type: 'distracted', label: 'distracted — on phone, medium window' },
      { type: 'staff', label: 'staff — never jump' },
    ];
    for (let i = 0; i < 4; i++) {
      const row = i < 2 ? 0 : 1;
      const col = i % 2;
      const cardW = 540, cardH = 160;
      const x = 100 + col * 560;
      const y = 190 + row * 180;
      SK.rect(ctx, x, y, cardW, cardH, SK.ink, 3);
      const card = cards[i];
      if (card.type === 'staff') {
        CH.person(ctx, x + 110, y + cardH - 15, { state: 'away', type: 'staff' });
      } else {
        CH.person(ctx, x + 110, y + cardH - 15, {
          state: card.type === 'looking' ? 'looking' : 'away',
          type: card.type,
        });
      }
      SK.text(ctx, card.label, x + 230, y + 80, 24, SK.ink, 'left');
    }
  } else {
    const cards = [
      { icon: 'alert', label: 'alert doodle above head = they will turn around soon' },
      { icon: 'star', label: 'star box = answer an hku question, skip ahead (max 6)' },
      { icon: 'announce', label: 'station announcement = staff is coming. do not jump.' },
      { icon: 'hearts', label: "three hearts. lose all three and it's over." },
      { icon: 'clock', label: 'reach the front before 8:55' },
    ];
    const cardW = 900, cardH = 80;
    for (let i = 0; i < cards.length; i++) {
      const x = (1280 - cardW) / 2;
      const y = 170 + i * 88;
      SK.rect(ctx, x, y, cardW, cardH, SK.ink, 3);
      const card = cards[i];
      if (card.icon === 'alert') SK.alert(ctx, x + 60, y + cardH / 2);
      if (card.icon === 'star') SK.star(ctx, x + 60, y + cardH / 2, 20);
      if (card.icon === 'hearts') {
        SK.heart(ctx, x + 40, y + cardH / 2, 18);
        SK.heart(ctx, x + 70, y + cardH / 2, 18);
        SK.heart(ctx, x + 100, y + cardH / 2, 18);
      }
      if (card.icon === 'clock') {
        SK.circle(ctx, x + 60, y + cardH / 2, 22, SK.ink, 2);
        SK.line(ctx, x + 60, y + cardH / 2, x + 60, y + cardH / 2 - 14, SK.ink, 2);
        SK.line(ctx, x + 60, y + cardH / 2, x + 72, y + cardH / 2, SK.ink, 2);
      }
      if (card.icon === 'announce') {
        SK.rect(ctx, x + 25, y + 22, 70, 36, SK.blue, 2.5);
        SK.text(ctx, '!', x + 60, y + 40, 26, SK.blue);
      }
      SK.text(ctx, card.label, x + 160, y + cardH / 2, 24, SK.ink, 'left');
    }
  }

  SK.text(ctx, 'skip', 100, 660, 28, SK.ink);
  G.buttons.push({ x: 70, y: 640, w: 100, h: 40, action: () => { G.screen = 'game'; } });

  if (G.tutorialPage === 0) {
    SK.text(ctx, 'next', 1140, 660, 28, SK.ink);
    G.buttons.push({ x: 1120, y: 640, w: 100, h: 40, action: () => { G.tutorialPage = 1; } });
  } else {
    SK.text(ctx, 'got it', 1140, 660, 28, SK.ink);
    G.buttons.push({ x: 1100, y: 640, w: 140, h: 40, action: () => { G.screen = 'briefing'; } });
  }
}

/* ---------------- GAME ---------------- */

function renderGame(ctx) {
  SK.line(ctx, 0, 560, 1280, 560, SK.ink, 2, 0.8);

  for (let i = 0; i < G.passedQueue.length; i++) {
    const m = G.passedQueue[i];
    const behindX = CONFIG.playerX - 80 - i * 60;
    if (behindX < -40) continue;
    CH.person(ctx, behindX, 560, m);
  }

  for (let i = 0; i < G.queue.length; i++) {
    const m = G.queue[i];
    let offsetX = 0;
    if (G.frozen) offsetX = Math.sin(performance.now() / 60) * 3;
    CH.person(ctx, CONFIG.slotX[i] + offsetX, 560, m);
  }

  const jumping = G.playerState === 'jump' && G.jumpTimer > 0;
  let py = 560;
  let px = CONFIG.playerX;
  if (jumping) {
    const p = 1 - (G.jumpTimer / CONFIG.jumpDuration);
    py = 560 - Math.sin(p * Math.PI) * 180;
    px = CONFIG.playerX + Math.sin(p * Math.PI) * 120;
  } else if (G.playerLunge > 0) {
    px = CONFIG.playerX + G.playerLunge * 120;
  }
  CH.player(ctx, px, py, G.playerState);

  if (G.combo >= 2) SK.text(ctx, G.combo + '/5', CONFIG.playerX, 430, 22, SK.gold);

  SK.text(ctx, currentClockString(), 40, 50, 32, SK.ink, 'left');

  for (let i = 0; i < CONFIG.hearts; i++) {
    SK.heart(ctx, 570 + i * 60, 50, 26, i >= G.hearts);
  }

  SK.text(ctx, 'people ' + Math.max(0, G.total - G.passed), 1240, 50, 26, SK.ink, 'right');

  SK.rect(ctx, 1200, 90, 60, 60, SK.ink, 2.5);
  SK.line(ctx, 1218, 100, 1218, 140, SK.ink, 4);
  SK.line(ctx, 1242, 100, 1242, 140, SK.ink, 4);
  G.buttons.push({ x: 1200, y: 90, w: 60, h: 60, action: () => { G.paused = true; } });

  if (G.staffState === 'banner') {
    SK.rect(ctx, 140, 90, 1000, 90, SK.blue, 3);
    SK.text(ctx, 'lift traffic is very busy, please follow staff direction to queue in line', 640, 135, 22, SK.ink);
  }

  if (G.staffState === 'walking') {
    const sx = 1280 - G.staffPhase * 1400;
    CH.person(ctx, sx, 560, { state: 'away', type: 'staff' });
    SK.alert(ctx, sx, 420);
  }

  if (G.frozen && G.queue[0]) {
    const bx = CONFIG.slotX[0], by = 420;
    SK.rect(ctx, bx - 50, by - 24, 130, 48, SK.ink, 2);
    SK.text(ctx, 'sorry!', bx + 15, by, 24);
  }

  if (G.trivia) renderTrivia(ctx);

  if (G.paused && !G.trivia) {
    SK.rect(ctx, 490, 280, 300, 160, SK.ink, 3);
    SK.text(ctx, 'paused', 640, 320, 40);
    SK.rect(ctx, 540, 360, 200, 60, SK.ink, 3);
    SK.text(ctx, 'resume', 640, 390, 28);
    G.buttons.push({ x: 540, y: 360, w: 200, h: 60, action: () => { G.paused = false; } });
  }
}

function renderTrivia(ctx) {
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 1280, 720);

  const w = 960, h = 500;
  const x = (1280 - w) / 2, y = (720 - h) / 2;
  SK.rect(ctx, x, y, w, h, SK.ink, 3);
  SK.star(ctx, x + w / 2, y + 50, 26);
  SK.text(ctx, G.trivia.question, x + w / 2, y + 130, 28);

  const optW = 280, optH = 140;
  const totalW = 3
