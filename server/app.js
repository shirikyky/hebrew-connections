// שרת HTTP — חשבונות + התקדמות + ולידציית רצף בצד שרת.
import { createServer } from 'node:http';
import { randomUUID } from 'node:crypto';
import { db } from './db.js';
import { hashPassword, verifyPassword, issueToken, authenticate } from './auth.js';
import { updateStreak, todayKey } from '../src/progress.js';

const MAX_BODY = 64 * 1024;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DEFAULT_PROGRESS = { xp: 0, streak: 0, lastPlayed: null, freezes: 0, stars: {} };

function json(res, status, data) {
  const body = JSON.stringify(data);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    'Cache-Control': 'no-store',
  });
  res.end(body);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (c) => {
      data += c;
      if (data.length > MAX_BODY) {
        const e = new Error('גוף גדול מדי');
        e.status = 413;
        reject(e);
        req.destroy();
      }
    });
    req.on('end', () => {
      if (!data) return resolve({});
      try {
        resolve(JSON.parse(data));
      } catch {
        const e = new Error('גוף לא תקין');
        e.status = 400;
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

function getUser(userId) {
  return db.prepare('SELECT id, email, created_at FROM users WHERE id = ?').get(userId);
}

function getProgress(userId) {
  const row = db.prepare('SELECT * FROM progress WHERE user_id = ?').get(userId);
  if (!row) return null;
  return {
    xp: row.xp,
    streak: row.streak,
    lastPlayed: row.last_played,
    freezes: row.freezes,
    stars: JSON.parse(row.stars || '{}'),
  };
}

function upsertProgress(userId, p) {
  db.prepare(
    `INSERT INTO progress (user_id, xp, streak, last_played, freezes, stars, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(user_id) DO UPDATE SET
       xp = excluded.xp,
       streak = excluded.streak,
       last_played = excluded.last_played,
       freezes = excluded.freezes,
       stars = excluded.stars,
       updated_at = excluded.updated_at`
  ).run(userId, p.xp, p.streak, p.lastPlayed, p.freezes, JSON.stringify(p.stars || {}), Date.now());
}

// ולידציית תאריך: YYYY-MM-DD, לא עתידי (מעבר ליום+1), לא ישן מ-30 ימים.
function sanitizeDate(s) {
  if (typeof s !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
  const t = new Date(s + 'T00:00:00Z').getTime();
  if (Number.isNaN(t)) return null;
  const todayT = new Date(todayKey() + 'T00:00:00Z').getTime();
  if (t > todayT + 86400000) return null; // עתיד
  if (t < todayT - 30 * 86400000) return null; // ישן מדי
  return s;
}

async function handleRegister(req, res) {
  const { email, password } = await readBody(req);
  if (typeof email !== 'string' || !EMAIL_RE.test(email)) {
    return json(res, 400, { error: 'אימייל לא תקין' });
  }
  if (typeof password !== 'string' || password.length < 8) {
    return json(res, 400, { error: 'הסיסמה חייבת לכלול לפחות 8 תווים' });
  }
  const norm = email.trim().toLowerCase();
  if (db.prepare('SELECT id FROM users WHERE email = ?').get(norm)) {
    return json(res, 409, { error: 'האימייל כבר רשום' });
  }
  const id = randomUUID();
  db.prepare('INSERT INTO users (id, email, pass_hash, created_at) VALUES (?, ?, ?, ?)').run(
    id,
    norm,
    hashPassword(password),
    Date.now()
  );
  json(res, 201, { token: issueToken(id), user: { id, email: norm } });
}

async function handleLogin(req, res) {
  const { email, password } = await readBody(req);
  if (typeof email !== 'string' || typeof password !== 'string') {
    return json(res, 400, { error: 'חסרים פרטים' });
  }
  const norm = email.trim().toLowerCase();
  const user = db.prepare('SELECT id, email, pass_hash FROM users WHERE email = ?').get(norm);
  if (!user || !verifyPassword(password, user.pass_hash)) {
    return json(res, 401, { error: 'אימייל או סיסמה שגויים' });
  }
  json(res, 200, { token: issueToken(user.id), user: { id: user.id, email: user.email } });
}

function handleRecordDaily(userId, body) {
  let date;
  if (body.date === undefined || body.date === null || body.date === '') {
    date = todayKey();
  } else {
    date = sanitizeDate(body.date);
    if (!date) {
      const e = new Error('תאריך לא תקין');
      e.status = 400;
      throw e;
    }
  }
  const existing = getProgress(userId) || { ...DEFAULT_PROGRESS, stars: {} };
  const r = updateStreak(existing, date);
  r.progress.xp = existing.xp || 0;
  r.progress.stars = existing.stars || {};
  upsertProgress(userId, r.progress);
  return { progress: r.progress, freezesUsed: r.freezesUsed, changed: r.changed };
}

async function handle(req, res) {
  const url = new URL(req.url, 'http://localhost');
  const { pathname: path } = url;
  const method = req.method;

  try {
    if (method === 'POST' && path === '/auth/register') return await handleRegister(req, res);
    if (method === 'POST' && path === '/auth/login') return await handleLogin(req, res);

    const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
    const userId = authenticate(token);
    if (!userId) return json(res, 401, { error: 'לא מורשה' });

    if (method === 'GET' && path === '/me') {
      return json(res, 200, { user: getUser(userId) });
    }
    if (method === 'GET' && path === '/progress') {
      return json(res, 200, { progress: getProgress(userId) || { ...DEFAULT_PROGRESS } });
    }
    if (method === 'PUT' && path === '/progress') {
      const body = await readBody(req);
      const cur = getProgress(userId) || { ...DEFAULT_PROGRESS };
      if (typeof body.xp === 'number' && Number.isFinite(body.xp)) {
        cur.xp = Math.max(0, Math.floor(body.xp));
      }
      if (typeof body.freezes === 'number' && Number.isFinite(body.freezes)) {
        cur.freezes = Math.max(0, Math.floor(body.freezes));
      }
      if (body.stars && typeof body.stars === 'object') cur.stars = body.stars;
      upsertProgress(userId, cur);
      return json(res, 200, { progress: cur });
    }
    if (method === 'POST' && path === '/progress/daily') {
      const body = await readBody(req);
      return json(res, 200, handleRecordDaily(userId, body));
    }

    json(res, 404, { error: 'לא נמצא' });
  } catch (e) {
    json(res, e.status || 500, { error: e.message || 'שגיאת שרת' });
  }
}

export function createApp() {
  return createServer((req, res) => {
    handle(req, res);
  });
}

export function startServer(port = 8787, host = '127.0.0.1') {
  const s = createApp();
  return new Promise((resolve) => s.listen(port, host, () => resolve(s)));
}
