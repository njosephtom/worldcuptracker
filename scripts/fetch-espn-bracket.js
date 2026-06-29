#!/usr/bin/env node
'use strict';
const fs   = require('fs');
const path = require('path');

const ESPN_URL  = 'https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard';
const OUT_PATH  = path.join(__dirname, '../public/bracket-live.json');

const KNOCKOUT_START = '2026-06-28';
const KNOCKOUT_END   = '2026-07-19';

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

const ROUND_PATTERN = {
  'round of 32': 'R32',
  'round of 16': 'R16',
  'quarterfinal': 'QF',
  'quarter-final': 'QF',
  'semifinal': 'SF',
  'semi-final': 'SF',
  'third': 'Bronze',
  'final': 'Final',
};

function norm(name) { return ESPN_NAME_MAP[name] || name; }

function extractRound(altNote) {
  if (!altNote) return null;
  const lower = altNote.toLowerCase();
  if (/round of 32/i.test(lower)) return 'R32';
  if (/round of 16/i.test(lower)) return 'R16';
  if (/quarter/i.test(lower))     return 'QF';
  if (/semi/i.test(lower))        return 'SF';
  if (/third/i.test(lower))       return 'Bronze';
  if (/final/i.test(lower) && !/semi/i.test(lower) && !/third/i.test(lower)) return 'Final';
  return null;
}

