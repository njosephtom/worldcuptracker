#!/usr/bin/env node
// Fetches YouTube highlights for completed FIFA World Cup 2026 matches.
// Run by GitHub Actions every 6 hours (see .github/workflows/highlights-sync.yml).
//
// Strategy:
//   1. Read match-events.json — only finished matches appear there
//   2. For each finished match without a highlight, search TSN Sports channel on YouTube
//   3. Fall back to global YouTube search if TSN doesn't have it
//   4. Retry up to MAX_ATTEMPTS times (every 6h), then give up
//   5. Write results to public/match-highlights.json (served as static CDN asset)
//
// Quota: ~100 units per search. 10,000 units/day ≈ 100 searches.
// ~4 matches/day × 2 queries each = ~800 units/day — well within free tier.

'use strict';
const fs   = require('fs');
const path = require('path');

const YT_URL          = 'https://www.googleapis.com/youtube/v3';
const EVENTS_PATH     = path.join(__dirname, '../public/match-events.json');
const HIGHLIGHTS_PATH = path.join(__dirname, '../public/match-highlights.json');
const TSN_HANDLE      = 'TSN_Sports';
const MAX_ATTEMPTS    = 8;   // 8 × 6h = 48h of retrying before giving up
const MIN_RETRY_H     = 5.5; // skip if last attempt was < 5.5h ago

// YouTube title name mapping (same as frontend)
/** @type {Record<string,string>} */
const YT_NAME_MAP = {
  'Cape Verde':              'Cabo Verde',
  'United States':           'USA',
  'Bosnia and Herzegovina':  'Bosnia',
  'Ivory Coast':             "Cote d'Ivoire",
  'DR Congo':                'DR Congo',
};
/** @param {string} n @returns {string} */
function ytName(n) { return YT_NAME_MAP[n] || n; }

