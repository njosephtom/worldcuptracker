import React, { useEffect, useRef, useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { useWorldCup, isDevMode } from './useWorldCup';
import { useTooltip, TooltipPortal } from './Tooltip';
import { MatchDay } from './MatchDay';
import { KnockoutBracket } from './KnockoutBracket';
import { Groups } from './Groups';
import { SquadModal } from './SquadModal';
import { MatchModal } from './MatchModal';
import { SEOContent } from './SEOContent';
import { WorldCupHistory } from './WorldCupHistory';
import { CookieConsent } from './CookieConsent';
import { FIFA_RANKING } from './data';
import { loadFifaRankings } from './squads';
import './App.css';

const TOURNAMENT_START = new Date('2026-06-11T15:00:00-04:00');
const MOBILE_BREAKPOINT = 900;

const TZ_OPTIONS = [
  { label: 'ET', iana: 'America/New_York' },
  { label: 'CT', iana: 'America/Chicago' },
  { label: 'MT', iana: 'America/Denver' },
  { label: 'PT', iana: 'America/Los_Angeles' },
];

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
  const [autoRefresh, setAutoRefresh] = useState(() => localStorage.getItem('wc-autorefresh') !== 'off');
  const [fifaRankings, setFifaRankings] = useState(FIFA_RANKING);
  const wc = useWorldCup(autoRefresh);

  useEffect(() => {
    loadFifaRankings().then(r => { if (r) setFifaRankings(r); });
  }, []);
  const { tooltip, show, move, hide } = useTooltip();
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [counter, setCounter] = useState(() => countdownText(TOURNAMENT_START));
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < MOBILE_BREAKPOINT);
  const [isDark, setIsDark] = useState(() => localStorage.getItem('wc-theme') !== 'light');
  const [use24h, setUse24h] = useState(() => localStorage.getItem('wc-clock') === '24h');
  const [showGuide, setShowGuide] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedTZ, setSelectedTZ] = useState(() => localStorage.getItem('wc-tz') || null);
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
    if (!autoRefresh) return;
    const t = setInterval(() => {
      if (!refreshingRef.current) {
        refreshingRef.current = true;
        setIsRefreshing(true);
        setTimeout(() => { refreshingRef.current = false; setIsRefreshing(false); }, 900);
      }
    }, 5 * 60 * 1000);
    return () => clearInterval(t);
  }, [autoRefresh]);

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
            style={{ ...S.dbtn, fontSize: 11, padding: '4px 8px',
              color: autoRefresh ? 'var(--ac-green)' : 'var(--tx-dim)',
              borderColor: autoRefresh ? 'var(--ac-green)' : 'var(--bd-btn)',
              background: autoRefresh ? 'rgba(34,197,94,0.08)' : 'var(--bg-input)',
            }}
            onClick={() => setAutoRefresh(v => { const n = !v; localStorage.setItem('wc-autorefresh', n ? 'on' : 'off'); return n; })}
            title={autoRefresh ? 'Auto-refresh ON — click to disable' : 'Auto-refresh OFF — click to enable'}
          >
            ↻ Auto {autoRefresh ? 'ON' : 'OFF'}
          </button>
          <button
            style={{ ...S.dbtn, fontSize: 11, padding: '4px 8px' }}
            onClick={() => setUse24h(v => { const n = !v; localStorage.setItem('wc-clock', n ? '24h' : '12h'); return n; })}
            title="Toggle 12h / 24h clock"
          >
            {use24h ? '24h' : '12h'}
          </button>
          <button
            style={{ ...S.dbtn, fontSize: 15, padding: '3px 8px', lineHeight: 1 }}
            onClick={() => setIsDark(d => { const n = !d; localStorage.setItem('wc-theme', n ? 'dark' : 'light'); return n; })}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? '☀️' : '🌙'}
          </button>
          <div style={{ display: 'flex', background: 'var(--bg-input)', border: '1px solid var(--bd-btn)', borderRadius: 6, overflow: 'hidden' }}
               title="Show match times in a North American timezone">
            {TZ_OPTIONS.map(({ label, iana }, i) => (
              <button
                key={label}
                style={{
                  ...S.dbtn,
                  border: 'none',
                  borderRight: i < TZ_OPTIONS.length - 1 ? '1px solid var(--bd-btn)' : 'none',
                  borderRadius: 0,
                  fontSize: 10,
                  padding: '4px 7px',
                  background: selectedTZ === label ? 'rgba(240,192,64,0.18)' : 'transparent',
                  color: selectedTZ === label ? 'var(--ac-gold)' : 'var(--tx-dim)',
                  fontWeight: selectedTZ === label ? 700 : 400,
                  transition: 'all .12s',
                }}
                onClick={() => setSelectedTZ(v => {
                  const next = v === label ? null : label;
                  if (next) localStorage.setItem('wc-tz', next);
                  else localStorage.removeItem('wc-tz');
                  return next;
                })}
                title={`Show match times in ${label} (${iana})`}
              >
                {label}
              </button>
            ))}
          </div>
          <button
            style={{ ...S.dbtn, fontSize: 14, padding: '3px 8px', lineHeight: 1, opacity: isRefreshing ? 0.5 : 1, transition: 'opacity .2s' }}
            onClick={handleRefresh}
            title="Manually refresh data"
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
                  bracketLive={wc.bracketLive} onTT={show} onMoveTT={move} onHideTT={hide} />
            </div>
          </div>
          {/* RIGHT: Match Day + Map — shown first on mobile */}
          <div style={{ ...S.colRight, ...(isMobile ? S.colRightMobile : {}), order: isMobile ? 1 : 0 }}>
            <MatchDay
              matches={wc.matches}
              today={wc.today}
              use24h={use24h}
              selectedTZ={selectedTZ}
              onMatchClick={m => setSelectedMatch(m)}
              onTT={show} onMoveTT={move} onHideTT={hide}
            />
          </div>
        </div>
      )}

      {/* GROUPS TAB */}
      {wc.activeTab === 'groups' && (
        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
          <Groups matches={wc.matches} standings={wc.standings} onTeamSelect={setSelectedTeam} isMobile={isMobile} fifaRankings={fifaRankings} />
        </div>
      )}

      <SquadModal team={selectedTeam} onClose={() => setSelectedTeam(null)} fifaRankings={fifaRankings} />
      <MatchModal match={selectedMatch} onClose={() => setSelectedMatch(null)} use24h={use24h} fifaRankings={fifaRankings} />
      <TooltipPortal tooltip={tooltip} />
      <Analytics />
      <CookieConsent />

      {showGuide && <SEOContent onHide={() => setShowGuide(false)} />}
      {showHistory && <WorldCupHistory onHide={() => setShowHistory(false)} />}

      {/* Floating hide buttons — stack when both sections are open */}
      {showHistory && (
        <button
          style={{ ...S.floatHideBtn, bottom: 24 }}
          onClick={() => setShowHistory(false)}
          aria-label="Hide World Cup History"
        >
          Hide History ▲
        </button>
      )}
      {showGuide && (
        <button
          style={{ ...S.floatHideBtn, bottom: showHistory ? 72 : 24 }}
          onClick={() => setShowGuide(false)}
          aria-label="Hide World Cup Guide"
        >
          Hide Guide ▲
        </button>
      )}

      {/* Footer */}
      <div style={S.footer}>
        <span>Not affiliated with FIFA &nbsp;·&nbsp;</span>
        <button
          style={S.footerBtn}
          onClick={() => {
            setShowGuide(v => {
              if (!v) setTimeout(() => document.getElementById('wc2026-guide')?.scrollIntoView({ behavior: 'smooth' }), 30);
              return !v;
            });
          }}
        >
          {showGuide ? 'Hide Guide ▲' : 'World Cup Guide ▼'}
        </button>
        <span> &nbsp;·&nbsp; </span>
        <button
          style={S.footerBtn}
          onClick={() => {
            setShowHistory(v => {
              if (!v) setTimeout(() => document.getElementById('wc-history')?.scrollIntoView({ behavior: 'smooth' }), 30);
              return !v;
            });
          }}
        >
          {showHistory ? 'Hide History ▲' : 'World Cup History ▼'}
        </button>
        <span> &nbsp;·&nbsp; </span>
        <a href="/about.html" style={S.footerLink} target="_blank" rel="noopener noreferrer">About</a>
        <span> &nbsp;·&nbsp; </span>
        <a href="/privacy.html" style={S.footerLink} target="_blank" rel="noopener noreferrer">Privacy Policy</a>
        <span> &nbsp;·&nbsp; &copy; 2026 worldcuptracker.us</span>
      </div>
    </div>
  );
}

