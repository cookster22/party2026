const http = require('http');
const fs = require('fs');
const path = require('path');
const https = require('https');

const PORT = process.env.PORT || 3000;
const SW_API_KEY = process.env.SMARTWAIVER_API_KEY || '';
const SNOWBASIN_TEMPLATE = 'n1qncqjkdme8eu3xud26h';
const BUCKWILD_TEMPLATE  = 'hdbohnp4evpbp3y1unsdp7';

const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.webp': 'image/webp',
};

// ── CSV baseline ──────────────────────────────────────────────────────────────
const CSV_BASELINE = {
  "jaime alamillo":         { snow: 'done', buck: 'done' },
  "easton anderson":        { snow: 'done', buck: 'none' },
  "julie anderson":         { snow: 'done', buck: 'none' },
  "carlee arthur":          { snow: 'done', buck: 'none' },
  "zach baker":             { snow: 'done', buck: 'none' },
  "austin bakker":          { snow: 'done', buck: 'done' },
  "dustin barrilleaux":     { snow: 'done', buck: 'done' },
  "nermin bektic":          { snow: 'done', buck: 'done' },
  "madeline birtcher":      { snow: 'done', buck: 'done' },
  "daniel bjornn":          { snow: 'done', buck: 'done' },
  "jenna blacker":          { snow: 'done', buck: 'none' },
  "kyle boblett":           { snow: 'done', buck: 'none' },
  "persephone bohon":       { snow: 'done', buck: 'done' },
  "fidel bravo":            { snow: 'done', buck: 'none' },
  "lindsey broud":          { snow: 'done', buck: 'none' },
  "marisa bruce":           { snow: 'done', buck: 'none' },
  "jon brusch":             { snow: 'pending', buck: 'pending' },
  "lizbeth calvillo":       { snow: 'pending', buck: 'pending' },
  "gabriel cano":           { snow: 'done', buck: 'done' },
  "amelia chacon":          { snow: 'done', buck: 'none' },
  "lexus chavez":           { snow: 'done', buck: 'done' },
  "lilianah chavez":        { snow: 'done', buck: 'none' },
  "cameron clark":          { snow: 'done', buck: 'done' },
  "lautaro colazo":         { snow: 'done', buck: 'none' },
  "jeremy conterio":        { snow: 'done', buck: 'done' },
  "kylen conterio":         { snow: 'done', buck: 'none' },
  "david cook":             { snow: 'done', buck: 'none' },
  "dominique coon":         { snow: 'done', buck: 'done' },
  "samuel corbett":         { snow: 'pending', buck: 'pending' },
  "bradie dains":           { snow: 'done', buck: 'done' },
  "katherine davidson":     { snow: 'pending', buck: 'none' },
  "brennen davis":          { snow: 'done', buck: 'done' },
  "edin dzindo":            { snow: 'done', buck: 'done' },
  "nicholis egbert":        { snow: 'done', buck: 'done' },
  "carli fairchild":        { snow: 'done', buck: 'done' },
  "paytan fairchild":       { snow: 'done', buck: 'done' },
  "jacob garner":           { snow: 'done', buck: 'done' },
  "brian garstka":          { snow: 'done', buck: 'none' },
  "avery giles":            { snow: 'done', buck: 'done' },
  "alexis gilliam":         { snow: 'done', buck: 'done' },
  "bentley glover":         { snow: 'done', buck: 'done' },
  "trevor gosar":           { snow: 'done', buck: 'done' },
  "colton griffith":        { snow: 'done', buck: 'done' },
  "natassja grossman":      { snow: 'done', buck: 'none' },
  "matteo guerrieri":       { snow: 'done', buck: 'done' },
  "taylour hanson":         { snow: 'done', buck: 'none' },
  "jonathan hernandez":     { snow: 'done', buck: 'none' },
  "carson hoch":            { snow: 'done', buck: 'done' },
  "cory jeffs":             { snow: 'done', buck: 'done' },
  "andrew jensen":          { snow: 'done', buck: 'done' },
  "kayla jensen":           { snow: 'pending', buck: 'pending' },
  "garret joiret":          { snow: 'done', buck: 'done' },
  "olivia jones":           { snow: 'pending', buck: 'done' },
  "arlette juarez":         { snow: 'done', buck: 'none' },
  "cesar juarez":           { snow: 'done', buck: 'done' },
  "isela juarez":           { snow: 'done', buck: 'done' },
  "raquel juarez":          { snow: 'done', buck: 'done' },
  "yesenia juarez":         { snow: 'done', buck: 'done' },
  "creighton king":         { snow: 'done', buck: 'pending' },
  "nathaniel kirk":         { snow: 'pending', buck: 'none' },
  "jordan knudsen":         { snow: 'pending', buck: 'pending' },
  "hanna kolsen":           { snow: 'done', buck: 'none' },
  "aidan kuhlman":          { snow: 'pending', buck: 'pending' },
  "noah kumrow":            { snow: 'done', buck: 'done' },
  "harrison larsen":        { snow: 'done', buck: 'done' },
  "owen larson":            { snow: 'done', buck: 'done' },
  "nathaniel leishman":     { snow: 'done', buck: 'pending' },
  "christian luiten":       { snow: 'done', buck: 'none' },
  "matthew mahony":         { snow: 'pending', buck: 'pending' },
  "dixie mann":             { snow: 'done', buck: 'done' },
  "jonathan martinez":      { snow: 'done', buck: 'none' },
  "julissa martinez":       { snow: 'done', buck: 'done' },
  "misty mckenzie":         { snow: 'done', buck: 'done' },
  "preston mcpheters":      { snow: 'done', buck: 'done' },
  "vanessa mercado":        { snow: 'done', buck: 'done' },
  "schylar mills":          { snow: 'done', buck: 'done' },
  "kevin millward":         { snow: 'done', buck: 'none' },
  "london mitchell":        { snow: 'done', buck: 'none' },
  "destiny nelson":         { snow: 'pending', buck: 'none' },
  "dustin nielsen":         { snow: 'done', buck: 'none' },
  "kambren nielson":        { snow: 'done', buck: 'done' },
  "michael o'brien":        { snow: 'pending', buck: 'pending' },
  "jacoby o'connell":       { snow: 'done', buck: 'done' },
  "guadalupe ornelas":      { snow: 'done', buck: 'done' },
  "zavian pelayo":          { snow: 'pending', buck: 'pending' },
  "emily pena-gil":         { snow: 'done', buck: 'none' },
  "bradley perkins":        { snow: 'done', buck: 'done' },
  "kevin perkins":          { snow: 'done', buck: 'done' },
  "ashley pliler":          { snow: 'done', buck: 'none' },
  "alishia proctor":        { snow: 'done', buck: 'done' },
  "joshua putnam":          { snow: 'done', buck: 'done' },
  "christine rallison":     { snow: 'done', buck: 'done' },
  "yesenia ramirez":        { snow: 'done', buck: 'none' },
  "emily rasmussen":        { snow: 'done', buck: 'pending' },
  "haleigh rasmussen":      { snow: 'done', buck: 'done' },
  "jaunette reyes":         { snow: 'done', buck: 'done' },
  "kelsie richardson":      { snow: 'done', buck: 'done' },
  "rosio rivera":           { snow: 'done', buck: 'done' },
  "joseph rose":            { snow: 'done', buck: 'done' },
  "melissa salinas":        { snow: 'done', buck: 'none' },
  "eduardo sanchez":        { snow: 'none', buck: 'done' },
  "sara schafer":           { snow: 'done', buck: 'none' },
  "tanner sillito":         { snow: 'done', buck: 'done' },
  "nicholas snelson":       { snow: 'done', buck: 'none' },
  "matthew sommercorn":     { snow: 'done', buck: 'done' },
  "jade spencer":           { snow: 'done', buck: 'done' },
  "jill stellingwerf":      { snow: 'done', buck: 'none' },
  "brynne stenovich":       { snow: 'done', buck: 'none' },
  "evan stone":             { snow: 'done', buck: 'pending' },
  "jack tanis":             { snow: 'done', buck: 'done' },
  "amanda tilley":          { snow: 'done', buck: 'none' },
  "rayce tohara":           { snow: 'pending', buck: 'pending' },
  "rylee tomicic":          { snow: 'done', buck: 'none' },
  "erick vega":             { snow: 'pending', buck: 'none' },
  "dalton wallace":         { snow: 'done', buck: 'done' },
  "kyle whitchurch":        { snow: 'done', buck: 'done' },
  "corbin williams":        { snow: 'done', buck: 'done' },
  "david williams":         { snow: 'done', buck: 'none' },
  "jesse williams":         { snow: 'none', buck: 'pending' },
  "jessica wilson":         { snow: 'done', buck: 'done' },
  "craig wright":           { snow: 'done', buck: 'done' },
  "chase zundel":           { snow: 'done', buck: 'none' },
};

