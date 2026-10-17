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
  SK.text(ctx, label, x + w / 2, y + h / 2, 26);
  G.buttons.push({ x, y, w, h, action });
}

/* ---------------- TITLE ---------------- */

function renderTitle(ctx) {
  SK.rect(ctx, 460, 130, 360, 140, SK.ink, 3);
  SK.rect(ctx, 500, 150, 40, 40, SK.ink, 2);
  SK.text(ctx, 'exit a', 640, 220, 44);
  SK.text(ctx, 'hku station · exit a', 640, 330, 34);

  SK.line(ctx, 0, 560, 1280, 560, SK.ink, 2, 0.8);

  SK.circle(ctx, 640, 430, 22, SK.ink, 2);
  SK.line(ctx, 640, 430, 640, 415, SK.ink, 2);
  SK.line(ctx, 640, 430, 650, 430, SK.ink, 2);
  SK.text(ctx, '8:50', 700, 430, 28);

  SK.rect(ctx, 540, 570, 200, 60, SK.ink, 3);
  SK.text(ctx, 'start', 640, 600, 28);
  G.buttons.push({
    x: 540, y: 570, w: 200, h: 60,
    action: () => { requestFullscreen(); G.screen = 'mode'; }
  });

  SK.text(ctx, 'this game is fictional. please queue properly in real life.', 640, 680, 18, SK.ink);

  SK.rect(ctx, 40, 40, 60, 60, SK.ink, 2);
  SK.text(ctx, G.soundOn ? '♪' : '×', 70, 70, 30);
  G.buttons.push({
    x: 40, y: 40, w: 60, h: 60,
    action: () => { G.soundOn = !G.soundOn; saveSound(); }
  });
}

/* ---------------- MODE ---------------- */

function renderMode(ctx) {
  SK.text(ctx, 'choose your queue', 640, 130, 40);

  SK.rect(ctx, 330, 290, 620, 70, SK.ink, 3);
  SK.text(ctx, 'easy — exit a1 line', 640, 315, 26);
  SK.text(ctx, '~65 people', 640, 345, 18);
  G.buttons.push({ x: 330, y: 290, w: 620, h: 70, action: () => { startGame('easy'); } });

  SK.rect(ctx, 330, 400, 620, 70, SK.ink, 3);
  SK.text(ctx, 'hard — exit a2 line', 640, 425, 26);
  SK.text(ctx, '~100 people', 640, 455, 18);
  G.buttons.push({ x: 330, y: 400, w: 620, h: 70, action: () => { startGame('hard'); } });

  btn(ctx, 60, 640, 160, 60, 'back', () => { G.screen = 'title'; });
  SK.text(ctx, 'this game is fictional. please queue properly in real life.', 640, 660, 18);
}

/* ---------------- BRIEFING ---------------- */

function renderBriefing(ctx) {
  SK.circle(ctx, 640, 130, 22, SK.ink, 2);
  SK.line(ctx, 640, 130, 640, 115, SK.ink, 2);
  SK.line(ctx, 640, 130, 650, 130, SK.ink, 2);
  SK.text(ctx, '8:50', 700, 130, 28);

  SK.rect(ctx, 440, 220, 400, 100, SK.ink, 3);
  SK.circle(ctx, 500, 270, 15, SK.ink, 2);
  SK.text(ctx, 'people ahead: ' + G.total, 660, 270, 26);

  SK.text(ctx, 'class check-in at 9:00 sharp.', 640, 380, 28);
  SK.text(ctx, 'reach the front before 8:55.', 640, 430, 28);

  btn(ctx, 540, 530, 200, 60, 'how to play', () => {
    G.screen = 'tutorial';
    G.tutorialPage = 0;
  });
  btn(ctx, 540, 610, 200, 55, 'start queuing', () => { G.screen = 'game'; });
}

/* ---------------- TUTORIAL ---------------- */

