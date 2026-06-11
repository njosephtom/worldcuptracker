import { useState } from 'react';
import { MATCHES, computeStandings, todayStr, clampDate } from './data';
import { MOCK_RESULTS } from './mockBracket';

export const isDevMode =
  process.env.NODE_ENV === 'development' ||
  (typeof window !== 'undefined' && window.location.hostname === 'localhost');

export function useWorldCup() {
  const today = todayStr();
  const initial = clampDate(today);
  const [selectedDate, setSelectedDate] = useState(initial);
  const [activeTab, setActiveTab] = useState('main');
  const [mockEnabled, setMockEnabled] = useState(false);

  const matches = MATCHES.map(m => {
    if (mockEnabled && m.g) {
      const mock = MOCK_RESULTS[m.id];
      if (mock) {
        return { ...m, status: 'finished', homeScore: mock.hs, awayScore: mock.as };
      }
    }
    return { ...m, status: 'upcoming', homeScore: undefined, awayScore: undefined };
  });

  const standings = computeStandings(matches, null);
  const dayMatches = matches.filter(m => m.d === selectedDate);
  const liveCount = 0;

  return {
    selectedDate, setSelectedDate,
    activeTab, setActiveTab,
    matches, dayMatches, standings, liveCount,
    today,
    mockEnabled, setMockEnabled,
  };
}