// ── Smartwaiver API helpers ───────────────────────────────────────────────────
function swFetch(params) {
  return new Promise((resolve) => {
    if (!SW_API_KEY) return resolve([]);
    const qs = Object.entries(params).map(([k,v]) => `${k}=${encodeURIComponent(v)}`).join('&');
    const url = `https://api.smartwaiver.com/v4/waivers?${qs}`;
    https.get(url, { headers: { 'sw-api-key': SW_API_KEY } }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try { resolve(JSON.parse(data).waivers || []); }
        catch { resolve([]); }
      });
    }).on('error', () => resolve([]));
  });
}

// Fetch a time window, auto-splitting into 15-min sub-windows if it hits the 100 cap
async function fetchWindow(fromDts, toDts) {
  const w = await swFetch({ limit: 100, fromDts, toDts });
  if (w.length < 100) return w;

  // Hit cap — split into 15-min sub-windows
  const from = new Date(fromDts);
  const to   = new Date(toDts);
  const span = (to - from) / 4; // 4 equal sub-windows
  if (span < 5 * 60 * 1000) return w; // already tiny, can't split further

  const results = [];
  for (let i = 0; i < 4; i++) {
    const s = new Date(from.getTime() + i * span);
    const e = new Date(from.getTime() + (i + 1) * span);
    const fmt = d => d.toISOString().replace('T', 'T').slice(0, 19);
    const sub = await fetchWindow(fmt(s), fmt(e));
    results.push(...sub);
  }
  return results;
}

