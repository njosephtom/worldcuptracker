import { useState, useEffect, useRef, useCallback } from 'react';

const ESPN_URL = 'https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard';
const POLL_MS  = 60 * 1000; // poll every 60 seconds

// ESPN display names → our MATCHES team names
const ESPN_NAME_MAP = {
  'Czech Republic':          'Czechia',
  'Bosnia-Herzegovina':      'Bosnia and Herzegovina',
  "Cote d'Ivoire":           "Côte d'Ivoire",
  "Côte D'Ivoire":           "Côte d'Ivoire",
  'Ivory Coast':             "Côte d'Ivoire",
  'Korea Republic':          'South Korea',
  'Republic of Korea':       'South Korea',
  'IR Iran':                 'Iran',
  'United Arab Emirates':    'UAE',
  'DR Congo':                'DR Congo',
  'Democratic Republic of the Congo': 'DR Congo',
  'Turkey':                  'Türkiye',
  'Türkiye':                 'Türkiye',
  'Curacao':                 'Curaçao',
};

function normalise(name) {
  return ESPN_NAME_MAP[name] || name;
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
    if (sName === 'STATUS_IN_PROGRESS')  status = 'live';
    if (sName === 'STATUS_FINAL' ||
        sName === 'STATUS_FULL_TIME' ||
        sName === 'STATUS_END_PERIOD')   status = 'finished';

    const clock = ev.status?.displayClock || '';

    // key matches our MATCHES: home team first
    scores[`${homeTeam}|${awayTeam}`] = {
      homeScore: parseInt(home.score, 10) || 0,
      awayScore: parseInt(away.score, 10) || 0,
      status,
      clock,
    };
  });
  return scores;
}

export function useLiveScores() {
  const [scores, setScores] = useState({});
  const timer  = useRef(null);

  const fetchScores = useCallback(async () => {
    try {
      const res = await fetch(`${ESPN_URL}?ts=${Date.now()}`);
      if (!res.ok) return;
      const data = await res.json();
      setScores(parseESPN(data));
    } catch { /* network error — keep last good data */ }
  }, []);

  useEffect(() => {
    fetchScores();
    timer.current = setInterval(fetchScores, POLL_MS);
    return () => clearInterval(timer.current);
  }, [fetchScores]);

  return scores;
}