// All group-stage matches with team names
// Knockout IDs (72–103) are excluded: teams are TBD until bracket fills
/** @type {Array<{id:number,d:string,h:string,a:string}>} */
const MATCHES = [
  // Round 1 — must match IDs in src/data.js
  {id:1,  d:'2026-06-11', h:'Mexico',                   a:'South Africa'},
  {id:2,  d:'2026-06-11', h:'South Korea',               a:'Czechia'},
  {id:3,  d:'2026-06-12', h:'Canada',                    a:'Bosnia and Herzegovina'},
  {id:4,  d:'2026-06-12', h:'United States',             a:'Paraguay'},
  {id:5,  d:'2026-06-13', h:'Qatar',                     a:'Switzerland'},
  {id:6,  d:'2026-06-13', h:'Brazil',                    a:'Morocco'},
  {id:7,  d:'2026-06-13', h:'Haiti',                     a:'Scotland'},
  {id:8,  d:'2026-06-13', h:'Australia',                 a:'Turkey'},
  {id:9,  d:'2026-06-14', h:'Germany',                   a:'Curaçao'},
  {id:10, d:'2026-06-14', h:'Netherlands',               a:'Japan'},
  {id:11, d:'2026-06-14', h:'Ivory Coast',               a:'Ecuador'},
  {id:12, d:'2026-06-14', h:'Sweden',                    a:'Tunisia'},
  {id:13, d:'2026-06-15', h:'Spain',                     a:'Cape Verde'},
  {id:14, d:'2026-06-15', h:'Belgium',                   a:'Egypt'},
  {id:15, d:'2026-06-15', h:'Uruguay',                   a:'Saudi Arabia'},
  {id:16, d:'2026-06-15', h:'Iran',                      a:'New Zealand'},
  {id:17, d:'2026-06-16', h:'France',                    a:'Senegal'},
  {id:18, d:'2026-06-16', h:'Norway',                    a:'Iraq'},
  {id:19, d:'2026-06-16', h:'Argentina',                 a:'Algeria'},
  {id:20, d:'2026-06-16', h:'Austria',                   a:'Jordan'},
  {id:21, d:'2026-06-17', h:'Portugal',                  a:'DR Congo'},
  {id:22, d:'2026-06-17', h:'England',                   a:'Croatia'},
  {id:23, d:'2026-06-17', h:'Ghana',                     a:'Panama'},
  {id:24, d:'2026-06-17', h:'Uzbekistan',                a:'Colombia'},
  // Round 2
  {id:25, d:'2026-06-18', h:'Czechia',                   a:'South Africa'},
  {id:26, d:'2026-06-18', h:'Switzerland',               a:'Bosnia and Herzegovina'},
  {id:27, d:'2026-06-18', h:'Canada',                    a:'Qatar'},
  {id:28, d:'2026-06-18', h:'Mexico',                    a:'South Korea'},
  {id:29, d:'2026-06-19', h:'United States',             a:'Australia'},
  {id:30, d:'2026-06-19', h:'Scotland',                  a:'Morocco'},
  {id:31, d:'2026-06-19', h:'Brazil',                    a:'Haiti'},
  {id:32, d:'2026-06-19', h:'Turkey',                    a:'Paraguay'},
  {id:33, d:'2026-06-20', h:'Netherlands',               a:'Sweden'},
  {id:34, d:'2026-06-20', h:'Germany',                   a:'Ivory Coast'},
  {id:35, d:'2026-06-20', h:'Ecuador',                   a:'Curaçao'},
  {id:104,d:'2026-06-20', h:'Tunisia',                   a:'Japan'},
  {id:36, d:'2026-06-21', h:'Spain',                     a:'Saudi Arabia'},
  {id:37, d:'2026-06-21', h:'Belgium',                   a:'Iran'},
  {id:38, d:'2026-06-21', h:'Uruguay',                   a:'Cape Verde'},
  {id:39, d:'2026-06-21', h:'New Zealand',               a:'Egypt'},
  {id:40, d:'2026-06-22', h:'Argentina',                 a:'Austria'},
  {id:41, d:'2026-06-22', h:'France',                    a:'Iraq'},
  {id:42, d:'2026-06-22', h:'Norway',                    a:'Senegal'},
  {id:43, d:'2026-06-22', h:'Jordan',                    a:'Algeria'},
  {id:44, d:'2026-06-23', h:'Portugal',                  a:'Uzbekistan'},
  {id:45, d:'2026-06-23', h:'England',                   a:'Ghana'},
  {id:46, d:'2026-06-23', h:'Panama',                    a:'Croatia'},
  {id:47, d:'2026-06-23', h:'Colombia',                  a:'DR Congo'},
  // Round 3
  {id:48, d:'2026-06-24', h:'Bosnia and Herzegovina',    a:'Qatar'},
  {id:49, d:'2026-06-24', h:'Switzerland',               a:'Canada'},
  {id:50, d:'2026-06-24', h:'Morocco',                   a:'Haiti'},
  {id:51, d:'2026-06-24', h:'Scotland',                  a:'Brazil'},
  {id:52, d:'2026-06-24', h:'Czechia',                   a:'Mexico'},
  {id:53, d:'2026-06-24', h:'South Korea',               a:'South Africa'},
  {id:54, d:'2026-06-25', h:'Curaçao',                   a:'Ivory Coast'},
  {id:55, d:'2026-06-25', h:'Ecuador',                   a:'Germany'},
  {id:56, d:'2026-06-25', h:'Japan',                     a:'Sweden'},
  {id:57, d:'2026-06-25', h:'Tunisia',                   a:'Netherlands'},
  {id:58, d:'2026-06-25', h:'Paraguay',                  a:'Australia'},
  {id:59, d:'2026-06-25', h:'Turkey',                    a:'United States'},
  {id:60, d:'2026-06-26', h:'Norway',                    a:'France'},
  {id:61, d:'2026-06-26', h:'Iraq',                      a:'Senegal'},
  {id:62, d:'2026-06-26', h:'Cape Verde',                a:'Saudi Arabia'},
  {id:63, d:'2026-06-26', h:'Uruguay',                   a:'Spain'},
  {id:64, d:'2026-06-26', h:'Iran',                      a:'Egypt'},
  {id:65, d:'2026-06-26', h:'Belgium',                   a:'New Zealand'},
  {id:66, d:'2026-06-27', h:'Ghana',                     a:'Croatia'},
  {id:67, d:'2026-06-27', h:'Panama',                    a:'England'},
  {id:68, d:'2026-06-27', h:'Portugal',                  a:'Colombia'},
  {id:69, d:'2026-06-27', h:'Uzbekistan',                a:'DR Congo'},
  {id:70, d:'2026-06-27', h:'Austria',                   a:'Algeria'},
  {id:71, d:'2026-06-27', h:'Argentina',                 a:'Jordan'},
];

// ── Helpers ───────────────────────────────────────────────────────────────────

/** @param {string} msg */
function log(msg) { console.log(`[${new Date().toISOString().slice(11,19)}] ${msg}`); }

/** @returns {number} hours since isoDate */
function hoursSince(isoDate) {
  return (Date.now() - new Date(isoDate).getTime()) / 3_600_000;
}

/**
 * Score how well a YouTube title matches the expected match.
 * @param {string} title
 * @param {string} home
 * @param {string} away
 * @returns {number}
 */
function scoreTitle(title, home, away) {
  const t  = title.toLowerCase();
  const h  = ytName(home).toLowerCase();
  const a  = ytName(away).toLowerCase();
  let s = 0;
  if (t.includes(h))           s += 3;
  if (t.includes(a))           s += 3;
  if (t.includes('highlight')) s += 2;
  if (t.includes('full'))      s += 1;
  if (t.includes('world cup')) s += 2;
  if (t.includes('2026'))      s += 1;
  if (t.includes('best moments') || t.includes('matchday') || t.includes('gameplay')) s -= 4;
  return s;
}

