#!/usr/bin/env node
// Fetches the full FIFA World Cup 2026 schedule from ESPN API and writes
// public/match-schedule.json. Run daily by GitHub Actions to pick up any
// FIFA schedule changes (venue swaps, time changes, matchup corrections).
// Outputs both ET and local venue time for every match.

'use strict';
const fs   = require('fs');
const path = require('path');

const ESPN_URL = 'https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard';
const OUT_PATH = path.join(__dirname, '../public/match-schedule.json');

const TOURNAMENT_START = '2026-06-11';
const TOURNAMENT_END   = '2026-07-19';

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

const VENUE_MAP = {
  'Estadio Banorte':                  'azteca',
  'Estadio Azteca':                   'azteca',
  'Estadio Akron':                    'akron',
  'Estadio BBVA':                     'bbva',
  'SoFi Stadium':                     'sofi',
  "Levi's Stadium":                   'levis',
  'Lumen Field':                      'lumen',
  'GEHA Field at Arrowhead Stadium':  'arrowhead',
  'Arrowhead Stadium':                'arrowhead',
  'AT&T Stadium':                     'att',
  'NRG Stadium':                      'nrg',
  'Mercedes-Benz Stadium':            'mercedes',
  'Hard Rock Stadium':                'hardrock',
  'Lincoln Financial Field':          'lincoln',
  'Gillette Stadium':                 'gillette',
  'MetLife Stadium':                  'metlife',
  'BMO Field':                        'bmo',
  'BC Place':                         'bcplace',
};

const VENUE_TZ = {
  azteca:    { iana: 'America/Mexico_City',  abbr: 'CT' },
  akron:     { iana: 'America/Mexico_City',  abbr: 'CT' },
  bbva:      { iana: 'America/Mexico_City',  abbr: 'CT' },
  sofi:      { iana: 'America/Los_Angeles',  abbr: 'PT' },
  levis:     { iana: 'America/Los_Angeles',  abbr: 'PT' },
  lumen:     { iana: 'America/Los_Angeles',  abbr: 'PT' },
  bcplace:   { iana: 'America/Los_Angeles',  abbr: 'PT' },
  arrowhead: { iana: 'America/Chicago',      abbr: 'CT' },
  att:       { iana: 'America/Chicago',      abbr: 'CT' },
  nrg:       { iana: 'America/Chicago',      abbr: 'CT' },
  mercedes:  { iana: 'America/New_York',     abbr: 'ET' },
  hardrock:  { iana: 'America/New_York',     abbr: 'ET' },
  lincoln:   { iana: 'America/New_York',     abbr: 'ET' },
  gillette:  { iana: 'America/New_York',     abbr: 'ET' },
  metlife:   { iana: 'America/New_York',     abbr: 'ET' },
  bmo:       { iana: 'America/Toronto',      abbr: 'ET' },
};

// Fallback times from data.js for matches where ESPN returns midnight placeholders
const STATIC_TIMES = {
  'Mexico|South Africa':              { d:'2026-06-11', t:'3:00 PM ET'  },
  'South Korea|Czechia':              { d:'2026-06-11', t:'9:00 PM ET'  },
  'Canada|Bosnia and Herzegovina':    { d:'2026-06-12', t:'3:00 PM ET'  },
  'United States|Paraguay':           { d:'2026-06-12', t:'9:00 PM ET'  },
  'Qatar|Switzerland':                { d:'2026-06-13', t:'3:00 PM ET'  },
  'Brazil|Morocco':                   { d:'2026-06-13', t:'6:00 PM ET'  },
  'Haiti|Scotland':                   { d:'2026-06-13', t:'9:00 PM ET'  },
  'Australia|Turkey':                 { d:'2026-06-13', t:'11:00 PM ET' },
  'Germany|Curaçao':                  { d:'2026-06-14', t:'3:00 PM ET'  },
  'Netherlands|Japan':                { d:'2026-06-14', t:'6:00 PM ET'  },
  'Ivory Coast|Ecuador':              { d:'2026-06-14', t:'8:00 PM ET'  },
  'Sweden|Tunisia':                   { d:'2026-06-14', t:'11:00 PM ET' },
  'Spain|Cape Verde':                 { d:'2026-06-15', t:'12:00 PM ET' },
  'Belgium|Egypt':                    { d:'2026-06-15', t:'3:00 PM ET'  },
  'Uruguay|Saudi Arabia':             { d:'2026-06-15', t:'6:00 PM ET'  },
  'Iran|New Zealand':                 { d:'2026-06-15', t:'9:00 PM ET'  },
  'France|Senegal':                   { d:'2026-06-16', t:'3:00 PM ET'  },
  'Norway|Iraq':                      { d:'2026-06-16', t:'6:00 PM ET'  },
  'Argentina|Algeria':                { d:'2026-06-16', t:'9:00 PM ET'  },
  'Austria|Jordan':                   { d:'2026-06-16', t:'9:00 PM ET'  },
  'Portugal|DR Congo':                { d:'2026-06-17', t:'4:00 PM ET'  },
  'England|Croatia':                  { d:'2026-06-17', t:'4:00 PM ET'  },
  'Ghana|Panama':                     { d:'2026-06-17', t:'7:00 PM ET'  },
  'Uzbekistan|Colombia':              { d:'2026-06-17', t:'10:00 PM ET' },
  'Tunisia|Japan':                    { d:'2026-06-20', t:'12:00 AM ET' },
};

