import React, { useState } from 'react';
import { VENUES, flagLabel, fmtDate } from './data';
import { FlagImg } from './FlagImg';

export function MatchDay({ matches, today, onMatchClick, onTeamSelect, onTT, onMoveTT, onHideTT }) {
  const [view, setView] = useState('today');

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
        <span style={{ color: 'var(--ac-gold)', fontWeight: 600, fontSize: 10 }}>⚡ Match Schedule</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 9, color: 'var(--tx-dim)' }}>{filtered.length} match{filtered.length !== 1 ? 'es' : ''}</span>
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
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {dates.length === 0 ? (
          <div style={styles.noMatch}>
            <div style={{ fontSize: 24, marginBottom: 6 }}>{view === 'today' ? '🗓' : '🏆'}</div>
            <div>{view === 'today' ? 'No matches today' : 'Tournament has concluded'}</div>
          </div>
        ) : dates.map(date => {
          const isToday = date === today;
          const dMatches = grouped[date];
          return (
            <div key={date}>
              {/* Date header — only shown in All view, or always for clarity */}
              <div style={{
                ...styles.dateHdr,
                background: isToday ? 'var(--bg-panel)' : 'var(--bg-tabs)',
                borderLeft: isToday ? '3px solid var(--ac-gold)' : '3px solid transparent',
              }}>
                <span style={{ color: isToday ? 'var(--ac-gold)' : 'var(--tx-secondary)', fontWeight: isToday ? 700 : 400 }}>
                  {isToday ? '⚡ Today — ' : ''}{fmtDate(date)}
                </span>
                <span style={{ fontSize: 9, color: 'var(--tx-dim)' }}>
                  {dMatches.length} match{dMatches.length !== 1 ? 'es' : ''}
                </span>
              </div>

              {dMatches.map(m => {
                const v = VENUES[m.v] || { city: m.v };
                const live = m.status === 'live';
                const ft = m.status === 'finished';
                const roundLabel = m.round || `Group ${m.g}`;
                const ttHtml = `<div style="font-weight:500;color:var(--ac-gold);margin-bottom:5px">${roundLabel}: ${flagLabel(m.h)} vs ${flagLabel(m.a)}</div><div style="color:var(--tx-secondary)">📅 ${m.d} · ${m.t}</div><div style="color:var(--tx-secondary)">🏟️ ${v.name || v.city}, ${v.city}</div>${ft || live ? `<div style="color:var(--ac-green);font-weight:500;margin-top:4px">Score: ${m.homeScore} – ${m.awayScore}</div>` : ''}`;

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
                        <span style={{ ...styles.tname, cursor: 'pointer' }} onClick={e => handleTeamClick(e, m.h)}>{m.h}</span>
                      </div>
                      {ft || live ? (
                        <div style={styles.scoreBox}>
                          <span style={styles.scoreNum}>{m.homeScore ?? 0}</span>
                          <span style={{ color: 'var(--tx-dim2)', fontSize: 10 }}>–</span>
                          <span style={styles.scoreNum}>{m.awayScore ?? 0}</span>
                        </div>
                      ) : (
                        <div style={styles.vsBox}>vs</div>
                      )}
                      <div style={styles.teamRow}>
                        <span style={{ cursor: 'pointer', flexShrink: 0 }} onClick={e => handleTeamClick(e, m.a)}>
                          <FlagImg name={m.a} w={18} h={12} />
                        </span>
                        <span style={{ ...styles.tname, cursor: 'pointer' }} onClick={e => handleTeamClick(e, m.a)}>{m.a}</span>
                      </div>
                    </div>
                    <div style={styles.mcardMeta}>
                      <div style={{ fontSize: 7, color: m.round ? 'var(--ac-gold)' : 'var(--tx-dim2)', fontWeight: m.round ? 700 : 400, marginBottom: 1, letterSpacing: .4 }}>
                        {m.round || `Grp ${m.g}`}
                      </div>
                      {live && <span style={styles.liveBadge}>● LIVE</span>}
                      {ft && <span style={styles.ftBadge}>FT</span>}
                      {!live && !ft && <span style={{ fontSize: 8, color: 'var(--tx-muted)' }}>{m.t}</span>}
                      <div style={{ fontSize: 8, color: 'var(--tx-dim2)', marginTop: 1 }}>{v.city}</div>
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
    fontSize: 8,
    fontWeight: 600,
    padding: '2px 7px',
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
    padding: '3px 10px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 9,
    borderBottom: '1px solid var(--bd-main)',
    position: 'sticky',
    top: 0,
    zIndex: 1,
  },
  noMatch: { padding: 24, textAlign: 'center', color: 'var(--tx-dim2)', fontSize: 11 },
  mcard: {
    borderBottom: '1px solid var(--bg-inner)',
    padding: '5px 10px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    transition: 'background .12s',
  },
  mcardTeams: { flex: 1, display: 'flex', alignItems: 'center', gap: 4 },
  teamRow: { display: 'flex', alignItems: 'center', gap: 3, flex: 1 },
  tname: { fontSize: 9, color: 'var(--tx-team2)', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 80 },
  scoreBox: { display: 'flex', alignItems: 'center', gap: 3, minWidth: 40, justifyContent: 'center' },
  scoreNum: { fontSize: 12, fontWeight: 600, color: 'var(--ac-gold)', minWidth: 12, textAlign: 'center' },
  vsBox: { fontSize: 8, color: 'var(--tx-dim2)', minWidth: 20, textAlign: 'center' },
  mcardMeta: { textAlign: 'right', fontSize: 8, color: 'var(--tx-dim)', minWidth: 48, flexShrink: 0 },
  liveBadge: { display: 'inline-block', background: 'var(--ac-red)', color: '#fff', fontSize: 7, fontWeight: 600, padding: '1px 4px', borderRadius: 6, animation: 'blink 1.4s infinite' },
  ftBadge: { fontSize: 8, color: 'var(--ac-green)', fontWeight: 600 },
};
