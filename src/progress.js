// לוגיקת התקדמות: רצף יומי, הקפאות ו-XP — טהורה, ניתנת לבדיקה.

export function todayKey(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function daysBetween(a, b) {
  const da = new Date(a + 'T00:00:00');
  const db = new Date(b + 'T00:00:00');
  return Math.round((db - da) / 86400000);
}

// מעדכן רצף לפי יום משחק חדש. מחזיר { progress, freezesUsed, changed }.
export function updateStreak(progress, playedDate) {
  const p = {
    streak: progress.streak || 0,
    lastPlayed: progress.lastPlayed || null,
    freezes: progress.freezes || 0,
  };
  const today = playedDate || todayKey();
  if (p.lastPlayed === today) {
    return { progress: p, freezesUsed: 0, changed: false };
  }

  let freezesUsed = 0;
  if (p.lastPlayed) {
    const gap = daysBetween(p.lastPlayed, today);
    if (gap === 1) {
      p.streak += 1;
    } else if (gap > 1) {
      const missed = gap - 1;
      const used = Math.min(p.freezes, missed);
      freezesUsed = used;
      p.freezes -= used;
      p.streak = used >= missed ? p.streak + 1 : 1;
    }
  } else {
    p.streak = 1;
  }
  p.lastPlayed = today;
  return { progress: p, freezesUsed, changed: true };
}

// רמה נגזרת מ-XP: כל 100 XP = רמה.
export function levelFromXp(xp) {
  const level = Math.floor(xp / 100) + 1;
  const progress = (xp % 100) / 100;
  return { level, progress };
}