function norm(name) { return ESPN_NAME_MAP[name] || name; }

function mapVenue(venueName) {
  if (!venueName) return null;
  for (const [key, code] of Object.entries(VENUE_MAP)) {
    if (venueName.includes(key)) return code;
  }
  return null;
}

function extractGroup(altNote) {
  if (!altNote) return null;
  const m = altNote.match(/Group\s+([A-L])/i);
  return m ? m[1] : null;
}

function extractRound(altNote) {
  if (!altNote) return null;
  if (/round of 32/i.test(altNote)) return 'R32';
  if (/round of 16/i.test(altNote)) return 'R16';
  if (/quarter/i.test(altNote))     return 'QF';
  if (/semi/i.test(altNote))        return 'SF';
  if (/final/i.test(altNote) && !/semi/i.test(altNote) && !/third/i.test(altNote)) return 'Final';
  if (/third/i.test(altNote))       return 'Bronze';
  return null;
}

function fmtTime(isoDate, iana) {
  try {
    const d = new Date(isoDate);
    return d.toLocaleTimeString('en-US', {
      timeZone: iana,
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } catch { return null; }
}

function fmtDate(isoDate, iana) {
  try {
    const d = new Date(isoDate);
    return d.toLocaleDateString('en-CA', { timeZone: iana });
  } catch { return null; }
}

function isLikelyPlaceholder(isoDate) {
  const d = new Date(isoDate);
  const etHour = parseInt(d.toLocaleTimeString('en-US', {
    timeZone: 'America/New_York', hour: 'numeric', hour12: false,
  }), 10);
  return etHour >= 0 && etHour < 6;
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

async function main() {
  const allDates = dateRange(TOURNAMENT_START, TOURNAMENT_END);
  const matches = [];
  const seen = new Set();

  console.log(`Fetching ESPN schedule for ${allDates.length} days…\n`);

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

        const altNote   = comp.altGameNote || ev.competitions?.[0]?.notes?.[0]?.headline || '';
        const group     = extractGroup(altNote);
        const round     = group ? null : extractRound(altNote);
        const venueName = comp.venue?.fullName || '';
        const venueCode = mapVenue(venueName);
        const startDate = comp.startDate || ev.date;

        const matchKey = `${homeTeam}|${awayTeam}`;
        const staticFallback = STATIC_TIMES[matchKey];
        const placeholder = isLikelyPlaceholder(startDate);

        let etDate, etTime;
        if (placeholder && staticFallback) {
          etDate = staticFallback.d;
          etTime = staticFallback.t;
        } else {
          etDate = fmtDate(startDate, 'America/New_York');
          etTime = fmtTime(startDate, 'America/New_York') + ' ET';
        }

        const vtz = VENUE_TZ[venueCode];
        let localTime = null;
        let localTZ   = null;
        if (vtz && !placeholder) {
          localTime = fmtTime(startDate, vtz.iana) + ' ' + vtz.abbr;
          localTZ   = vtz.abbr;
        } else if (vtz && staticFallback) {
          localTZ = vtz.abbr;
        }

        const sName = ev.status?.type?.name || '';
        let status = 'upcoming';
        if (/IN_PROGRESS|FIRST_HALF|SECOND_HALF|HALFTIME|EXTRA_TIME|PENALTY/.test(sName)) status = 'live';
        if (/FINAL|FULL_TIME|END_PERIOD/.test(sName)) status = 'finished';

        const match = {
          espnId,
          h: homeTeam,
          a: awayTeam,
          d: etDate,
          t: etTime,
          v: venueCode,
          venueName,
          status,
        };

        if (localTime)  match.localTime = localTime;
        if (localTZ)    match.localTZ   = localTZ;
        if (group)      match.g = group;
        if (round)      match.round = round;

        if (status !== 'upcoming') {
          match.homeScore = parseInt(home.score, 10) || 0;
          match.awayScore = parseInt(away.score, 10) || 0;
        }

        matches.push(match);
      }

      const dayCount = (data.events || []).length;
      if (dayCount > 0) console.log(`  ${date}: ${dayCount} event(s)`);
    } catch (err) {
      console.error(`  ✗ ${date}: ${err.message}`);
    }

    await new Promise(r => setTimeout(r, 300));
  }

  const output = {
    updated: new Date().toISOString(),
    matches,
  };

  fs.writeFileSync(OUT_PATH, JSON.stringify(output, null, 2));
  console.log(`\nWrote ${OUT_PATH} — ${matches.length} matches total`);
}

main().catch(err => { console.error(err); process.exit(1); });
