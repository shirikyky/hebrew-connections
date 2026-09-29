// שכבת נתונים — SQLite מובנה (node:sqlite), ללא תלות חיצונית.
// בסביבת ייצור: ניתן להחליף ל-Postgres/Supabase באותה סכמה.
import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const DATA_DIR = join(__dirname, 'data');
mkdirSync(DATA_DIR, { recursive: true });

const DB_PATH = process.env.CONNECTIONS_DB_PATH || join(DATA_DIR, 'connections.db');

export const db = new DatabaseSync(DB_PATH);

db.exec(`
  PRAGMA journal_mode = WAL;

  CREATE TABLE IF NOT EXISTS users (
    id          TEXT PRIMARY KEY,
    email       TEXT UNIQUE NOT NULL,
    pass_hash   TEXT NOT NULL,
    created_at  INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS tokens (
    token       TEXT PRIMARY KEY,
    user_id     TEXT NOT NULL,
    created_at  INTEGER NOT NULL,
    expires_at  INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS progress (
    user_id     TEXT PRIMARY KEY,
    xp          INTEGER NOT NULL DEFAULT 0,
    streak      INTEGER NOT NULL DEFAULT 0,
    last_played TEXT,
    freezes     INTEGER NOT NULL DEFAULT 0,
    stars       TEXT NOT NULL DEFAULT '{}',
    updated_at  INTEGER NOT NULL
  );
`);
