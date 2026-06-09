import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchWorldCupData } from './api';
import { MATCHES, computeStandings, todayStr, clampDate } from './data';

export function useWorldCup() {
  const today = todayStr();
  const initial = clampDate(today);
  const [selectedDate, setSelectedDate] = useState(initial);
  const [liveData, setLiveData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastFetch, setLastFetch] = useState(null);
  const [activeTab, setActiveTab] = useState('main');
  const timerRef = useRef(null);

  const matches = MATCHES.map(m => {
    const result = liveData?.results?.find(r => r.id === m.id);
    const live = liveData?.liveMatches?.find(r => r.id === m.id);
    return {
      ...m,
      status: live ? 'live' : result ? 'finished' : 'upcoming',
      homeScore: live?.homeScore ?? result?.homeScore,
      awayScore: live?.awayScore ?? result?.awayScore,
    };
  });

  const standings = computeStandings(matches, liveData);

  const refresh = useCallback(async () => {
    setLoading(true);
    const data = await fetchWorldCupData();
    if (data) {
      setLiveData(data);
      setLastFetch(new Date().toLocaleTimeString());
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
    timerRef.current = setInterval(refresh, 5 * 60 * 1000);
    return () => clearInterval(timerRef.current);
  }, [refresh]);

  const dayMatches = matches.filter(m => m.d === selectedDate);
  const liveCount = matches.filter(m => m.status === 'live').length;

  return {
    selectedDate, setSelectedDate,
    liveData, loading, lastFetch,
    activeTab, setActiveTab,
    matches, dayMatches, standings, liveCount,
    refresh, today,
  };
}