function renderTutorial(ctx) {
  SK.text(ctx, 'how to play', 640, 80, 40);

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
      const cardW = 380, cardH = 130;
      const totalW = count * cardW + (count - 1) * 20;
      const startX = (1280 - totalW) / 2;
      const y = 160 + row * (cardH + 30);
      for (let c = 0; c < count; c++) {
        const x = startX + c * (cardW + 20);
        SK.rect(ctx, x, y, cardW, cardH, SK.ink, 3);
        const card = cards[i];
        if (card.type === 'staff') {
          CH.person(ctx, x + 70, y + cardH - 10, { state: 'away', type: 'normal' });
        } else {
          CH.person(ctx, x + 70, y + cardH - 10, {
            state: card.type === 'looking' ? 'looking' : 'away',
            type: card.type,
          });
        }
        SK.line(ctx, x + 130, y + 40, x + 170, y + 80, SK.red, 3);
        SK.line(ctx, x + 170, y + 40, x + 130, y + 80, SK.red, 3);
        SK.text(ctx, card.label, x + cardW - 20, y + 40, 20, SK.ink, 'right');
        if (card.type !== 'staff') {
          SK.heart(ctx, x + cardW - 140, y + 85, 16);
          SK.text(ctx, '−1', x + cardW - 100, y + 85, 22, SK.red);
        } else {
          SK.text(ctx, 'restart', x + cardW - 40, y + 85, 20, SK.ink, 'right');
        }
        i++;
      }
    }
  } else {
    const cards = [
      { icon: 'alert', label: "alert doodle = they're about to turn" },
      { icon: 'star', label: 'star box = answer a question, skip ahead (max 6)' },
      { icon: 'hearts', label: "three hearts. lose all three and it's over." },
      { icon: 'clock', label: 'reach the front before 8:55' },
    ];
    const cardW = 700, cardH = 100;
    for (let i = 0; i < cards.length; i++) {
      const x = (1280 - cardW) / 2;
      const y = 150 + i * 110;
      SK.rect(ctx, x, y, cardW, cardH, SK.ink, 3);
      const card = cards[i];
      if (card.icon === 'alert') SK.alert(ctx, x + 60, y + cardH / 2);
      if (card.icon === 'star') SK.star(ctx, x + 60, y + cardH / 2, 20);
      if (card.icon === 'hearts') {
        SK.heart(ctx, x + 30, y + cardH / 2, 16);
        SK.heart(ctx, x + 60, y + cardH / 2, 16);
        SK.heart(ctx, x + 90, y + cardH / 2, 16);
      }
      if (card.icon === 'clock') {
        SK.circle(ctx, x + 60, y + cardH / 2, 20, SK.ink, 2);
        SK.line(ctx, x + 60, y + cardH / 2, x + 60, y + cardH / 2 - 12, SK.ink, 2);
        SK.line(ctx, x + 60, y + cardH / 2, x + 70, y + cardH / 2, SK.ink, 2);
      }
      SK.text(ctx, card.label, x + 130, y + cardH / 2, 24, SK.ink, 'left');
    }
  }

  SK.text(ctx, 'space  |  tap anywhere  |  jump', 640, 640, 22);

  if (G.tutorialPage === 0) {
    btn(ctx, 1040, 620, 180, 60, 'next', () => { G.tutorialPage = 1; });
  } else {
    btn(ctx, 1020, 620, 200, 60, 'got it', () => { G.screen = 'game'; });
  }
  btn(ctx, 60, 620, 160, 60, 'skip', () => { G.screen = 'game'; });
}

/* ---------------- GAME ---------------- */

function renderGame(ctx) {
  SK.line(ctx, 0, 560, 1280, 560, SK.ink, 2, 0.8);

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
    py = 560 - Math.sin(p * Math.PI) * 160;
    px = CONFIG.playerX + Math.sin(p * Math.PI) * 100;
  } else if (G.playerLunge > 0) {
    px = CONFIG.playerX + G.playerLunge * 100;
  }
  CH.player(ctx, px, py, G.playerState);

  if (G.combo >= 2) {
    SK.text(ctx, G.combo + '/5', CONFIG.playerX, 450, 20, SK.gold);
  }

  SK.text(ctx, currentClockString(), 1240, 40, 26, SK.ink, 'right');
  for (let i = 0; i < CONFIG.hearts; i++) {
    SK.heart(ctx, 1120 + i * 40, 92, 16, i >= G.hearts);
  }
  SK.text(ctx, 'people ' + Math.max(0, G.total - G.passed), 1240, 140, 22, SK.ink, 'right');

  if (G.staffState === 'banner') {
    SK.rect(ctx, 140, 90, 1000, 80, SK.blue, 3);
    SK.text(ctx, 'lift traffic is very busy, please follow staff direction to queue in line', 640, 130, 22, SK.ink);
  }

  if (G.staffState === 'walking') {
    const sx = 1280 - G.staffPhase * 1400;
    CH.person(ctx, sx, 560, { state: 'away', type: 'normal' });
    SK.rect(ctx, sx - 25, 470, 50, 70, SK.red, 2);
    SK.alert(ctx, sx, 430);
  }

  if (G.frozen && G.queue[0]) {
    const bx = CONFIG.slotX[0], by = 440;
    SK.rect(ctx, bx - 40, by - 20, 120, 40, SK.ink, 2);
    SK.text(ctx, 'sorry!', bx + 20, by, 22);
  }

  if (G.trivia) renderTrivia(ctx);
}

