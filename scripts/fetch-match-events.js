#!/usr/bin/env node
// Fetches finished match events from ESPN and updates public/match-events.json
// Run by GitHub Actions every 30 minutes during the tournament.

'use strict';
const fs   = require('fs');
const path = require('path');

const ESPN_URL = 'https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard';
const OUT_PATH = path.join(__dirname, '../public/match-events.json');

// Map ESPN display names → our MATCHES team names
const ESPN_NAME_MAP = {
  'Czech Republic': 'Czechia',
  'Bosnia-Herzegovina': 'Bosnia and Herzegovina',
  "Cote d'Ivoire": 'Ivory Coast',
  "Côte D'Ivoire": 'Ivory Coast',
  "Côte d'Ivoire": 'Ivory Coast',
  'Korea Republic': 'South Korea',
  'Republic of Korea': 'South Korea',
  'IR Iran': 'Iran',
  'Türkiye': 'Turkey',
  'Curacao': 'Curaçao',
  'Congo DR': 'DR Congo',
  'Democratic Republic of the Congo': 'DR Congo',
  'Cabo Verde': 'Cape Verde',
  'USA': 'United States',
};

function norm(name) { return ESPN_NAME_MAP[name] || name; }

// Node fetch already decodes UTF-8 correctly — pass through unchanged
function fixEnc(s) { return s || s; }

// All group-stage matches — id, date (ET), home, away
// Updated from ESPN schedule — must stay in sync with src/data.js MATCHES
const MATCHES = [
  {id:1,  d:'2026-06-11', h:'Mexico',                   a:'South Africa'},
  {id:2,  d:'2026-06-11', h:'South Korea',               a:'Czechia'},
  {id:3,  d:'2026-06-12', h:'Canada',                    a:'Bosnia and Herzegovina'},
  {id:4,  d:'2026-06-12', h:'United States',             a:'Paraguay'},
  {id:5,  d:'2026-06-13', h:'Qatar',                     a:'Switzerland'},
  {id:6,  d:'2026-06-13', h:'Brazil',                    a:'Morocco'},
  {id:7,  d:'2026-06-13', h:'Haiti',                     a:'Scotland'},
  {id:8,  d:'2026-06-14', h:'Australia',                 a:'Turkey'},
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
  {id:20, d:'2026-06-17', h:'Austria',                   a:'Jordan'},
  {id:21, d:'2026-06-17', h:'Portugal',                  a:'DR Congo'},
  {id:22, d:'2026-06-17', h:'England',                   a:'Croatia'},
  {id:23, d:'2026-06-17', h:'Ghana',                     a:'Panama'},
  {id:24, d:'2026-06-17', h:'Uzbekistan',                a:'Colombia'},
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
  {id:104,d:'2026-06-21', h:'Tunisia',                   a:'Japan'},
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

// Build lookup: "HomeTeam|AwayTeam" → { id, flipped }
// Also index the reverse key since ESPN assigns home/away independently for neutral venues
const NAME_TO_ID = {};
MATCHES.forEach(m => {
  NAME_TO_ID[`${m.h}|${m.a}`] = { id: m.id, flipped: false };
  NAME_TO_ID[`${m.a}|${m.h}`] = { id: m.id, flipped: true };
});

function todayET() {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
}

function dateRange(from, to) {
  const dates = [];
  const cur = new Date(from + 'T12:00:00Z');
  const end = new Date(to   + 'T12:00:00Z');
  while (cur <= end) {
    dates.push(cur.toISOString().slice(0, 10));
    cur.setUTCDate(cur.getUTCDate() + 1);
  }
  return dates;
}

async function fetchByDate(dateStr) {
  const yyyymmdd = dateStr.replace(/-/g, '');
  const url = `${ESPN_URL}?dates=${yyyymmdd}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`ESPN ${res.status} for ${dateStr}`);
  return res.json();
}

function parseEvents(data, cache) {
  for (const ev of (data.events || [])) {
    const comp = ev.competitions?.[0];
    if (!comp) continue;

    // `completed` is ESPN's authoritative "match is over" flag — true after
    // full time and after extra time / penalty shootouts alike.
    if (ev.status?.type?.completed !== true) continue;

    const home = comp.competitors?.find(c => c.homeAway === 'home');
    const away = comp.competitors?.find(c => c.homeAway === 'away');
    if (!home || !away) continue;

    const homeTeam = norm(home.team?.displayName || '');
    const awayTeam = norm(away.team?.displayName || '');
    const match = NAME_TO_ID[`${homeTeam}|${awayTeam}`];
    if (!match) continue;

    const { id: matchId, flipped } = match;

    const events = (comp.details || [])
      .filter(d => d.scoringPlay || d.yellowCard || d.redCard)
      .map(d => ({
        minute:  d.clock?.displayValue || '',
        player:  fixEnc(d.athletesInvolved?.[0]?.shortName || ''),
        teamId:  d.team?.id || '',
        goal:    !!d.scoringPlay,
        ownGoal: !!d.ownGoal,
        penalty: !!d.penaltyKick,
        yellow:  !!d.yellowCard,
        red:     !!d.redCard,
      }));

    const hs = parseInt(home.score, 10) || 0;
    const as = parseInt(away.score, 10) || 0;
    cache[String(matchId)] = {
      homeScore:  flipped ? as : hs,
      awayScore:  flipped ? hs : as,
      homeTeamId: flipped ? (away.team?.id || '') : (home.team?.id || ''),
      awayTeamId: flipped ? (home.team?.id || '') : (away.team?.id || ''),
      events,
    };
    console.log(`  ✓ [${matchId}] ${flipped ? awayTeam : homeTeam} ${cache[matchId].homeScore}-${cache[matchId].awayScore} ${flipped ? homeTeam : awayTeam} (${events.length} events)`);
  }
}

async function main() {
  // Load existing cache
  let cache = {};
  if (fs.existsSync(OUT_PATH)) {
    try { cache = JSON.parse(fs.readFileSync(OUT_PATH, 'utf8')); } catch {}
  }
  delete cache.updated; // remove meta key before checking match IDs

  const today = todayET();
  const tournamentStart = '2026-06-11';
  if (today < tournamentStart) {
    console.log('Tournament not started yet.');
    return;
  }

  // Find dates that have uncached finished matches
  const allDates = dateRange(tournamentStart, today);
  const cachedIds = new Set(Object.keys(cache).map(Number));
  const datesToFetch = new Set();

  for (const m of MATCHES) {
    if (m.d <= today && !cachedIds.has(m.id)) {
      datesToFetch.add(m.d);
    }
  }

  if (datesToFetch.size === 0) {
    console.log('All finished matches already cached.');
    return;
  }

  console.log(`Fetching ${datesToFetch.size} date(s): ${[...datesToFetch].join(', ')}`);

  for (const date of [...datesToFetch].sort()) {
    console.log(`\nFetching ESPN for ${date}…`);
    try {
      const data = await fetchByDate(date);
      parseEvents(data, cache);
    } catch (err) {
      console.error(`  ✗ ${err.message}`);
    }
    // Small delay to be polite to ESPN
    await new Promise(r => setTimeout(r, 500));
  }

  // Write updated cache with timestamp
  const output = { updated: new Date().toISOString(), ...cache };
  fs.writeFileSync(OUT_PATH, JSON.stringify(output, null, 2));
  console.log(`\nWrote ${OUT_PATH} (${Object.keys(cache).length} matches cached)`);
}

main().catch(err => { console.error(err); process.exit(1); });
