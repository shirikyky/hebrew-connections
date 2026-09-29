import { puzzles } from '../data/puzzles.js';
import {
  getPuzzleForDate,
  createGame,
  toggleSelection,
  submitGuess,
  shareString,
  getFullAnswers,
} from './game.js';

// מספר חידה יומי (ימים מאז תחילת 2026)
const DAY0 = Date.UTC(2026, 0, 1);
const now = new Date();
const puzzle = getPuzzleForDate(puzzles, now);
const puzzleNumber = Math.floor((now.getTime() - DAY0) / 86400000) + 1;
const seed = Math.floor(now.getTime() / 86400000);

let game = createGame(puzzle, seed);

const gridEl = document.getElementById('grid');
const livesEl = document.getElementById('lives');
const messageEl = document.getElementById('message');
const solvedEl = document.getElementById('solved');
const shuffleBtn = document.getElementById('shuffle');
const submitBtn = document.getElementById('submit');
const shareBtn = document.getElementById('share');
const overlayEl = document.getElementById('overlay');

const COLOR = {
  yellow: '#f6d860',
  green: '#9cc96a',
  blue: '#8ba5e8',
  purple: '#c08fe0',
};

function renderGrid() {
  gridEl.innerHTML = '';
  for (const word of game.grid) {
    if (game.solvedWords.has(word)) continue;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'tile';
    btn.textContent = word;
    if (game.selected.has(word)) btn.classList.add('selected');
    btn.addEventListener('click', () => {
      toggleSelection(game, word);
      render();
    });
    gridEl.appendChild(btn);
  }
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

function showOverlay() {
  overlayEl.hidden = false;
  overlayEl.innerHTML = '';
  const box = document.createElement('div');
  box.className = 'overlay-box';

  const title = document.createElement('h2');
  title.textContent = game.status === 'won' ? 'ניצחת! 🎉' : 'נגמרו הניסיונות 😕';
  box.appendChild(title);

  for (const a of getFullAnswers(game)) {
    const chip = document.createElement('div');
    chip.className = 'solved-chip';
    chip.style.background = COLOR[a.difficulty];
    chip.textContent = `${a.name}: ${a.words.join(', ')}`;
    box.appendChild(chip);
  }
  overlayEl.appendChild(box);
  shareBtn.hidden = false;
}

function render() {
  renderGrid();
  renderLives();
  renderSolved();
  renderMessage();
  if (game.status !== 'playing') showOverlay();
}

submitBtn.addEventListener('click', () => {
  submitGuess(game);
  render();
});

shuffleBtn.addEventListener('click', () => {
  game.grid = [...game.grid].sort(() => Math.random() - 0.5);
  render();
});

shareBtn.addEventListener('click', async () => {
  const text = shareString(game, puzzleNumber);
  try {
    await navigator.clipboard.writeText(text);
    shareBtn.textContent = 'הועתק! ✅';
  } catch {
    shareBtn.textContent = text;
  }
});

render();
