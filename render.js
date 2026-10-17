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

  // ground
  SK.line(ctx, 0, 560, 1280, 560, SK.ink, 2, 0.8);

  // player walking in from left then standing
  const walkIn = Math.min(1, t / 2);
  const px = -100 + (CONFIG.playerX + 100) * walkIn;
  CH.player(ctx, px, 560, 'idle');

  // clock doodle
  SK.circle(ctx, 640, 400, 30, SK.ink, 2.5);
  SK.line(ctx, 640, 400, 640, 380, SK.ink, 2.5);
  SK.line(ctx, 640, 400, 660, 400, SK.ink, 2.5);
  SK.text(ctx, '8:50', 720, 400, 34);

  // scenario text
  SK.text(ctx, 'you are queuing for the lift at exit a.', 640, 470, 26);
  SK.text(ctx, 'class check-in is at 9:00 sharp.', 640, 500, 26);
  SK.text(ctx, 'jump the queue when people are not looking.', 640, 530, 26);

  SK.text(ctx, 'this game is fictional. please queue properly in real life.', 640, 690, 20, SK.ink);

  // start button
  SK.rect(ctx, 540, 590, 200, 70, SK.ink, 3);
  SK.text(ctx, 'start', 640, 625, 32);
  G.buttons.push({
    x: 540, y: 590, w: 200, h: 70,
    action: () => { requestFullscreen(); G.screen = 'mode'; }
  });

  // sound toggle
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
  SK.text(ctx, 'easy — exit a1 line', 640, 320, 30);
  SK.text(ctx, '~65 people', 640, 360, 22);
  G.buttons.push({ x: 330, y: 290, w: 620, h: 100, action: () => { startGame('easy'); } });

  SK.rect(ctx, 330, 420, 620, 100, SK.ink, 3);
  SK.text(ctx, 'hard — exit a2 line', 640, 450, 30);
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
      { type: 'distracted', label: 'distracted — medium window' },
      { type: 'paranoid', label: 'paranoid — turns fast' },
      { type: 'staff', label: 'staff — never jump' },
    ];
    let i = 0;
    for (let row = 0; row < 2; row++) {
      const count = row === 0 ? 3 : 2;
      const cardW = 380, cardH = 160;
      const totalW = count * cardW + (count - 1) * 20;
      const startX = (1280 - totalW) / 2;
      const y = 180 + row * (cardH + 30);
      for (let c = 0; c < count; c++) {
        const x = startX + c * (cardW + 20);
        SK.rect(ctx, x, y, cardW, cardH, SK.ink, 3);
        const card = cards[i];
        if (card.type === 'staff') {
          CH.person(ctx, x + 90, y + cardH - 15, { state: 'away', type: 'staff' });
        } else {
          CH.person(ctx, x + 90, y + cardH - 15, {
            state: card.type === 'looking' ? 'looking' : 'away',
            type: card.type,
          });
        }
        SK.text(ctx, card.label, x + 170, y + 50, 22, SK.ink, 'left');
        if (card.type !== 'staff') {
          SK.heart(ctx, x + 190, y + 110, 18);
          SK.text(ctx, '−1', x + 220, y + 110, 24, SK.red, 'left');
        } else {
          SK.text(ctx, 'caught by staff = restart', x + 170, y + 110, 18, SK.ink, 'left');
        }
        i++;
      }
    }
  } else {
    const cards = [
      { icon: 'alert', label: 'alert doodle above head = they will turn around soon' },
      { icon: 'star', label: 'star box = answer an hku question, skip ahead (max 6)' },
      { icon: 'announce', label: 'station announcement = staff is coming. do not jump.' },
      { icon: 'hearts', label: "three hearts. lose all three and it's over." },
      { icon: 'clock', label: 'reach the front before 8:55' },
    ];
    const cardW = 800, cardH = 90;
    for (let i = 0; i < cards.length; i++) {
      const x = (1280 - cardW) / 2;
      const y = 170 + i * 100;
      SK.rect(ctx, x, y, cardW, cardH, SK.ink, 3);
      const card = cards[i];
      if (card.icon === 'alert') SK.alert(ctx, x + 60, y + cardH / 2);
      if (card.icon === 'star') SK.star(ctx, x + 60, y + cardH / 2, 20);
      if (card.icon === 'hearts') { SK.heart(ctx, x + 40, y + cardH / 2, 18); SK.heart(ctx, x + 70, y + cardH / 2, 18); SK.heart(ctx, x + 100, y + cardH / 2, 18); }
      if (card.icon === 'clock') {
        SK.circle(ctx, x + 60, y + cardH / 2, 22, SK.ink, 2);
        SK.line(ctx, x + 60, y + cardH / 2, x + 60, y + cardH / 2 - 14, SK.ink, 2);
        SK.line(ctx, x + 60, y + cardH / 2, x + 72, y + cardH / 2, SK.ink, 2);
      }
      if (card.icon === 'announce') {
        SK.rect(ctx, x + 20, y + 25, 80, 40, SK.blue, 2.5);
        SK.text(ctx, '!', x + 60, y + 45, 28, SK.blue);
      }
      SK.text(ctx, card.label, x + 140, y + cardH / 2, 24, SK.ink, 'left');
    }
  }

  if (G.tutorialPage === 0) btn(ctx, 1040, 630, 180, 60, 'next', () => { G.tutorialPage = 1; });
  else btn(ctx, 1020, 630, 200, 60, 'got it', () => { G.screen = 'briefing'; });
  btn(ctx, 60, 630, 160, 60, 'skip', () => { G.screen = 'game'; });
}

/* ---------------- GAME ---------------- */

