import { useState, useEffect } from 'react';
import { MATCHES, computeStandings, todayStr, clampDate } from './data';
import { MOCK_RESULTS } from './mockBracket';

export const isDevMode =
  process.env.NODE_ENV === 'development' ||
  (typeof window !== 'undefined' && window.location.hostname === 'localhost');

// Match runs ~115 min (90 + 15 HT + 10 buffer)
const LIVE_MS = 115 * 60 * 1000;

function parseMatchDT(date, timeET) {
  const str = timeET.replace(' ET', '').trim();
  const [timePart, period] = str.split(' ');
  const [hStr, mStr] = timePart.split(':');
  let h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  if (period === 'PM' && h !== 12) h += 12;
  if (period === 'AM' && h === 12) h = 0;
  return new Date(`${date}T${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00-04:00`);
}

function resolveStatus(m, now) {
  const start = parseMatchDT(m.d, m.t).getTime();
  if (now >= start && now < start + LIVE_MS) return 'live';
  return 'upcoming';
}

export function useWorldCup() {
  const today = todayStr();
  const initial = clampDate(today);
  const [selectedDate, setSelectedDate] = useState(initial);
  const [activeTab, setActiveTab] = useState('main');
  const [mockEnabled, setMockEnabled] = useState(false);
  const [now, setNow] = useState(Date.now());

  // Re-evaluate live status every 30 seconds
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(t);
  }, []);

  const matches = MATCHES.map(m => {
    if (mockEnabled && m.g) {
      const mock = MOCK_RESULTS[m.id];
      if (mock) {
        return { ...m, status: 'finished', homeScore: mock.hs, awayScore: mock.as };
      }
    }
    const status = resolveStatus(m, now);
    return {
      ...m,
      status,
      homeScore: status === 'live' ? (m.homeScore ?? 0) : undefined,
      awayScore: status === 'live' ? (m.awayScore ?? 0) : undefined,
    };
  });

  const standings = computeStandings(matches, null);
  const dayMatches = matches.filter(m => m.d === selectedDate);
  const liveCount = matches.filter(m => m.status === 'live').length;

  return {
    selectedDate, setSelectedDate,
    activeTab, setActiveTab,
    matches, dayMatches, standings, liveCount,
    today,
    mockEnabled, setMockEnabled,
  };
}
