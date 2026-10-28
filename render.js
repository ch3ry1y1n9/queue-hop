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
  SK.text(ctx, label, x + w / 2, y + h / 2, 30);
  SK.line(ctx, x + 20, y + h / 2 + 20, x + w - 20, y + h / 2 + 20, SK.ink, 2, 0.6);
  G.buttons.push({ x: x, y: y, w: w, h: h, action: action });
}

/* ---------------- TITLE ---------------- */

function renderTitle(ctx) {
  const t = performance.now() / 1000;

  SK.text(ctx, 'queue hop', 640, 140, 72);
  SK.text(ctx, 'hku station · exit A', 640, 210, 34);

  SK.line(ctx, 0, 560, 1280, 560, SK.ink, 2, 0.8);

  const walkIn = Math.min(1, t / 2);
  const px = -100 + (CONFIG.playerX + 100) * walkIn;
  CH.player(ctx, px, 560, 'idle');

  SK.text(ctx, 'you are queuing for the lift at exit A.', 640, 340, 28);
  SK.text(ctx, 'class check-in is at 9:00 sharp.', 640, 380, 28);
  SK.text(ctx, 'jump the queue when people are not looking.', 640, 420, 28);

  SK.text(ctx, 'this game is fictional. please queue properly in real life.', 640, 690, 18);
  SK.text(ctx, 'fonts: fonts.google.com/specimen/Gaegu', 1240, 30, 13, SK.grey, 'right');

  SK.text(ctx, 'start', 640, 625, 32);
  SK.line(ctx, 580, 650, 700, 650, SK.ink, 2, 0.6);
  G.buttons.push({
    x: 540, y: 590, w: 200, h: 70,
    action: function() { requestFullscreen(); G.screen = 'mode'; }
  });
}

/* ---------------- MODE ---------------- */

function renderMode(ctx) {
  SK.text(ctx, 'choose your queue', 640, 140, 44);

  SK.text(ctx, 'easy — exit A1 line', 640, 340, 30);
  SK.line(ctx, 420, 365, 860, 365, SK.ink, 2, 0.6);
  G.buttons.push({
    x: 330, y: 290, w: 620, h: 100,
    action: function() { startGame('easy'); }
  });

  SK.text(ctx, 'hard — exit A2 line', 640, 470, 30);
  SK.line(ctx, 420, 495, 860, 495, SK.ink, 2, 0.6);
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

  SK.text(ctx, 'people ahead: ' + G.total, 640, 270, 34);

  SK.text(ctx, 'class check-in at 9:00 sharp.', 640, 380, 30);
  SK.text(ctx, 'reach the front before 8:55.', 640, 430, 30);

  btn(ctx, 540, 530, 220, 70, 'how to play', function() {
    G.screen = 'tutorial';
    G.tutorialPage = 0;
    G.tutorialReturn = 'briefing';
  });
  btn(ctx, 540, 620, 220, 60, 'start queuing', function() { G.screen = 'game'; });
}

/* ---------------- TUTORIAL ---------------- */

function renderTutorial(ctx) {
  SK.text(ctx, 'how to play', 640, 80, 44);
  SK.text(ctx, 'use space on desktop, or tap anywhere on your phone, to jump', 640, 140, 22);

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
    const rows = [
      { icon: 'alert', label: 'alert doodle above head = they will turn around soon' },
      { icon: 'star', label: 'star box = answer an hku question, skip ahead (max 6)' },
      { icon: 'announce', label: 'station announcement = staff is coming. do not jump.' },
      { icon: 'hearts', label: "three hearts. lose all three and it's over." },
      { icon: 'clock', label: 'reach the front before 8:55' }
    ];
    for (let i = 0; i < rows.length; i++) {
      const y = 230 + i * 74;
      const iconX = 340;
      const textX = 400;
      if (rows[i].icon === 'alert') SK.alert(ctx, iconX, y);
      if (rows[i].icon === 'star') SK.star(ctx, iconX, y, 18);
      if (rows[i].icon === 'hearts') {
        SK.heart(ctx, iconX - 30, y, 16);
        SK.heart(ctx, iconX, y, 16);
        SK.heart(ctx, iconX + 30, y, 16);
      }
      if (rows[i].icon === 'clock') {
        SK.circle(ctx, iconX, y, 18, SK.ink, 2);
        SK.line(ctx, iconX, y, iconX, y - 11, SK.ink, 2);
        SK.line(ctx, iconX, y, iconX + 10, y, SK.ink, 2);
      }
      if (rows[i].icon === 'announce') {
        SK.rect(ctx, iconX - 26, y - 12, 52, 24, SK.blue, 2.5);
        SK.text(ctx, '!', iconX, y, 20, SK.blue);
      }
      SK.text(ctx, rows[i].label, textX, y, 24, SK.ink, 'left');
    }
  }

  SK.text(ctx, 'skip', 100, 660, 28, SK.ink);
  SK.line(ctx, 78, 678, 122, 678, SK.ink, 2, 0.6);
  G.buttons.push({ x: 60, y: 620, w: 120, h: 80, action: function() {
    if (G.tutorialReturn === 'pause') { G.paused = false; G.screen = 'game'; G.tutorialReturn = null; }
    else G.screen = 'game';
  }});

  if (G.tutorialPage === 0) {
    SK.text(ctx, 'next', 1140, 660, 28, SK.ink);
    SK.line(ctx, 1122, 678, 1158, 678, SK.ink, 2, 0.6);
    G.buttons.push({ x: 1100, y: 620, w: 120, h: 80, action: function() { G.tutorialPage = 1; } });
  } else {
    SK.text(ctx, 'got it', 1140, 660, 28, SK.ink);
    SK.line(ctx, 1112, 678, 1168, 678, SK.ink, 2, 0.6);
    G.buttons.push({ x: 1080, y: 620, w: 160, h: 80, action: function() {
      if (G.tutorialReturn === 'pause') { G.paused = false; G.screen = 'game'; G.tutorialReturn = null; }
      else G.screen = 'briefing';
    }});
  }
}

