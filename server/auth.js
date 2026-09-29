// אימות: גיבוב סיסמאות (scrypt + salt) והנפקת טוקנים.
import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { db } from './db.js';

const TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 ימים

export function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(':');
  if (!salt || !hash) return false;
  const candidate = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, 'hex');
  return candidate.length === expected.length && timingSafeEqual(candidate, expected);
}

export function issueToken(userId) {
  const token = randomBytes(32).toString('hex');
  const now = Date.now();
  db.prepare(
    'INSERT INTO tokens (token, user_id, created_at, expires_at) VALUES (?, ?, ?, ?)'
  ).run(token, userId, now, now + TOKEN_TTL_MS);
  return token;
}

// מחזיר userId או null אם הטוקן חסר/פג תוקף.
export function authenticate(token) {
  if (!token) return null;
  const row = db
    .prepare('SELECT user_id, expires_at FROM tokens WHERE token = ?')
    .get(token);
  if (!row) return null;
  if (row.expires_at < Date.now()) {
    db.prepare('DELETE FROM tokens WHERE token = ?').run(token);
    return null;
  }
  return row.user_id;
}
