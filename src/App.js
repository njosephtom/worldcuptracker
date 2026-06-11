import React, { useEffect, useRef, useState } from 'react';
import { useWorldCup, isDevMode } from './useWorldCup';
import { useTooltip, TooltipPortal } from './Tooltip';
import { MatchDay } from './MatchDay';
import { KnockoutBracket } from './KnockoutBracket';
import { Groups } from './Groups';
import { SquadModal } from './SquadModal';
import { MatchModal } from './MatchModal';
import { shiftDate, clampDate } from './data';
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
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [counter, setCounter] = useState(() => countdownText(TOURNAMENT_START));
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < MOBILE_BREAKPOINT);
  const [isDark, setIsDark] = useState(() => localStorage.getItem('wc-theme') !== 'light');
  const [tzAbbr] = useState(getTZAbbr);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const refreshingRef = useRef(false);

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

  function handleRefresh() {
    if (refreshingRef.current) return;
    refreshingRef.current = true;
    setIsRefreshing(true);
    setTimeout(() => {
      refreshingRef.current = false;
      setIsRefreshing(false);
    }, 900);
  }

  useEffect(() => {
    const t = setInterval(() => {
      if (!refreshingRef.current) {
        refreshingRef.current = true;
        setIsRefreshing(true);
        setTimeout(() => { refreshingRef.current = false; setIsRefreshing(false); }, 900);
      }
    }, 5 * 60 * 1000);
    return () => clearInterval(t);
  }, []);

  function handleDateShift(n) {
    const nd = clampDate(shiftDate(wc.selectedDate, n));
    wc.setSelectedDate(nd);
    document.getElementById('dp').value = nd;
  }

  const tabs = [
    { id: 'main', label: '📅 Match Day + Fixture' },
    { id: 'groups', label: '📊 Groups' },
  ];

  return (
    <div style={S.app} data-theme={isDark ? 'dark' : 'light'} role="main">
      {/* TOPBAR */}
      <div style={S.topbar}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 18 }}>⚽</span>
          <div>
            <div style={{ fontSize: 'var(--fs-sm)', fontWeight: 700, color: 'var(--ac-gold)', letterSpacing: 1.5, textTransform: 'uppercase' }}>FIFA World Cup 2026</div>
            <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--tx-dim)', letterSpacing: 0.5 }}>🇺🇸 USA · 🇨🇦 Canada · 🇲🇽 Mexico · Jun 11 – Jul 19</div>
          </div>
        </div>
        <div style={S.dateNav}>
          <button style={S.dbtn} onClick={() => handleDateShift(-1)}>◀</button>
          <input id="dp" type="date" defaultValue={wc.selectedDate} min="2026-06-11" max="2026-07-19"
            onChange={e => wc.setSelectedDate(e.target.value)}
            style={S.dpInput} />
          <button style={S.dbtn} onClick={() => handleDateShift(1)}>▶</button>
        </div>
        {!isMobile && Date.now() < TOURNAMENT_START.getTime() && (
          <div style={S.counterBox}>
            <span style={S.counterLabel}>World Cup Counter</span>
            <span style={S.counterValue}>{counter}</span>
            {tzAbbr && <span style={S.tzLabel}>Your local time: {tzAbbr}</span>}
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 'var(--fs-xs)' }}>
          {wc.liveCount > 0 && (
            <span style={{ color: 'var(--ac-red)', fontWeight: 700, animation: 'blink 1.4s infinite' }}>● {wc.liveCount} LIVE</span>
          )}
          {isDevMode && (
            <button
              style={{
                ...S.dbtn,
                fontSize: 10, padding: '4px 10px', letterSpacing: 0.4,
                background: wc.mockEnabled ? 'rgba(34,197,94,0.15)' : 'var(--bg-input)',
                border: wc.mockEnabled ? '1px solid var(--ac-green)' : '1px solid var(--bd-btn)',
                color: wc.mockEnabled ? 'var(--ac-green)' : 'var(--tx-dim)',
                transition: 'all .18s',
              }}
              onClick={() => wc.setMockEnabled(v => !v)}
              title="Toggle mock data — dev/localhost only"
            >
              🎭 Mock {wc.mockEnabled ? 'ON' : 'OFF'}
            </button>
          )}
          <button
            style={{ ...S.dbtn, fontSize: 15, padding: '3px 8px', lineHeight: 1 }}
            onClick={() => setIsDark(d => { const n = !d; localStorage.setItem('wc-theme', n ? 'dark' : 'light'); return n; })}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? '☀️' : '🌙'}
          </button>
          <button
            style={{ ...S.dbtn, fontSize: 14, padding: '3px 8px', lineHeight: 1, opacity: isRefreshing ? 0.5 : 1, transition: 'opacity .2s' }}
            onClick={handleRefresh}
            title="Refresh data (auto-refreshes every 5 min)"
          >
            <span style={{ display: 'inline-block', animation: isRefreshing ? 'spin .7s linear infinite' : 'none' }}>↻</span>
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
            <div style={{ overflow: 'hidden', flex: 1, minHeight: 0 }}>
              <KnockoutBracket isMobile={isMobile} mockEnabled={wc.mockEnabled} standings={wc.standings}
                  onTT={show} onMoveTT={move} onHideTT={hide} />
            </div>
          </div>
          {/* RIGHT: Match Day + Map — shown first on mobile */}
          <div style={{ ...S.colRight, ...(isMobile ? S.colRightMobile : {}), order: isMobile ? 1 : 0 }}>
            <MatchDay
              matches={wc.matches}
              today={wc.today}
              onMatchClick={m => setSelectedMatch(m)}
              onTT={show} onMoveTT={move} onHideTT={hide}
            />
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
      <MatchModal match={selectedMatch} onClose={() => setSelectedMatch(null)} />
      <TooltipPortal tooltip={tooltip} />

      {/* Footer */}
      <div style={S.footer}>
        <span>Not affiliated with FIFA &nbsp;·&nbsp;</span>
        <a href="/privacy.html" style={S.footerLink} target="_blank" rel="noopener noreferrer">Privacy Policy</a>
        <span> &nbsp;·&nbsp; &copy; 2026 worldcuptracker.us</span>
      </div>
    </div>
  );
}

