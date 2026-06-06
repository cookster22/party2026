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
  'aaron bruce': { snow: 'done', buck: 'done' },
  'abbie bown': { snow: 'done', buck: 'done' },
  'abigail larsen': { snow: 'done', buck: 'done' },
  'adeline m baker': { snow: 'done', buck: 'none' },
  'aidan erznoznik': { snow: 'done', buck: 'done' },
  'aidan kuhlman': { snow: 'pending', buck: 'pending' },
  'alejandro magana': { snow: 'done', buck: 'done' },
  'alex robb': { snow: 'pending', buck: 'done' },
  'alexia findlay': { snow: 'pending', buck: 'done' },
  'alexis gilliam': { snow: 'done', buck: 'done' },
  'alishia proctor': { snow: 'done', buck: 'done' },
  'allison barrilleaux': { snow: 'done', buck: 'done' },
  'allison garstka': { snow: 'done', buck: 'none' },
  'almin saracevic': { snow: 'done', buck: 'done' },
  'aly mcelhaney': { snow: 'done', buck: 'none' },
  'amanda tilley': { snow: 'done', buck: 'none' },
  'amber atkinson': { snow: 'done', buck: 'none' },
  'amelia chacon': { snow: 'done', buck: 'done' },
  'amy sillito': { snow: 'done', buck: 'done' },
  'andrew jensen': { snow: 'done', buck: 'done' },
  'angie burgess': { snow: 'done', buck: 'none' },
  'arlette juarez': { snow: 'done', buck: 'done' },
  'armando castillo': { snow: 'done', buck: 'done' },
  'ashley pliler': { snow: 'done', buck: 'none' },
  'austin bakker': { snow: 'done', buck: 'done' },
  'austin chugg': { snow: 'done', buck: 'done' },
  'avery giles': { snow: 'done', buck: 'done' },
  'belen jimenez de arechaga': { snow: 'done', buck: 'done' },
  'ben briten': { snow: 'pending', buck: 'none' },
  'benjamin briten': { snow: 'pending', buck: 'none' },
  'benjamin brusch': { snow: 'done', buck: 'done' },
  'benjamin smyer': { snow: 'done', buck: 'done' },
  'bentley glover': { snow: 'done', buck: 'done' },
  'bianca medrano': { snow: 'done', buck: 'done' },
  'brad perkins': { snow: 'done', buck: 'done' },
  'bradley perkins': { snow: 'done', buck: 'done' },
  'bradie dains': { snow: 'done', buck: 'done' },
  'brady lewis': { snow: 'done', buck: 'done' },
  'brayden shoemaker': { snow: 'done', buck: 'done' },
  'brennen davis': { snow: 'done', buck: 'done' },
  'brian garstka': { snow: 'done', buck: 'none' },
  'brooklyn kuhlman': { snow: 'pending', buck: 'pending' },
  'bryce nicoll': { snow: 'done', buck: 'none' },
  'brynne stenovich': { snow: 'done', buck: 'pending' },
  'caleb richardson': { snow: 'done', buck: 'done' },
  'caleb smith': { snow: 'done', buck: 'done' },
  'cameron clark': { snow: 'done', buck: 'done' },
  'carlee arthur': { snow: 'done', buck: 'none' },
  'carli fairchild': { snow: 'done', buck: 'done' },
  'carol vernaza': { snow: 'pending', buck: 'none' },
  'caroline gosar': { snow: 'done', buck: 'done' },
  'carson hoch': { snow: 'done', buck: 'done' },
  "casey o'connell": { snow: 'done', buck: 'done' },
  'celeste hatch': { snow: 'done', buck: 'done' },
  'cesar juarez': { snow: 'done', buck: 'done' },
  'chase pickett': { snow: 'done', buck: 'none' },
  'chase zundel': { snow: 'done', buck: 'none' },
  'cheyanne toner': { snow: 'done', buck: 'done' },
  'chip cook': { snow: 'done', buck: 'done' },
  'chloe bird': { snow: 'done', buck: 'done' },
  'christian luiten': { snow: 'done', buck: 'none' },
  'christian nielsen': { snow: 'pending', buck: 'pending' },
  'christine rallison': { snow: 'done', buck: 'done' },
  'christopher tamcke': { snow: 'done', buck: 'none' },
  'clayton bohon': { snow: 'pending', buck: 'done' },
  'colton griffith': { snow: 'done', buck: 'done' },
  'corbin williams': { snow: 'done', buck: 'done' },
  'cory jeffs': { snow: 'done', buck: 'done' },
  'craig wright': { snow: 'done', buck: 'done' },
  'creighton king': { snow: 'done', buck: 'pending' },
  'cristain gonzalez': { snow: 'pending', buck: 'none' },
  'crystian orozco': { snow: 'done', buck: 'none' },
  'daevon martinez': { snow: 'done', buck: 'done' },
  'dalton wallace': { snow: 'done', buck: 'done' },
  'daniel bjornn': { snow: 'done', buck: 'done' },
  'david cook': { snow: 'done', buck: 'none' },
  'david twitchell': { snow: 'pending', buck: 'none' },
  'david williams': { snow: 'done', buck: 'done' },
  'davis england': { snow: 'done', buck: 'done' },
  'dax edwards': { snow: 'none', buck: 'done' },
  'deavon martinez': { snow: 'pending', buck: 'pending' },
  'destiny nelson': { snow: 'done', buck: 'none' },
  'dixie mann': { snow: 'done', buck: 'done' },
  'dominique coon': { snow: 'done', buck: 'done' },
  'dustin barrilleaux': { snow: 'done', buck: 'done' },
  'dustin gutierrez': { snow: 'done', buck: 'done' },
  'dustin nielsen': { snow: 'done', buck: 'none' },
  'easton anderson': { snow: 'done', buck: 'none' },
  'edin dzindo': { snow: 'done', buck: 'done' },
  'eduardo sanchez': { snow: 'done', buck: 'done' },
  'efrain gutierrez': { snow: 'done', buck: 'none' },
  'elisha finlayson': { snow: 'done', buck: 'done' },
  'ella sharp': { snow: 'none', buck: 'done' },
  'emilee bakker': { snow: 'done', buck: 'done' },
  'emily pena': { snow: 'done', buck: 'none' },
  'emily pena-gil': { snow: 'done', buck: 'none' },
  'emily rasmussen': { snow: 'done', buck: 'done' },
  'emma jones': { snow: 'pending', buck: 'none' },
  'enna galarza': { snow: 'done', buck: 'done' },
  'erick vega': { snow: 'pending', buck: 'none' },
  'evan stone': { snow: 'done', buck: 'pending' },
  'fidel bravo': { snow: 'done', buck: 'none' },
  'gabriel cano': { snow: 'done', buck: 'done' },
  'gabrielle williams': { snow: 'done', buck: 'done' },
  'garret joiret': { snow: 'done', buck: 'done' },
  'gary rasmussen': { snow: 'done', buck: 'none' },
  'gavin morrow': { snow: 'pending', buck: 'pending' },
  'gavin welch': { snow: 'pending', buck: 'none' },
  'gilbert vega': { snow: 'done', buck: 'none' },
  'guadalupe ornelas': { snow: 'done', buck: 'done' },
  'guadalupe paz': { snow: 'done', buck: 'none' },
  'hagen hale': { snow: 'done', buck: 'done' },
  'haleigh rasmussen': { snow: 'done', buck: 'done' },
  'hanna kolsen': { snow: 'done', buck: 'none' },
  'harrison larsen': { snow: 'done', buck: 'done' },
  'hayden filetti': { snow: 'done', buck: 'done' },
  'heidi perkins': { snow: 'done', buck: 'none' },
  'houston ewing': { snow: 'done', buck: 'done' },
  'humberto chavez': { snow: 'done', buck: 'done' },
  'hunter breshears': { snow: 'done', buck: 'done' },
  'hunter oppe': { snow: 'pending', buck: 'pending' },
  'ian cuillard': { snow: 'done', buck: 'none' },
  'isela juarez': { snow: 'done', buck: 'done' },
  'ivan campos': { snow: 'pending', buck: 'pending' },
  'jack schemmel': { snow: 'done', buck: 'done' },
  'jack tanis': { snow: 'done', buck: 'done' },
  'jacob garner': { snow: 'done', buck: 'done' },
  'jacob malcom': { snow: 'done', buck: 'done' },
  "jacoby o'connell": { snow: 'done', buck: 'done' },
  'jade spencer': { snow: 'done', buck: 'done' },
  'jaden blacker': { snow: 'pending', buck: 'none' },
  'jaime alamillo': { snow: 'done', buck: 'done' },
  'jasmin fedaie': { snow: 'done', buck: 'done' },
  'jaunette reyes': { snow: 'done', buck: 'done' },
  'jeanne horton': { snow: 'done', buck: 'none' },
  'jenna blacker': { snow: 'done', buck: 'none' },
  'jennifer walls': { snow: 'done', buck: 'none' },
  'jenny salinas': { snow: 'done', buck: 'done' },
  'jeremy aragon': { snow: 'done', buck: 'done' },
  'jeremy conterio': { snow: 'done', buck: 'done' },
  'jeremy toner': { snow: 'done', buck: 'done' },
  'jesse williams': { snow: 'none', buck: 'pending' },
  'jessica wilson': { snow: 'done', buck: 'done' },
  'jesus rivera': { snow: 'done', buck: 'done' },
  'jill stellingwerf': { snow: 'done', buck: 'none' },
  'john essma': { snow: 'done', buck: 'none' },
  'jon brusch': { snow: 'pending', buck: 'pending' },
  'jonathan hernandez': { snow: 'done', buck: 'none' },
  'jonathan martinez': { snow: 'done', buck: 'none' },
  'jordan christensen': { snow: 'pending', buck: 'done' },
  'jordan knudsen': { snow: 'pending', buck: 'pending' },
  'jose calvillo': { snow: 'pending', buck: 'pending' },
  'joseph rose': { snow: 'done', buck: 'done' },
  'josh putnam': { snow: 'done', buck: 'done' },
  'joshua ferry': { snow: 'done', buck: 'done' },
  'joshua kuhn': { snow: 'done', buck: 'done' },
  'joshua putnam': { snow: 'done', buck: 'done' },
  'juan blancas': { snow: 'pending', buck: 'pending' },
  'julie anderson': { snow: 'done', buck: 'none' },
  'julissa martinez': { snow: 'done', buck: 'done' },
  'kaitlyn bushman': { snow: 'done', buck: 'none' },
  'kambren nielson': { snow: 'done', buck: 'done' },
  'kami millward': { snow: 'done', buck: 'none' },
  'katherine davidson': { snow: 'done', buck: 'none' },
  'kayla jensen': { snow: 'pending', buck: 'pending' },
  'kayla king': { snow: 'done', buck: 'done' },
  'kelsie richardson': { snow: 'done', buck: 'done' },
  'kendra christensen': { snow: 'none', buck: 'done' },
  'kendra lacy': { snow: 'done', buck: 'none' },
  'kendra molina-lacy': { snow: 'done', buck: 'none' },
  'kevin millward': { snow: 'done', buck: 'none' },
  'kevin perkins': { snow: 'done', buck: 'done' },
  'kiera mcguire': { snow: 'done', buck: 'done' },
  'kimra arnell': { snow: 'done', buck: 'done' },
  'kristen sullivan': { snow: 'done', buck: 'done' },
  'kyle boblett': { snow: 'done', buck: 'none' },
  'kyle whitchurch': { snow: 'done', buck: 'done' },
  'kylen conterio': { snow: 'done', buck: 'none' },
  'kylie conterio': { snow: 'done', buck: 'none' },
  'landon tilley': { snow: 'done', buck: 'none' },
  'lautaro colazo': { snow: 'done', buck: 'none' },
  'lexus chavez': { snow: 'done', buck: 'done' },
  'lilianah chavez': { snow: 'done', buck: 'none' },
  'lindsey broud': { snow: 'done', buck: 'none' },
  'lizbeth calvillo': { snow: 'pending', buck: 'pending' },
  'london mitchell': { snow: 'done', buck: 'none' },
  'lupe ornelas': { snow: 'done', buck: 'done' },
  'luis vasquez': { snow: 'done', buck: 'done' },
  'luke johnson': { snow: 'done', buck: 'none' },
  'lynnete thaxton': { snow: 'done', buck: 'done' },
  'madeline birtcher': { snow: 'done', buck: 'done' },
  'madison fink': { snow: 'done', buck: 'none' },
  'malia arnell': { snow: 'pending', buck: 'none' },
  'malibu sprinkle': { snow: 'done', buck: 'done' },
  'marc julian': { snow: 'done', buck: 'none' },
  'marisa breshears': { snow: 'done', buck: 'pending' },
  'marisa bruce': { snow: 'done', buck: 'none' },
  'marisol martinez': { snow: 'done', buck: 'none' },
  'markus mann': { snow: 'done', buck: 'done' },
  'matteo guerrieri': { snow: 'done', buck: 'done' },
  'matthew mahony': { snow: 'pending', buck: 'pending' },
  'matthew sommercorn': { snow: 'done', buck: 'done' },
  'mckenna wallace': { snow: 'done', buck: 'done' },
  'mckenzie newkirk': { snow: 'done', buck: 'done' },
  'megan tanis': { snow: 'done', buck: 'none' },
  'melissa salinas': { snow: 'done', buck: 'none' },
  'mia juarez': { snow: 'done', buck: 'done' },
  'michael brizuela': { snow: 'done', buck: 'done' },
  "michael o'brien": { snow: 'pending', buck: 'pending' },
  'michaela goyen': { snow: 'done', buck: 'done' },
  'misty mckenzie': { snow: 'done', buck: 'done' },
  'natalie bodily': { snow: 'done', buck: 'done' },
  'natassja grossman': { snow: 'done', buck: 'none' },
  'nate kirk': { snow: 'pending', buck: 'none' },
  'nate leishman': { snow: 'done', buck: 'done' },
  'nathaniel kirk': { snow: 'pending', buck: 'none' },
  'nathaniel leishman': { snow: 'done', buck: 'done' },
  'nermin bektic': { snow: 'done', buck: 'done' },
  'nicholas davidson': { snow: 'pending', buck: 'none' },
  'nicholis egbert': { snow: 'done', buck: 'done' },
  'nick snelson': { snow: 'done', buck: 'none' },
  'nicholas snelson': { snow: 'done', buck: 'none' },
  'nicole best': { snow: 'pending', buck: 'none' },
  'nina twitchell': { snow: 'done', buck: 'none' },
  'noah kumrow': { snow: 'done', buck: 'done' },
  'olivia jones': { snow: 'pending', buck: 'done' },
  'owen larson': { snow: 'done', buck: 'done' },
  'paytan fairchild': { snow: 'done', buck: 'done' },
  'persephone bohon': { snow: 'done', buck: 'done' },
  'plamedie tshibanda': { snow: 'pending', buck: 'done' },
  'presley pickett': { snow: 'done', buck: 'none' },
  'preston mcpheters': { snow: 'done', buck: 'done' },
  'rachel davis': { snow: 'done', buck: 'done' },
  'raquel juarez': { snow: 'done', buck: 'done' },
  'rayce tohara': { snow: 'pending', buck: 'pending' },
  'rebecca graham': { snow: 'done', buck: 'none' },
  'reed arthur': { snow: 'done', buck: 'none' },
  'ridge dains': { snow: 'done', buck: 'done' },
  'robert spencer': { snow: 'done', buck: 'none' },
  'rosio rivera': { snow: 'done', buck: 'done' },
  'ryan horton': { snow: 'done', buck: 'none' },
  'ryan madsen': { snow: 'done', buck: 'done' },
  'rylee tomicic': { snow: 'done', buck: 'none' },
  'rylie cuillard': { snow: 'pending', buck: 'none' },
  'sadie rasmussen': { snow: 'done', buck: 'done' },
  'samuel corbett': { snow: 'pending', buck: 'pending' },
  'sara schafer': { snow: 'done', buck: 'none' },
  'sarah cook': { snow: 'pending', buck: 'none' },
  'schylar mills': { snow: 'done', buck: 'done' },
  'seth mcguire': { snow: 'done', buck: 'done' },
  'shane ball': { snow: 'done', buck: 'done' },
  'shannon garner': { snow: 'done', buck: 'done' },
  'shantel bjornn': { snow: 'done', buck: 'none' },
  'sidney smyer': { snow: 'done', buck: 'done' },
  'sidney snow': { snow: 'done', buck: 'done' },
  'spencer watkins': { snow: 'done', buck: 'none' },
  'sydney england': { snow: 'done', buck: 'done' },
  'talynna lewis': { snow: 'done', buck: 'none' },
  'tamara garcia': { snow: 'done', buck: 'done' },
  'tana hoch': { snow: 'done', buck: 'none' },
  'tanner bodily': { snow: 'done', buck: 'done' },
  'tanner sillito': { snow: 'done', buck: 'done' },
  'taylour hanson': { snow: 'done', buck: 'none' },
  'teeghan turner': { snow: 'done', buck: 'done' },
  'tracey thaxton': { snow: 'done', buck: 'done' },
  'trevor durfey': { snow: 'done', buck: 'none' },
  'trevor gosar': { snow: 'done', buck: 'done' },
  'trey pizzi': { snow: 'done', buck: 'none' },
  'ty denning': { snow: 'done', buck: 'done' },
  'ukiah tyree': { snow: 'done', buck: 'pending' },
  'valeria venegas': { snow: 'done', buck: 'done' },
  'vanessa mercado': { snow: 'done', buck: 'done' },
  'veronica campos': { snow: 'pending', buck: 'pending' },
  'victoria stark': { snow: 'done', buck: 'none' },
  'yadira castillo': { snow: 'done', buck: 'none' },
  'yesenia juarez': { snow: 'done', buck: 'done' },
  'yesenia ramirez': { snow: 'done', buck: 'none' },
  'zach baker': { snow: 'done', buck: 'none' },
  'zach martin': { snow: 'done', buck: 'done' },
  'zachary martin': { snow: 'done', buck: 'done' },
  'zackery schrenk': { snow: 'done', buck: 'none' },
  'zavian pelayo': { snow: 'pending', buck: 'pending' },
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

