// לוגיקת המשחק "חיבורים" — טהורה, ניתנת לבדיקה (ללא DOM).

export const DIFFICULTY_ORDER = ['yellow', 'green', 'blue', 'purple'];

// מחולל מספרים פסאודו-אקראי דטרמיניסטי (mulberry32) — אותו seed, אותה רשת.
export function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffle(arr, rng) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// חידה יציבה לפי תאריך (מחזורית על פני רשימת החידות).
export function getPuzzleForDate(puzzles, date) {
  const day = Math.floor(date.getTime() / 86400000);
  return puzzles[day % puzzles.length];
}

export function createGame(puzzle, seed = 1) {
  const rng = mulberry32(seed);
  const allWords = puzzle.categories.flatMap((c) => c.words);
  return {
    puzzleId: puzzle.id,
    categories: puzzle.categories.map((c) => ({
      name: c.name,
      difficulty: c.difficulty,
      words: new Set(c.words),
    })),
    grid: shuffle(allWords, rng),
    solved: [], // { name, difficulty, words: string[] }
    solvedWords: new Set(),
    mistakes: 0,
    maxMistakes: 4,
    selected: new Set(),
    message: null,
    status: 'playing', // 'playing' | 'won' | 'lost'
  };
}

export function toggleSelection(state, word) {
  if (state.status !== 'playing') return state;
  if (state.solvedWords.has(word)) return state;
  if (state.selected.has(word)) {
    state.selected.delete(word);
  } else if (state.selected.size < 4) {
    state.selected.add(word);
  }
  state.message = null;
  return state;
}

function findFullCategory(state, wordsArr) {
  return state.categories.find((c) => wordsArr.every((w) => c.words.has(w)));
}

function findThreeMatch(state, wordsArr) {
  return state.categories.find(
    (c) => wordsArr.filter((w) => c.words.has(w)).length === 3
  );
}

export function submitGuess(state) {
  if (state.status !== 'playing') return state;
  if (state.selected.size !== 4) {
    state.message = 'בחרי בדיוק 4 מילים';
    return state;
  }

  const words = [...state.selected];
  const full = findFullCategory(state, words);

  if (full) {
    state.solved.push({ name: full.name, difficulty: full.difficulty, words: [...full.words] });
    for (const w of full.words) state.solvedWords.add(w);
    state.categories = state.categories.filter((c) => c !== full);
    state.selected.clear();
    if (state.categories.length === 0) {
      state.status = 'won';
      state.message = 'ניצחת! 🎉';
    } else {
      state.message = 'נכון!';
    }
    return state;
  }

  // ניחוש שגוי עולה בטעות
  state.mistakes += 1;
  const three = findThreeMatch(state, words);
  state.selected.clear();

  if (state.mistakes >= state.maxMistakes) {
    state.status = 'lost';
    state.message = 'נגמרו הניסיונות';
  } else if (three) {
    state.message = `קרוב! 3 מתוך 4 (טעות ${state.mistakes}/${state.maxMistakes})`;
  } else {
    state.message = `לא נכון (טעות ${state.mistakes}/${state.maxMistakes})`;
  }
  return state;
}

export function getFullAnswers(state) {
  const out = state.solved.map((s) => ({ ...s, words: s.words.slice() }));
  for (const c of state.categories) {
    out.push({ name: c.name, difficulty: c.difficulty, words: [...c.words] });
  }
  return out;
}

const EMOJI = { yellow: '🟨', green: '🟩', blue: '🟦', purple: '🟪' };

export function shareString(state, puzzleNumber) {
  const header = `חיבורים #${puzzleNumber}`;
  const rows = state.solved.map((s) => EMOJI[s.difficulty].repeat(4));
  if (state.status === 'lost') {
    rows.push(`❌ ${state.solved.length}/4`);
  }
  return [header, ...rows].join('\n');
}
