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

const TOURNAMENT_START = new Date('2026-06-11T15:00:00-05:00');
const MOBILE_BREAKPOINT = 900;

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
    <div style={S.app}>
      {/* TOPBAR */}
      <div style={S.topbar}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 18 }}>⚽</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#f0c040', letterSpacing: 2, textTransform: 'uppercase' }}>FIFA World Cup 2026</div>
            <div style={{ fontSize: 9, color: '#4a5a70', letterSpacing: 1 }}>🇺🇸 USA · 🇨🇦 Canada · 🇲🇽 Mexico · Jun 11 – Jul 19</div>
          </div>
        </div>
        <div style={S.dateNav}>
          <button style={{ ...S.dbtn, borderColor: '#22c55e', color: '#22c55e' }} onClick={goToday}>Today</button>
          <button style={S.dbtn} onClick={() => handleDateShift(-1)}>◀</button>
          <input id="dp" type="date" defaultValue={wc.selectedDate} min="2026-06-11" max="2026-07-19"
            onChange={e => wc.setSelectedDate(e.target.value)}
            style={S.dpInput} />
          <button style={S.dbtn} onClick={() => handleDateShift(1)}>▶</button>
        </div>
        <div style={S.counterBox}>
          <span style={S.counterLabel}>World Cup Counter</span>
          <span style={S.counterValue}>{counter}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 10 }}>
          {wc.liveCount > 0 && (
            <span style={{ color: '#ef4444', fontWeight: 600, animation: 'blink 1.4s infinite' }}>● {wc.liveCount} LIVE</span>
          )}
          {wc.loading ? (
            <span style={{ color: '#5a6a85', display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={S.spinner} /> Fetching…
            </span>
          ) : (
            <span style={{ color: '#4a5a70' }}>↻ {wc.lastFetch || 'Loading…'}</span>
          )}
          <button style={{ ...S.dbtn, fontSize: 10, padding: '4px 8px' }} onClick={wc.refresh}>Refresh</button>
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
          {/* LEFT: Fixture */}
          <div style={{ ...S.colLeft, ...(isMobile ? S.colLeftMobile : {}) }}>
            <div style={{ background: '#0a1420', borderBottom: '1px solid #1a2540', padding: '6px 12px', fontSize: 10, color: '#f0c040', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 500 }}>Fixture — Group Stage → Final</span>
              <span style={{ color: '#3a4a60', fontSize: 9 }}>hover teams for stats · click team for squad</span>
            </div>
            <div style={{ overflowX: 'auto', overflowY: 'auto', flex: 1 }}>
              <Bracket matches={wc.matches} standings={wc.standings} onTeamSelect={setSelectedTeam} onTT={show} onMoveTT={move} onHideTT={hide} />
            </div>
          </div>
          {/* RIGHT: Match Day + Map */}
          <div style={{ ...S.colRight, ...(isMobile ? S.colRightMobile : {}) }}>
            <MatchDay
              dayMatches={wc.dayMatches}
              selectedDate={wc.selectedDate}
              today={wc.today}
              onMatchClick={m => {}}
              onTeamSelect={setSelectedTeam}
              onTT={show} onMoveTT={move} onHideTT={hide}
            />
            <VenueMap
              dayMatches={wc.dayMatches}
              selectedDate={wc.selectedDate}
              onTT={show} onMoveTT={move} onHideTT={hide}
            />
          </div>
        </div>
      )}

      {/* GROUPS TAB */}
      {wc.activeTab === 'groups' && (
        <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 100px)' }}>
          <Groups matches={wc.matches} standings={wc.standings} onTeamSelect={setSelectedTeam} />
        </div>
      )}

      <SquadModal team={selectedTeam} onClose={() => setSelectedTeam(null)} />
      <TooltipPortal tooltip={tooltip} />
    </div>
  );
}

const S = {
  app: { background: '#080d1a', color: '#e0ddd5', fontFamily: "'Roboto Mono', 'SF Mono', monospace", minHeight: '100vh', display: 'flex', flexDirection: 'column' },
  topbar: { background: '#0d1425', borderBottom: '1px solid #1a2540', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' },
  dateNav: { display: 'flex', alignItems: 'center', gap: 5 },
  counterBox: { display: 'flex', flexDirection: 'column', gap: 1, minWidth: 180, padding: '4px 8px', border: '1px solid #1f2d45', borderRadius: 6, background: '#111827' },
  counterLabel: { fontSize: 9, letterSpacing: '.8px', textTransform: 'uppercase', color: '#5a6a85' },
  counterValue: { fontSize: 12, fontWeight: 700, color: '#f0c040' },
  dbtn: { background: '#111827', border: '1px solid #1f2d45', color: '#9ca3af', fontSize: 11, padding: '5px 10px', borderRadius: 6, cursor: 'pointer' },
  dpInput: { background: '#111827', border: '1px solid #1f2d45', color: '#e0ddd5', fontSize: 11, padding: '5px 10px', borderRadius: 6, cursor: 'pointer', outline: 'none' },
  tabs: { display: 'flex', background: '#0a1020', borderBottom: '1px solid #1a2540' },
  tab: { padding: '8px 18px', fontSize: 11, fontWeight: 500, color: '#5a6a85', cursor: 'pointer', borderBottom: '2px solid transparent', transition: 'all .15s', textTransform: 'uppercase', letterSpacing: '.8px' },
  tabActive: { color: '#f0c040', borderBottomColor: '#f0c040' },
  unified: { display: 'grid', gridTemplateColumns: '1.7fr 1fr', flex: 1, minHeight: 0 },
  unifiedMobile: { gridTemplateColumns: '1fr', gridTemplateRows: 'minmax(340px, 55vh) minmax(320px, 45vh)' },
  colLeft: { borderRight: '1px solid #1a2540', display: 'flex', flexDirection: 'column', overflowY: 'auto' },
  colRight: { display: 'flex', flexDirection: 'column', overflowY: 'auto' },
  colLeftMobile: { borderRight: 'none', borderBottom: '1px solid #1a2540', minHeight: 0 },
  colRightMobile: { minHeight: 0 },
  spinner: { width: 12, height: 12, borderRadius: '50%', border: '2px solid #1a2540', borderTopColor: '#f0c040', display: 'inline-block', animation: 'spin .7s linear infinite' },
};
