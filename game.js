const G = {
  screen: 'title',
  mode: 'easy',
  total: 0,
  passed: 0,
  hearts: 3,
  starsUsed: 0,
  successAdvances: 0,
  combo: 0,
  clockElapsed: 0,
  queue: [],
  playerState: 'idle',
  jumpTimer: 0,
  frozen: false,
  frozenTimer: 0,
  staffState: 'idle',
  staffTimer: 0,
  staffPhase: 0,
  tutorialPage: 0,
  trivia: null,
  usedQuestions: [],
  buttons: [],
  winTime: '',
  failReason: '',
  best: { easy: 0, hard: 0 },
  soundOn: true,
  soundCtx: null,
};

function rand(a, b) { return a + Math.random() * (b - a); }
function randInt(a, b) { return Math.floor(rand(a, b + 1)); }
function pick(a) { return a[Math.floor(Math.random() * a.length)]; }

function loadBest() {
  try {
    const b = JSON.parse(localStorage.getItem('queuehop_best') || '{}');
    G.best.easy = b.easy || 0;
    G.best.hard = b.hard || 0;
  } catch (e) {}
}
function saveBest() {
  try { localStorage.setItem('queuehop_best', JSON.stringify(G.best)); } catch (e) {}
}
function loadSound() {
  try { G.soundOn = localStorage.getItem('queuehop_sound') !== 'off'; } catch (e) {}
}
function saveSound() {
  try { localStorage.setItem('queuehop_sound', G.soundOn ? 'on' : 'off'); } catch (e) {}
}

function beep(freq, dur) {
  if (!G.soundOn) return;
  try {
    if (!G.soundCtx) G.soundCtx = new (window.AudioContext || window.webkitAudioContext)();
    const o = G.soundCtx.createOscillator();
    const g = G.soundCtx.createGain();
    o.frequency.value = freq;
    o.connect(g); g.connect(G.soundCtx.destination);
    g.gain.setValueAtTime(0.06, G.soundCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, G.soundCtx.currentTime + dur);
    o.start(); o.stop(G.soundCtx.currentTime + dur);
  } catch (e) {}
}

function makeMember(mode, progress = 0) {
  const dist = typeDistribution(mode, progress);
  let r = Math.random();
  let type = 'normal';
  for (const [t, p] of dist) { r -= p; if (r <= 0) { type = t; break; } }
  const cfg = CONFIG.queueTypes[type];
  return {
    type,
    state: 'away',
    awayDur: rand(cfg.away[0], cfg.away[1]),
    alertDur: cfg.alert,
    lookDur: rand(cfg.look[0], cfg.look[1]),
    timer: rand(0, cfg.away[1]),
    hasStar: false,
  };
}

function typeDistribution(mode, progress) {
  const p = Math.min(1, Math.max(0, progress));
  const tables = {
    easy: { early: { dozing: .55, distracted: .3, normal: .15, paranoid: 0 }, late: { dozing: .25, distracted: .4, normal: .25, paranoid: .1 } },
    hard: { early: { dozing: .35, distracted: .3, normal: .2, paranoid: .15 }, late: { dozing: .1, distracted: .3, normal: .2, paranoid: .4 } },
  };
  const t = tables[mode];
  const out = [];
  for (const k in t.early) {
    out.push([k, t.early[k] * (1 - p) + t.late[k] * p]);
  }
  return out;
}

function makeQueue(count, mode, progress = 0) {
  const q = [];
  for (let i = 0; i < count; i++) q.push(makeMember(mode, progress));
  return q;
}

function startGame(mode) {
  const m = CONFIG.modes[mode];
  G.mode = mode;
  G.total = randInt(m.people[0], m.people[1]);
  G.passed = 0;
  G.hearts = CONFIG.hearts;
  G.starsUsed = 0;
  G.successAdvances = 0;
  G.combo = 0;
  G.clockElapsed = 0;
  G.queue = makeQueue(6, mode, 0);
  G.playerState = 'idle';
  G.jumpTimer = 0;
  G.frozen = false;
  G.frozenTimer = 0;
  G.staffState = 'idle';
  G.staffTimer = m.staffFirst;
  G.staffPhase = 0;
  G.trivia = null;
  G.usedQuestions = [];
  G.screen = 'game';
  G.winTime = '';
  G.failReason = '';
}