// Generate hourly windows from Jun 2 2026 through Jun 7 2026 (local time as ISO strings)
function getWindows() {
  const windows = [];
  // Start Jun 2 22:00 (first waivers) through Jun 7 00:00
  const start = new Date('2026-06-02T22:00:00');
  const end   = new Date('2026-06-07T00:00:00');
  let cur = start;
  while (cur < end) {
    const next = new Date(cur.getTime() + 60 * 60 * 1000); // 1-hour windows
    const fmt = d => d.toISOString().replace(/\.\d{3}Z$/, '').replace('Z','');
    windows.push([fmt(cur), fmt(next > end ? end : next)]);
    cur = next;
  }
  return windows;
}

// Build full waiver map from all time windows
async function fetchAllWaivers() {
  const windows = getWindows();
  const allWaivers = [];
  for (const [from, to] of windows) {
    const w = await fetchWindow(from, to);
    allWaivers.push(...w);
  }
  return allWaivers;
}

function toStatus(verified) {
  return verified ? 'done' : 'pending';
}

// Party list keys (for guest detection)
const PARTY_KEYS = new Set([
  "gianfranco aciego","ethan aguinaga","jaime alamillo","aaron albrechtsen","burke alder",
  "easton anderson","julie anderson","rhett anderson","dallas andrade","brenda arambula",
  "carlee arthur","zach baker","austin bakker","shane ball","dustin barrilleaux",
  "nermin bektic","madeline birtcher","daniel bjornn","jaden blacker","jenna blacker",
  "kyle boblett","tanner bodily","persephone bohon","michael bradshaw","fidel bravo",
  "hunter breshears","benjamin briten","candice brizuela","adam broud","lindsey broud",
  "marisa bruce","jon brusch","katelyn call","lizbeth calvillo","veronica campos",
  "gabriel cano","yadira castillo","amelia chacon","lexus chavez","lilianah chavez",
  "easton christiansen","austin chugg","cameron clark","lautaro colazo","jeremy conterio",
  "kylen conterio","david cook","chip cook","matt cook","zander cook","dominique coon",
  "frank corbett","samuel corbett","joshua cruz","ian cuillard","bradie dains",
  "katherine davidson","brennen davis","evan davis","malia davis","edin dzindo",
  "trevor durfey","william edwards","nicholis egbert","davis england","houston ewing",
  "carli fairchild","paytan fairchild","jasmin fedaie","joshua ferry","nicholas filetti",
  "kyle fowers","saran garcia","jacob garner","brian garstka","avery giles","alexis gilliam",
  "bentley glover","trevor gosar","rebecca graham","laci greene","colton griffith",
  "natassja grossman","matteo guerrieri","leigha gutierrez","vanessa gutierrez",
  "taylour hanson","dallin hatch","jonathan hernandez","carson hoch","rylie hockenbury",
  "ryan horton","andy huerta","diego ibarra","parker jackson","samuel jaggi","cory jeffs",
  "andrew jensen","kayla jensen","nathan jensen","garret joiret","olivia jones",
  "arlette juarez","cesar juarez","felisha juarez","isela juarez","raquel juarez",
  "yesenia juarez","yvette juarez","sara kapsimalis","ryan kesler","mobina khazei",
  "creighton king","nathaniel kirk","jordan knudsen","hanna kolsen","aidan kuhlman",
  "joshua kuhn","noah kumrow","harrison larsen","owen larson","kira laub",
  "nathaniel leishman","devin lethbridge","brady lewis","caleb loveland","christian luiten",
  "ryan madsen","matthew mahony","aliya maldonado","dixie mann","zachary martin",
  "jonathan martinez","julissa martinez","katelyn mayner","kiera mcguire","misty mckenzie",
  "preston mcpheters","roanne mediati","jacob meiners","vanessa mercado","schylar mills",
  "kevin millward","jera mitchell","london mitchell","kendra molina-lacy","destiny nelson",
  "bryce nicoll","christian nielsen","dustin nielsen","kambren nielson","uela nifo",
  "michael o'brien","jacoby o'connell","esau ocrospoma","guadalupe ornelas","kearra orth",
  "trevor patten","zavian pelayo","emily pena-gil","bradley perkins","kevin perkins",
  "john petitta","chase pickett","ashley pliler","alishia proctor","joshua putnam",
  "angelica quezada","christine rallison","randy ramirez","yesenia ramirez","emily rasmussen",
  "gary rasmussen","haleigh rasmussen","sadie rasmussen","jaunette reyes","owen reynolds",
  "kelsie richardson","rosio rivera","franklin rizo","zach roberts","joseph rose",
  "kathryn sabersky","melissa salinas","eduardo sanchez","sara schafer","zackery schrenk",
  "gregory secrist","brayden shoemaker","tanner sillito","pablo silvaz","caleb smith",
  "ryan smith","teague smyer","nicholas snelson","matthew sommercorn","daniel spencer",
  "jade spencer","malibu sprinkle","mark stahmann","haylee stalions","kjell stamminger",
  "jill stellingwerf","brynne stenovich","evan stone","sterling strickland","james takacs",
  "trinidad talamantes","landon talbot","jack tanis","jacob telles","david ten",
  "mercedes tena","dorothy thaxton","amanda tilley","ashley tilley","rayce tohara",
  "rylee tomicic","jeremy toner","teeghan turner","nina twitchell","erick vega",
  "julie vosdoganis","dalton wallace","gavin welch","kyle whitchurch","audrey williams",
  "brandon williams","corbin williams","david williams","jesse williams","jessica wilson",
  "ashley wimmer","james wirthlin","craig wright","chase zundel",
]);

