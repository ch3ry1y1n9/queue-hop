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
  passedQueue: [],
  playerState: 'idle',
  jumpTimer: 0,
  playerLunge: 0,
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
  titleEnterTime: 0,
};

function rand(a, b) { return a + Math.random() * (b - a); }
function randInt(a, b) { return Math.floor(rand(a, b + 1)); }

function loadBest() {
  try {
    const b = JSON.parse(localStorage.getItem('queuehop_best') || '{}');
    G.best.easy = b.easy || 0; G.best.hard = b.hard || 0;
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
    g.gain.setValueAtTime(0.05, G.soundCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, G.soundCtx.currentTime + dur);
    o.start(); o.stop(G.sound
