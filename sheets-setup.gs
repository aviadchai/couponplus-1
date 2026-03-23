// ╔══════════════════════════════════════════════════════════════════╗
// ║         קופון פלוס — Google Sheets Setup Script                 ║
// ║  הדבק קובץ זה ב-Google Apps Script והרץ את setupAll()          ║
// ║  Apps Script: Extensions → Apps Script → הדבק → Run setupAll   ║
// ╚══════════════════════════════════════════════════════════════════╝

// ── רשימות dropdown ────────────────────────────────────────────────

const CHAINS = [
  'רמי לוי','שופרסל','מגה','ויקטורי','יינות ביתן',
  'חצי חינם','יוחננוף','אושר עד',
  'Super-Pharm','NewPharm','כללית מושלם',
  'AliExpress','Shein','Amazon','eBay','Temu',
  'אחר'
];

const CATEGORIES = [
  'סופרמרקט',
  'פארם ובריאות',
  'טיפוח וקוסמטיקה',
  'טואלטיקה',
  'אלקטרוניקה',
  'בית ומטבח',
  'אופנה',
  'חיות מחמד',
  'בינלאומי',
  'אחר'
];

const TYPES = [
  'קוד קופון',        // רק קוד — מציג שדה code
  'קישור להטבה',     // רק לינק — ללא קוד
  'קוד + קישור'      // גם קוד וגם לינק
];

const BADGES = [
  '',                 // ← ריק = ללא badge
  'חם',              // 🔥 מופיע ב"חמים עכשיו"
  'חדש',
  'מוגבל',
  // ── תגיות לדף Special (החג הנוכחי) ──
  'פסח',
  'שבועות',
  'ראש השנה',
  'סוכות',
  'חנוכה',
  'פורים',
];

// ── צבעי header ────────────────────────────────────────────────────
const COLOR_HEADER_BG   = '#1A1A2E';  // navy
const COLOR_HEADER_TEXT = '#FFFFFF';
const COLOR_REQUIRED    = '#FFF3E0';  // שדות חובה — צהבהב
const COLOR_OPTIONAL    = '#F5F5F5';  // שדות רשות — אפור בהיר
const COLOR_SPECIAL     = '#FCE4EC';  // שדות special/חג — ורוד

// ══════════════════════════════════════════════════════════════════
//  MAIN — מריץ הכל
// ══════════════════════════════════════════════════════════════════
function setupAll() {
  setupCouponsSheet();
  setupSliderSheet();
  SpreadsheetApp.getUi().alert('✅ הגדרת הגיליון הושלמה! כל ה-dropdowns והעיצוב מוכנים.');
}

