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
  G.buttons.push({ x: x, y: y, w: w, h: h, action: action });
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

  SK.text(ctx, 'you are queuing for the lift at exit a.', 640, 340, 28);
  SK.text(ctx, 'class check-in is at 9:00 sharp.', 640, 380, 28);
  SK.text(ctx, 'jump the queue when people are not looking.', 640, 420, 28);

  SK.text(ctx, 'this game is fictional. please queue properly in real life.', 640, 690, 20);

  SK.rect(ctx, 540, 590, 200, 70, SK.ink, 3);
  SK.text(ctx, 'start', 640, 625, 32);
  G.buttons.push({
    x: 540, y: 590, w: 200, h: 70,
    action: function() { requestFullscreen(); G.screen = 'mode'; }
  });

  SK.rect(ctx, 40, 40, 80, 80, SK.ink, 2);
  SK.text(ctx, G.soundOn ? '♪' : 'x', 80, 80, 36);
  G.buttons.push({
    x: 40, y: 40, w: 80, h: 80,
    action: function() { G.soundOn = !G.soundOn; saveSound(); }
  });
}

/* ---------------- MODE ---------------- */

function renderMode(ctx) {
  SK.text(ctx, 'choose your queue', 640, 140, 44);

  SK.rect(ctx, 330, 290, 620, 100, SK.ink, 3);
  SK.text(ctx, 'easy — exit A1 line', 640, 320, 30);
  SK.text(ctx, '~65 people', 640, 360, 22);
  G.buttons.push({
    x: 330, y: 290, w: 620, h: 100,
    action: function() { startGame('easy'); }
  });

  SK.rect(ctx, 330, 420, 620, 100, SK.ink, 3);
  SK.text(ctx, 'hard — exit A2 line', 640, 450, 30);
  SK.text(ctx, '~100 people', 640, 490, 22);
  G.buttons.push({
    x: 330, y: 420, w: 620, h: 100,
    action: function() { startGame('hard'); }
  });

  btn(ctx, 60, 630, 160, 60, 'back', function() { G.screen = 'title'; });
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

  btn(ctx, 540, 530, 220, 70, 'how to play', function() {
    G.screen = 'tutorial';
    G.tutorialPage = 0;
  });
  btn(ctx, 540, 620, 220, 60, 'start queuing', function() { G.screen = 'game'; });
}

/* ---------------- TUTORIAL ---------------- */

function renderTutorial(ctx) {
  SK.text(ctx, 'how to play', 640, 80, 44);
  SK.text(ctx, 'use space on desktop, or tap anywhere on your phone, to jump', 640, 130, 22);

  if (G.tutorialPage === 0) {
    const cards = [
      { type: 'looking', label: "looking — don't jump" },
      { type: 'dozing', label: 'dozing — safest to pass' },
      { type: 'distracted', label: 'distracted — on phone' },
      { type: 'staff', label: 'staff — never jump' }
    ];
    for (let i = 0; i < 4; i++) {
      const row = i < 2 ? 0 : 1;
      const col = i % 2;
      const x = 140 + col * 520;
      const y = 220 + row * 180;
      const card = cards[i];
      if (card.type === 'staff') {
        CH.person(ctx, x + 80, y + 140, { state: 'away', type: 'staff' });
      } else {
        CH.person(ctx, x + 80, y + 140, {
          state: card.type === 'looking' ? 'looking' : 'away',
          type: card.type
        });
      }
      SK.text(ctx, card.label, x + 160, y + 60, 26, SK.ink, 'left');
    }
  } else {
    const cards = [
      'alert doodle above head = they will turn around soon',
      'star box = answer an hku question, skip ahead (max 6)',
      'station announcement = staff is coming. do not jump.',
      "three hearts. lose all three and it's over.",
      'reach the front before 8:55'
    ];
    for (let i = 0; i < cards.length; i++) {
      SK.text(ctx, cards[i], 640, 200 + i * 60, 24, SK.ink);
    }
  }

  SK.text(ctx, 'skip', 100, 660, 28, SK.ink);
  G.buttons.push({ x: 70, y: 640, w: 100, h: 40, action: function() { G.screen = 'game'; } });

  if (G.tutorialPage === 0) {
    SK.text(ctx, 'next', 1140, 660, 28, SK.ink);
    G.buttons.push({ x: 1120, y: 640, w: 100, h: 40, action: function() { G.tutorialPage = 1; } });
  } else {
    SK.text(ctx, 'got it', 1140, 660, 28, SK.ink);
    G.buttons.push({ x: 1100, y: 640, w: 140, h: 40, action: function() { G.screen = 'briefing'; } });
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
  G.buttons.push({ x: 1200, y: 90, w: 60, h: 60, action: function() { G.paused = true; } });

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
    SK.text(ctx, 'got caught! back to position ' + (G.total - G.passed), 640, 200, 28, SK.red);
  }

  if (G.trivia) renderTrivia(ctx);

  if (G.paused && !G.trivia) renderPause(ctx);
}

