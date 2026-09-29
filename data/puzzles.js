// חידות "חיבורים" — כל חידה: 4 קטגוריות × 4 מילים.
// difficulty: yellow (קל) → green → blue → purple (קשה)

export const puzzles = [
  {
    id: 1,
    categories: [
      { name: 'חיות', difficulty: 'yellow', words: ['כלב', 'חתול', 'סוס', 'פרה'] },
      { name: 'צבעים', difficulty: 'green', words: ['אדום', 'ירוק', 'כחול', 'צהוב'] },
      { name: 'פירות', difficulty: 'blue', words: ['תפוח', 'בננה', 'תפוז', 'ענבים'] },
      { name: 'לבוש', difficulty: 'purple', words: ['חולצה', 'מכנסיים', 'נעליים', 'כובע'] },
    ],
  },
  {
    id: 2,
    categories: [
      { name: 'כלי מטבח', difficulty: 'yellow', words: ['סכין', 'מזלג', 'כף', 'צלחת'] },
      { name: 'רהיטים', difficulty: 'green', words: ['שולחן', 'כיסא', 'ארון', 'מיטה'] },
      { name: 'משקאות', difficulty: 'blue', words: ['מים', 'חלב', 'קפה', 'תה'] },
      { name: 'כלי כתיבה', difficulty: 'purple', words: ['עט', 'עיפרון', 'מחברת', 'דף'] },
    ],
  },
  {
    id: 3,
    categories: [
      { name: 'תחבורה', difficulty: 'yellow', words: ['אוטובוס', 'רכבת', 'מטוס', 'אופניים'] },
      { name: 'מקצועות', difficulty: 'green', words: ['רופא', 'מורה', 'שופט', 'טבח'] },
      { name: 'איברי גוף', difficulty: 'blue', words: ['יד', 'רגל', 'ראש', 'עין'] },
      { name: 'מזג אוויר', difficulty: 'purple', words: ['גשם', 'שמש', 'שלג', 'רוח'] },
    ],
  },
  {
    id: 4,
    categories: [
      { name: 'ימי השבוע', difficulty: 'yellow', words: ['ראשון', 'שני', 'שלישי', 'רביעי'] },
      { name: 'רגשות', difficulty: 'green', words: ['שמחה', 'עצב', 'פחד', 'כעס'] },
      { name: 'חיות ים', difficulty: 'blue', words: ['דג', 'כריש', 'תמנון', 'מדוזה'] },
      { name: 'כלי נגינה', difficulty: 'purple', words: ['גיטרה', 'פסנתר', 'תוף', 'כינור'] },
    ],
  },
  {
    id: 5,
    categories: [
      { name: 'עונות', difficulty: 'yellow', words: ['קיץ', 'חורף', 'אביב', 'סתיו'] },
      { name: 'כיוונים', difficulty: 'green', words: ['צפון', 'דרום', 'מזרח', 'מערב'] },
      { name: 'משפחה', difficulty: 'blue', words: ['אמא', 'אבא', 'אח', 'אחות'] },
      { name: 'חגים', difficulty: 'purple', words: ['פסח', 'סוכות', 'שבועות', 'חנוכה'] },
    ],
  },
  {
    id: 6,
    categories: [
      { name: 'ספורט', difficulty: 'yellow', words: ['כדורגל', 'כדורסל', 'טניס', 'שחייה'] },
      { name: 'ירקות', difficulty: 'green', words: ['עגבנייה', 'מלפפון', 'גזר', 'בצל'] },
      { name: 'מוצרי חשמל', difficulty: 'blue', words: ['טלפון', 'מחשב', 'טלוויזיה', 'מקרר'] },
      { name: 'תבלינים', difficulty: 'purple', words: ['מלח', 'פלפל', 'כמון', 'פפריקה'] },
    ],
  },
  {
    id: 7,
    categories: [
      { name: 'מדינות', difficulty: 'yellow', words: ['ישראל', 'צרפת', 'יפן', 'ברזיל'] },
      { name: 'שפות', difficulty: 'green', words: ['עברית', 'אנגלית', 'צרפתית', 'ספרדית'] },
      { name: 'כוכבי לכת', difficulty: 'blue', words: ['נוגה', 'מאדים', 'צדק', 'שבתאי'] },
      { name: 'מאכלים', difficulty: 'purple', words: ['פיצה', 'המבורגר', 'סלט', 'מרק'] },
    ],
  },
  {
    id: 8,
    categories: [
      { name: 'ציפורים', difficulty: 'yellow', words: ['יונה', 'עורב', 'נשר', 'תוכי'] },
      { name: 'בית ספר', difficulty: 'green', words: ['מורה', 'תלמיד', 'כיתה', 'שיעור'] },
      { name: 'גופי מים', difficulty: 'blue', words: ['ים', 'נהר', 'אגם', 'בריכה'] },
      { name: 'חומרי בניין', difficulty: 'purple', words: ['בטון', 'ברזל', 'עץ', 'זכוכית'] },
    ],
  },
  {
    id: 9,
    categories: [
      { name: 'פרחים', difficulty: 'yellow', words: ['ורד', 'צבעוני', 'חרצית', 'נרקיס'] },
      { name: 'תכשיטים', difficulty: 'green', words: ['טבעת', 'שרשרת', 'צמיד', 'עגיל'] },
      { name: 'מטבעות', difficulty: 'blue', words: ['שקל', 'דולר', 'יורו', 'פאונד'] },
      { name: 'מקצועות רפואה', difficulty: 'purple', words: ['רופא', 'אחות', 'רוקח', 'וטרינר'] },
    ],
  },
  {
    id: 10,
    categories: [
      { name: 'פירות הדר', difficulty: 'yellow', words: ['תפוז', 'לימון', 'אשכולית', 'קלמנטינה'] },
      { name: 'חיות בר', difficulty: 'green', words: ['אריה', 'נמר', 'פיל', 'זאב'] },
      { name: 'מקומות בעיר', difficulty: 'blue', words: ['כיכר', 'רחוב', 'גן', 'שוק'] },
      { name: 'תחביבים', difficulty: 'purple', words: ['קריאה', 'ציור', 'ריצה', 'בישול'] },
    ],
  },
];
