import React, { useEffect, useState } from 'react';
import { VENUES } from './data';
import { FlagImg } from './FlagImg';

// ── helpers ──────────────────────────────────────────────────────────────────
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

function fmtLocalTime(d, use24h) {
  return d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit', hour12: !use24h });
}

function getLiveMinute(matchDate, now) {
  const e = Math.floor((now - matchDate.getTime()) / 60000);
  if (e < 0) return null;
  if (e <= 45) return `${Math.max(1, e)}'`;
  if (e <= 60) return 'HT';
  const second = e - 15;
  if (second <= 90) return `${second}'`;
  return '90+\'';
}

function eventIcon(ev) {
  if (ev.red)    return '🟥';
  if (ev.yellow) return '🟨';
  if (ev.goal)   return ev.ownGoal ? '⚽ OG' : ev.penalty ? '⚽ (P)' : '⚽';
  return '';
}

function EventsColumn({ team, events, teamId, align }) {
  const teamEvents = (events || []).filter(e => e.teamId === teamId);
  return (
    <div style={{ ...S.eventsCol, alignItems: align === 'right' ? 'flex-end' : 'flex-start' }}>
      <div style={{ ...S.evColHeader, flexDirection: align === 'right' ? 'row-reverse' : 'row' }}>
        <FlagImg name={team} w={18} h={12} />
        <span style={S.evTeamName}>{team}</span>
      </div>
      {teamEvents.length === 0 ? (
        <div style={S.evEmpty}>–</div>
      ) : (
        teamEvents.map((ev, i) => (
          <div key={i} style={{ ...S.evRow, flexDirection: align === 'right' ? 'row-reverse' : 'row' }}>
            <span style={S.evMin}>{ev.minute}</span>
            <span style={S.evIcon}>{eventIcon(ev)}</span>
            <span style={S.evPlayer}>{ev.player}</span>
          </div>
        ))
      )}
    </div>
  );
}