/* ---------------- GAME ---------------- */

function drawLift(ctx) {
  // lift on the right-hand side, past the last queue slot
  const lx = 1180;
  const ly = 320;

  // lift door frame
  SK.rect(ctx, lx, ly, 90, 240, SK.ink, 3);

  // double doors
  SK.line(ctx, lx + 45, ly + 10, lx + 45, ly + 230, SK.ink, 2, 0.5);

  // handle marks
  SK.line(ctx, lx + 38, ly + 115, lx + 38, ly + 130, SK.ink, 2.5, 0);
  SK.line(ctx, lx + 52, ly + 115, lx + 52, ly + 130, SK.ink, 2.5, 0);

  // floor indicator above door
  SK.rect(ctx, lx + 15, ly - 28, 60, 22, SK.ink, 2);
  SK.text(ctx, G.mode === 'easy' ? 'A1' : 'A2', lx + 45, ly - 17, 16, SK.ink);

  // opening direction arrows on both sides of frame
  SK.line(ctx, lx - 15, ly + 60, lx - 5, ly + 60, SK.ink, 2, 0.3);
  SK.line(ctx, lx - 5, ly + 60, lx - 10, ly + 55, SK.ink, 2, 0.2);
  SK.line(ctx, lx - 5, ly + 60, lx - 10, ly + 65, SK.ink, 2, 0.2);

  // ground line under lift
  SK.line(ctx, lx - 20, 560, lx + 110, 560, SK.ink, 2, 0.8);
}

function renderGame(ctx) {
  SK.line(ctx, 0, 560, 1280, 560, SK.ink, 2, 0.8);

  const remaining = G.total - G.passed;
  if (remaining <= 10) {
    drawLift(ctx);
  }

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

  // pause button — two vertical bars, no box
  SK.line(ctx, 1218, 120, 1218, 160, SK.ink, 4);
  SK.line(ctx, 1242, 120, 1242, 160, SK.ink, 4);
  G.buttons.push({ x: 1180, y: 90, w: 90, h: 90, action: function() { G.paused = true; } });

  if (G.staffState === 'banner') {
    SK.text(ctx, 'lift traffic is very busy, please follow staff direction to queue in line', 640, 135, 30, SK.blue);
  }

  if (G.staffState === 'walking') {
    const sx = 1280 - G.staffPhase * 1400;
    CH.person(ctx, sx, 560, { state: 'away', type: 'staff' });
    SK.alert(ctx, sx, 420);
  }

  if (G.frozen && G.queue[0]) {
    SK.text(ctx, 'sorry!', px, py - 180, 46, SK.red);
    SK.text(ctx, 'moved back to position ' + (G.total - G.passed), 640, 200, 32, SK.red);
  }

  if (G.advanceMessageTimer > 0) {
    SK.text(ctx, '+' + G.advanceMessageAmount + ' positions', 640, 210, 34, '#4a7a00');
  }

  if (G.trivia) renderTrivia(ctx);

  SK.text(ctx, currentClockString(), 40, 50, 32, SK.ink, 'left');
  SK.text(ctx, 'people ' + Math.max(0, G.total - G.passed), 640, 60, 42, SK.ink, 'center');
  for (let i = 0; i < CONFIG.hearts; i++) {
    SK.heart(ctx, 1120 + i * 60, 50, 30, i >= G.hearts);
  }

  if (G.paused && !G.trivia) renderPause(ctx);
}

/* ---------------- TRIVIA ---------------- */

