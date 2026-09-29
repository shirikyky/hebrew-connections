import { puzzles } from '../data/puzzles.js';
import {
  getPuzzleForDate,
  createGame,
  toggleSelection,
  submitGuess,
  shareString,
  getFullAnswers,
  starsFor,
} from './game.js';
import { updateStreak, todayKey, levelFromXp } from './progress.js';

const STORAGE_KEY = 'hebrew-connections-progress';
const ONBOARD_KEY = 'hebrew-connections-onboarded';
const DAY0 = Date.UTC(2026, 0, 1);
const FACES = ['happy', 'excited', 'sad', 'thinking'];

// עקומת קושי: רמות ממוינות קל → קשה (מציאת המחקר — להתחיל קל)
const LEVELS = [...puzzles].sort((a, b) => (a.difficulty || 1) - (b.difficulty || 1));

const DIFF = {
  1: { label: 'קל', color: '#4caf50' },
  2: { label: 'בינוני', color: '#e8930c' },
  3: { label: 'קשה', color: '#d9534f' },
};

const ONBOARDING_STEPS = [
  { title: 'ברוכה הבאה! 😺', text: 'אני חתולי, ואני אלמד אותך לשחק ב-30 שניות.' },
  { title: '16 מילים 🔤', text: 'בכל חידה יש 16 מילים. מיין אותן ל-4 קבוצות של 4 מילים קשורות.' },
  { title: 'בחרי 4 וניחשי 🎯', text: 'לחצי על 4 מילים ששייכות יחד, ואז על "נחשי".' },
  { title: '4 ניסיונות בלבד 💛', text: 'טעות = ניסיון אבוד. נצחי בלי טעויות = 3 כוכבים ⭐⭐⭐' },
];

const $ = (id) => document.getElementById(id);
const gridEl = $('grid');
const livesEl = $('lives');
const messageEl = $('message');
const solvedEl = $('solved');
const levelSelectEl = $('level-select');
const gameScreenEl = $('game');
const overlayEl = $('overlay');
const confettiEl = $('confetti');
const adModalEl = $('ad-modal');

let mode = 'levels'; // 'levels' | 'daily'
let currentLevel = 0;
let game = null;
let puzzleNumber = 0;
let introDone = false;
let lastStreakResult = null;
let obStep = 0;

const COLOR = {
  yellow: '#f6d860',
  green: '#9cc96a',
  blue: '#8ba5e8',
  purple: '#c08fe0',
};

// ---- התקדמות (localStorage) ----
function loadProgress() {
  const base = { stars: {}, streak: 0, lastPlayed: null, freezes: 0, xp: 0 };
  try {
    return { ...base, ...(JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}) };
  } catch {
    return { ...base };
  }
}

function saveProgress(p) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
}

function renderStats() {
  const p = loadProgress();
  const { level, progress } = levelFromXp(p.xp || 0);
  $('stat-streak').textContent = `🔥 ${p.streak || 0}`;
  $('stat-freezes').textContent = `❄️ ${p.freezes || 0}`;
  $('stat-level').textContent = `רמה ${level}`;
  $('xp-fill').style.width = (progress * 100) + '%';
  $('stat-xp').textContent = `${(p.xp || 0) % 100}/100`;
}

function awardXP(n) {
  const p = loadProgress();
  p.xp = (p.xp || 0) + n;
  saveProgress(p);
  renderStats();
}

function recordDailyPlay() {
  const p = loadProgress();
  const r = updateStreak(p, todayKey());
  r.progress.stars = p.stars || {};
  r.progress.xp = p.xp || 0;
  saveProgress(r.progress);
  lastStreakResult = r;
  renderStats();
  return r;
}

// ---- דמות (מצבי הבעה) ----
function setFace(face, bounce = false) {
  for (const f of FACES) {
    const el = $('face-' + f);
    if (el) el.style.display = f === face ? '' : 'none';
  }
  $('sparkles').style.display = face === 'excited' ? '' : 'none';
  if (bounce) {
    const m = $('mascot');
    m.classList.remove('bounce');
    void m.getBoundingClientRect();
    m.classList.add('bounce');
  }
}