const S = {
  app: { background: 'var(--bg-app)', color: 'var(--tx-primary)', fontFamily: 'var(--font-sans)', height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' },
  topbar: { background: 'var(--bg-topbar)', borderBottom: '1px solid var(--bd-main)', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' },
  dateNav: { display: 'flex', alignItems: 'center', gap: 5 },
  counterBox: { display: 'flex', flexDirection: 'column', gap: 1, minWidth: 180, padding: '4px 8px', border: '1px solid var(--bd-btn)', borderRadius: 6, background: 'var(--bg-input)' },
  counterLabel: { fontSize: 'var(--fs-xs)', letterSpacing: '.6px', textTransform: 'uppercase', color: 'var(--tx-muted)' },
  counterValue: { fontSize: 'var(--fs-sm)', fontWeight: 700, color: 'var(--ac-gold)' },
  tzLabel: { fontSize: 'var(--fs-xs)', color: 'var(--tx-dim)', letterSpacing: '.3px', marginTop: 1 },
  dbtn: { background: 'var(--bg-input)', border: '1px solid var(--bd-btn)', color: 'var(--tx-secondary)', fontSize: 'var(--fs-sm)', padding: '5px 10px', borderRadius: 6, cursor: 'pointer', fontFamily: 'var(--font-sans)' },
  dpInput: { background: 'var(--bg-input)', border: '1px solid var(--bd-btn)', color: 'var(--tx-primary)', fontSize: 'var(--fs-sm)', padding: '5px 10px', borderRadius: 6, cursor: 'pointer', outline: 'none', fontFamily: 'var(--font-sans)' },
  tabs: { display: 'flex', background: 'var(--bg-tabs)', borderBottom: '1px solid var(--bd-main)' },
  tab: { padding: '9px 18px', fontSize: 'var(--fs-sm)', fontWeight: 500, color: 'var(--tx-muted)', cursor: 'pointer', borderBottom: '2px solid transparent', transition: 'all .15s', textTransform: 'uppercase', letterSpacing: '.6px' },
  tabActive: { color: 'var(--ac-gold)', borderBottomColor: 'var(--ac-gold)' },
  unified: { display: 'grid', gridTemplateColumns: '1.7fr 1fr', flex: 1, minHeight: 0, overflow: 'hidden' },
  unifiedMobile: { gridTemplateColumns: '1fr', gridTemplateRows: 'minmax(340px, 55vh) minmax(320px, 45vh)' },
  colLeft: { borderRight: '1px solid var(--bd-main)', display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 },
  colRight: { display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 },
  colLeftMobile: { borderRight: 'none', borderBottom: '1px solid var(--bd-main)', minHeight: 0 },
  colRightMobile: { minHeight: 0 },
  spinner: { width: 12, height: 12, borderRadius: '50%', border: '2px solid var(--bd-main)', borderTopColor: 'var(--ac-gold)', display: 'inline-block', animation: 'spin .7s linear infinite' },
  footer: { flexShrink: 0, borderTop: '1px solid var(--bd-main)', padding: '5px 16px', fontSize: 10, color: 'var(--tx-muted)', textAlign: 'center', background: 'var(--bg-topbar)' },
  footerLink: { color: 'var(--ac-gold)', textDecoration: 'none', fontWeight: 500 },
};