// ══════════════════════════════════════════════════════════════════
//  גיליון קופונים
// ══════════════════════════════════════════════════════════════════
function setupCouponsSheet() {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  let sheet   = ss.getSheetByName('קופונים');
  if (!sheet) sheet = ss.insertSheet('קופונים');

  sheet.clearFormats();

  // ── עמודות וכותרות ────────────────────────────────────────────
  const headers = [
    { col: 1,  label: 'ID',           note: 'מזהה ייחודי — לא לשנות (coup_01, coup_02...)', required: true  },
    { col: 2,  label: 'שם הקופון',    note: 'שם תיאורי שיופיע בכרטיס',                      required: true  },
    { col: 3,  label: 'רשת / מותג',   note: 'dropdown — בחר מהרשימה',                        required: true  },
    { col: 4,  label: 'קטגוריה',      note: 'dropdown — בחר מהרשימה',                        required: true  },
    { col: 5,  label: 'הנחה',         note: 'לדוגמה: 20% / 50₪ / 1+1',                       required: false },
    { col: 6,  label: 'סוג',          note: 'dropdown — קוד קופון / קישור / שניהם',           required: true  },
    { col: 7,  label: 'קוד קופון',    note: 'רלוונטי ל"קוד קופון" ו"קוד+קישור" בלבד',        required: false },
    { col: 8,  label: 'קישור להטבה',  note: 'URL מלא כולל https://',                          required: false },
    { col: 9,  label: 'תוקף עד',      note: 'תאריך — dd/mm/yyyy',                             required: false },
    { col: 10, label: 'Badge / תגית', note: 'dropdown — חם / חדש / פסח / שבועות...',          required: false, special: true },
    { col: 11, label: 'תמונה (URL)',   note: 'קישור לתמונה Google Drive או אחר',               required: false },
    { col: 12, label: 'תיאור מורחב',  note: 'טקסט שיופיע בדף הקופון הבודד',                  required: false },
    { col: 13, label: 'PDF מבצעים',   note: 'קישור לחוברת PDF (אם קיימת)',                    required: false },
  ];

  // רוחב עמודות
  const widths = [80, 260, 130, 150, 90, 130, 120, 260, 100, 120, 240, 300, 200];
  headers.forEach((h, i) => {
    sheet.setColumnWidth(h.col, widths[i]);
    const cell = sheet.getRange(1, h.col);
    cell.setValue(h.label)
        .setBackground(COLOR_HEADER_BG)
        .setFontColor(COLOR_HEADER_TEXT)
        .setFontWeight('bold')
        .setFontSize(11)
        .setHorizontalAlignment('center')
        .setNote(h.note);

    // צבע רקע לשורות נתונים (2-200)
    const dataRange = sheet.getRange(2, h.col, 199, 1);
    if (h.special) {
      dataRange.setBackground(COLOR_SPECIAL);
    } else if (h.required) {
      dataRange.setBackground(COLOR_REQUIRED);
    } else {
      dataRange.setBackground(COLOR_OPTIONAL);
    }
  });

  sheet.setRowHeight(1, 36);
  sheet.setFrozenRows(1);
  sheet.setFrozenColumns(2); // קיבוע ID + שם

  // ── Dropdowns ─────────────────────────────────────────────────

  // רשת (C)
  addDropdown(sheet, 2, 3, 200, CHAINS);

  // קטגוריה (D)
  addDropdown(sheet, 2, 4, 200, CATEGORIES);

  // סוג (F)
  addDropdown(sheet, 2, 6, 200, TYPES);

  // Badge (J) — כולל חגים
  addDropdown(sheet, 2, 10, 200, BADGES.filter(b => b !== '').concat(['']));

  // ── תאריך תוקף (I) — פורמט dd/mm/yyyy ───────────────────────
  sheet.getRange(2, 9, 199, 1).setNumberFormat('dd/mm/yyyy');

  // ── Conditional formatting — Badge ────────────────────────────
  const badgeRange = sheet.getRange('J2:J200');
  const rules = sheet.getConditionalFormatRules();

  const badgeColors = {
    'חם':       { bg: '#FFEBEE', text: '#C62828' },
    'חדש':      { bg: '#E8F5E9', text: '#2E7D32' },
    'מוגבל':    { bg: '#FFF8E1', text: '#F57F17' },
    'פסח':      { bg: '#FFF3E0', text: '#E65100' },
    'שבועות':   { bg: '#E8F5E9', text: '#1B5E20' },
    'ראש השנה': { bg: '#F3E5F5', text: '#6A1B9A' },
    'סוכות':    { bg: '#E3F2FD', text: '#0D47A1' },
    'חנוכה':    { bg: '#E0F7FA', text: '#006064' },
    'פורים':    { bg: '#FCE4EC', text: '#880E4F' },
  };

  Object.entries(badgeColors).forEach(([val, clr]) => {
    const rule = SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo(val)
      .setBackground(clr.bg)
      .setFontColor(clr.text)
      .setRanges([badgeRange])
      .build();
    rules.push(rule);
  });
  sheet.setConditionalFormatRules(rules);

  // ── אימות: ID לא ריק ──────────────────────────────────────────
  const idValidation = SpreadsheetApp.newDataValidation()
    .requireTextContains('coup_')
    .setHelpText('ID חייב להתחיל ב-coup_ (לדוגמה: coup_01)')
    .setAllowInvalid(false)
    .build();
  sheet.getRange(2, 1, 199, 1).setDataValidation(idValidation);

  // ── שורת דוגמה ────────────────────────────────────────────────
  const example = sheet.getRange(2, 1, 1, 13);
  if (!sheet.getRange('A2').getValue()) {
    sheet.getRange('A2').setValue('coup_01');
    sheet.getRange('B2').setValue('דוגמה — מחק שורה זו');
    sheet.getRange('C2').setValue('רמי לוי');
    sheet.getRange('D2').setValue('סופרמרקט');
    sheet.getRange('E2').setValue('20%');
    sheet.getRange('F2').setValue('קוד קופון');
    sheet.getRange('G2').setValue('RAMI20');
    sheet.getRange('H2').setValue('https://rami-levy.co.il');
    sheet.getRange('I2').setValue('31/12/2025');
    sheet.getRange('J2').setValue('חם');
    example.setFontStyle('italic').setFontColor('#9E9E9E');
  }

  Logger.log('✅ גיליון קופונים הוגדר');
}

