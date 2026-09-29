// בדיקות אינטגרציה לבק-אנד — מריצות שרת אמיתי (fetch) מול DB בזיכרון.
import { test, before, after } from 'node:test';
import assert from 'node:assert';

process.env.CONNECTIONS_DB_PATH = ':memory:';
const { startServer } = await import('../app.js');

let base;
let server;

before(async () => {
  server = await startServer(0);
  base = `http://127.0.0.1:${server.address().port}`;
});

after(() => {
  server.close();
  server.closeAllConnections?.();
});

async function api(method, path, { token, body } = {}) {
  const headers = {};
  if (body) headers['Content-Type'] = 'application/json';
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(base + path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  return { status: res.status, data: await res.json() };
}

test('auth: הרשמה → התחברות → מי אני', async () => {
  const reg = await api('POST', '/auth/register', {
    body: { email: 'a@example.com', password: 'password123' },
  });
  assert.strictEqual(reg.status, 201);
  assert.ok(reg.data.token);
  assert.strictEqual(reg.data.user.email, 'a@example.com');

  const login = await api('POST', '/auth/login', {
    body: { email: 'a@example.com', password: 'password123' },
  });
  assert.strictEqual(login.status, 200);
  assert.ok(login.data.token);

  const me = await api('GET', '/me', { token: login.data.token });
  assert.strictEqual(me.status, 200);
  assert.strictEqual(me.data.user.email, 'a@example.com');
});

test('auth: שגיאות ולידציה', async () => {
  const badEmail = await api('POST', '/auth/register', {
    body: { email: 'לא-אימייל', password: 'password123' },
  });
  assert.strictEqual(badEmail.status, 400);

  const shortPw = await api('POST', '/auth/register', {
    body: { email: 'x@example.com', password: '123' },
  });
  assert.strictEqual(shortPw.status, 400);

  const dup1 = await api('POST', '/auth/register', {
    body: { email: 'b@example.com', password: 'password123' },
  });
  assert.strictEqual(dup1.status, 201);
  const dup2 = await api('POST', '/auth/register', {
    body: { email: 'b@example.com', password: 'password123' },
  });
  assert.strictEqual(dup2.status, 409);

  const badLogin = await api('POST', '/auth/login', {
    body: { email: 'b@example.com', password: 'wrongpassword' },
  });
  assert.strictEqual(badLogin.status, 401);
});

test('אבטחה: גישה ללא טוקן נדחית', async () => {
  const r = await api('GET', '/progress');
  assert.strictEqual(r.status, 401);
});

test('התקדמות: רצף מחושב בצד שרת + XP נשמר', async () => {
  const reg = await api('POST', '/auth/register', {
    body: { email: 'c@example.com', password: 'password123' },
  });
  const token = reg.data.token;

  const p0 = await api('GET', '/progress', { token });
  assert.strictEqual(p0.status, 200);
  assert.strictEqual(p0.data.progress.streak, 0);

  const d1 = await api('POST', '/progress/daily', { token, body: { date: '2026-09-27' } });
  assert.strictEqual(d1.status, 200);
  assert.strictEqual(d1.data.progress.streak, 1);
  assert.strictEqual(d1.data.changed, true);

  const d2 = await api('POST', '/progress/daily', { token, body: { date: '2026-09-27' } });
  assert.strictEqual(d2.data.changed, false);
  assert.strictEqual(d2.data.progress.streak, 1);

  const d3 = await api('POST', '/progress/daily', { token, body: { date: '2026-09-28' } });
  assert.strictEqual(d3.data.progress.streak, 2);

  const put = await api('PUT', '/progress', { token, body: { xp: 150 } });
  assert.strictEqual(put.data.progress.xp, 150);

  const get = await api('GET', '/progress', { token });
  assert.strictEqual(get.data.progress.xp, 150);
  assert.strictEqual(get.data.progress.streak, 2);

  const fut = await api('POST', '/progress/daily', { token, body: { date: '2999-01-01' } });
  assert.strictEqual(fut.status, 400);
});
