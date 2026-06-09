import React from 'react';
import { VENUES, TEAM_CC, flagLabel, fmtDate } from './data';
import { FlagImg } from './FlagImg';

export function MatchDay({ dayMatches, selectedDate, today, onMatchClick, onTeamSelect, onTT, onMoveTT, onHideTT }) {
  const isToday = selectedDate === today;
  const handleTeamClick = (event, team) => {
    event.stopPropagation();
    onTeamSelect?.(team);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={styles.panelHdr}>
        <span style={{ color: 'var(--ac-gold)', fontWeight: 500 }}>
          {isToday ? '⚡ Today — ' : ''}{fmtDate(selectedDate)}
        </span>
        <span style={{ fontSize: 10, color: 'var(--tx-dim)' }}>
          {dayMatches.length} match{dayMatches.length !== 1 ? 'es' : ''}
        </span>
      </div>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {dayMatches.length === 0 ? (
          <div style={styles.noMatch}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>🗓</div>
            <div>No matches on this date</div>
            <div style={{ fontSize: 10, marginTop: 4, color: 'var(--tx-dim3)' }}>Group stage: Jun 11–27</div>
          </div>
        ) : dayMatches.map(m => {
          const v = VENUES[m.v] || { city: m.v };
          const live = m.status === 'live';
          const ft = m.status === 'finished';
          const roundLabel = m.round || `Group ${m.g}`;
          const ttHtml = `<div style="font-weight:500;color:var(--ac-gold);margin-bottom:5px">${roundLabel}: ${flagLabel(m.h)} vs ${flagLabel(m.a)}</div><div style="color:var(--tx-secondary)">📅 ${m.d} · ${m.t}</div><div style="color:var(--tx-secondary)">🏟️ ${v.name||v.city}, ${v.city}</div>${ft||live?`<div style="color:var(--ac-green);font-weight:500;margin-top:4px">Score: ${m.homeScore} – ${m.awayScore}</div>`:''}`;
          return (
            <div key={m.id} style={{
              ...styles.mcard,
              borderLeft: live ? '3px solid var(--ac-red)' : '3px solid transparent',
            }}
              onClick={() => onMatchClick(m)}
              onMouseEnter={e => onTT(e, ttHtml)}
              onMouseMove={onMoveTT}
              onMouseLeave={onHideTT}
            >
              <div style={styles.mcardTeams}>
                <div style={styles.teamRow}>
                  <span style={{ cursor: 'pointer', flexShrink: 0 }} onClick={(event) => handleTeamClick(event, m.h)}>
                    <FlagImg name={m.h} w={22} h={15} />
                  </span>
                  <span style={{ ...styles.tname, cursor: 'pointer' }} onClick={(event) => handleTeamClick(event, m.h)}>{m.h}</span>
                </div>
                {ft || live ? (
                  <div style={styles.scoreBox}>
                    <span style={styles.scoreNum}>{m.homeScore ?? 0}</span>
                    <span style={{ color: 'var(--tx-dim2)', fontSize: 12 }}>–</span>
                    <span style={styles.scoreNum}>{m.awayScore ?? 0}</span>
                  </div>
                ) : (
                  <div style={styles.vsBox}>vs</div>
                )}
                <div style={styles.teamRow}>
                  <span style={{ cursor: 'pointer', flexShrink: 0 }} onClick={(event) => handleTeamClick(event, m.a)}>
                    <FlagImg name={m.a} w={22} h={15} />
                  </span>
                  <span style={{ ...styles.tname, cursor: 'pointer' }} onClick={(event) => handleTeamClick(event, m.a)}>{m.a}</span>
                </div>
              </div>
              <div style={styles.mcardMeta}>
                <div style={{ fontSize: 8, color: m.round ? 'var(--ac-gold)' : 'var(--tx-dim2)', fontWeight: m.round ? 700 : 400, marginBottom: 1, letterSpacing: .5 }}>
                  {m.round || `Grp ${m.g}`}
                </div>
                {live && <span style={styles.liveBadge}>● LIVE</span>}
                {ft && <span style={styles.ftBadge}>FT</span>}
                {!live && !ft && <span style={{ fontSize: 9, color: 'var(--tx-muted)' }}>{m.t}</span>}
                <div style={{ fontSize: 9, color: 'var(--tx-dim2)', marginTop: 2 }}>{v.city}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  panelHdr: { background: 'var(--bg-panel)', borderBottom: '1px solid var(--bd-main)', padding: '6px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11 },
  noMatch: { padding: 32, textAlign: 'center', color: 'var(--tx-dim2)', fontSize: 12 },
  mcard: { borderBottom: '1px solid var(--bg-inner)', padding: '8px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, transition: 'background .12s' },
  mcardTeams: { flex: 1, display: 'flex', alignItems: 'center', gap: 6 },
  teamRow: { display: 'flex', alignItems: 'center', gap: 4, flex: 1 },
  flag: { fontSize: 14 },
  tname: { fontSize: 10, color: 'var(--tx-team2)', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 90 },
  scoreBox: { display: 'flex', alignItems: 'center', gap: 4, minWidth: 48, justifyContent: 'center' },
  scoreNum: { fontSize: 15, fontWeight: 600, color: 'var(--ac-gold)', minWidth: 14, textAlign: 'center' },
  vsBox: { fontSize: 9, color: 'var(--tx-dim2)', minWidth: 24, textAlign: 'center' },
  mcardMeta: { textAlign: 'right', fontSize: 9, color: 'var(--tx-dim)', minWidth: 56 },
  liveBadge: { display: 'inline-block', background: 'var(--ac-red)', color: '#fff', fontSize: 8, fontWeight: 600, padding: '2px 5px', borderRadius: 8, animation: 'blink 1.4s infinite' },
  ftBadge: { fontSize: 9, color: 'var(--ac-green)', fontWeight: 600 },
};
