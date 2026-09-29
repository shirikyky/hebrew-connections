# בק-אנד — חשבונות, שמירה בענן וולידציית רצף

> סטטוס: **עובד ונבדק מקומית** (19 בדיקות קליינט + 4 בדיקות אינטגרציה לשרת).
> המטרה: לסגור את שלושת הפערים — חשבונות בתשלום, שמירת התקדמות בענן, ואנטי-רמאות.

## ארכיטקטורה

```
דפדפן (GitHub Pages)
   │  HTTPS + Bearer token
   ▼
שרת Node (server/) — node:http + node:sqlite (אפס תלות חיצונית)
   ▼
SQLite (server/data/connections.db) — users, tokens, progress
```

השרת נטול תלות (בלי express, בלי חבילות) — רץ על כל Node 22.5+.

## נקודות קצה (API)

| Method | Path | Auth | תיאור |
|---|---|---|---|
| POST | `/auth/register` | — | `{email, password}` → `{token, user}` |
| POST | `/auth/login` | — | `{email, password}` → `{token, user}` |
| GET | `/me` | ✅ | פרטי המשתמש |
| GET | `/progress` | ✅ | ההתקדמות השמורה |
| PUT | `/progress` | ✅ | שמירת XP/כוכבים/הקפאות |
| POST | `/progress/daily` | ✅ | **ולידציית רצף בצד שרת** |

## מודל נתונים

- **users**: id (uuid), email (ייחודי), pass_hash (scrypt+salt), created_at
- **tokens**: token (256-bit), user_id, expires_at (30 יום)
- **progress**: user_id, xp, streak, last_played, freezes, stars (JSON)

## אבטחה

- **סיסמאות**: scrypt + salt + השוואה timing-safe. לעולם לא נשמרות כטקסט.
- **טוקנים**: 256-bit אקראי, פג תוקף ב-30 יום.
- **רצף בצד שרת**: ה-`streak` מחושב על השרת (`updateStreak` מ-`src/progress.js`) — הלקוח שולח "שיחקתי היום" והשרת קובע את הרצף. אי אפשר לזייף ב-localStorage.
- **ולידציית תאריך**: דוחה תאריכים עתידיים או ישנים מ-30 יום.

## מגבלות כנות (לשלבים הבאים)

- **XP/כוכבים עדיין מדווחים מהלקוח** (`PUT /progress`). ולידציית XP מלאה דורשת שהשרת יאמת כל פתרון חידה — שלב מאוחר יותר.
- **HTTPS**: השרת מאזין HTTP גולמי; בפריסה צריך reverse proxy עם TLS (Caddy/nginx).
- **קצב הגבלה / שחזור סיסמה**: לא מומשו עדיין.

## הרצה מקומית

```bash
npm run start:server     # מאזין על :8787
npm run test:server      # בדיקות אינטגרציה
```

## דיפלוי (אחת משתיים)

**א. Self-host על השרת שלך** (37.60.247.8) — דורש sudo להתקנת Docker/Caddy:
- לשים את השרת מאחורי reverse proxy עם TLS על הדומיין שלך
- לעדכן את `backendUrl` בקליינט לכתובת ה-HTTPS

**ב. Supabase** (חינמי, בלי שרת) — מומלץ להתחלה:
- אותה סכמה עוברת ישירות ל-Postgres + Row Level Security
- הקליינט מדבר עם Supabase במקום השרת המקומי

## השלב הבא

חיבור הקליינט: מודול `src/backend.js` שמסנכרן התקדמות מול השרת (offline-first: localStorage כקאש + סנכרון בענן), וכניסה/הרשמה בממשק.
