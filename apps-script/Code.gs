/**
 * Workshop Survey — Google Apps Script bound to the response sheet.
 *
 * Deploy as Web App:
 *  1. Open your Google Sheet → Extensions → Apps Script.
 *  2. Paste this file as Code.gs.
 *  3. Deploy → New deployment → Type: Web app.
 *     - Execute as: Me
 *     - Who has access: Anyone
 *  4. Copy the web app URL and put it in Vercel as env var APPS_SCRIPT_URL.
 *  5. Re-run setup() once from the Apps Script editor to create headers.
 */

const SHEET_NAME = 'responses';

const HEADERS = [
  'timestamp',
  'email',
  'mode_excited',
  'role',
  'blocker',
  'next_topic',
  'frequency',
  'take_on_ai',
  'confidence',
  'use_cases',
  'aha_mode',
  'active_project',
  'wants_chat',
  'nps',
  'interests',
  'stars',
  'comment',
  'version',
];

function setup() {
  const ss = SpreadsheetApp.getActive();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  sheet.clear();
  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  sheet.setFrozenRows(1);
}

function doPost(e) {
  try {
    const b = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME);
    sheet.appendRow([
      new Date(),
      b.email || '',
      b.mode_excited || '',
      b.role || '',
      b.blocker || '',
      b.next_topic || '',
      b.frequency ?? '',
      b.take_on_ai || '',
      b.confidence ?? '',
      (b.use_cases || []).join('|'),
      b.aha_mode || '',
      b.active_project || '',
      b.wants_chat || '',
      b.nps ?? '',
      (b.interests || []).join('|'),
      b.stars ?? '',
      b.comment || '',
      b.version || '',
    ]);
    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) }, 500);
  }
}

function doGet() {
  const sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME);
  if (!sheet) return json(empty());
  const rows = sheet.getDataRange().getValues();
  if (rows.length <= 1) return json(empty());
  const headers = rows[0];
  const data = rows.slice(1).map(function (r) {
    const o = {};
    headers.forEach(function (h, i) { o[h] = r[i]; });
    return o;
  });

  const CHOICE_FIELDS = [
    'mode_excited', 'role', 'blocker', 'next_topic',
    'aha_mode', 'active_project', 'wants_chat', 'take_on_ai',
  ];
  const MULTI_FIELDS = ['use_cases', 'interests'];
  const SLIDER_FIELDS = ['frequency', 'confidence', 'nps'];

  const byChoice = {};
  CHOICE_FIELDS.forEach(function (f) {
    byChoice[f] = {};
    data.forEach(function (row) {
      const v = row[f];
      if (v === '' || v == null) return;
      byChoice[f][v] = (byChoice[f][v] || 0) + 1;
    });
  });

  const byMulti = {};
  MULTI_FIELDS.forEach(function (f) {
    byMulti[f] = {};
    data.forEach(function (row) {
      const raw = row[f];
      if (!raw) return;
      String(raw).split('|').filter(Boolean).forEach(function (v) {
        byMulti[f][v] = (byMulti[f][v] || 0) + 1;
      });
    });
  });

  const bySliderAvg = {};
  SLIDER_FIELDS.forEach(function (f) {
    let sum = 0, count = 0;
    data.forEach(function (row) {
      const v = row[f];
      if (v === '' || v == null || isNaN(Number(v))) return;
      sum += Number(v); count++;
    });
    bySliderAvg[f] = { avg: count ? sum / count : 0, count: count };
  });

  const starDist = [0, 0, 0, 0, 0];
  let starSum = 0, starCount = 0;
  data.forEach(function (row) {
    const s = Number(row.stars);
    if (!s || s < 1 || s > 5) return;
    starDist[s - 1]++;
    starSum += s; starCount++;
  });

  let promoters = 0, passives = 0, detractors = 0;
  data.forEach(function (row) {
    const n = Number(row.nps);
    if (isNaN(n)) return;
    if (n >= 9) promoters++;
    else if (n >= 7) passives++;
    else detractors++;
  });
  const total = promoters + passives + detractors;
  const npsScore = total ? ((promoters - detractors) / total) * 100 : 0;

  return json({
    count: data.length,
    byChoice: byChoice,
    byMulti: byMulti,
    bySliderAvg: bySliderAvg,
    stars: { avg: starCount ? starSum / starCount : 0, count: starCount, dist: starDist },
    nps: { promoters: promoters, passives: passives, detractors: detractors, score: npsScore },
  });
}

function empty() {
  return {
    count: 0,
    byChoice: {}, byMulti: {}, bySliderAvg: {},
    stars: { avg: 0, count: 0, dist: [0, 0, 0, 0, 0] },
    nps: { promoters: 0, passives: 0, detractors: 0, score: 0 },
  };
}

function json(obj, _status) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
