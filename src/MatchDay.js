import React, { useState, useEffect, useMemo } from 'react';
import { VENUES, flagLabel, fmtDate } from './data';
import { FlagImg } from './FlagImg';

// Tournament runs June–July 2026 (EDT = UTC-4)
function parseMatchDateTime(date, timeET) {
  const str = timeET.replace(' ET', '').trim();
  const [timePart, period] = str.split(' ');
  const [hStr, mStr] = timePart.split(':');
  let h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  if (period === 'PM' && h !== 12) h += 12;
  if (period === 'AM' && h === 12) h = 0;
  return new Date(`${date}T${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00-04:00`);
}

function matchCountdown(matchDate, now) {
  const diff = matchDate.getTime() - now;
  if (diff <= 0) return null;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Starting now';
  if (mins < 60) return `Starts in ${mins}m`;
  const h = Math.floor(mins / 60);
  const rem = mins % 60;
  if (h < 24) return rem > 0 ? `Starts in ${h}h ${rem}m` : `Starts in ${h}h`;
  const d = Math.floor(h / 24);
  const rh = h % 24;
  return rh > 0 ? `in ${d}d ${rh}h` : `in ${d}d`;
}

function fmtLocalTime(matchDate) {
  return matchDate.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit', hour12: true });
}

function liveMinute(matchDate, now) {
  const e = Math.floor((now - matchDate.getTime()) / 60000);
  if (e < 0) return '';
  if (e <= 45) return ` ${Math.max(1, e)}'`;
  if (e <= 60) return ' HT';
  const second = e - 15;
  if (second <= 90) return ` ${second}'`;
  return ' 90+';
}