function renderTrivia(ctx) {
  const w = 900, h = 420;
  const x = (1280 - w) / 2, y = (720 - h) / 2;
  SK.rect(ctx, x, y, w, h, SK.ink, 3);
  SK.star(ctx, x + w / 2, y + 40, 18);
  SK.text(ctx, G.trivia.question, x + w / 2, y + 100, 26);

  const optW = 260, optH = 120;
  const totalW = 3 * optW + 2 * 20;
  const startX = x + (w - totalW) / 2;
  G.trivia.optionRects = [];
  for (let i = 0; i < 3; i++) {
    const ox = startX + i * (optW + 20);
    const oy = y + 180;
    const opt = G.trivia.options[i];
    let color = SK.ink;
    if (G.trivia.result && G.trivia.chosen === i) {
      color = G.trivia.result === 'correct' ? SK.gold : SK.red;
    }
    SK.rect(ctx, ox, oy, optW, optH, color, 3);
    SK.text(ctx, opt.label, ox + optW / 2, oy + optH / 2, 22);
    G.trivia.optionRects.push({ x: ox, y: oy, w: optW, h: optH });
  }

  SK.text(ctx, 'tap the answer', x + w / 2, y + h - 30, 18);
}

/* ---------------- SUCCESS ---------------- */

function renderSuccess(ctx) {
  CH.player(ctx, 640, 260, 'idle');
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + 0.3;
    SK.star(ctx, 640 + Math.cos(a) * 80, 260 + Math.sin(a) * 60, 12);
  }

  SK.text(ctx, 'phew, just make it!', 640, 380, 44);

  const x = 440, y = 430, w = 400, h = 150;
  SK.rect(ctx, x, y, w, h, SK.ink, 3);

  SK.circle(ctx, x + 40, y + 35, 12, SK.ink, 2);
  SK.text(ctx, G.passed + ' people cut', x + 80, y + 35, 22, SK.ink, 'left');

  SK.circle(ctx, x + 40, y + 75, 12, SK.ink, 2);
  SK.text(ctx, 'arrived ' + G.winTime, x + 80, y + 75, 22, SK.ink, 'left');

  SK.rect(ctx, x + 30, y + 105, 24, 30, SK.ink, 2);
  SK.text(ctx, 'exit ' + (G.mode === 'easy' ? 'a1' : 'a2'), x + 80, y + 115, 22, SK.ink, 'left');

  btn(ctx, 540, 620, 200, 60, 'again', () => { G.screen = 'mode'; });
}

/* ---------------- FAIL ---------------- */

function renderFail(ctx) {
  let icon = 'staff', headline = 'caught by station staff. start over.';
  if (G.failReason === 'hearts') { icon = 'heart'; headline = 'three strikes. game over.'; }
  if (G.failReason === 'clock') { icon = 'clock'; headline = 'leave home earlier next time.'; }

  if (icon === 'heart') SK.heart(ctx, 640, 180, 40, true);
  if (icon === 'clock') {
    SK.circle(ctx, 640, 180, 40, SK.ink, 3);
    SK.line(ctx, 640, 180, 640, 155, SK.ink, 3);
    SK.line(ctx, 640, 180, 665, 180, SK.ink, 3);
  }
  if (icon === 'staff') CH.person(ctx, 640, 220, { state: 'away', type: 'normal' });

  SK.text(ctx, headline, 640, 320, 34);

  btn(ctx, 540, 420, 200, 60, 'try again', () => { startGame(G.mode); });
  btn(ctx, 540, 500, 200, 60, 'change mode', () => { G.screen = 'mode'; });
}