// ── YouTube API ───────────────────────────────────────────────────────────────

let _tsnChannelId = null;   // cached for the process lifetime
let _quotaUsed    = 0;

/**
 * Resolve @TSN_Sports handle → channel ID once per run.
 * @param {string} apiKey
 * @returns {Promise<string>}
 */
async function resolveTSNChannelId(apiKey) {
  if (_tsnChannelId !== null) return _tsnChannelId;
  try {
    const url = `${YT_URL}/channels?part=id&forHandle=${TSN_HANDLE}&key=${apiKey}`;
    const res  = await fetch(url);
    const data = await res.json();
    _tsnChannelId = data?.items?.[0]?.id ?? '';
    _quotaUsed   += 1;
    log(`TSN channel ID: ${_tsnChannelId || '(not resolved)'}`);
  } catch (err) {
    log(`TSN resolve error: ${err.message}`);
    _tsnChannelId = '';
  }
  return _tsnChannelId;
}

/**
 * Search YouTube for a video. Returns the best-scoring item or null.
 * @param {string} apiKey
 * @param {string} q
 * @param {string} home
 * @param {string} away
 * @param {string} [channelId]
 * @param {string} [publishedAfter]  ISO date string
 * @returns {Promise<{videoId:string,title:string,thumbnail:string,channelTitle:string}|null>}
 */
async function ytSearch(apiKey, q, home, away, channelId, publishedAfter) {
  const params = new URLSearchParams({
    part: 'snippet',
    q,
    type: 'video',
    videoDuration: 'medium',  // 4–20 min — ideal for highlights, excludes 90-min replays
    maxResults: '5',
    order: 'relevance',
    key: apiKey,
  });
  if (channelId) params.set('channelId', channelId);
  // Only use publishedAfter for past dates — YouTube rejects future dates with 400
  if (publishedAfter && new Date(publishedAfter) < new Date()) {
    params.set('publishedAfter', `${publishedAfter}T00:00:00Z`);
  }

  const url = `${YT_URL}/search?${params}`;
  _quotaUsed += 100;

  try {
    const res  = await fetch(url);
    const data = await res.json();

    if (data?.error) {
      log(`  YT API error ${data.error.code}: ${data.error.message}`);
      return null;
    }

    /** @type {any[]|undefined} */
    const items = data?.items;
    if (!items?.length) return null;

    // Pick the highest-scoring result (both team names required)
    let best = null, bestScore = -1;
    for (const item of items) {
      const title = item.snippet?.title ?? '';
      const score = scoreTitle(title, home, away);
      if (score > bestScore) { bestScore = score; best = item; }
    }
    if (!best || bestScore < 6) return null;  // require both team names (3+3)

    const snip  = best.snippet;
    const thumb = snip.thumbnails?.maxres?.url
               || snip.thumbnails?.high?.url
               || snip.thumbnails?.medium?.url
               || '';
    return {
      videoId:      best.id.videoId,
      title:        snip.title,
      thumbnail:    thumb,
      channelTitle: snip.channelTitle ?? '',
    };
  } catch (err) {
    log(`  ytSearch fetch error: ${err.message}`);
    return null;
  }
}

/**
 * Try multiple queries (TSN first, then global) for a match's highlights.
 * @param {string} apiKey
 * @param {string} channelId
 * @param {string} home
 * @param {string} away
 * @param {string} matchDate   YYYY-MM-DD
 * @returns {Promise<{videoId:string,title:string,thumbnail:string,channelTitle:string,query:string}|null>}
 */
async function findHighlight(apiKey, channelId, home, away, matchDate) {
  const h  = ytName(home);
  const a  = ytName(away);
  const queries = [
    `${h} vs. ${a} Full Highlights | FIFA World Cup 2026`,
    `${h} vs ${a} highlights FIFA World Cup 2026`,
  ];

  for (const q of queries) {
    // Try TSN channel first
    if (channelId) {
      log(`  Search TSN: "${q}"`);
      const r = await ytSearch(apiKey, q, home, away, channelId, matchDate);
      if (r) return { ...r, query: `[TSN] ${q}` };
      await sleep(300);
    }
    // Fall back to global search
    log(`  Search global: "${q}"`);
    const r = await ytSearch(apiKey, q, home, away, undefined, matchDate);
    if (r) return { ...r, query: `[global] ${q}` };
    await sleep(300);
  }
  return null;
}

/** @param {number} ms */
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ── Main ───────────────────────────────────────────────────────────────────────