export function MatchDay({ matches, today, onMatchClick, onTeamSelect, onTT, onMoveTT, onHideTT }) {
  const [view, setView] = useState('today');
  const [now, setNow] = useState(Date.now);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(t);
  }, []);

  const tzAbbr = useMemo(() => {
    try {
      return new Intl.DateTimeFormat(undefined, { timeZoneName: 'short' })
        .formatToParts(new Date())
        .find(p => p.type === 'timeZoneName')?.value || '';
    } catch { return ''; }
  }, []);

  const userCity = useMemo(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const parts = tz.split('/');
      return parts[parts.length - 1].replace(/_/g, ' ');
    } catch { return ''; }
  }, []);

  const handleTeamClick = (event, team) => {
    event.stopPropagation();
    onTeamSelect?.(team);
  };

  const upcoming = matches.filter(m => m.d >= today);
  const filtered = view === 'today' ? upcoming.filter(m => m.d === today) : upcoming;

  const grouped = {};
  filtered.forEach(m => {
    if (!grouped[m.d]) grouped[m.d] = [];
    grouped[m.d].push(m);
  });
  const dates = Object.keys(grouped).sort();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header with filter toggle */}
      <div style={styles.panelHdr}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 5, overflow: 'hidden', minWidth: 0 }}>
          <span style={{ color: 'var(--ac-gold)', fontWeight: 700, fontSize: 10 }}>⚡ Match Schedule</span>
          {tzAbbr && (
            <span style={{ fontSize: 10, color: 'var(--tx-dim)', fontWeight: 400 }}>
              All times in your local time: <b style={{ color: 'var(--tx-secondary)' }}>{tzAbbr}</b>
              {userCity && <span style={{ color: 'var(--tx-dim2)' }}> · 📍 {userCity}</span>}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 10, color: 'var(--tx-dim)' }}>{filtered.length} match{filtered.length !== 1 ? 'es' : ''}</span>
          <div style={styles.toggle}>
            {['today', 'all'].map(opt => (
              <button
                key={opt}
                style={{ ...styles.toggleBtn, ...(view === opt ? styles.toggleActive : {}) }}
                onClick={() => setView(opt)}
              >
                {opt === 'today' ? 'Today' : 'All'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Match list */}
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
        {dates.length === 0 ? (
          <div style={styles.noMatch}>
            <div style={{ fontSize: 24, marginBottom: 6 }}>{view === 'today' ? '🗓' : '🏆'}</div>
            <div>{view === 'today' ? 'No matches today' : 'Tournament has concluded'}</div>
          </div>
        ) : dates.map(date => {
          const isToday = date === today;
          const dMatches = grouped[date];
          return (
            <div key={date} style={isToday && view === 'all' ? {
              border: '1.5px solid rgba(240,192,64,0.55)',
              borderRadius: 8,
              margin: '6px 6px 10px',
              background: 'rgba(240,192,64,0.03)',
              overflow: 'hidden',
              boxShadow: '0 0 14px rgba(240,192,64,0.10)',
            } : {}}>
              {/* Date header */}
              <div style={{
                ...styles.dateHdr,
                background: isToday ? 'var(--bg-panel)' : 'var(--bg-tabs)',
                borderLeft: isToday ? '3px solid var(--ac-gold)' : '3px solid transparent',
              }}>
                <span style={{ color: isToday ? 'var(--ac-gold)' : 'var(--tx-secondary)', fontWeight: 700 }}>
                  {isToday ? '⚡ Today — ' : ''}{fmtDate(date)}
                </span>
                <span style={{ fontSize: 11, color: 'var(--tx-dim)' }}>
                  {dMatches.length} match{dMatches.length !== 1 ? 'es' : ''}
                </span>
              </div>

              {dMatches.map(m => {
                const v = VENUES[m.v] || { city: m.v };
                const live = m.status === 'live';
                const ft = m.status === 'finished';
                const roundLabel = m.round || `Group ${m.g}`;
                const ttHtml = `<div style="font-weight:500;color:var(--ac-gold);margin-bottom:5px">${roundLabel}: ${flagLabel(m.h)} vs ${flagLabel(m.a)}</div><div style="color:var(--tx-secondary)">📅 ${m.d} · ${m.t}</div><div style="color:var(--tx-secondary)">🏟️ ${v.name || v.city}, ${v.city}</div>${ft || live ? `<div style="color:var(--ac-green);font-weight:500;margin-top:4px">Score: ${m.homeScore} – ${m.awayScore}</div>` : ''}`;

                const md       = parseMatchDateTime(m.d, m.t);
                const countdown = matchCountdown(md, now);
                const homeWins  = ft && m.homeScore > m.awayScore;
                const awayWins  = ft && m.awayScore > m.homeScore;

                return (
                  <div key={m.id}
                    style={{ ...styles.mcard, borderLeft: live ? '3px solid var(--ac-red)' : '3px solid transparent' }}
                    onClick={() => onMatchClick(m)}
                    onMouseEnter={e => onTT(e, ttHtml)}
                    onMouseMove={onMoveTT}
                    onMouseLeave={onHideTT}
                  >
                    <div style={styles.mcardTeams}>
                      <div style={styles.teamRow}>
                        <span style={{ cursor: 'pointer', flexShrink: 0 }} onClick={e => handleTeamClick(e, m.h)}>
                          <FlagImg name={m.h} w={18} h={12} />
                        </span>
                        <span style={{ ...styles.tname, cursor: 'pointer', color: homeWins ? 'var(--ac-gold)' : undefined }}
                          onClick={e => handleTeamClick(e, m.h)}>{m.h}</span>
                        {homeWins && <span style={styles.wBadge}>W</span>}
                      </div>
                      {ft || live ? (
                        <div style={styles.scoreBox}>
                          <span style={live ? styles.scoreNumLive : styles.scoreNum}>{m.homeScore ?? 0}</span>
                          <span style={{ color: live ? 'var(--ac-red)' : 'var(--tx-dim2)', fontSize: 10, fontWeight: live ? 700 : 400 }}>–</span>
                          <span style={live ? styles.scoreNumLive : styles.scoreNum}>{m.awayScore ?? 0}</span>
                        </div>
                      ) : (
                        <div style={styles.vsBox}>vs</div>
                      )}
                      <div style={styles.teamRow}>
                        <span style={{ cursor: 'pointer', flexShrink: 0 }} onClick={e => handleTeamClick(e, m.a)}>
                          <FlagImg name={m.a} w={18} h={12} />
                        </span>
                        <span style={{ ...styles.tname, cursor: 'pointer', color: awayWins ? 'var(--ac-gold)' : undefined }}
                          onClick={e => handleTeamClick(e, m.a)}>{m.a}</span>
                        {awayWins && <span style={styles.wBadge}>W</span>}
                      </div>
                    </div>
                    <div style={styles.mcardMeta}>
                      <div style={{ fontSize: 10, color: 'var(--tx-dim2)', fontWeight: 600, marginBottom: 1, letterSpacing: .3 }}>
                        {m.round || `Grp ${m.g}`}
                      </div>
                      {live && <div style={{ marginBottom: 1 }}><span style={styles.liveBadge}>● LIVE{liveMinute(md, now)}</span></div>}
                      {/* Local kickoff time — always visible */}
                      <div style={{ fontSize: 11, color: 'var(--tx-secondary)', fontWeight: 600, whiteSpace: 'nowrap', textAlign: 'right' }}>
                        {fmtLocalTime(md)}
                        {!ft && !live && countdown && (
                          <span style={{ fontSize: 9, color: 'var(--ac-green)', fontWeight: 600, marginLeft: 4 }}>
                            ({countdown.replace(/^Starts in /, '').replace(/^in /, '').replace('Starting now', 'now')})
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: 9, color: 'var(--tx-dim2)', marginTop: 2, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        📍 {v.city}{v.name ? ` · ${v.name}` : ''}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  panelHdr: {
    background: 'var(--bg-panel)',
    borderBottom: '1px solid var(--bd-main)',
    padding: '5px 10px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexShrink: 0,
  },
  toggle: {
    display: 'flex',
    background: 'var(--bg-inner)',
    borderRadius: 5,
    padding: 2,
    gap: 1,
  },
  toggleBtn: {
    background: 'transparent',
    border: 'none',
    color: 'var(--tx-dim)',
    fontSize: 11,
    fontWeight: 600,
    padding: '5px 20px',
    borderRadius: 3,
    cursor: 'pointer',
    textTransform: 'uppercase',
    letterSpacing: '.5px',
    transition: 'all .12s',
  },
  toggleActive: {
    background: 'var(--ac-gold)',
    color: '#0a0e1a',
  },
  dateHdr: {
    padding: '5px 10px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 10,
    fontWeight: 700,
    borderBottom: '1px solid var(--bd-main)',
    position: 'sticky',
    top: 0,
    zIndex: 1,
  },
  noMatch: { padding: 24, textAlign: 'center', color: 'var(--tx-dim2)', fontSize: 11 },
  mcard: {
    borderBottom: '1px solid var(--bg-inner)',
    padding: '6px 8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    transition: 'background .12s',
  },
  mcardTeams: { flex: 1, display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: 4 },
  teamRow: { display: 'flex', alignItems: 'center', gap: 3 },
  tname: { fontSize: 12, color: 'var(--tx-team2)', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 80 },
  scoreBox: { display: 'flex', alignItems: 'center', gap: 3, padding: '0 6px', justifyContent: 'center' },
  scoreNum: { fontSize: 14, fontWeight: 800, color: 'var(--ac-gold)', minWidth: 14, textAlign: 'center' },
  scoreNumLive: { fontSize: 15, fontWeight: 900, color: 'var(--ac-red)', minWidth: 14, textAlign: 'center' },
  vsBox: { fontSize: 8, color: 'var(--tx-dim2)', minWidth: 20, textAlign: 'center' },
  mcardMeta: { textAlign: 'right', fontSize: 8, color: 'var(--tx-dim)', minWidth: 120, maxWidth: 120, overflow: 'hidden', flexShrink: 0 },
  liveBadge: { display: 'inline-block', background: 'var(--ac-red)', color: '#fff', fontSize: 7, fontWeight: 600, padding: '1px 4px', borderRadius: 6, animation: 'blink 1.4s infinite' },
  ftBadge: { fontSize: 8, color: 'var(--ac-green)', fontWeight: 600 },
  wBadge: { fontSize: 7, background: 'var(--ac-green)', color: '#fff', fontWeight: 800, padding: '1px 3px', borderRadius: 3, flexShrink: 0, letterSpacing: 0.3 },
};