function dateRange(from, to) {
  const dates = [];
  const cur = new Date(from + 'T12:00:00Z');
  const end = new Date(to + 'T12:00:00Z');
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

// IDs match KnockoutBracket.js BD map (bracket layout order, NOT data.js schedule order)
const STATIC_R32 = {
  72: { h: 'Germany',       a: 'Paraguay' },
  73: { h: 'France',        a: 'Sweden' },
  74: { h: 'South Africa',  a: 'Canada' },
  75: { h: 'Netherlands',   a: 'Morocco' },
  76: { h: 'Portugal',      a: 'Croatia' },
  77: { h: 'Spain',         a: 'Austria' },
  78: { h: 'United States', a: 'Bosnia and Herzegovina' },
  79: { h: 'Belgium',       a: 'Senegal' },
  80: { h: 'Brazil',        a: 'Japan' },
  81: { h: 'Ivory Coast',   a: 'Norway' },
  82: { h: 'Mexico',        a: 'Ecuador' },
  83: { h: 'England',       a: 'DR Congo' },
  84: { h: 'Argentina',     a: 'Cape Verde' },
  85: { h: 'Australia',     a: 'Egypt' },
  86: { h: 'Switzerland',   a: 'Algeria' },
  87: { h: 'Colombia',      a: 'Ghana' },
};

// R16 pairings — winners feed into these. IDs match KnockoutBracket.js BD map.
// Each R16 match gets its teams from two R32 match winners.
const R16_FEEDS = {
  88: [72, 73],
  89: [74, 75],
  90: [76, 77],
  91: [78, 79],
  92: [80, 81],
  93: [82, 83],
  94: [84, 85],
  95: [86, 87],
};

const QF_FEEDS  = { 96: [88, 89], 97: [90, 91], 98: [92, 93], 99: [94, 95] };
const SF_FEEDS  = { 100: [96, 97], 101: [98, 99] };
const F_FEEDS   = { 103: [100, 101] };

function findMatchId(homeTeam, awayTeam, round, espnMatches) {
  // For R32, match against our static schedule (teams are known)
  if (round === 'R32') {
    for (const [id, m] of Object.entries(STATIC_R32)) {
      if ((m.h === homeTeam && m.a === awayTeam) ||
          (m.h === awayTeam && m.a === homeTeam)) {
        return +id;
      }
    }
  }
  return null;
}

async function main() {
  const allDates = dateRange(KNOCKOUT_START, KNOCKOUT_END);
  const espnMatches = [];
  const seen = new Set();

  console.log(`Fetching ESPN bracket for ${allDates.length} days...\n`);

  for (const date of allDates) {
    try {
      const data = await fetchByDate(date);
      for (const ev of (data.events || [])) {
        const espnId = ev.id;
        if (seen.has(espnId)) continue;
        seen.add(espnId);

        const comp = ev.competitions?.[0];
        if (!comp) continue;

        const home = comp.competitors?.find(c => c.homeAway === 'home');
        const away = comp.competitors?.find(c => c.homeAway === 'away');
        if (!home || !away) continue;

        const homeTeam = norm(home.team?.displayName || '');
        const awayTeam = norm(away.team?.displayName || '');

        const altNote = comp.altGameNote || ev.competitions?.[0]?.notes?.[0]?.headline || '';
        const round   = extractRound(altNote);
        if (!round) continue; // skip group stage

        const sName = ev.status?.type?.name || '';
        let status = 'upcoming';
        if (/IN_PROGRESS|FIRST_HALF|SECOND_HALF|HALFTIME|EXTRA_TIME|PENALTY/.test(sName)) status = 'live';
        if (/FINAL|FULL_TIME|END_PERIOD/.test(sName)) status = 'finished';

        const homeScore = parseInt(home.score, 10) || 0;
        const awayScore = parseInt(away.score, 10) || 0;

        const match = {
          espnId,
          h: homeTeam,
          a: awayTeam,
          round,
          status,
          homeScore: status !== 'upcoming' ? homeScore : null,
          awayScore: status !== 'upcoming' ? awayScore : null,
        };

        // Determine winner for finished matches
        if (status === 'finished') {
          match.winner = homeScore > awayScore ? homeTeam : awayTeam;
        }

        espnMatches.push(match);
      }

      const dayCount = (data.events || []).length;
      if (dayCount > 0) console.log(`  ${date}: ${dayCount} event(s)`);
    } catch (err) {
      console.error(`  x ${date}: ${err.message}`);
    }

    await new Promise(r => setTimeout(r, 250));
  }

  // Build bracket results keyed by our internal match IDs
  const bracket = {};

  // Process R32 matches — match ESPN data to our static IDs
  for (const m of espnMatches) {
    if (m.round !== 'R32') continue;
    for (const [id, static_m] of Object.entries(STATIC_R32)) {
      if ((static_m.h === m.h && static_m.a === m.a) ||
          (static_m.h === m.a && static_m.a === m.h)) {
        const flipped = static_m.h === m.a;
        bracket[+id] = {
          h: static_m.h,
          a: static_m.a,
          hs: flipped ? m.awayScore : m.homeScore,
          as: flipped ? m.homeScore : m.awayScore,
          status: m.status,
          winner: m.winner || null,
        };
      }
    }
  }

  // For R16+, ESPN provides the actual team names once R32 is done.
  // Match by team names + round since we can't predict matchups beforehand.
  const roundMatches = { R16: [], QF: [], SF: [], Final: [], Bronze: [] };
  for (const m of espnMatches) {
    if (roundMatches[m.round]) roundMatches[m.round].push(m);
  }

  // Process R16 — resolve which R16 slot each match fills
  function resolveRound(feeds, roundKey) {
    const matches = roundMatches[roundKey] || [];
    for (const [targetId, sourceIds] of Object.entries(feeds)) {
      // Get expected teams from source match winners
      const expectedTeams = sourceIds.map(sid => bracket[sid]?.winner).filter(Boolean);
      if (expectedTeams.length < 2) continue;

      // Find the ESPN match containing both expected teams
      for (const m of matches) {
        if (expectedTeams.includes(m.h) && expectedTeams.includes(m.a)) {
          const h = expectedTeams[0];
          const a = expectedTeams[1];
          const flippedH = m.h === a;
          bracket[+targetId] = {
            h,
            a,
            hs: flippedH ? m.awayScore : m.homeScore,
            as: flippedH ? m.homeScore : m.awayScore,
            status: m.status,
            winner: m.winner || null,
          };
          break;
        }
      }
    }
  }

  resolveRound(R16_FEEDS, 'R16');
  resolveRound(QF_FEEDS, 'QF');
  resolveRound(SF_FEEDS, 'SF');
  resolveRound(F_FEEDS, 'Final');

  // Bronze match — losers of semifinals
  const sfLosers = [100, 101].map(id => {
    const m = bracket[id];
    if (!m?.winner) return null;
    return m.winner === m.h ? m.a : m.h;
  }).filter(Boolean);

  if (sfLosers.length === 2) {
    const bronzeESPN = roundMatches['Bronze']?.[0];
    if (bronzeESPN) {
      const h = sfLosers[0];
      const a = sfLosers[1];
      const flippedH = bronzeESPN.h === a;
      bracket[102] = {
        h, a,
        hs: flippedH ? bronzeESPN.awayScore : bronzeESPN.homeScore,
        as: flippedH ? bronzeESPN.homeScore : bronzeESPN.awayScore,
        status: bronzeESPN.status,
        winner: bronzeESPN.winner || null,
      };
    }
  }

  const output = {
    updated: new Date().toISOString(),
    bracket,
  };

  fs.writeFileSync(OUT_PATH, JSON.stringify(output, null, 2));
  console.log(`\nWrote ${OUT_PATH} — ${Object.keys(bracket).length} knockout matches`);
}

main().catch(err => { console.error(err); process.exit(1); });