async function main() {
  const apiKey = process.env.REACT_APP_YOUTUBE_API_KEY || process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    console.error('ERROR: No YouTube API key. Set REACT_APP_YOUTUBE_API_KEY or YOUTUBE_API_KEY.');
    process.exit(1);
  }

  log('=== FIFA World Cup 2026 Highlights Sync ===');

  // Load finished match IDs from match-events.json (only finished matches appear there)
  /** @type {Set<number>} */
  const finishedIds = new Set();
  if (fs.existsSync(EVENTS_PATH)) {
    try {
      const eventsDB = JSON.parse(fs.readFileSync(EVENTS_PATH, 'utf8'));
      for (const key of Object.keys(eventsDB)) {
        const id = parseInt(key, 10);
        if (!isNaN(id)) finishedIds.add(id);
      }
    } catch (err) {
      log(`Warning: could not read match-events.json: ${err.message}`);
    }
  }
  log(`Finished matches detected: ${finishedIds.size}`);

  // Load existing highlights DB
  /** @type {Record<string,any>} */
  let db = {};
  if (fs.existsSync(HIGHLIGHTS_PATH)) {
    try { db = JSON.parse(fs.readFileSync(HIGHLIGHTS_PATH, 'utf8')); } catch {}
  }

  // Resolve TSN channel ID (costs 1 quota unit)
  const channelId = await resolveTSNChannelId(apiKey);

  const now = new Date().toISOString();
  let nFound = 0, nPending = 0, nSkipped = 0, nErrors = 0;

  for (const match of MATCHES) {
    const key = String(match.id);

    // Only process finished matches
    if (!finishedIds.has(match.id)) continue;

    /** @type {any} */
    const entry = db[key];

    // Skip matches that already have a highlight
    if (entry?.status === 'found' && entry.videoId) { nSkipped++; continue; }

    // Skip matches that gave up after max retries
    if (entry?.status === 'not-found') { nSkipped++; continue; }

    // Pending: throttle retries (wait MIN_RETRY_H hours between attempts)
    if (entry?.status === 'pending') {
      if (hoursSince(entry.lastAttemptAt) < MIN_RETRY_H) {
        log(`Match ${match.id} (${match.h} vs ${match.a}): too soon to retry`);
        nPending++;
        continue;
      }
      if ((entry.attempts ?? 0) >= MAX_ATTEMPTS) {
        log(`Match ${match.id}: giving up after ${entry.attempts} attempts`);
        db[key] = { ...entry, status: 'not-found', lastAttemptAt: now };
        continue;
      }
    }

    log(`\nMatch ${match.id}: ${match.h} vs ${match.a} (${match.d})`);
    const attempts = (entry?.attempts ?? 0) + 1;

    try {
      const result = await findHighlight(apiKey, channelId, match.h, match.a, match.d);

      if (result) {
        db[key] = {
          videoId:      result.videoId,
          title:        result.title,
          thumbnail:    result.thumbnail,
          channelTitle: result.channelTitle,
          status:       'found',
          fetchedAt:    entry?.fetchedAt ?? now,
          lastAttemptAt: now,
          attempts,
          searchQuery:  result.query,
        };
        log(`  ✓ Found: "${result.title}" (${result.videoId})`);
        nFound++;
      } else {
        db[key] = {
          ...entry,
          status:        'pending',
          fetchedAt:     entry?.fetchedAt ?? now,
          lastAttemptAt: now,
          attempts,
        };
        log(`  ✗ Not found (attempt ${attempts}/${MAX_ATTEMPTS})`);
        nPending++;
      }
    } catch (err) {
      log(`  ERROR: ${err.message}`);
      db[key] = {
        ...entry,
        status:        'pending',
        fetchedAt:     entry?.fetchedAt ?? now,
        lastAttemptAt: now,
        attempts,
        error:         err.message,
      };
      nErrors++;
    }

    // Be polite between matches
    await sleep(500);
  }

  // Write updated DB
  db._meta = {
    updatedAt:    now,
    totalFound:   Object.values(db).filter(e => e?.status === 'found').length,
    totalPending: Object.values(db).filter(e => e?.status === 'pending').length,
    quotaUsed:    _quotaUsed,
  };
  fs.writeFileSync(HIGHLIGHTS_PATH, JSON.stringify(db, null, 2) + '\n', 'utf8');

  log('\n=== Summary ===');
  log(`New highlights found : ${nFound}`);
  log(`Still pending        : ${nPending}`);
  log(`Skipped (done/gave up): ${nSkipped}`);
  log(`Errors               : ${nErrors}`);
  log(`Quota used this run  : ${_quotaUsed} units`);
  log(`Output → ${HIGHLIGHTS_PATH}`);
}

main().catch(err => { console.error(err); process.exit(1); });
