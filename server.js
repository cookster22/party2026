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

// ── CSV baseline (all historical waivers before live API cutoff) ──────────────
// status: 'done' | 'pending' | 'none'
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

// Fetch all waivers for a given template from the API
function fetchWaivers(templateId) {
  return new Promise((resolve) => {
    if (!SW_API_KEY) return resolve([]);
    const url = `https://api.smartwaiver.com/v4/waivers?limit=100&templateId=${templateId}`;
    https.get(url, { headers: { 'sw-api-key': SW_API_KEY } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data).waivers || []); }
        catch { resolve([]); }
      });
    }).on('error', () => resolve([]));
  });
}

// Build live waiver map from API data, merging over CSV baseline
async function buildWaiverMap() {
  const [snowWaivers, buckWaivers] = await Promise.all([
    fetchWaivers(SNOWBASIN_TEMPLATE),
    fetchWaivers(BUCKWILD_TEMPLATE),
  ]);

  // Start with CSV baseline
  const map = {};
  for (const [key, val] of Object.entries(CSV_BASELINE)) {
    map[key] = { snow: val.snow, buck: val.buck };
  }

  // Overlay live API data (live wins)
  for (const w of snowWaivers) {
    const key = `${w.firstName} ${w.lastName}`.toLowerCase();
    if (!map[key]) map[key] = { snow: 'none', buck: 'none' };
    map[key].snow = w.verified ? 'done' : 'pending';
  }
  for (const w of buckWaivers) {
    const key = `${w.firstName} ${w.lastName}`.toLowerCase();
    if (!map[key]) map[key] = { snow: 'none', buck: 'none' };
    map[key].buck = w.verified ? 'done' : 'pending';
  }

  return map;
}

// Cache waivers for 2 minutes so we don't hammer the API
let waiverCache = null;
let waiverCacheTime = 0;
const CACHE_TTL = 2 * 60 * 1000;

async function getWaivers() {
  if (waiverCache && Date.now() - waiverCacheTime < CACHE_TTL) return waiverCache;
  waiverCache = await buildWaiverMap();
  waiverCacheTime = Date.now();
  return waiverCache;
}

// ── HTTP server ───────────────────────────────────────────────────────────────
const server = http.createServer(async (req, res) => {
  // API endpoint
  if (req.url === '/api/waivers') {
    try {
      const map = await getWaivers();
      res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
      res.end(JSON.stringify({ waivers: map, updatedAt: new Date().toISOString(), source: SW_API_KEY ? 'live' : 'baseline' }));
    } catch (e) {
      res.writeHead(500); res.end('{}');
    }
    return;
  }

  // Static files
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
