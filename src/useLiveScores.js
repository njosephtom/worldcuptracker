import { useState, useEffect, useRef, useCallback } from 'react';

const ESPN_URL = 'https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard';
const POLL_MS  = 30 * 1000; // poll every 30 seconds

// ESPN display names → our MATCHES team names (must match exactly what's in data.js MATCHES)
const ESPN_NAME_MAP = {
  'Czech Republic':                    'Czechia',
  'Bosnia-Herzegovina':                'Bosnia and Herzegovina',
  "Cote d'Ivoire":                     'Ivory Coast',
  "Côte D'Ivoire":                     'Ivory Coast',
  "Côte d'Ivoire":                     'Ivory Coast',
  'Korea Republic':                    'South Korea',
  'Republic of Korea':                 'South Korea',
  'IR Iran':                           'Iran',
  'United Arab Emirates':              'UAE',
  'Congo DR':                          'DR Congo',
  'Democratic Republic of the Congo':  'DR Congo',
  'Türkiye':                           'Turkey',
  'Curacao':                           'Curaçao',
  'Cabo Verde':                        'Cape Verde',
  'USA':                               'United States',
};

function normalise(name) {
  return ESPN_NAME_MAP[name] || name;
}

// ESPN double-encodes UTF-8 names (e.g. "Julián" → "JuliÃ¡n")
function fixEncoding(s) {
  if (!s) return s;
  try { return decodeURIComponent(escape(s)); } catch { return s; }
}

function parseESPN(data) {
  const scores = {};
  (data?.events || []).forEach(ev => {
    const comp = ev.competitions?.[0];
    if (!comp) return;

    const home = comp.competitors?.find(c => c.homeAway === 'home');
    const away = comp.competitors?.find(c => c.homeAway === 'away');
    if (!home || !away) return;

    const homeTeam = normalise(home.team?.displayName || '');
    const awayTeam = normalise(away.team?.displayName || '');
    if (!homeTeam || !awayTeam) return;

    const sName = ev.status?.type?.name || '';
    let status = 'upcoming';
    if (sName === 'STATUS_IN_PROGRESS' ||
        sName === 'STATUS_FIRST_HALF'  ||
        sName === 'STATUS_SECOND_HALF' ||
        sName === 'STATUS_HALFTIME'    ||
        sName === 'STATUS_EXTRA_TIME'  ||
        sName === 'STATUS_PENALTY')     status = 'live';
    if (sName === 'STATUS_FINAL' ||
        sName === 'STATUS_FULL_TIME' ||
        sName === 'STATUS_END_PERIOD')   status = 'finished';

    // skip upcoming — only merge live/finished into the app
    if (status === 'upcoming') return;

    const clock = ev.status?.displayClock || '';

    // Parse goals, cards, own-goals from competition details
    const events = (comp.details || [])
      .filter(d => d.scoringPlay || d.yellowCard || d.redCard)
      .map(d => ({
        minute:  d.clock?.displayValue || '',
        player:  fixEncoding(d.athletesInvolved?.[0]?.shortName || ''),
        teamId:  d.team?.id || '',
        goal:    d.scoringPlay,
        ownGoal: d.ownGoal,
        penalty: d.penaltyKick,
        yellow:  d.yellowCard,
        red:     d.redCard,
      }));

    // key matches our MATCHES: home team first
    scores[`${homeTeam}|${awayTeam}`] = {
      homeScore:  parseInt(home.score, 10) || 0,
      awayScore:  parseInt(away.score, 10) || 0,
      homeTeamId: home.team?.id || '',
      awayTeamId: away.team?.id || '',
      status,
      clock,
      events,
    };
  });
  return scores;
}

export function useLiveScores(paused = false) {
  const [scores, setScores] = useState({});
  const timer  = useRef(null);

  const fetchScores = useCallback(async () => {
    try {
      const now = new Date();
      // Fetch both the user's local date AND the ET date so games that start near
      // midnight ET (e.g. 9 PM PDT = midnight ET) are always included.
      const localDate = now.toLocaleDateString('en-CA').replace(/-/g, '');
      const etDate    = now.toLocaleDateString('en-CA', { timeZone: 'America/New_York' }).replace(/-/g, '');
      const dates     = [...new Set([localDate, etDate])];

      const results = await Promise.all(
        dates.map(d =>
          fetch(`${ESPN_URL}?dates=${d}&ts=${Date.now()}`)
            .then(r => r.ok ? r.json() : {})
            .catch(() => ({}))
        )
      );

      // Merge — if same game appears in both responses the later entry wins (fine)
      const merged = {};
      results.forEach(data => Object.assign(merged, parseESPN(data)));
      setScores(merged);
    } catch { /* network error — keep last good data */ }
  }, []);

  useEffect(() => {
    if (paused) { clearInterval(timer.current); return; }
    fetchScores();
    timer.current = setInterval(fetchScores, POLL_MS);
    return () => clearInterval(timer.current);
  }, [fetchScores, paused]);

  return scores;
}