// ── main component ────────────────────────────────────────────────────────────
export function MatchModal({ match, onClose, use24h }) {
  const [now, setNow] = useState(Date.now());

  // 1-second ticker for live match minute
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  // Close on Escape key
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!match) return null;

  const md       = parseMatchDateTime(match.d, match.t);
  const live     = match.status === 'live';
  const finished = match.status === 'finished';
  const upcoming = !live && !finished;
  const liveMin  = live ? (match.clock || getLiveMinute(md, now)) : null;
  const venue    = VENUES[match.v] || { city: match.v, name: '' };
  const roundLabel = match.round || `Group ${match.g}`;

  const homeScore = match.homeScore ?? 0;
  const awayScore = match.awayScore ?? 0;
  const homeWins  = finished && homeScore > awayScore;
  const awayWins  = finished && awayScore > homeScore;

  const hasEvents = (match.events || []).length > 0;

  return (
    <div style={S.backdrop} onClick={onClose}>
      <div style={S.modal} onClick={e => e.stopPropagation()}>

        {/* ── Header bar ── */}
        <div style={S.modalHeader}>
          <div style={S.headerMeta}>
            <span style={S.roundChip}>{roundLabel}</span>
            {live && (
              <span style={S.liveChip}>
                <span style={{ animation: 'blink 1.4s infinite', marginRight: 4 }}>●</span>
                LIVE {liveMin && `· ${liveMin}`}
              </span>
            )}
            {finished && <span style={S.ftChip}>Full Time</span>}
          </div>
          <button style={S.closeBtn} onClick={onClose} aria-label="Close">✕</button>
        </div>

        {/* ── Scoreboard ── */}
        <div style={S.scoreboard}>
          <div style={{ ...S.sbTeam, alignItems: 'flex-end' }}>
            <div style={S.sbFlag}><FlagImg name={match.h} w={36} h={24} /></div>
            <div style={{ ...S.sbTeamName, color: homeWins ? 'var(--ac-gold)' : 'var(--tx-primary)' }}>
              {match.h}
              {homeWins && <span style={S.winBadge}>W</span>}
            </div>
          </div>

          <div style={S.sbCenter}>
            {upcoming ? (
              <div style={S.sbTime}>
                <div style={S.sbKickoff}>{fmtLocalTime(md, use24h)}</div>
                <div style={S.sbDate}>{new Date(md).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</div>
              </div>
            ) : (
              <div style={S.sbScore}>
                <span style={{ color: homeWins ? 'var(--ac-gold)' : live ? 'var(--ac-red)' : 'var(--tx-primary)' }}>{homeScore}</span>
                <span style={S.sbDash}>–</span>
                <span style={{ color: awayWins ? 'var(--ac-gold)' : live ? 'var(--ac-red)' : 'var(--tx-primary)' }}>{awayScore}</span>
              </div>
            )}
            {live && liveMin && <div style={S.liveTimer}>{liveMin}</div>}
            <div style={S.venueRow}>📍 {venue.name ? `${venue.name}, ` : ''}{venue.city}</div>
          </div>

          <div style={{ ...S.sbTeam, alignItems: 'flex-start' }}>
            <div style={S.sbFlag}><FlagImg name={match.a} w={36} h={24} /></div>
            <div style={{ ...S.sbTeamName, color: awayWins ? 'var(--ac-gold)' : 'var(--tx-primary)' }}>
              {match.a}
              {awayWins && <span style={S.winBadge}>W</span>}
            </div>
          </div>
        </div>

        {/* ── Match Events ── */}
        <div style={S.eventsSection}>
          <div style={S.eventsLabel}>Match Events</div>
          {upcoming ? (
            <div style={S.evUpcoming}>Match has not started yet</div>
          ) : !hasEvents ? (
            <div style={S.evUpcoming}>No events recorded</div>
          ) : (
            <div style={S.eventsGrid}>
              <EventsColumn
                team={match.h}
                events={match.events}
                teamId={match.homeTeamId}
                align="left"
              />
              <div style={S.evDivider} />
              <EventsColumn
                team={match.a}
                events={match.events}
                teamId={match.awayTeamId}
                align="right"
              />
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// ── styles ────────────────────────────────────────────────────────────────────
const S = {
  backdrop: {
    position: 'fixed', inset: 0,
    background: 'rgba(3,8,18,0.88)',
    zIndex: 10000,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: 16,
  },
  modal: {
    width: 'min(680px, 100%)',
    maxHeight: '90vh',
    overflowY: 'auto',
    background: 'var(--bg-card)',
    border: '1px solid var(--bd-modal)',
    borderRadius: 16,
    boxShadow: '0 24px 72px rgba(0,0,0,.65)',
  },
  modalHeader: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '12px 16px 0',
    gap: 8,
  },
  headerMeta: { display: 'flex', alignItems: 'center', gap: 8 },
  roundChip: {
    fontSize: 10, fontWeight: 700, letterSpacing: '.8px', textTransform: 'uppercase',
    color: 'var(--tx-muted)', background: 'var(--bg-inner)',
    padding: '3px 8px', borderRadius: 20,
  },
  liveChip: {
    fontSize: 10, fontWeight: 700, letterSpacing: '.5px',
    color: '#fff', background: 'var(--ac-red)',
    padding: '3px 8px', borderRadius: 20,
    display: 'flex', alignItems: 'center',
  },
  ftChip: {
    fontSize: 10, fontWeight: 700, letterSpacing: '.5px',
    color: 'var(--ac-green)', background: 'rgba(34,197,94,0.12)',
    padding: '3px 8px', borderRadius: 20,
  },
  closeBtn: {
    background: 'var(--bg-inner)', border: '1px solid var(--bd-close)',
    color: 'var(--tx-secondary)', borderRadius: 8,
    width: 30, height: 30, cursor: 'pointer',
    fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  scoreboard: {
    display: 'grid', gridTemplateColumns: '1fr auto 1fr',
    alignItems: 'center', gap: 8,
    padding: '20px 24px 16px',
  },
  sbTeam: { display: 'flex', flexDirection: 'column', gap: 8 },
  sbFlag: { lineHeight: 1 },
  sbTeamName: {
    fontSize: 16, fontWeight: 700,
    display: 'flex', alignItems: 'center', gap: 6,
  },
  winBadge: {
    fontSize: 9, background: 'var(--ac-green)', color: '#fff',
    fontWeight: 800, padding: '1px 4px', borderRadius: 4,
  },
  sbCenter: { textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 },
  sbScore: { fontSize: 42, fontWeight: 900, display: 'flex', alignItems: 'center', gap: 8, lineHeight: 1 },
  sbDash: { fontSize: 28, color: 'var(--tx-dim2)', fontWeight: 400 },
  sbKickoff: { fontSize: 28, fontWeight: 800, color: 'var(--ac-gold)' },
  sbDate: { fontSize: 11, color: 'var(--tx-dim)', marginTop: 2 },
  sbTime: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
  liveTimer: {
    fontSize: 13, fontWeight: 700, color: 'var(--ac-red)',
    background: 'rgba(220,38,38,0.12)',
    padding: '2px 10px', borderRadius: 12, letterSpacing: .4,
  },
  venueRow: { fontSize: 10, color: 'var(--tx-dim2)', marginTop: 2 },
  eventsSection: {
    borderTop: '1px solid var(--bd-main)',
    padding: '12px 20px 20px',
  },
  eventsLabel: {
    fontSize: 9, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase',
    color: 'var(--tx-muted)', marginBottom: 12,
  },
  eventsGrid: {
    display: 'grid', gridTemplateColumns: '1fr 1px 1fr', gap: 0,
  },
  evDivider: { background: 'var(--bd-main)', margin: '0 16px' },
  eventsCol: { display: 'flex', flexDirection: 'column', gap: 6 },
  evColHeader: {
    display: 'flex', alignItems: 'center', gap: 6,
    marginBottom: 8,
  },
  evTeamName: {
    fontSize: 11, fontWeight: 700, color: 'var(--ac-gold)',
    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
  },
  evRow: {
    display: 'flex', alignItems: 'center', gap: 5,
  },
  evMin: {
    fontSize: 10, fontWeight: 700, color: 'var(--tx-dim)',
    minWidth: 30, flexShrink: 0,
  },
  evIcon: { fontSize: 12, flexShrink: 0 },
  evPlayer: { fontSize: 11, color: 'var(--tx-secondary)' },
  evEmpty: { fontSize: 11, color: 'var(--tx-dim2)', fontStyle: 'italic' },
  evUpcoming: {
    fontSize: 12, color: 'var(--tx-dim)', textAlign: 'center',
    padding: '16px 0',
  },
};