function renderGame(ctx) {
  SK.line(ctx, 0, 560, 1280, 560, SK.ink, 2, 0.8);

  // passed members stay behind player
  for (let i = 0; i < G.passedQueue.length; i++) {
    const m = G.passedQueue[i];
    const behindX = CONFIG.playerX - 80 - i * 60;
    if (behindX < -40) continue;
    CH.person(ctx, behindX, 560, m);
  }

  // queue
  for (let i = 0; i < G.queue.length; i++) {
    const m = G.queue[i];
    let offsetX = 0;
    if (G.frozen) offsetX = Math.sin(performance.now() / 60) * 3;
    CH.person(ctx, CONFIG.slotX[i] + offsetX, 560, m);
  }

  // player with forward lunge
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

  // timer top-left
  SK.text(ctx, currentClockString(), 40, 50, 32, SK.ink, 'left');

  // hearts top-right
  for (let i = 0; i < CONFIG.hearts; i++) {
    SK.heart(ctx, 1180 + i * 40, 60, 22, i >= G.hearts);
  }
  SK.text(ctx, 'people ' + Math.max(0, G.total - G.passed), 1240, 110, 26, SK.ink, 'right');

  // banner
  if (G.staffState === 'banner') {
    SK.rect(ctx, 140, 90, 1000, 90, SK.blue, 3);
    SK.text(ctx, 'lift traffic is very busy, please follow staff direction to queue in line', 640, 135, 22, SK.ink);
  }

  // staff
  if (G.staffState === 'walking') {
    const sx = 1280 - G.staffPhase * 1400;
    CH.person(ctx, sx, 560, { state: 'away', type: 'staff' });
    SK.alert(ctx, sx, 420);
  }

  // catch bubble
  if (G.frozen && G.queue[0]) {
    const bx = CONFIG.slotX[0], by = 420;
    SK.rect(ctx, bx - 50, by - 24, 130, 48, SK.ink, 2);
    SK.text(ctx, 'sorry!', bx + 15, by, 24);
  }

  if (G.trivia) renderTrivia(ctx);
}

function renderTrivia(ctx) {
  const w = 960, h = 460;
  const x = (1280 - w) / 2, y = (720 - h) / 2;
  SK.rect(ctx, x, y, w, h, SK.ink, 3);
  SK.star(ctx, x + w / 2, y + 40, 24);
  SK.text(ctx, G.trivia.question, x + w / 2, y + 110, 28);

  const optW = 280, optH = 130;
  const totalW = 3 * optW + 2 * 20;
  const startX = x + (w - totalW) / 2;
  G.trivia.optionRects = [];
  for (let i = 0; i < 3; i++) {
    const ox = startX + i * (optW + 20);
    const oy = y + 190;
    const opt = G.trivia.options[i];
    let color = SK.ink;
    if (G.trivia.result && G.trivia.chosen === i) {
      color = G.trivia.result === 'correct' ? SK.gold : SK.red;
    }
    SK.rect(ctx, ox, oy, optW, optH, color, 3);
    SK.text(ctx, opt.label, ox + optW / 2, oy + optH / 2, 24);
    G.trivia.optionRects.push({ x: ox, y: oy, w: optW, h: optH });
  }
  SK.text(ctx, 'tap the answer', x + w / 2, y + h - 30, 20);
}

/* ---------------- SUCCESS ---------------- */

function renderSuccess(ctx) {
  CH.player(ctx, 640, 280, 'idle');
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + 0.3;
    SK.star(ctx, 640 + Math.cos(a) * 90, 280 + Math.sin(a) * 70, 14);
  }
  SK.text(ctx, 'phew, just make it!', 640, 400, 48);

  const x = 440, y = 450, w = 400, h = 150;
  SK.rect(ctx, x, y, w, h, SK.ink, 3);
  SK.circle(ctx, x + 40, y + 35, 14, SK.ink, 2);
  SK.text(ctx, G.passed + ' people cut', x + 80, y + 35, 24, SK.ink, 'left');
  SK.circle(ctx, x + 40, y + 75, 14, SK.ink, 2);
  SK.text(ctx, 'arrived ' + G.winTime, x + 80, y + 75, 24, SK.ink, 'left');
  SK.rect(ctx, x + 30, y + 105, 24, 30, SK.ink, 2);
  SK.text(ctx, 'exit ' + (G.mode === 'easy' ? 'a1' : 'a2'), x + 80, y + 115, 24, SK.ink, 'left');

  btn(ctx, 540, 630, 200, 60, 'again', () => { G.screen = 'mode'; });
}

/* ---------------- FAIL ---------------- */

function renderFail(ctx) {
  let icon = 'staff', headline = 'caught by station staff. start over.';
  if (G.failReason === 'hearts') { icon = 'heart'; headline = 'three strikes. game over.'; }
  if (G.failReason === 'clock') { icon = 'clock'; headline = 'leave home earlier next time.'; }

  if (icon === 'heart') SK.heart(ctx, 640, 180, 48, true);
  if (icon === 'clock') {
    SK.circle(ctx, 640, 180, 48, SK.ink, 3);
    SK.line(ctx, 640, 180, 640, 150, SK.ink, 3);
    SK.line(ctx, 640, 180, 670, 180, SK.ink, 3);
  }
  if (icon === 'staff') CH.person(ctx, 640, 260, { state: 'away', type: 'staff' });

  SK.text(ctx, headline, 640, 350, 36);
  btn(ctx, 540, 440, 200, 60, 'try again', () => { startGame(G.mode); });
  btn(ctx, 540, 520, 200, 60, 'change mode', () => { G.screen = 'mode'; });
}
