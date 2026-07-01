import { useState, useEffect } from 'react';
import { MATCHES, computeStandings, todayStr, clampDate } from './data';
import { MOCK_RESULTS } from './mockBracket';
import { useLiveScores } from './useLiveScores';

export const isDevMode =
  process.env.NODE_ENV === 'development' ||
  (typeof window !== 'undefined' && window.location.hostname === 'localhost');

function mergeSchedule(staticMatches, scheduleData) {
  if (!scheduleData?.matches?.length) return staticMatches;

  const byTeamKey = {};
  const byEspnId = {};
  scheduleData.matches.forEach(em => {
    if (em.h && em.a && !(em.h === 'TBD' && em.a === 'TBD')) {
      byTeamKey[`${em.h}|${em.a}`] = em;
    }
    if (em.espnId) {
      byEspnId[em.espnId] = em;
    }
  });

  return staticMatches.map(m => {
    let em = byTeamKey[`${m.h}|${m.a}`] || byTeamKey[`${m.a}|${m.h}`];
    let flipped = !byTeamKey[`${m.h}|${m.a}`];

    // For bracket stage matches with TBD teams, try matching by espnId
    if (!em && (m.h === 'TBD' || m.a === 'TBD') && m.espnId) {
      em = byEspnId[m.espnId];
      flipped = false;
    }

    if (!em) return m;

    const updates = {};
    if (em.h) updates.h = flipped ? em.a : em.h;
    if (em.a) updates.a = flipped ? em.h : em.a;
    if (em.d) updates.d = em.d;
    if (em.t) updates.t = em.t;
    if (em.v) updates.v = em.v;
    if (em.status === 'finished' || em.status === 'live') {
      updates.status    = em.status;
      updates.homeScore = flipped ? em.awayScore : em.homeScore;
      updates.awayScore = flipped ? em.homeScore : em.awayScore;
    }
    return { ...m, ...updates };
  });
}

export function useWorldCup(autoRefresh = true) {
  const today   = todayStr();
  const initial = clampDate(today);
  const [selectedDate, setSelectedDate] = useState(initial);
  const [activeTab,    setActiveTab]    = useState('main');
  const [mockEnabled,  setMockEnabled]  = useState(false);
  const [cachedEvents, setCachedEvents] = useState({});
  const [matchSchedule, setMatchSchedule] = useState(null);
  const [bracketLive, setBracketLive] = useState(null);

  // Load static match-events.json once on mount for past match scores
  useEffect(() => {
    fetch(`/match-events.json?t=${Date.now()}`)
      .then(r => r.ok ? r.json() : {})
      .then(data => setCachedEvents(data))
      .catch(() => {});
  }, []);

  // Load match schedule (updated daily by GitHub Actions from ESPN)
  useEffect(() => {
    fetch(`/match-schedule.json?t=${Date.now()}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) setMatchSchedule(data); })
      .catch(() => {});
  }, []);

  // Load live bracket results (updated every 30 min by GitHub Actions)
  useEffect(() => {
    function load() {
      fetch(`/bracket-live.json?t=${Date.now()}`)
        .then(r => r.ok ? r.json() : null)
        .then(data => { if (data) setBracketLive(data); })
        .catch(() => {});
    }
    load();
    if (autoRefresh) {
      const t = setInterval(load, 5 * 60 * 1000);
      return () => clearInterval(t);
    }
  }, [autoRefresh]);

  // Live scores polled from ESPN every 60 s
  const liveScores = useLiveScores(!autoRefresh);

  const baseMatches = mergeSchedule(MATCHES, matchSchedule);

  const matches = baseMatches.map(m => {
    // Dev mock takes priority
    if (mockEnabled && m.g) {
      const mock = MOCK_RESULTS[m.id];
      if (mock) return { ...m, status: 'finished', homeScore: mock.hs, awayScore: mock.as };
    }

    // Merge ESPN live/finished data when available.
    // Also check the reversed key because ESPN assigns home/away for neutral-venue
    // games independently — it may list Turkey as "home" when our MATCHES has Australia.
    const key    = `${m.h}|${m.a}`;
    const revKey = `${m.a}|${m.h}`;
    const raw    = liveScores[key] || liveScores[revKey];
    const flipped = !liveScores[key] && !!liveScores[revKey];
    if (raw) {
      const hasShootout = raw.homeShootout != null && raw.awayShootout != null;
      const winner = raw.winner ? (flipped && raw.winner !== 'TBD' ? (raw.winner === m.h ? m.a : raw.winner === m.a ? m.h : raw.winner) : raw.winner) : null;
      // Auto-detect finished status if scores are final (have homeScore and awayScore)
      const status = (raw.homeScore != null && raw.awayScore != null) ? 'finished' : raw.status;
      return {
        ...m,
        status,
        homeScore:  flipped ? raw.awayScore : raw.homeScore,
        awayScore:  flipped ? raw.homeScore : raw.awayScore,
        clock:      raw.clock,
        homeTeamId: flipped ? raw.awayTeamId : raw.homeTeamId,
        awayTeamId: flipped ? raw.homeTeamId : raw.awayTeamId,
        events:     raw.events,
        ...(hasShootout ? {
          homeShootout: flipped ? raw.awayShootout : raw.homeShootout,
          awayShootout: flipped ? raw.homeShootout : raw.awayShootout,
        } : {}),
        ...(winner ? { winner } : {}),
      };
    }

    // Past matches: pull score + events from static match-events.json
    if (m.d < today) {
      const cached = cachedEvents[String(m.id)];
      return {
        ...m,
        status:     'finished',
        homeScore:  cached?.homeScore,
        awayScore:  cached?.awayScore,
        homeTeamId: cached?.homeTeamId,
        awayTeamId: cached?.awayTeamId,
        events:     cached?.events,
        clock:      undefined,
      };
    }

    // Today's games that have already finished but dropped off ESPN live:
    // use the static cache so scores still appear even after the live feed clears.
    if (m.d === today) {
      const cached = cachedEvents[String(m.id)];
      if (cached) {
        return {
          ...m,
          status:     'finished',
          homeScore:  cached.homeScore,
          awayScore:  cached.awayScore,
          homeTeamId: cached.homeTeamId,
          awayTeamId: cached.awayTeamId,
          events:     cached.events,
          clock:      undefined,
        };
      }
    }

    return { ...m, status: 'upcoming', homeScore: undefined, awayScore: undefined, clock: undefined };
  });

  const standings  = computeStandings(matches, null);
  const dayMatches = matches.filter(m => m.d === selectedDate);
  const liveCount  = matches.filter(m => m.status === 'live').length;

  return {
    selectedDate, setSelectedDate,
    activeTab, setActiveTab,
    matches, dayMatches, standings, liveCount,
    today,
    mockEnabled, setMockEnabled,
    bracketLive,
  };
}