/* ---------------- TRIVIA ---------------- */

function renderTrivia(ctx) {
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 1280, 720);

  const w = 960, h = 540;
  const x = (1280 - w) / 2, y = (720 - h) / 2;
  SK.rect(ctx, x, y, w, h, SK.ink, 3);
  SK.star(ctx, x + w / 2, y + 50, 26);
  SK.text(ctx, G.trivia.question, x + w / 2, y + 120, 26);

  const optW = 280, optH = 150;
  const totalW = 3 * optW + 2 * 20;
  const startX = x + (w - totalW) / 2;
  G.trivia.optionRects = [];
  for (let i = 0; i < 3; i++) {
    const ox = startX + i * (optW + 20);
    const oy = y + 200;
    const opt = G.trivia.options[i];
    let color = SK.ink;
    if (G.trivia.result && G.trivia.chosen === i) {
      color = G.trivia.result === 'correct' ? SK.gold : SK.red;
    }
    SK.rect(ctx, ox, oy, optW, optH, color, 3);
    wrapText(ctx, opt.label, ox + optW / 2, oy + optH / 2, optW - 20, 26, SK.ink, 'center');
    G.trivia.optionRects.push({ x: ox, y: oy, w: optW, h: optH });
  }

  if (G.trivia.result) {
    if (G.trivia.result === 'correct') {
      SK.text(ctx, 'correct!', x + w / 2, y + h - 80, 40, SK.gold);
    } else {
      SK.text(ctx, 'wrong!', x + w / 2, y + h - 80, 40, SK.red);
    }
  } else {
    SK.text(ctx, 'tap the answer', x + w / 2, y + h - 40, 20);
  }
}

function wrapText(ctx, text, cx, cy, maxW, size, color, align) {
  ctx.font = size + 'px "Gaegu", "Patrick Hand", cursive';
  ctx.fillStyle = color;
  ctx.textAlign = align || 'center';
  ctx.textBaseline = 'middle';
  const words = String(text).split(' ');
  const lines = [];
  let line = '';
  for (let i = 0; i < words.length; i++) {
    const test = line ? line + ' ' + words[i] : words[i];
    if (ctx.measureText(test).width > maxW && line) {
      lines.push(line);
      line = words[i];
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  const lineH = size + 4;
  const totalH = lines.length * lineH;
  const startY = cy - totalH / 2 + lineH / 2;
  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], cx, startY + i * lineH);
  }
}

/* ---------------- PAUSE ---------------- */

function renderPause(ctx) {
  // dim overlay over avatars
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.fillRect(0, 0, 1280, 720);

  SK.rect(ctx, 390, 220, 500, 280, SK.ink, 3);
  SK.text(ctx, 'paused', 640, 270, 44);

  SK.rect(ctx, 490, 310, 300, 60, SK.ink, 3);
  SK.text(ctx, 'resume', 640, 340, 28);
  G.buttons.push({ x: 490, y: 310, w: 300, h: 60, action: function() { G.paused = false; } });

  SK.rect(ctx, 490, 380, 300, 60, SK.ink, 3);
  SK.text(ctx, 'how to play', 640, 410, 28);
  G.buttons.push({ x: 490, y: 380, w: 300, h: 60, action: function() { G.paused = false; G.screen = 'tutorial'; G.tutorialPage = 0; } });

  SK.rect(ctx, 490, 450, 300, 60, SK.ink, 3);
  SK.text(ctx, 'go to landing page', 640, 480, 28);
  G.buttons.push({ x: 490, y: 450, w: 300, h: 60, action: function() { G.paused = false; G.screen = 'title'; } });
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
  SK.text(ctx, 'exit ' + (G.mode === 'easy' ? 'A1' : 'A2'), x + 80, y + 115, 24, SK.ink, 'left');

  btn(ctx, 540, 630, 200, 60, 'again', function() { G.screen = 'mode'; });
}

/* ---------------- FAIL ---------------- */

function renderFail(ctx) {
  let icon = 'staff', headline = 'caught by station staff. start over.';
  if (G.failReason === 'hearts') { icon = 'heart'; headline = '3 times getting caught... leave home earlier...'; }
  if (G.failReason === 'clock') { icon = 'clock'; headline = 'leave home earlier next time.'; }

  if (icon === 'heart') SK.heart(ctx, 640, 180, 48, true);
  if (icon === 'clock') {
    SK.circle(ctx, 640, 180, 48, SK.ink, 3);
    SK.line(ctx, 640, 180, 640, 150, SK.ink, 3);
    SK.line(ctx, 640, 180, 670, 180, SK.ink, 3);
  }
  if (icon === 'staff') CH.person(ctx, 640, 260, { state: 'away', type: 'staff' });

  SK.text(ctx, headline, 640, 350, 32);
  btn(ctx, 540, 440, 200, 60, 'try again', function() { startGame(G.mode); });
  btn(ctx, 540, 520, 200, 60, 'change mode', function() { G.screen = 'mode'; });
}
