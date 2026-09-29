import { test } from 'node:test';
import assert from 'node:assert';
import { updateStreak, levelFromXp, daysBetween } from '../src/progress.js';

test('משחק ראשון: רצף 1', () => {
  const r = updateStreak({}, '2026-01-01');
  assert.strictEqual(r.progress.streak, 1);
  assert.strictEqual(r.progress.lastPlayed, '2026-01-01');
});

test('יום רצוף: רצף עולה', () => {
  const r = updateStreak({ streak: 3, lastPlayed: '2026-01-01', freezes: 0 }, '2026-01-02');
  assert.strictEqual(r.progress.streak, 4);
});

test('אותו יום: אין שינוי', () => {
  const r = updateStreak({ streak: 3, lastPlayed: '2026-01-01', freezes: 0 }, '2026-01-01');
  assert.strictEqual(r.changed, false);
  assert.strictEqual(r.progress.streak, 3);
});

test('יום שהוחמץ בלי הקפאה: רצף מתאפס', () => {
  const r = updateStreak({ streak: 5, lastPlayed: '2026-01-01', freezes: 0 }, '2026-01-03');
  assert.strictEqual(r.progress.streak, 1);
});

test('יום שהוחמץ עם הקפאה: רצף נשמר והקפאה נצרכת', () => {
  const r = updateStreak({ streak: 5, lastPlayed: '2026-01-01', freezes: 1 }, '2026-01-03');
  assert.strictEqual(r.progress.streak, 6);
  assert.strictEqual(r.freezesUsed, 1);
  assert.strictEqual(r.progress.freezes, 0);
});

test('פער גדול מדי בלי מספיק הקפאות: רצף נשבר', () => {
  const r = updateStreak({ streak: 5, lastPlayed: '2026-01-01', freezes: 1 }, '2026-01-05');
  assert.strictEqual(r.progress.streak, 1);
});

test('levelFromXp: 150 XP = רמה 2, חצי דרך', () => {
  const l = levelFromXp(150);
  assert.strictEqual(l.level, 2);
  assert.ok(Math.abs(l.progress - 0.5) < 0.001);
});

test('daysBetween מחשב הפרש ימים', () => {
  assert.strictEqual(daysBetween('2026-01-01', '2026-01-03'), 2);
});