async function buildWaiverMap() {
  const allWaivers = await fetchAllWaivers();

  // Start with CSV baseline
  const map = {};
  for (const [key, val] of Object.entries(CSV_BASELINE)) {
    map[key] = { snow: val.snow, buck: val.buck };
  }

  // Track all unique signers from API (to detect guests)
  const apiSigners = new Map(); // key -> {firstName, lastName, snow, buck}

  for (const w of allWaivers) {
    const first = w.firstName.trim();
    const last  = w.lastName.trim();
    const key   = `${first} ${last}`.toLowerCase();
    if (!apiSigners.has(key)) apiSigners.set(key, { firstName: first, lastName: last, snow: 'none', buck: 'none' });
    const s = apiSigners.get(key);
    if (w.templateId === SNOWBASIN_TEMPLATE) s.snow = toStatus(w.verified);
    if (w.templateId === BUCKWILD_TEMPLATE)  s.buck = toStatus(w.verified);
    // Overlay into main map
    if (!map[key]) map[key] = { snow: 'none', buck: 'none' };
    if (w.templateId === SNOWBASIN_TEMPLATE) map[key].snow = toStatus(w.verified);
    if (w.templateId === BUCKWILD_TEMPLATE)  map[key].buck = toStatus(w.verified);
  }

  // Build guests list: signed waivers but not on party list
  const guests = [];
  for (const [key, s] of apiSigners) {
    if (!PARTY_KEYS.has(key)) {
      guests.push({ firstName: s.firstName, lastName: s.lastName, snow: s.snow, buck: s.buck });
    }
  }
  // Sort guests alphabetically by last name
  guests.sort((a, b) => a.lastName.localeCompare(b.lastName) || a.firstName.localeCompare(b.firstName));

  console.log(`[waivers] fetched ${allWaivers.length} records, ${Object.keys(map).length} unique, ${guests.length} guests`);
  return { map, guests };
}

// Cache: refresh every 3 minutes
let waiverCache = null;
let waiverCacheTime = 0;
const CACHE_TTL = 3 * 60 * 1000;

async function getWaivers() {
  if (waiverCache && Date.now() - waiverCacheTime < CACHE_TTL) return waiverCache;
  const result = await buildWaiverMap();
  waiverCache = result;
  waiverCacheTime = Date.now();
  return waiverCache;
}

// ── HTTP server ───────────────────────────────────────────────────────────────
const server = http.createServer(async (req, res) => {
  if (req.url === '/api/waivers') {
    try {
      const { map, guests } = await getWaivers();
      res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
      res.end(JSON.stringify({
        waivers: map,
        guests,
        updatedAt: new Date().toISOString(),
        source: SW_API_KEY ? 'live' : 'baseline',
      }));
    } catch (e) {
      console.error('[waivers] error:', e.message);
      res.writeHead(500); res.end('{}');
    }
    return;
  }

  const url = req.url === '/' ? '/index.html' : req.url.split('?')[0];
  const filePath = path.join(__dirname, 'public', url);
  const ext = path.extname(filePath);
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not found'); return; }
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  });
});

server.listen(PORT, () => console.log(`Party lookup running on port ${PORT}`));
