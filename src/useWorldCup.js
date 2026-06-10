import { useState } from 'react';
import { MATCHES, computeStandings, todayStr, clampDate } from './data';

export function useWorldCup() {
  const today = todayStr();
  const initial = clampDate(today);
  const [selectedDate, setSelectedDate] = useState(initial);
  const [activeTab, setActiveTab] = useState('main');

  const matches = MATCHES.map(m => ({
    ...m,
    status: 'upcoming',
    homeScore: undefined,
    awayScore: undefined,
  }));

  const standings = computeStandings(matches, null);
  const dayMatches = matches.filter(m => m.d === selectedDate);
  const liveCount = 0;

  return {
    selectedDate, setSelectedDate,
    activeTab, setActiveTab,
    matches, dayMatches, standings, liveCount,
    today,
  };
}
