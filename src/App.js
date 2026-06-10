import React, { useEffect, useState } from 'react';
import { useWorldCup } from './useWorldCup';
import { useTooltip, TooltipPortal } from './Tooltip';
import { MatchDay } from './MatchDay';
import { VenueMap } from './VenueMap';
import { Bracket } from './Bracket';
import { Groups } from './Groups';
import { SquadModal } from './SquadModal';
import { shiftDate, clampDate, todayStr } from './data';
import './App.css';

const TOURNAMENT_START = new Date('2026-06-11T15:00:00-04:00');
const MOBILE_BREAKPOINT = 900;

function getTZAbbr() {
  try {
    return new Intl.DateTimeFormat(undefined, { timeZoneName: 'short' })
      .formatToParts(new Date())
      .find(p => p.type === 'timeZoneName')?.value || '';
  } catch { return ''; }
}

function countdownText(targetDate) {
  const diff = targetDate.getTime() - Date.now();
  if (diff <= 0) return 'LIVE NOW';

  const total = Math.floor(diff / 1000);
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const mins = Math.floor((total % 3600) / 60);
  const secs = total % 60;
  return `${days}d ${String(hours).padStart(2, '0')}h ${String(mins).padStart(2, '0')}m ${String(secs).padStart(2, '0')}s`;
}

export default function App() {
  const wc = useWorldCup();
  const { tooltip, show, move, hide } = useTooltip();
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [counter, setCounter] = useState(() => countdownText(TOURNAMENT_START));
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < MOBILE_BREAKPOINT);
  const [isDark, setIsDark] = useState(() => localStorage.getItem('wc-theme') !== 'light');
  const [tzAbbr] = useState(getTZAbbr);

  useEffect(() => {
    const timer = setInterval(() => {
      setCounter(countdownText(TOURNAMENT_START));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    function onResize() {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    }
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  function handleDateShift(n) {
    const nd = clampDate(shiftDate(wc.selectedDate, n));
    wc.setSelectedDate(nd);
    document.getElementById('dp').value = nd;
  }

  function goToday() {
    const t = clampDate(todayStr());
    wc.setSelectedDate(t);
    document.getElementById('dp').value = t;
  }

  const tabs = [
    { id: 'main', label: '📅 Match Day + Map + Fixture' },
    { id: 'groups', label: '📊 Groups' },
  ];

  return (
    <div style={S.app} data-theme={isDark ? 'dark' : 'light'} role="main">
      {/* TOPBAR */}
      <div style={S.topbar}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 18 }}>⚽</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ac-gold)', letterSpacing: 2, textTransform: 'uppercase' }}>FIFA World Cup 2026</div>
            <div style={{ fontSize: 9, color: 'var(--tx-dim)', letterSpacing: 1 }}>🇺🇸 USA · 🇨🇦 Canada · 🇲🇽 Mexico · Jun 11 – Jul 19</div>
          </div>
        </div>
        <div style={S.dateNav}>
          <button style={{ ...S.dbtn, borderColor: 'var(--ac-green)', color: 'var(--ac-green)' }} onClick={goToday}>Today</button>
          <button style={S.dbtn} onClick={() => handleDateShift(-1)}>◀</button>
          <input id="dp" type="date" defaultValue={wc.selectedDate} min="2026-06-11" max="2026-07-19"
            onChange={e => wc.setSelectedDate(e.target.value)}
            style={S.dpInput} />
          <button style={S.dbtn} onClick={() => handleDateShift(1)}>▶</button>
        </div>
        {!isMobile && (
          <div style={S.counterBox}>
            <span style={S.counterLabel}>World Cup Counter</span>
            <span style={S.counterValue}>{counter}</span>
            {tzAbbr && <span style={S.tzLabel}>Your local time: {tzAbbr}</span>}
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 10 }}>
          {wc.liveCount > 0 && (
            <span style={{ color: 'var(--ac-red)', fontWeight: 600, animation: 'blink 1.4s infinite' }}>● {wc.liveCount} LIVE</span>
          )}
          <button
            style={{ ...S.dbtn, fontSize: 15, padding: '3px 8px', lineHeight: 1 }}
            onClick={() => setIsDark(d => { const n = !d; localStorage.setItem('wc-theme', n ? 'dark' : 'light'); return n; })}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? '☀️' : '🌙'}
          </button>
        </div>
      </div>

      {/* TABS */}
      <div style={S.tabs}>
        {tabs.map(t => (
          <div key={t.id} style={{ ...S.tab, ...(wc.activeTab === t.id ? S.tabActive : {}) }} onClick={() => wc.setActiveTab(t.id)}>
            {t.label}
          </div>
        ))}
      </div>

      {/* MAIN PANEL: 3-in-1 */}
      {wc.activeTab === 'main' && (
        <div style={{ ...S.unified, ...(isMobile ? S.unifiedMobile : {}) }}>
          {/* LEFT: Fixture — pushed below match list on mobile */}
          <div style={{ ...S.colLeft, ...(isMobile ? S.colLeftMobile : {}), order: isMobile ? 2 : 0 }}>
            <div style={{ overflow: 'auto', flex: 1, minHeight: 0 }}>
              <Bracket matches={wc.matches} standings={wc.standings} onTeamSelect={setSelectedTeam} onTT={show} onMoveTT={move} onHideTT={hide} />
            </div>
          </div>
          {/* RIGHT: Match Day + Map — shown first on mobile */}
          <div style={{ ...S.colRight, ...(isMobile ? S.colRightMobile : {}), order: isMobile ? 1 : 0 }}>
            <MatchDay
              matches={wc.matches}
              today={wc.today}
              onMatchClick={m => {}}
              onTeamSelect={setSelectedTeam}
              onTT={show} onMoveTT={move} onHideTT={hide}
            />
            {!isMobile && (
              <VenueMap
                dayMatches={wc.dayMatches}
                selectedDate={wc.selectedDate}
                onTT={show} onMoveTT={move} onHideTT={hide}
              />
            )}
          </div>
        </div>
      )}

      {/* GROUPS TAB */}
      {wc.activeTab === 'groups' && (
        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
          <Groups matches={wc.matches} standings={wc.standings} onTeamSelect={setSelectedTeam} isMobile={isMobile} />
        </div>
      )}

      <SquadModal team={selectedTeam} onClose={() => setSelectedTeam(null)} />
      <TooltipPortal tooltip={tooltip} />
    </div>
  );
}