// ---- onboarding (חוויית משתמש ראשונה) ----
function renderOnboarding() {
  const s = ONBOARDING_STEPS[obStep];
  $('ob-title').textContent = s.title;
  $('ob-text').textContent = s.text;
  const dots = $('ob-dots');
  dots.innerHTML = '';
  ONBOARDING_STEPS.forEach((_, i) => {
    const d = document.createElement('span');
    d.className = 'ob-dot' + (i === obStep ? ' active' : '');
    dots.appendChild(d);
  });
  $('ob-next').textContent =
    obStep === ONBOARDING_STEPS.length - 1 ? 'בואי נשחק! 🎮' : 'הבא ➡';
}

function showOnboarding() {
  obStep = 0;
  $('onboarding').hidden = false;
  renderOnboarding();
}

function hideOnboarding() {
  $('onboarding').hidden = true;
  localStorage.setItem(ONBOARD_KEY, '1');
}

function obNext() {
  obStep += 1;
  if (obStep >= ONBOARDING_STEPS.length) {
    hideOnboarding();
    return;
  }
  renderOnboarding();
}

function maybeShowOnboarding() {
  if (!localStorage.getItem(ONBOARD_KEY)) showOnboarding();
}

// ---- ניווט ----
function showLevels() {
  mode = 'levels';
  gameScreenEl.hidden = true;
  levelSelectEl.hidden = false;
  $('tab-levels').classList.add('active');
  $('tab-daily').classList.remove('active');
  renderLevelSelect();
  renderStats();
  setFace('happy');
}

function startLevel(i) {
  currentLevel = i;
  mode = 'levels';
  const puzzle = LEVELS[i];
  game = createGame(puzzle, puzzle.id);
  puzzleNumber = i + 1;
  introDone = false;
  lastStreakResult = null;
  levelSelectEl.hidden = true;
  gameScreenEl.hidden = false;
  $('share').hidden = true;
  overlayEl.hidden = true;
  setFace('happy');
  render();
}

function startDaily() {
  mode = 'daily';
  const now = new Date();
  const puzzle = getPuzzleForDate(puzzles, now);
  const seed = Math.floor(now.getTime() / 86400000);
  game = createGame(puzzle, seed);
  puzzleNumber = Math.floor((now.getTime() - DAY0) / 86400000) + 1;
  introDone = false;
  lastStreakResult = null;
  levelSelectEl.hidden = true;
  gameScreenEl.hidden = false;
  $('share').hidden = true;
  overlayEl.hidden = true;
  setFace('happy');
  render();
}

// ---- מסך בחירת רמות ----
function renderLevelSelect() {
  const progress = loadProgress();
  levelSelectEl.innerHTML = '';
  const h = document.createElement('h2');
  h.textContent = 'בחרי רמה';
  levelSelectEl.appendChild(h);

  const grid = document.createElement('div');
  grid.className = 'level-grid';

  LEVELS.forEach((p, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'level-tile';
    const stars = (progress.stars && progress.stars[p.id]) || 0;
    const unlocked = i === 0 || !!(progress.stars && progress.stars[LEVELS[i - 1].id]);
    if (!unlocked) {
      btn.classList.add('locked');
      btn.disabled = true;
      btn.textContent = '🔒';
    } else {
      const num = document.createElement('span');
      num.className = 'lv-num';
      num.textContent = i + 1;
      btn.appendChild(num);

      const d = DIFF[p.difficulty] || DIFF[1];
      const diff = document.createElement('span');
      diff.className = 'lv-diff';
      diff.textContent = d.label;
      diff.style.color = d.color;
      btn.appendChild(diff);

      if (stars) {
        const s = document.createElement('span');
        s.className = 'lv-stars';
        s.textContent = '⭐'.repeat(stars);
        btn.appendChild(s);
      }
      btn.addEventListener('click', () => startLevel(i));
    }
    grid.appendChild(btn);
  });
  levelSelectEl.appendChild(grid);
}