function renderTrivia(ctx) {
  const w = 960, h = 540;
  const x = (1280 - w) / 2, y = (720 - h) / 2;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x, y, w, h);

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
  ctx.fillStyle = 'rgba(255,255,255,0.96)';
  ctx.fillRect(0, 0, 1280, 720);

  SK.text(ctx, 'paused', 640, 250, 44, SK.red);

  SK.text(ctx, 'resume', 640, 340, 34, SK.ink);
  SK.line(ctx, 590, 360, 690, 360, SK.ink, 2, 0.6);
  G.buttons.push({ x: 490, y: 310, w: 300, h: 60, action: function() { G.paused = false; } });

  SK.text(ctx, 'how to play', 640, 410, 34, SK.ink);
  SK.line(ctx, 555, 430, 725, 430, SK.ink, 2, 0.6);
  G.buttons.push({ x: 490, y: 380, w: 300, h: 60, action: function() {
    G.paused = false;
    G.screen = 'tutorial';
    G.tutorialPage = 0;
    G.tutorialReturn = 'pause';
  }});

  SK.text(ctx, 'back to landing page', 640, 480, 28, SK.ink);
  SK.line(ctx, 480, 498, 800, 498, SK.ink, 2, 0.6);
  G.buttons.push({ x: 490, y: 450, w: 300, h: 60, action: function() {
    G.paused = false;
    G.screen = 'title';
  }});
}

/* ---------------- SUCCESS ---------------- */

function renderSuccess(ctx) {
  CH.player(ctx, 640, 300, 'idle');
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + 0.3;
    SK.star(ctx, 640 + Math.cos(a) * 90, 300 + Math.sin(a) * 70, 14);
  }
  SK.text(ctx, 'phew, just make it!', 640, 420, 48);

  SK.text(ctx, 'got into a lift at ' + G.winTime, 640, 490, 30, SK.ink);
  SK.text(ctx, 'exit ' + (G.mode === 'easy' ? 'A1' : 'A2'), 640, 530, 30, SK.ink);

  SK.text(ctx, 'go to landing page', 640, 620, 30, SK.ink);
  SK.line(ctx, 545, 638, 735, 638, SK.ink, 2, 0.6);
  G.buttons.push({ x: 490, y: 590, w: 300, h: 60, action: function() { G.screen = 'title'; } });
}

/* ---------------- FAIL ---------------- */

function renderFail(ctx) {
  let icon = 'staff', headline = 'caught by station staff. start over.';
  if (G.failReason === 'hearts') { icon = 'heart'; headline = '3 times getting caught...'; }
  if (G.failReason === 'clock') { icon = 'clock'; headline = 'leave home earlier next time.'; }

  if (icon === 'heart') SK.heart(ctx, 640, 180, 48, true);
  if (icon === 'clock') {
    SK.circle(ctx, 640, 180, 48, SK.ink, 3);
    SK.line(ctx, 640, 180, 640, 150, SK.ink, 3);
    SK.line(ctx, 640, 180, 670, 180, SK.ink, 3);
  }

  if (icon === 'staff') {
    SK.line(ctx, 0, 380, 1280, 380, SK.ink, 2, 0.8);

    CH.person(ctx, 460, 380, { state: 'away', type: 'staff' });

    ctx.save();
    ctx.translate(820, 380);
    ctx.scale(-1, 1);
    CH.player(ctx, 0, 0, 'blush');
    ctx.restore();

    SK.alert(ctx, 460, 240);

    SK.text(ctx, "don't jump the queue!", 640, 265, 24, SK.ink);

    SK.line(ctx, 870, 260, 890, 270, SK.ink, 2, 0.5);
    SK.line(ctx, 870, 280, 890, 290, SK.ink, 2, 0.5);
    SK.line(ctx, 870, 300, 890, 310, SK.ink, 2, 0.5);
  }

  let headlineColor = SK.ink;
  if (G.failReason === 'hearts') headlineColor = SK.red;
  if (G.failReason === 'staff') headlineColor = SK.red;
  const headlineY = icon === 'staff' ? 430 : 350;
  SK.text(ctx, headline, 640, headlineY, 32, headlineColor);

  const offset = icon === 'staff' ? 80 : 0;
  SK.text(ctx, 'queue again', 640, 440 + offset, 30, SK.ink);
  SK.line(ctx, 545, 458 + offset, 735, 458 + offset, SK.ink, 2, 0.6);
  G.buttons.push({ x: 490, y: 410 + offset, w: 300, h: 60, action: function() { startGame(G.mode); } });

  SK.text(ctx, 'change to another queue', 640, 510 + offset, 30, SK.ink);
  SK.line(ctx, 480, 528 + offset, 800, 528 + offset, SK.ink, 2, 0.6);
  G.buttons.push({ x: 490, y: 480 + offset, w: 300, h: 60, action: function() { G.screen = 'mode'; } });
}