const S = {
  app: { background: 'var(--bg-app)', color: 'var(--tx-primary)', fontFamily: "'Roboto Mono', 'SF Mono', monospace", height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' },
  topbar: { background: 'var(--bg-topbar)', borderBottom: '1px solid var(--bd-main)', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' },
  dateNav: { display: 'flex', alignItems: 'center', gap: 5 },
  counterBox: { display: 'flex', flexDirection: 'column', gap: 1, minWidth: 180, padding: '4px 8px', border: '1px solid var(--bd-btn)', borderRadius: 6, background: 'var(--bg-input)' },
  counterLabel: { fontSize: 9, letterSpacing: '.8px', textTransform: 'uppercase', color: 'var(--tx-muted)' },
  counterValue: { fontSize: 12, fontWeight: 700, color: 'var(--ac-gold)' },
  tzLabel: { fontSize: 8, color: 'var(--tx-dim)', letterSpacing: '.4px', marginTop: 1 },
  dbtn: { background: 'var(--bg-input)', border: '1px solid var(--bd-btn)', color: 'var(--tx-secondary)', fontSize: 11, padding: '5px 10px', borderRadius: 6, cursor: 'pointer' },
  dpInput: { background: 'var(--bg-input)', border: '1px solid var(--bd-btn)', color: 'var(--tx-primary)', fontSize: 11, padding: '5px 10px', borderRadius: 6, cursor: 'pointer', outline: 'none' },
  tabs: { display: 'flex', background: 'var(--bg-tabs)', borderBottom: '1px solid var(--bd-main)' },
  tab: { padding: '8px 18px', fontSize: 11, fontWeight: 500, color: 'var(--tx-muted)', cursor: 'pointer', borderBottom: '2px solid transparent', transition: 'all .15s', textTransform: 'uppercase', letterSpacing: '.8px' },
  tabActive: { color: 'var(--ac-gold)', borderBottomColor: 'var(--ac-gold)' },
  unified: { display: 'grid', gridTemplateColumns: '1.7fr 1fr', flex: 1, minHeight: 0, overflow: 'hidden' },
  unifiedMobile: { gridTemplateColumns: '1fr', gridTemplateRows: 'minmax(340px, 55vh) minmax(320px, 45vh)' },
  colLeft: { borderRight: '1px solid var(--bd-main)', display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 },
  colRight: { display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 },
  colLeftMobile: { borderRight: 'none', borderBottom: '1px solid var(--bd-main)', minHeight: 0 },
  colRightMobile: { minHeight: 0 },
  spinner: { width: 12, height: 12, borderRadius: '50%', border: '2px solid var(--bd-main)', borderTopColor: 'var(--ac-gold)', display: 'inline-block', animation: 'spin .7s linear infinite' },
};