// ---- רינדור המשחק ----
function renderGrid() {
  gridEl.innerHTML = '';
  game.grid.forEach((word, idx) => {
    if (game.solvedWords.has(word)) return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'tile';
    btn.textContent = word;
    if (!introDone) btn.style.animationDelay = (idx * 30) + 'ms';
    if (game.selected.has(word)) btn.classList.add('selected');
    btn.addEventListener('click', () => {
      toggleSelection(game, word);
      setFace(game.selected.size > 0 ? 'thinking' : 'happy');
      render();
    });
    gridEl.appendChild(btn);
  });
  introDone = true;
}

function renderLives() {
  livesEl.innerHTML = '';
  for (let i = 0; i < game.maxMistakes; i++) {
    const dot = document.createElement('span');
    dot.className = 'life' + (i < game.mistakes ? ' lost' : '');
    livesEl.appendChild(dot);
  }
}

function renderSolved() {
  solvedEl.innerHTML = '';
  for (const s of game.solved) {
    const chip = document.createElement('div');
    chip.className = 'solved-chip';
    chip.style.background = COLOR[s.difficulty];
    chip.textContent = `${s.name}: ${s.words.join(', ')}`;
    solvedEl.appendChild(chip);
  }
}

function renderMessage() {
  messageEl.textContent = game.message || '';
}

function shakeGrid() {
  gridEl.classList.remove('shake');
  void gridEl.getBoundingClientRect();
  gridEl.classList.add('shake');
}

function confetti() {
  const colors = ['#f6d860', '#9cc96a', '#8ba5e8', '#c08fe0', '#ff8a80'];
  for (let i = 0; i < 44; i++) {
    const p = document.createElement('div');
    p.className = 'confetti-piece';
    p.style.left = Math.random() * 100 + '%';
    p.style.background = colors[i % colors.length];
    p.style.animationDelay = (Math.random() * 0.7) + 's';
    p.style.animationDuration = (1.6 + Math.random() * 1.6) + 's';
    p.style.transform = `rotate(${Math.random() * 360}deg)`;
    confettiEl.appendChild(p);
  }
  setTimeout(() => (confettiEl.innerHTML = ''), 3400);
}

function showOverlay() {
  overlayEl.hidden = false;
  overlayEl.innerHTML = '';
  const box = document.createElement('div');
  box.className = 'overlay-box';

  const won = game.status === 'won';
  const title = document.createElement('h2');
  title.textContent = won ? 'ניצחת! 🎉' : 'נגמרו הניסיונות 😕';
  box.appendChild(title);

  if (won && mode === 'levels') {
    const stars = starsFor(game);
    const starsEl = document.createElement('div');
    starsEl.className = 'win-stars';
    starsEl.textContent = '⭐'.repeat(stars) + '☆'.repeat(3 - stars);
    box.appendChild(starsEl);
  }

  if (mode === 'daily' && lastStreakResult) {
    const line = document.createElement('p');
    line.className = 'streak-line';
    line.textContent = `🔥 רצף: ${lastStreakResult.progress.streak} ימים`;
    if (lastStreakResult.freezesUsed > 0) {
      line.textContent += ' (❄️ הקפאה הגנה עליך)';
    }
    box.appendChild(line);
  }

  for (const a of getFullAnswers(game)) {
    const chip = document.createElement('div');
    chip.className = 'solved-chip';
    chip.style.background = COLOR[a.difficulty];
    chip.textContent = `${a.name}: ${a.words.join(', ')}`;
    box.appendChild(chip);
  }

  const next = document.createElement('button');
  next.type = 'button';
  next.className = 'primary';
  next.textContent =
    won && mode === 'levels' && currentLevel + 1 < LEVELS.length
      ? 'רמה הבאה ➡'
      : 'חזרה לרמות';
  next.addEventListener('click', () => {
    if (won && mode === 'levels' && currentLevel + 1 < LEVELS.length) {
      startLevel(currentLevel + 1);
    } else {
      showLevels();
    }
  });
  box.appendChild(next);

  overlayEl.appendChild(box);
  $('share').hidden = false;
}

function render() {
  renderGrid();
  renderLives();
  renderSolved();
  renderMessage();
  if (game.status !== 'playing') {
    showOverlay();
    if (game.status === 'won') {
      setFace('excited', true);
      confetti();
    } else {
      setFace('sad', true);
    }
  }
}