// ── Check-in system ──────────────────────────────────────────────────────────
const ADMIN_PASSWORD = 'party';
const ADMIN_TOKEN    = 'le-party-2026';
const DATA_DIR       = process.env.DATA_DIR || __dirname;
const CHECKIN_FILE   = path.join(DATA_DIR, 'checkin_state.json');

// Master guest list seeded from RSVP CSV
const GUEST_LIST = [
  {name:"Gianfranco Aciego",email:"gianfranco.aciego@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Ethan Aguinaga",email:"ethan.aguinaga@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Jaime Alamillo",email:"jaime.alamillo@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Aaron Albrechtsen",email:"aaron.albrechtsen@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Burke Alder",email:"burke.alder@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Easton Anderson",email:"easton.anderson@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Julie Anderson",email:"julie.anderson@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Rhett Anderson",email:"rhett.anderson@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Dallas Andrade",email:"dallas.andrade@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Brenda Arambula",email:"brenda.arambula@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Carlee Arthur",email:"carlee.hellstrom@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Zach Baker",email:"zach.baker@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Austin Bakker",email:"austin.bakker@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Shane Ball",email:"shane.ball@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Dustin Barrilleaux",email:"dustin.barrilleaux@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Nermin Bektic",email:"nermin.bektic@leaseend.com",vip:false,plusoneRsvp:false},
  {name:"Madeline Birtcher",email:"madeline.birtcher@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Daniel Bjornn",email:"dan.bjornn@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Jaden Blacker",email:"jaden.blacker@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Jenna Blacker",email:"jenna.blacker@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Kyle Boblett",email:"kyle.boblett@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Tanner Bodily",email:"tanner.bodily@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Persephone Bohon",email:"percy.monson@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Michael Bradshaw",email:"michael.bradshaw@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Fidel Bravo",email:"fidel.bravo@leaseend.com",vip:false,plusoneRsvp:false},
  {name:"Hunter Breshears",email:"hunter.breshears@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Benjamin Briten",email:"ben.briten@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Adam Broud",email:"adam.broud@leaseend.com",vip:false,plusoneRsvp:false},
  {name:"Lindsey Broud",email:"lindsey.broud@leaseend.com",vip:false,plusoneRsvp:false},
  {name:"Marisa Bruce",email:"marisa.bruce@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Jon Brusch",email:"jon.brusch@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Katelyn Call",email:"katelyn.call@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Lizbeth Calvillo",email:"lizbeth.calvillo@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Veronica Campos",email:"veronica.campos@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Gabriel Cano",email:"gabriel.cano@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Yadira Castillo",email:"yadira.castillo@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Amelia Chacon",email:"amelia.chacon@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Lexus Chavez",email:"lexus.salinas@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Lilianah Chavez",email:"lily.chavez@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Easton Christiansen",email:"easton.christiansen@leaseend.com",vip:false,plusoneRsvp:false},
  {name:"Kellen Christiansen",email:"kellen.christiansen@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Austin Chugg",email:"austin.chugg@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Cameron Clark",email:"cameron.clark@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Lautaro Colazo",email:"lautaro.colazo@leaseend.com",vip:false,plusoneRsvp:false},
  {name:"Jeremy Conterio",email:"jeremy.conterio@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Kylen Conterio",email:"kylie.conterio@leaseend.com",vip:false,plusoneRsvp:false},
  {name:"David Cook",email:"david.cook@leaseend.com",vip:true,plusoneRsvp:true},
  {name:"Chip Cook",email:"chip.cook@leaseend.com",vip:true,plusoneRsvp:true},
  {name:"Matt Cook",email:"mattcook@goodemotor.com",vip:true,plusoneRsvp:true},
  {name:"Zander Cook",email:"zander@leaseend.com",vip:true,plusoneRsvp:true},
  {name:"Dominique Coon",email:"dominique.coon@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Frank Corbett",email:"frank.corbett@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Samuel Corbett",email:"samuel.corbett@leaseend.com",vip:false,plusoneRsvp:false},
  {name:"Joshua Cruz",email:"joshua.cruz@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Ian Cuillard",email:"ian.cuillard@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Bradie Dains",email:"bradie.olsen@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Katherine Davidson",email:"katie.davidson@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Brennen Davis",email:"brennen.davis@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Evan Davis",email:"evan.davis@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Malia Davis",email:"malia.davis@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Edin Dzindo",email:"edin.dzindo@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"William Edwards",email:"dax.edwards@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Nicholis Egbert",email:"nicholis.egbert@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Davis England",email:"davis.england@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Houston Ewing",email:"houston.ewing@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Carli Fairchild",email:"carli.fairchild@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Paytan Fairchild",email:"paytan.fairchild@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Jasmin Fedaie",email:"jasmin.fedaie@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Joshua Ferry",email:"joshua.ferry@leaseend.com",vip:false,plusoneRsvp:false},
  {name:"Nicholas Filetti",email:"hayden.filetti@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Kyle Fowers",email:"kyle.fowers@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Saran Garcia",email:"saran.garcia@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Jacob Garner",email:"jacob.garner@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Brian Garstka",email:"brian.garstka@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Avery Giles",email:"avery.giles@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Alexis Gilliam",email:"alexis.gilliam@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Bentley Glover",email:"bentley.glover@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Trevor Gosar",email:"trevor.gosar@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Rebecca Graham",email:"rebecca.graham@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Laci Greene",email:"laci.greene@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Colton Griffith",email:"colton.griffith@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Natassja Grossman",email:"natassja.grossman@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Matteo Guerrieri",email:"matteo.guerrieri@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Leigha Gutierrez",email:"leigha.gutierrez@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Vanessa Gutierrez",email:"vanessa.rizo@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Taylour Hanson",email:"taylour.hanson@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Dallin Hatch",email:"dallin.hatch@leaseend.com",vip:false,plusoneRsvp:false},
  {name:"Jonathan Hernandez",email:"jonathan.hernandez@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Carson Hoch",email:"carson.hoch@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Rylie Hockenbury",email:"rylie.hockenbury@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Ryan Horton",email:"ryan.horton@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Andy Huerta",email:"andy.huerta@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Diego Ibarra",email:"diego.ibarra@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Parker Jackson",email:"parker.jackson@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Samuel Jaggi",email:"samuel.jaggi@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Cory Jeffs",email:"cory.jeffs@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Andrew Jensen",email:"andrew.jensen@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Kayla Jensen",email:"kayla.jensen@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Nathan Jensen",email:"nate.jensen@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Garret Joiret",email:"garret.joiret@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Olivia Jones",email:"olivia.jones@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Arlette Juarez",email:"arlette.juarez@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Cesar Juarez",email:"cesar.juarez@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Felisha Juarez",email:"felisha.aguinaga@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Isela Juarez",email:"isela.juarez@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Raquel Juarez",email:"raquel.juarez@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Yesenia Juarez",email:"yesenia.juarez@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Ryan Kesler",email:"ryan.kelser@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Mobina Khazei",email:"mobina.khazei@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Creighton King",email:"creighton.king@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Nathaniel Kirk",email:"nathan.kirk@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Jordan Knudsen",email:"jordan.knudsen@leaseend.com",vip:false,plusoneRsvp:false},
  {name:"Hanna Kolsen",email:"hanna.kolsen@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Aidan Kuhlman",email:"aidan.kuhlman@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Joshua Kuhn",email:"joshua.kuhn@leaseend.com",vip:false,plusoneRsvp:false},
  {name:"Harrison Larsen",email:"harrison.larsen@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Owen Larson",email:"owen.larson@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Kira Laub",email:"kira.laub@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Nathaniel Leishman",email:"nathaniel.leishman@leaseend.com",vip:false,plusoneRsvp:false},
  {name:"Devin Lethbridge",email:"devin.lethbridge@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Brady Lewis",email:"brady.lewis@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Caleb Loveland",email:"caleb.loveland@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Christian Luiten",email:"christian.luiten@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Ryan Madsen",email:"ryan.madsen@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Matthew Mahony",email:"matthew.mahony@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Aliya Maldonado",email:"aliya.maldonado@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Dixie Mann",email:"dixie.mann@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Zachary Martin",email:"zach.martin@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Jonathan Martinez",email:"jonathan.martinez@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Julissa Martinez",email:"julissa.martinez@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Katelyn Mayner",email:"katelyn.mayner@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Kiera Mcguire",email:"kiera.mcguire@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Misty McKenzie",email:"misty.mckenzie@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Preston McPheters",email:"preston.mcpheters@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"RoAnne Mediati",email:"roanne.mediati@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Jacob Meiners",email:"jake.meiners@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Vanessa Mercado",email:"vanessa.mercado@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Schylar Mills",email:"schylar.mills@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Kevin Millward",email:"kevin.millward@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Jera Mitchell",email:"jera.mitchell@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"London Mitchell",email:"london.mitchell@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Kendra Molina-Lacy",email:"kendra.molina-lacy@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Destiny Nelson",email:"destiny.nelson@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Bryce Nicoll",email:"bryce.nicoll@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Christian Nielsen",email:"christian.nielsen@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Dustin Nielsen",email:"dustin.nielsen@leaseend.com",vip:false,plusoneRsvp:false},
  {name:"Kambren Nielson",email:"kambren.nielson@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Uela Nifo",email:"uela.nifo@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Michael O'Brien",email:"michael.obrien@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Jacoby O'Connell",email:"jacoby.oconnell@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Esau Ocrospoma",email:"esau.ocrospoma@leaseend.com",vip:false,plusoneRsvp:false},
  {name:"Guadalupe Ornelas",email:"guadalupe.ornelas@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Kearra Orth",email:"kearra.orth@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Trevor Patten",email:"trevor.patten@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Zavian Pelayo",email:"zavian.pelayo@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Emily Pena-Gil",email:"emily.pena@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Bradley Perkins",email:"brad.perkins@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Kevin Perkins",email:"kevin.perkins@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"John Petitta",email:"mckay.petitta@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Chase Pickett",email:"chase.pickett@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Ashley Pliler",email:"ashley.pliler@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Alishia Proctor",email:"alishia.proctor@leaseend.com",vip:false,plusoneRsvp:false},
  {name:"Joshua Putnam",email:"josh.putnam@leaseend.com",vip:false,plusoneRsvp:false},
  {name:"Angelica Quezada",email:"angelica.quezada@leaseend.com",vip:false,plusoneRsvp:false},
  {name:"Christine Rallison",email:"christine.rallison@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Randy Ramirez",email:"randy.ramirez@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Yesenia Ramirez",email:"yesenia.ramirez@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Emily Rasmussen",email:"emily.rasmussen@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Gary Rasmussen",email:"gary.rasmussen@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Haleigh Rasmussen",email:"haleigh.rasmussen@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Sadie Rasmussen",email:"sadie.rasmussen@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Jaunette Reyes",email:"jaunette.martinez-barajas@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Owen Reynolds",email:"owen.reynolds@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Kelsie Richardson",email:"kelsie.pope@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Rosio Rivera",email:"rosie.ramirez@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Franklin Rizo",email:"franklin.rizo@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Zach Roberts",email:"zachery.roberts@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Joseph Rose",email:"joe.rose@leaseend.com",vip:false,plusoneRsvp:false},
  {name:"Kathryn Sabersky",email:"kvrs@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Melissa Salinas",email:"melissa.salinas@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Eduardo Sanchez",email:"eduardo.sanchez@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Sara Schafer",email:"sara.schafer@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Zackery Schrenk",email:"zackery.schrenk@leaseend.com",vip:false,plusoneRsvp:false},
  {name:"Gregory Secrist",email:"gregory.secrist@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Brayden Shoemaker",email:"brayden.shoemaker@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Tanner Sillito",email:"tanner.sillito@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Pablo Silvaz",email:"pablo.silvaz@goodemotor.com",vip:false,plusoneRsvp:true},
  {name:"Caleb Smith",email:"caleb.smith@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Ryan Smith",email:"boomer.smith@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Benjamin Smyer",email:"teague.smyer@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Nicholas Snelson",email:"nick.snelson@leaseend.com",vip:false,plusoneRsvp:false},
  {name:"Matthew Sommercorn",email:"matthew.sommercorn@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Daniel Spencer",email:"daniel.spencer@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Jade Spencer",email:"jade.spencer@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Malibu Sprinkle",email:"malibu.sprinkle@leaseend.com",vip:false,plusoneRsvp:false},
  {name:"Mark Stahmann",email:"mark.stahmann@leaseend.com",vip:false,plusoneRsvp:false},
  {name:"Haylee Stalions",email:"haylee.stalions@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Kjell Stamminger",email:"kjell.stamminger@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Jill Stellingwerf",email:"jill.stellingwerf@leaseend.com",vip:false,plusoneRsvp:false},
  {name:"Brynne Stenovich",email:"brynne.stenovich@leaseend.com",vip:false,plusoneRsvp:false},
  {name:"Evan Stone",email:"evan.stone@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Sterling Strickland",email:"sterling.strickland@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"James Takacs",email:"james.takacs@leaseend.com",vip:false,plusoneRsvp:false},
  {name:"Landon Talbot",email:"landon.talbot@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Jack Tanis",email:"jack.tanis@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Jacob Telles",email:"jacob.telles@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"David Ten",email:"david.ten@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Mercedes Tena",email:"mercedes.tena@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Lynnete Thaxton",email:"lynnete.thaxton@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Amanda Tilley",email:"amanda.tilley@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Ashley Tilley",email:"ashley.tilley@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Rayce Tohara",email:"rayce.tohara@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Rylee Tomicic",email:"rylee.pizzi@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Jeremy Toner",email:"jeremy@leaseend.com",vip:true,plusoneRsvp:true},
  {name:"Teeghan Turner",email:"teeghan.turner@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Nina Twitchell",email:"nina.twitchell@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Erick Vega",email:"erick.vega@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Julie Vosdoganis",email:"julie.vosdoganis@leaseend.com",vip:false,plusoneRsvp:false},
  {name:"Dalton Wallace",email:"dalton.wallace@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Gavin Welch",email:"gavin.welch@leaseend.com",vip:false,plusoneRsvp:false},
  {name:"Kyle Whitchurch",email:"kyle.whitchurch@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Audrey Williams",email:"audreyannawilliams@gmail.com",vip:false,plusoneRsvp:true},
  {name:"Brandon Williams",email:"bw@leaseend.com",vip:true,plusoneRsvp:true},
  {name:"Corbin Williams",email:"corbin@leaseend.com",vip:false,plusoneRsvp:false},
  {name:"David Williams",email:"dave@leaseend.com",vip:true,plusoneRsvp:true},
  {name:"Garth Williams",email:"garth@goodemotor.com",vip:true,plusoneRsvp:true},
  {name:"Jesse Williams",email:"jesse.williams@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Jessica Wilson",email:"jessica.wilson@leaseend.com",vip:false,plusoneRsvp:false},
  {name:"Ashley Wimmer",email:"ashley.wimmer@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"James Wirthlin",email:"james.wirthlin@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Craig Wright",email:"craig.wright@leaseend.com",vip:false,plusoneRsvp:true},
  {name:"Chase Zundel",email:"chase.zundel@leaseend.com",vip:false,plusoneRsvp:false},
  // Sponsors / Partners
  {name:"Tia Lyons",email:"tia.lyons@pnc.com",vip:false,plusoneRsvp:true,sponsor:true,sponsorOrg:"PNC Bank"},
  {name:"Steve Sain",email:"steve.sain@ally.com",vip:false,plusoneRsvp:true,sponsor:true,sponsorOrg:"Ally Bank"},
  {name:"Gregory Kropidlowski",email:"gregory.kropidlowski@td.com",vip:false,plusoneRsvp:true,sponsor:true,sponsorOrg:"TD Bank"},
  {name:"Jaclyn Goddard",email:"jaclyng@consumerportfolio.com",vip:false,plusoneRsvp:true,sponsor:true,sponsorOrg:"CPS"},
  {name:"Autumn McClain",email:"autumn.mcclain@capitalone.com",vip:false,plusoneRsvp:true,sponsor:true,sponsorOrg:"Capital One"},
];

// In-memory state: { [email]: { name, checkedIn, checkedInAt, plusOne, method } }
let checkInState = {};
try { checkInState = JSON.parse(fs.readFileSync(CHECKIN_FILE, 'utf8')); } catch(e) {}

// Seed any guests not yet in state
GUEST_LIST.forEach(g => {
  const key = g.email.toLowerCase();
  if (!checkInState[key]) {
    checkInState[key] = { name: g.name, email: key, vip: g.vip, plusoneRsvp: g.plusoneRsvp, sponsor: g.sponsor || false, sponsorOrg: g.sponsorOrg || null, checkedIn: false, checkedInAt: null, plusOne: false, method: null };
  }
});

// Auto-save every 10 seconds
setInterval(() => {
  fs.writeFile(CHECKIN_FILE, JSON.stringify(checkInState), () => {});
}, 10000);

function saveNow() {
  fs.writeFileSync(CHECKIN_FILE, JSON.stringify(checkInState));
}

function isAdmin(req) {
  return req.headers['x-admin-token'] === ADMIN_TOKEN;
}

function readBody(req) {
  return new Promise(resolve => {
    let body = '';
    req.on('data', c => body += c);
    req.on('end', () => { try { resolve(JSON.parse(body)); } catch { resolve({}); } });
  });
}

function json(res, data, status = 200) {
  res.writeHead(status, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
  res.end(JSON.stringify(data));
}

// ── HTTP server ───────────────────────────────────────────────────────────────
const server = http.createServer(async (req, res) => {
  const urlObj = new URL(req.url, `http://localhost`);
  const pathname = urlObj.pathname;

  // CORS preflight
  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

  // ── Admin auth ──
  if (pathname === '/api/auth' && req.method === 'POST') {
    const body = await readBody(req);
    if (body.password === ADMIN_PASSWORD) {
      return json(res, { token: ADMIN_TOKEN });
    }
    return json(res, { error: 'Wrong password' }, 401);
  }

  // ── Self check-in (public) ──
  if (pathname === '/api/self-checkin' && req.method === 'POST') {
    const { email } = await readBody(req);
    const key = (email || '').trim().toLowerCase();
    if (!key) return json(res, { error: 'Email required' }, 400);
    const existing = checkInState[key];
    if (!existing) return json(res, { error: 'not_found' }, 404);
    if (existing.checkedIn) return json(res, { already: true, name: existing.name });
    existing.checkedIn = true;
    existing.checkedInAt = new Date().toISOString();
    existing.method = 'self';
    saveNow();
    return json(res, { success: true, name: existing.name, vip: existing.vip });
  }

  // ── Get all guests + status (admin) ──
  if (pathname === '/api/guests' && req.method === 'GET') {
    if (!isAdmin(req)) return json(res, { error: 'Unauthorized' }, 401);
    return json(res, { guests: Object.values(checkInState) });
  }

  // ── Manual check-in (admin) ──
  if (pathname === '/api/checkin' && req.method === 'POST') {
    if (!isAdmin(req)) return json(res, { error: 'Unauthorized' }, 401);
    const { email, value } = await readBody(req);
    const key = (email || '').trim().toLowerCase();
    if (!checkInState[key]) return json(res, { error: 'not_found' }, 404);
    checkInState[key].checkedIn = value !== false;
    checkInState[key].checkedInAt = value !== false ? new Date().toISOString() : null;
    checkInState[key].method = 'manual';
    saveNow();
    return json(res, { success: true });
  }

  // ── Toggle plus-one (admin) ──
  if (pathname === '/api/plusone' && req.method === 'POST') {
    if (!isAdmin(req)) return json(res, { error: 'Unauthorized' }, 401);
    const { email, value } = await readBody(req);
    const key = (email || '').trim().toLowerCase();
    if (!checkInState[key]) return json(res, { error: 'not_found' }, 404);
    checkInState[key].plusOne = value === true;
    saveNow();
    return json(res, { success: true });
  }

  // ── Add walk-in attendee (admin) ──
  if (pathname === '/api/add-guest' && req.method === 'POST') {
    if (!isAdmin(req)) return json(res, { error: 'Unauthorized' }, 401);
    const { firstName, lastName, email } = await readBody(req);
    if (!firstName || !lastName) return json(res, { error: 'Name required' }, 400);
    const name = `${firstName.trim()} ${lastName.trim()}`;
    const key  = (email || '').trim().toLowerCase() || `walkin-${Date.now()}@party.local`;
    if (checkInState[key]) {
      // Already exists — just check them in
      checkInState[key].checkedIn = true;
      checkInState[key].checkedInAt = new Date().toISOString();
      checkInState[key].method = 'walkin';
      saveNow();
      return json(res, { success: true, name: checkInState[key].name, email: key, alreadyExisted: true });
    }
    checkInState[key] = {
      name, email: key, vip: false, plusoneRsvp: false,
      checkedIn: true, checkedInAt: new Date().toISOString(),
      plusOne: false, method: 'walkin', walkin: true,
    };
    saveNow();
    return json(res, { success: true, name, email: key });
  }

  // ── Self-service plus-one (after self check-in) ──
  if (pathname === '/api/self-plusone' && req.method === 'POST') {
    const { email, value } = await readBody(req);
    const key = (email || '').trim().toLowerCase();
    if (!checkInState[key]) return json(res, { error: 'not_found' }, 404);
    checkInState[key].plusOne = value === true;
    saveNow();
    return json(res, { success: true });
  }

  // ── Stats (admin) ──
  if (pathname === '/api/stats' && req.method === 'GET') {
    if (!isAdmin(req)) return json(res, { error: 'Unauthorized' }, 401);
    const all = Object.values(checkInState);
    const checkedIn = all.filter(g => g.checkedIn).length;
    const plusOnes  = all.filter(g => g.checkedIn && g.plusOne).length;
    return json(res, {
      total: all.length,
      checkedIn,
      remaining: all.length - checkedIn,
      plusOnes,
      totalBodies: checkedIn + plusOnes,
    });
  }

  // ── Export CSV (admin) ──
  if (pathname === '/api/export' && req.method === 'GET') {
    const qToken = urlObj.searchParams.get('token');
    if (!isAdmin(req) && qToken !== ADMIN_TOKEN) return json(res, { error: 'Unauthorized' }, 401);
    const rows = ['Name,Email,VIP,Checked In,Plus One,Time,Method'];
    Object.values(checkInState).sort((a,b) => a.name.localeCompare(b.name)).forEach(g => {
      const t = g.checkedInAt ? new Date(g.checkedInAt).toLocaleTimeString('en-US') : '';
      rows.push(`"${g.name}","${g.email}",${g.vip},${g.checkedIn},${g.plusOne},"${t}","${g.method||''}"`);
    });
    res.writeHead(200, {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="checkins.csv"',
    });
    return res.end(rows.join('\n'));
  }

  if (pathname === '/api/waivers') {
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
