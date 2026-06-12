import { useState, useEffect } from 'react';
import { MATCHES, computeStandings, todayStr, clampDate } from './data';
import { MOCK_RESULTS } from './mockBracket';
import { useLiveScores } from './useLiveScores';

export const isDevMode =
  process.env.NODE_ENV === 'development' ||
  (typeof window !== 'undefined' && window.location.hostname === 'localhost');

export function useWorldCup(autoRefresh = true) {
  const today   = todayStr();
  const initial = clampDate(today);
  const [selectedDate, setSelectedDate] = useState(initial);
  const [activeTab,    setActiveTab]    = useState('main');
  const [mockEnabled,  setMockEnabled]  = useState(false);
  const [cachedEvents, setCachedEvents] = useState({});

  // Load static match-events.json once on mount for past match scores
  useEffect(() => {
    fetch('/match-events.json')
      .then(r => r.ok ? r.json() : {})
      .then(data => setCachedEvents(data))
      .catch(() => {});
  }, []);

  // Live scores polled from ESPN every 60 s
  const liveScores = useLiveScores(!autoRefresh);

  const matches = MATCHES.map(m => {
    // Dev mock takes priority
    if (mockEnabled && m.g) {
      const mock = MOCK_RESULTS[m.id];
      if (mock) return { ...m, status: 'finished', homeScore: mock.hs, awayScore: mock.as };
    }

    // Merge ESPN live/finished data when available
    const key = `${m.h}|${m.a}`;
    const live = liveScores[key];
    if (live) {
      return {
        ...m,
        status:     live.status,
        homeScore:  live.homeScore,
        awayScore:  live.awayScore,
        clock:      live.clock,
        homeTeamId: live.homeTeamId,
        awayTeamId: live.awayTeamId,
        events:     live.events,
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
  };
}