// ══════════════════════════════════════════════════════════════════
//  גיליון סליידר
// ══════════════════════════════════════════════════════════════════
function setupSliderSheet() {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  let sheet   = ss.getSheetByName('סליידר');
  if (!sheet) sheet = ss.insertSheet('סליידר');

  sheet.clearFormats();

  const COLOR_SLIDER_HEADER = '#E8321A'; // אדום קופון+

  const headers = [
    { col: 1,  label: 'פעיל?',        note: 'כן / לא — רק "כן" יופיע בסליידר',  required: true  },
    { col: 2,  label: 'כותרת',        note: 'כותרת גדולה בסליידר',                required: true  },
    { col: 3,  label: 'כותרת משנה',   note: 'טקסט קטן מתחת לכותרת',              required: false },
    { col: 4,  label: 'תגית (Tag)',    note: 'תגית צבעונית קטנה (כמו "🔥 חם")',   required: false },
    { col: 5,  label: 'הנחה',         note: 'טקסט הנחה גדול (20% / 50₪ / 1+1)', required: false },
    { col: 6,  label: 'סוג',          note: 'קוד קופון / קישור להטבה / קוד+קישור',required: true  },
    { col: 7,  label: 'קוד קופון',    note: 'קוד שיוצג בסליידר',                  required: false },
    { col: 8,  label: 'קישור',        note: 'URL מלא לאן ללחוץ',                  required: false },
    { col: 9,  label: 'תמונת רקע',   note: 'URL לתמונה — מומלץ 1280×480',        required: false },
    { col: 10, label: 'ID קופון',     note: 'coup_01 — לחיצה תעביר לדף הקופון',  required: false },
  ];

  const widths = [70, 240, 200, 140, 100, 140, 130, 260, 260, 110];
  headers.forEach((h, i) => {
    sheet.setColumnWidth(h.col, widths[i]);
    const cell = sheet.getRange(1, h.col);
    cell.setValue(h.label)
        .setBackground(COLOR_SLIDER_HEADER)
        .setFontColor('#FFFFFF')
        .setFontWeight('bold')
        .setFontSize(11)
        .setHorizontalAlignment('center')
        .setNote(h.note);

    const dataRange = sheet.getRange(2, h.col, 9, 1);
    dataRange.setBackground(h.required ? COLOR_REQUIRED : COLOR_OPTIONAL);
  });

  sheet.setRowHeight(1, 36);
  sheet.setFrozenRows(1);

  // ── Dropdowns ─────────────────────────────────────────────────
  addDropdown(sheet, 2, 1, 10, ['כן', 'לא']);
  addDropdown(sheet, 2, 6, 10, TYPES);

  // ── Conditional formatting — פעיל ─────────────────────────────
  const activeRange = sheet.getRange('A2:A10');
  const activeRules = [];

  activeRules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('כן')
    .setBackground('#E8F5E9').setFontColor('#1B5E20').setBold(true)
    .setRanges([activeRange]).build());

  activeRules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('לא')
    .setBackground('#FFEBEE').setFontColor('#B71C1C')
    .setRanges([activeRange]).build());

  sheet.setConditionalFormatRules(activeRules);

  // ── שורת דוגמה ────────────────────────────────────────────────
  if (!sheet.getRange('A2').getValue()) {
    sheet.getRange('A2').setValue('כן');
    sheet.getRange('B2').setValue('חסכו 20% ברמי לוי');
    sheet.getRange('C2').setValue('עם קוד קופון בלעדי');
    sheet.getRange('D2').setValue('🔥 חם');
    sheet.getRange('E2').setValue('20%');
    sheet.getRange('F2').setValue('קוד קופון');
    sheet.getRange('G2').setValue('RAMI20');
    sheet.getRange('H2').setValue('https://rami-levy.co.il');
    sheet.getRange('J2').setValue('coup_01');
    sheet.getRange(2, 1, 1, 10).setFontStyle('italic').setFontColor('#9E9E9E');
  }

  // הסבר מספר שורות
  sheet.getRange('A12').setValue('⚠ הסליידר מציג עד 3 שורות פעילות (כן) בלבד')
       .setFontColor('#E65100').setFontWeight('bold').setFontSize(10);

  Logger.log('✅ גיליון סליידר הוגדר');
}

// ══════════════════════════════════════════════════════════════════
//  עזר — יצירת dropdown
// ══════════════════════════════════════════════════════════════════
function addDropdown(sheet, startRow, col, numRows, values) {
  const rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(values, true)
    .setAllowInvalid(false)
    .setHelpText('בחר ערך מהרשימה')
    .build();
  sheet.getRange(startRow, col, numRows, 1).setDataValidation(rule);
}
