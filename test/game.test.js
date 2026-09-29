import { test } from 'node:test';
import assert from 'node:assert';
import { puzzles } from '../data/puzzles.js';
import {
  createGame,
  toggleSelection,
  submitGuess,
  getPuzzleForDate,
  shareString,
  starsFor,
} from '../src/game.js';

test('כל חידה מכילה 4 קטגוריות של 4 מילים ללא כפילויות', () => {
  for (const p of puzzles) {
    assert.strictEqual(p.categories.length, 4, `חידה ${p.id}: 4 קטגוריות`);
    const words = p.categories.flatMap((c) => c.words);
    assert.strictEqual(words.length, 16, `חידה ${p.id}: 16 מילים`);
    assert.strictEqual(new Set(words).size, 16, `חידה ${p.id}: אין כפילויות`);
  }
});

test('יצירת משחק מערבבת 16 מילים ברשת', () => {
  const game = createGame(puzzles[0], 1);
  assert.strictEqual(game.grid.length, 16);
  assert.strictEqual(new Set(game.grid).size, 16);
});

test('אותו seed מייצר אותה רשת', () => {
  const a = createGame(puzzles[0], 42).grid.join(',');
  const b = createGame(puzzles[0], 42).grid.join(',');
  assert.strictEqual(a, b);
});

test('ניחוש נכון פותר קטגוריה בלי טעות', () => {
  const game = createGame(puzzles[0], 1);
  const cat = puzzles[0].categories[0];
  for (const w of cat.words) toggleSelection(game, w);
  submitGuess(game);
  assert.strictEqual(game.solved.length, 1);
  assert.strictEqual(game.mistakes, 0);
  assert.strictEqual(game.status, 'playing');
});

test('ניחוש שגוי עולה בטעות', () => {
  const game = createGame(puzzles[0], 1);
  const wrong = puzzles[0].categories.map((c) => c.words[0]);
  for (const w of wrong) toggleSelection(game, w);
  submitGuess(game);
  assert.strictEqual(game.mistakes, 1);
});

test('קרוב (3 מתוך 4) מזוהה ועדיין עולה בטעות', () => {
  const game = createGame(puzzles[0], 1);
  const three = puzzles[0].categories[0].words.slice(0, 3);
  const other = puzzles[0].categories[1].words[0];
  for (const w of [...three, other]) toggleSelection(game, w);
  submitGuess(game);
  assert.strictEqual(game.mistakes, 1);
  assert.ok(game.message.includes('קרוב'));
});

test('4 טעויות מובילות להפסד', () => {
  const game = createGame(puzzles[0], 1);
  const wrong = puzzles[0].categories.map((c) => c.words[0]);
  for (let i = 0; i < 4; i++) {
    for (const w of wrong) toggleSelection(game, w);
    submitGuess(game);
  }
  assert.strictEqual(game.status, 'lost');
});

test('פתרון כל הקטגוריות מנצח', () => {
  const game = createGame(puzzles[0], 1);
  for (const c of puzzles[0].categories) {
    for (const w of c.words) toggleSelection(game, w);
    submitGuess(game);
  }
  assert.strictEqual(game.status, 'won');
  assert.strictEqual(game.mistakes, 0);
});

test('getPuzzleForDate מחזיר חידה יציבה ליום נתון', () => {
  const d = new Date(Date.UTC(2026, 8, 29));
  assert.strictEqual(getPuzzleForDate(puzzles, d).id, getPuzzleForDate(puzzles, d).id);
});

test('shareString מחזיר כותרת ורשת אימוג׳י', () => {
  const game = createGame(puzzles[0], 1);
  for (const c of puzzles[0].categories) {
    for (const w of c.words) toggleSelection(game, w);
    submitGuess(game);
  }
  const s = shareString(game, 7);
  assert.ok(s.includes('חיבורים #7'));
  assert.ok(s.includes('🟨'));
});

test('starsFor: 0 טעויות = 3 כוכבים, טעות = 2, 2+ = 1', () => {
  const g0 = createGame(puzzles[0], 1);
  for (const c of puzzles[0].categories) {
    for (const w of c.words) toggleSelection(g0, w);
    submitGuess(g0);
  }
  assert.strictEqual(starsFor(g0), 3);

  const g1 = createGame(puzzles[0], 1);
  // טעות אחת מכוונת
  const wrong = puzzles[0].categories.map((c) => c.words[0]);
  for (const w of wrong) toggleSelection(g1, w);
  submitGuess(g1);
  for (const c of puzzles[0].categories) {
    for (const w of c.words) toggleSelection(g1, w);
    submitGuess(g1);
  }
  assert.strictEqual(starsFor(g1), 2);
});
