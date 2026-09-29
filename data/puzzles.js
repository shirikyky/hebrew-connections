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
  {
    id: 11,
    categories: [
      { name: 'כלי עבודה', difficulty: 'yellow', words: ['פטיש', 'מברג', 'מסור', 'צבת'] },
      { name: 'מוצרי חלב', difficulty: 'green', words: ['חלב', 'גבינה', 'יוגורט', 'חמאה'] },
      { name: 'בגדי חורף', difficulty: 'blue', words: ['מעיל', 'כפפות', 'צעיף', 'מגפיים'] },
      { name: 'כלי שיט', difficulty: 'purple', words: ['סירה', 'ספינה', 'אונייה', 'יאכטה'] },
    ],
  },
  {
    id: 12,
    categories: [
      { name: 'איברים פנימיים', difficulty: 'yellow', words: ['לב', 'מוח', 'ריאה', 'כבד'] },
      { name: 'מכשירי מטבח', difficulty: 'green', words: ['מיקסר', 'טוסטר', 'קומקום', 'בלנדר'] },
      { name: 'חרקים', difficulty: 'blue', words: ['נמלה', 'דבורה', 'יתוש', 'פרפר'] },
      { name: 'סוגי בשר', difficulty: 'purple', words: ['עוף', 'בקר', 'כבש', 'הודו'] },
    ],
  },
  {
    id: 13,
    categories: [
      { name: 'פירות יבשים', difficulty: 'yellow', words: ['תמר', 'צימוק', 'תאנה', 'משמש'] },
      { name: 'חלקי עץ', difficulty: 'green', words: ['עלה', 'ענף', 'גזע', 'שורש'] },
      { name: 'משקאות חמים', difficulty: 'blue', words: ['קפה', 'תה', 'שוקו', 'חליטה'] },
      { name: 'מקצועות בריאות', difficulty: 'purple', words: ['אחות', 'רוקח', 'פסיכולוג', 'וטרינר'] },
    ],
  },
  {
    id: 14,
    categories: [
      { name: 'אביזרי תינוק', difficulty: 'yellow', words: ['מוצץ', 'בקבוק', 'חיתול', 'עגלה'] },
      { name: 'חיות חווה', difficulty: 'green', words: ['פרה', 'סוס', 'עז', 'תרנגולת'] },
      { name: 'סוגי לחם', difficulty: 'blue', words: ['חלה', 'פיתה', 'בגט', 'לחמנייה'] },
      { name: 'צורות', difficulty: 'purple', words: ['עיגול', 'ריבוע', 'משולש', 'מעוין'] },
    ],
  },
  {
    id: 15,
    categories: [
      { name: 'סוגי בדים', difficulty: 'yellow', words: ['כותנה', 'צמר', 'משי', 'פשתן'] },
      { name: 'כלי נשיפה', difficulty: 'green', words: ['חליל', 'חצוצרה', 'סקסופון', 'קלרינט'] },
      { name: 'ירקות שורש', difficulty: 'blue', words: ['גזר', 'סלק', 'בצל', 'צנון'] },
      { name: 'ספורט מים', difficulty: 'purple', words: ['שחייה', 'גלישה', 'שיט', 'צלילה'] },
    ],
  },
  {
    id: 16,
    categories: [
      { name: 'חלקי בית', difficulty: 'yellow', words: ['קיר', 'גג', 'רצפה', 'דלת'] },
      { name: 'סוגי דגנים', difficulty: 'green', words: ['חיטה', 'שעורה', 'תירס', 'אורז'] },
      { name: 'מקצועות יצירה', difficulty: 'blue', words: ['צייר', 'פסל', 'נגר', 'חייט'] },
      { name: 'אביזרי שיער', difficulty: 'purple', words: ['מסרק', 'מברשת', 'גומייה', 'שמפו'] },
    ],
  },
  {
    id: 17,
    categories: [
      { name: 'כלי הגשה', difficulty: 'yellow', words: ['צלחת', 'קערה', 'כוס', 'ספל'] },
      { name: 'ציפורים', difficulty: 'green', words: ['שחף', 'חסידה', 'דרור', 'טווס'] },
      { name: 'אבני חן', difficulty: 'blue', words: ['יהלום', 'ספיר', 'אודם', 'ברקת'] },
      { name: 'מקצועות בניין', difficulty: 'purple', words: ['אדריכל', 'חשמלאי', 'שרברב', 'מהנדס'] },
    ],
  },
  {
    id: 18,
    categories: [
      { name: 'קינוחים', difficulty: 'yellow', words: ['עוגה', 'עוגייה', 'גלידה', 'פנקייק'] },
      { name: 'חיות מדבר', difficulty: 'green', words: ['גמל', 'נחש', 'לטאה', 'יען'] },
      { name: 'חלקי פנים', difficulty: 'blue', words: ['אף', 'פה', 'אוזן', 'שן'] },
      { name: 'אגוזים', difficulty: 'purple', words: ['שקד', 'פקאן', 'פיסטוק', 'קשיו'] },
    ],
  },
  {
    id: 19,
    categories: [
      { name: 'מקצועות חינוך', difficulty: 'yellow', words: ['מורה', 'גננת', 'מרצה', 'מדריך'] },
      { name: 'תופעות מזג אוויר', difficulty: 'green', words: ['ברק', 'רעם', 'ברד', 'ערפל'] },
      { name: 'סוגי נעליים', difficulty: 'blue', words: ['סנדל', 'מגף', 'עקב', 'כפכף'] },
      { name: 'אביזרי תפירה', difficulty: 'purple', words: ['חוט', 'מחט', 'כפתור', 'מספריים'] },
    ],
  },
  {
    id: 20,
    categories: [
      { name: 'משקאות קלים', difficulty: 'yellow', words: ['קולה', 'מיץ', 'סודה', 'לימונדה'] },
      { name: 'חיות גן חיות', difficulty: 'green', words: ['אריה', 'נמר', 'פיל', 'ג׳ירפה'] },
      { name: 'חלקי מכונית', difficulty: 'blue', words: ['גלגל', 'דלת', 'מנוע', 'הגה'] },
      { name: 'מכשירי משרד', difficulty: 'purple', words: ['מדפסת', 'סורק', 'מקרן', 'מחשב'] },
    ],
  },
  {
    id: 21,
    categories: [
      { name: 'כיסויי ראש', difficulty: 'yellow', words: ['כובע', 'קסדה', 'מצנפת', 'כיפה'] },
      { name: 'חיות לילה', difficulty: 'green', words: ['ינשוף', 'עטלף', 'זאב', 'שועל'] },
      { name: 'מקומות טבע', difficulty: 'blue', words: ['מדבר', 'יער', 'הר', 'חוף'] },
      { name: 'אביזרי נסיעה', difficulty: 'purple', words: ['מזוודה', 'תרמיל', 'דרכון', 'כרטיס'] },
    ],
  },
  {
    id: 22,
    categories: [
      { name: 'אביזרי ספורט', difficulty: 'yellow', words: ['כדור', 'מחבט', 'מגן', 'קסדה'] },
      { name: 'נוזלים', difficulty: 'green', words: ['מים', 'שמן', 'דבש', 'דיו'] },
      { name: 'מקצועות תקשורת', difficulty: 'blue', words: ['עיתונאי', 'צלם', 'שדרן', 'עורך'] },
      { name: 'ירקות עליים', difficulty: 'purple', words: ['חסה', 'תרד', 'כרוב', 'פטרוזיליה'] },
    ],
  },
  {
    id: 23,
    categories: [
      { name: 'סוגי ריקוד', difficulty: 'yellow', words: ['בלט', 'סלסה', 'טנגו', 'פלמנקו'] },
      { name: 'מכשירי ניקיון', difficulty: 'green', words: ['מטאטא', 'דלי', 'סמרטוט', 'מגב'] },
      { name: 'אביזרי מחשב', difficulty: 'blue', words: ['מקלדת', 'עכבר', 'מסך', 'רמקול'] },
      { name: 'מקצועות במה', difficulty: 'purple', words: ['שחקן', 'זמר', 'רקדן', 'נגן'] },
    ],
  },
  {
    id: 24,
    categories: [
      { name: 'סוגי בתים', difficulty: 'yellow', words: ['דירה', 'וילה', 'קוטג׳', 'צריף'] },
      { name: 'סוגי פסטה', difficulty: 'green', words: ['ספגטי', 'מקרוני', 'פנה', 'לזניה'] },
      { name: 'חלקי גוף עליון', difficulty: 'blue', words: ['כתף', 'מרפק', 'צוואר', 'גב'] },
      { name: 'אביזרי אמבטיה', difficulty: 'purple', words: ['סבון', 'מגבת', 'ספוג', 'שמפו'] },
    ],
  },
  {
    id: 25,
    categories: [
      { name: 'סוגי מיצים', difficulty: 'yellow', words: ['תפוזים', 'ענבים', 'תפוחים', 'לימון'] },
      { name: 'חיות ים גדולות', difficulty: 'green', words: ['לוויתן', 'דולפין', 'כלב ים', 'כריש'] },
      { name: 'אביזרי ניירת', difficulty: 'blue', words: ['מעטפה', 'גיליון', 'תיקייה', 'סרגל'] },
      { name: 'סוגי גבינות', difficulty: 'purple', words: ['פטה', 'צפתית', 'בולגרית', 'מוצרלה'] },
    ],
  },
];
