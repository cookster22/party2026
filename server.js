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