function fmtClock(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function currentClockSeconds() {
  return CONFIG.clockStart + G.clockElapsed * CONFIG.clockSpeed;
}

function currentClockString() {
  return fmtClock(currentClockSeconds());
}

function maybeSpawnStar() {
  if (G.starsUsed >= CONFIG.starMax) return;
  const shouldHave = Math.floor(G.successAdvances / CONFIG.starEvery);
  if (shouldHave > G.starsUsed) {
    if (G.queue[0] && !G.queue[0].hasStar) G.queue[0].hasStar = true;
  }
}

function onJump() {
  if (G.screen !== 'game') return;
  if (G.trivia) return;
  if (G.frozen) return;
  if (G.jumpTimer > 0) return;

  if (G.staffState === 'walking') {
    G.failReason = 'staff';
    G.screen = 'fail';
    beep(200, 0.2);
    return;
  }

  const target = G.queue[0];
  if (!target) return;

  G.playerState = 'jump';
  G.jumpTimer = CONFIG.jumpDuration;
  beep(800, 0.08);

  if (target.state === 'looking') {
    triggerCatch();
    return;
  }

  // success
  const hadStar = target.hasStar;
  G.passed++;
  G.successAdvances++;
  G.combo++;
  G.queue.shift();
  G.queue.push(makeMember(G.mode, G.passed / G.total));
  if (G.combo >= CONFIG.comboStep) {
    G.passed++;
    G.combo = 0;
    setTimeout(() => {}, 0);
  }
  maybeSpawnStar();

  if (hadStar) {
    G.starsUsed++;
    openTrivia();
    return;
  }

  checkWin();
}

function triggerCatch() {
  G.frozen = true;
  G.frozenTimer = CONFIG.catchSequence;
  G.playerState = 'blush';
  G.hearts--;
  G.passed = Math.max(0, G.passed - CONFIG.catchPenalty);
  G.combo = 0;
  beep(300, 0.15);
  setTimeout(() => {
    if (G.hearts <= 0) {
      G.failReason = 'hearts';
      G.screen = 'fail';
      G.frozen = false;
      return;
    }
    G.queue = makeQueue(6, G.mode, G.passed / G.total);
    maybeSpawnStar();
    G.frozen = false;
    G.playerState = 'idle';
  }, CONFIG.catchSequence * 1000);
}

function openTrivia() {
  if (G.usedQuestions.length >= TRIVIA.length) {
    G.trivia = null;
    checkWin();
    return;
  }
  let idx;
  do { idx = Math.floor(Math.random() * TRIVIA.length); }
  while (G.usedQuestions.includes(idx));
  G.usedQuestions.push(idx);

  const q = TRIVIA[idx];
  const options = q.opts.map((label, i) => ({ label, isCorrect: i === q.a }));
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  G.trivia = {
    question: q.q,
    options,
    result: null,
    resultTimer: 0,
    chosen: -1,
    optionRects: [],
  };
}

function answerTrivia(i) {
  if (!G.trivia || G.trivia.result) return;
  const opt = G.trivia.options[i];
  G.trivia.chosen = i;
  G.trivia.result = opt.isCorrect ? 'correct' : 'wrong';
  G.trivia.resultTimer = 0.6;
  if (opt.isCorrect) beep(880, 0.15);
  else beep(220, 0.15);
}

function resolveTrivia() {
  const wasCorrect = G.trivia.result === 'correct';
  G.trivia = null;
  if (wasCorrect) {
    const skip = randInt(CONFIG.starSkipMin, CONFIG.starSkipMax);
    G.passed += skip;
    G.queue = makeQueue(6, G.mode, G.passed / G.total);
    maybeSpawnStar();
    checkWin();
  }
}

function checkWin() {
  if (G.passed >= G.total) {
    G.winTime = currentClockString();
    if (G.passed > G.best[G.mode]) {
      G.best[G.mode] = G.passed;
      saveBest();
    }
    G.screen = 'success';
    beep(660, 0.15);
    setTimeout(() => beep(880, 0.2), 120);
  }
}

function update(dt) {
  if (G.screen !== 'game') return;

  if (G.trivia) {
    if (G.trivia.result) {
      G.trivia.resultTimer -= dt;
      if (G.trivia.resultTimer <= 0) resolveTrivia();
    }
    return;
  }

  if (G.jumpTimer > 0) G.jumpTimer -= dt;
  if (G.jumpTimer <= 0 && G.playerState === 'jump') G.playerState = 'idle';

  if (G.frozen) {
    G.frozenTimer -= dt;
    return;
  }

  G.clockElapsed += dt;
  if (currentClockSeconds() >= CONFIG.clockDeadline) {
    G.failReason = 'clock';
    G.screen = 'fail';
    return;
  }

  if (G.staffState !== 'walking') {
    const progress = G.passed / G.total;
    for (const m of G.queue) {
      m.timer -= dt;
      if (m.timer <= 0) {
        if (m.state === 'away') { m.state = 'alert'; m.timer = m.alertDur; }
        else if (m.state === 'alert') { m.state = 'looking'; m.timer = m.lookDur; }
        else {
          m.state = 'away';
          m.timer = rand(CONFIG.queueTypes[m.type].away[0], CONFIG.queueTypes[m.type].away[1]);
        }
      }
    }
  }

  if (G.staffState === 'idle') {
    G.staffTimer -= dt;
    if (G.staffTimer <= 0) {
      G.staffState = 'banner';
      G.staffTimer = CONFIG.announcementLen;
      G.staffPhase = 0;
    }
  } else if (G.staffState === 'banner') {
    G.staffTimer -= dt;
    if (G.staffTimer <= 0) {
      G.staffState = 'walking';
      G.staffTimer = CONFIG.staffWalkLen;
      G.staffPhase = 0;
    }
  } else if (G.staffState === 'walking') {
    G.staffTimer -= dt;
    G.staffPhase = 1 - (G.staffTimer / CONFIG.staffWalkLen);
    if (G.staffTimer <= 0) {
      G.staffState = 'idle';
      G.staffPhase = 0;
      const range = CONFIG.modes[G.mode].staffInterval;
      G.staffTimer = rand(range[0], range[1]);
    }
  }
}

function requestFullscreen() {
  const el = document.documentElement;
  try {
    if (el.requestFullscreen) el.requestFullscreen().catch(() => {});
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
  } catch (e) {}
}
