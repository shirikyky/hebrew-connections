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

const STORAGE_KEY = 'hebrew-connections-progress';
const DAY0 = Date.UTC(2026, 0, 1);
const FACES = ['happy', 'excited', 'sad', 'thinking'];

const $ = (id) => document.getElementById(id);
const gridEl = $('grid');
const livesEl = $('lives');
const messageEl = $('message');
const solvedEl = $('solved');
const levelSelectEl = $('level-select');
const gameScreenEl = $('game');
const overlayEl = $('overlay');
const confettiEl = $('confetti');

let mode = 'levels'; // 'levels' | 'daily'
let currentLevel = 0;
let game = null;
let puzzleNumber = 0;
let introDone = false;

const COLOR = {
  yellow: '#f6d860',
  green: '#9cc96a',
  blue: '#8ba5e8',
  purple: '#c08fe0',
};

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

// ---- התקדמות (localStorage) ----
function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function saveProgress(p) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
}

// ---- ניווט ----
function showLevels() {
  mode = 'levels';
  gameScreenEl.hidden = true;
  levelSelectEl.hidden = false;
  $('tab-levels').classList.add('active');
  $('tab-daily').classList.remove('active');
  renderLevelSelect();
  setFace('happy');
}

function startLevel(i) {
  currentLevel = i;
  mode = 'levels';
  const puzzle = puzzles[i];
  game = createGame(puzzle, puzzle.id);
  puzzleNumber = i + 1;
  introDone = false;
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

  puzzles.forEach((p, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'level-tile';
    const stars = progress[p.id] || 0;
    const unlocked = i === 0 || !!progress[puzzles[i - 1].id];
    if (!unlocked) {
      btn.classList.add('locked');
      btn.disabled = true;
      btn.textContent = '🔒';
    } else {
      const num = document.createElement('span');
      num.className = 'lv-num';
      num.textContent = i + 1;
      btn.appendChild(num);
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
    won && mode === 'levels' && currentLevel + 1 < puzzles.length
      ? 'רמה הבאה ➡'
      : 'חזרה לרמות';
  next.addEventListener('click', () => {
    if (won && mode === 'levels' && currentLevel + 1 < puzzles.length) {
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

// ---- אירועים ----
$('submit').addEventListener('click', () => {
  const solvedBefore = game.solved.length;
  const mistakesBefore = game.mistakes;

  submitGuess(game);

  if (game.status === 'won') {
    if (mode === 'levels') {
      const progress = loadProgress();
      const s = starsFor(game);
      if (s > (progress[puzzles[currentLevel].id] || 0)) {
        progress[puzzles[currentLevel].id] = s;
        saveProgress(progress);
      }
    }
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

$('share').addEventListener('click', async () => {
  const text = shareString(game, puzzleNumber);
  try {
    await navigator.clipboard.writeText(text);
    $('share').textContent = 'הועתק! ✅';
  } catch {
    $('share').textContent = text;
  }
});

// ---- אתחול ----
showLevels();