// ---- מודעות מתוגמלות (סימולציה; החלף ל-AdMob אמיתי) ----
function showRewardedAd(label, onReward) {
  $('ad-text').textContent = label;
  adModalEl.hidden = false;
  const fill = $('ad-fill');
  fill.style.width = '0%';
  let w = 0;
  const id = setInterval(() => {
    w += 4;
    fill.style.width = w + '%';
    if (w >= 100) {
      clearInterval(id);
      adModalEl.hidden = true;
      onReward();
    }
  }, 90);
}

function giveHint() {
  if (!game || game.status !== 'playing' || game.categories.length === 0) return;
  showRewardedAd('מודעה — תקבלי רמז 🎁', () => {
    const cat = game.categories[Math.floor(Math.random() * game.categories.length)];
    game.message = `💡 אחת הקבוצות היא: ${cat.name}`;
    setFace('excited', true);
    render();
  });
}

function giveLife() {
  if (!game || game.status !== 'playing' || game.mistakes <= 0) return;
  showRewardedAd('מודעה — תקבלי חיים ❤️', () => {
    game.mistakes -= 1;
    setFace('happy', true);
    render();
  });
}

function buyFreeze() {
  showRewardedAd('מודעה — תקבלי הקפאת רצף ❄️', () => {
    const p = loadProgress();
    p.freezes = (p.freezes || 0) + 1;
    saveProgress(p);
    renderStats();
    setFace('excited', true);
  });
}

// ---- שיתוף (לולאת צמיחה ויראלית — כמו Wordle) ----
function buildShareText() {
  const p = loadProgress();
  let text = shareString(game, puzzleNumber);
  if (mode === 'daily' && (p.streak || 0) > 0) {
    text += `\n🔥 רצף: ${p.streak} ימים`;
  }
  text += '\n\nhttps://shirikyky.github.io/hebrew-connections/';
  return text;
}

async function doShare() {
  const text = buildShareText();
  // Web Share API — פותח את דף השיתוף המקורי (וואטסאפ/טלגרם וכו')
  if (navigator.share) {
    try {
      await navigator.share({ text });
      $('share').textContent = 'שותף! ✅';
      return;
    } catch {
      /* בוטל — נופל להעתקה */
    }
  }
  try {
    await navigator.clipboard.writeText(text);
    $('share').textContent = 'הועתק! ✅';
  } catch {
    $('share').textContent = text;
  }
}

// ---- אירועים ----
$('submit').addEventListener('click', () => {
  const solvedBefore = game.solved.length;
  const mistakesBefore = game.mistakes;

  submitGuess(game);

  if (game.solved.length > solvedBefore) {
    awardXP((game.solved.length - solvedBefore) * 15);
  }

  if (game.status === 'won') {
    awardXP(50);
    if (mode === 'levels') {
      const progress = loadProgress();
      const s = starsFor(game);
      if (s > ((progress.stars[LEVELS[currentLevel].id]) || 0)) {
        progress.stars[LEVELS[currentLevel].id] = s;
        saveProgress(progress);
      }
    } else {
      awardXP(20);
      recordDailyPlay();
    }
  } else if (game.status === 'lost') {
    if (mode === 'daily') {
      awardXP(20);
      recordDailyPlay();
    }
    setFace('sad', true);
  } else if (game.solved.length > solvedBefore) {
    setFace('excited', true);
  } else if (game.mistakes > mistakesBefore) {
    setFace('sad', true);
    shakeGrid();
  }
  render();
});

$('shuffle').addEventListener('click', () => {
  game.grid = [...game.grid].sort(() => Math.random() - 0.5);
  introDone = true;
  render();
});

$('back').addEventListener('click', showLevels);
$('tab-levels').addEventListener('click', showLevels);
$('tab-daily').addEventListener('click', startDaily);

$('hint').addEventListener('click', giveHint);
$('life').addEventListener('click', giveLife);
$('buy-freeze').addEventListener('click', buyFreeze);

$('share').addEventListener('click', doShare);

$('help').addEventListener('click', showOnboarding);
$('ob-next').addEventListener('click', obNext);
$('ob-skip').addEventListener('click', hideOnboarding);

// ---- אתחול ----
showLevels();
maybeShowOnboarding();