const S = {
  app: { background: 'var(--bg-app)', color: 'var(--tx-primary)', fontFamily: 'var(--font-sans)', minHeight: '100vh', overflowY: 'auto', display: 'flex', flexDirection: 'column' },
  topbar: { background: 'var(--bg-topbar)', borderBottom: '1px solid var(--bd-main)', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' },
  counterBox: { display: 'flex', flexDirection: 'column', gap: 1, minWidth: 180, padding: '4px 8px', border: '1px solid var(--bd-btn)', borderRadius: 6, background: 'var(--bg-input)' },
  counterLabel: { fontSize: 'var(--fs-xs)', letterSpacing: '.6px', textTransform: 'uppercase', color: 'var(--tx-muted)' },
  counterValue: { fontSize: 'var(--fs-sm)', fontWeight: 700, color: 'var(--ac-gold)' },
  tzLabel: { fontSize: 'var(--fs-xs)', color: 'var(--tx-dim)', letterSpacing: '.3px', marginTop: 1 },
  dbtn: { background: 'var(--bg-input)', border: '1px solid var(--bd-btn)', color: 'var(--tx-secondary)', fontSize: 'var(--fs-sm)', padding: '5px 10px', borderRadius: 6, cursor: 'pointer', fontFamily: 'var(--font-sans)' },
  tabs: { display: 'flex', background: 'var(--bg-tabs)', borderBottom: '1px solid var(--bd-main)' },
  tab: { padding: '9px 18px', fontSize: 'var(--fs-sm)', fontWeight: 500, color: 'var(--tx-muted)', cursor: 'pointer', borderBottom: '2px solid transparent', transition: 'all .15s', textTransform: 'uppercase', letterSpacing: '.6px' },
  tabActive: { color: 'var(--ac-gold)', borderBottomColor: 'var(--ac-gold)' },
  unified: { display: 'grid', gridTemplateColumns: '1.7fr 1fr', height: 'calc(100vh - 130px)', minHeight: 400, overflow: 'hidden' },
  unifiedMobile: { gridTemplateColumns: '1fr', gridTemplateRows: 'minmax(340px, 55vh) minmax(320px, 45vh)' },
  colLeft: { borderRight: '1px solid var(--bd-main)', display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 },
  colRight: { display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 },
  colLeftMobile: { borderRight: 'none', borderBottom: '1px solid var(--bd-main)', minHeight: 0 },
  colRightMobile: { minHeight: 0 },
  spinner: { width: 12, height: 12, borderRadius: '50%', border: '2px solid var(--bd-main)', borderTopColor: 'var(--ac-gold)', display: 'inline-block', animation: 'spin .7s linear infinite' },
  footer: { flexShrink: 0, borderTop: '1px solid var(--bd-main)', padding: '5px 16px', fontSize: 10, color: 'var(--tx-muted)', textAlign: 'center', background: 'var(--bg-topbar)' },
  footerLink: { color: 'inherit', textDecoration: 'underline', textUnderlineOffset: 2 },
  footerBtn: { background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'var(--ac-gold)', fontWeight: 600, fontSize: 10, fontFamily: 'var(--font-sans)' },
  floatHideBtn: {
    position: 'fixed', bottom: 24, right: 20, zIndex: 9000,
    background: 'var(--bg-inner)', border: '1px solid var(--bd-btn)',
    color: 'var(--ac-gold)', fontWeight: 700, fontSize: 11,
    fontFamily: 'var(--font-sans)', letterSpacing: '.4px',
    padding: '9px 18px', borderRadius: 24, cursor: 'pointer',
    boxShadow: '0 4px 20px rgba(0,0,0,.45)',
  },
};
