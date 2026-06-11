import React, { useEffect, useState } from 'react';
import { VENUES } from './data';
import { FlagImg } from './FlagImg';
import { getTeamSquad, getFallbackTeamSquad } from './squads';

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

function fmtLocalTime(d) {
  return d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit', hour12: true });
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

const POS_ORDER = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'];
const POS_SHORT = { Goalkeeper: 'GK', Defender: 'DEF', Midfielder: 'MID', Forward: 'FWD' };

function SquadColumn({ team, squad, loading }) {
  return (
    <div style={S.squadCol}>
      <div style={S.squadTeamHeader}>
        <FlagImg name={team} w={20} h={14} />
        <span style={S.squadTeamName}>{team}</span>
      </div>
      <div style={S.coachRow}>Coach: {squad.coach}</div>
      {loading ? (
        <div style={S.loading}>Loading…</div>
      ) : squad.players.length === 0 ? (
        <div style={S.noData}>No squad data</div>
      ) : (
        POS_ORDER.map(pos => {
          const group = squad.players.filter(p =>
            typeof p === 'string' ? p.includes(`(${pos})`) : p.position === pos
          );
          if (group.length === 0) return null;
          return (
            <div key={pos} style={S.posGroup}>
              <div style={S.posLabel}>{POS_SHORT[pos]}</div>
              {group.map((p, i) => {
                const name = typeof p === 'string' ? p.replace(` (${pos})`, '') : p.name;
                return (
                  <div key={i} style={S.playerRow}>
                    <span style={S.posDot} />
                    {name}
                  </div>
                );
              })}
            </div>
          );
        })
      )}
    </div>
  );
}

// ── main component ────────────────────────────────────────────────────────────
export function MatchModal({ match, onClose }) {
  const [now, setNow] = useState(Date.now());
  const [homeSquad, setHomeSquad] = useState(null);
  const [awaySquad, setAwaySquad] = useState(null);
  const [homeLoading, setHomeLoading] = useState(true);
  const [awayLoading, setAwayLoading] = useState(true);

  // 1-second ticker for live match minute
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  // Load squads for both teams
  useEffect(() => {
    if (!match) return;
    setHomeSquad(getFallbackTeamSquad(match.h));
    setAwaySquad(getFallbackTeamSquad(match.a));
    setHomeLoading(true);
    setAwayLoading(true);

    let cancelled = false;
    getTeamSquad(match.h).then(d => { if (!cancelled) { setHomeSquad(d); setHomeLoading(false); } });
    getTeamSquad(match.a).then(d => { if (!cancelled) { setAwaySquad(d); setAwayLoading(false); } });
    return () => { cancelled = true; };
  }, [match]);

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
  const liveMin  = live ? getLiveMinute(md, now) : null;
  const venue    = VENUES[match.v] || { city: match.v, name: '' };
  const roundLabel = match.round || `Group ${match.g}`;

  const homeScore = match.homeScore ?? 0;
  const awayScore = match.awayScore ?? 0;
  const homeWins  = finished && homeScore > awayScore;
  const awayWins  = finished && awayScore > homeScore;

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
          {/* Home team */}
          <div style={{ ...S.sbTeam, alignItems: 'flex-end' }}>
            <div style={S.sbFlag}><FlagImg name={match.h} w={36} h={24} /></div>
            <div style={{ ...S.sbTeamName, color: homeWins ? 'var(--ac-gold)' : 'var(--tx-primary)' }}>
              {match.h}
              {homeWins && <span style={S.winBadge}>W</span>}
            </div>
          </div>

          {/* Score / time */}
          <div style={S.sbCenter}>
            {upcoming ? (
              <div style={S.sbTime}>
                <div style={S.sbKickoff}>{fmtLocalTime(md)}</div>
                <div style={S.sbDate}>{new Date(md).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</div>
              </div>
            ) : (
              <div style={S.sbScore}>
                <span style={{ color: homeWins ? 'var(--ac-gold)' : live ? 'var(--ac-red)' : 'var(--tx-primary)' }}>{homeScore}</span>
                <span style={S.sbDash}>–</span>
                <span style={{ color: awayWins ? 'var(--ac-gold)' : live ? 'var(--ac-red)' : 'var(--tx-primary)' }}>{awayScore}</span>
              </div>
            )}
            {live && liveMin && (
              <div style={S.liveTimer}>{liveMin}</div>
            )}
            <div style={S.venueRow}>
              📍 {venue.name ? `${venue.name}, ` : ''}{venue.city}
            </div>
          </div>

          {/* Away team */}
          <div style={{ ...S.sbTeam, alignItems: 'flex-start' }}>
            <div style={S.sbFlag}><FlagImg name={match.a} w={36} h={24} /></div>
            <div style={{ ...S.sbTeamName, color: awayWins ? 'var(--ac-gold)' : 'var(--tx-primary)' }}>
              {match.a}
              {awayWins && <span style={S.winBadge}>W</span>}
            </div>
          </div>
        </div>

        {/* ── Squads ── */}
        <div style={S.squadsLabel}>Squads</div>
        <div style={S.squadsRow}>
          {homeSquad && (
            <SquadColumn team={match.h} squad={homeSquad} loading={homeLoading} />
          )}
          <div style={S.squadDivider} />
          {awaySquad && (
            <SquadColumn team={match.a} squad={awaySquad} loading={awayLoading} />
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
    width: 'min(760px, 100%)',
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
  squadsLabel: {
    fontSize: 9, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase',
    color: 'var(--tx-muted)', borderTop: '1px solid var(--bd-main)',
    padding: '10px 20px 0',
  },
  squadsRow: { display: 'grid', gridTemplateColumns: '1fr 1px 1fr', gap: 0, padding: '8px 16px 20px' },
  squadDivider: { background: 'var(--bd-main)', margin: '0 12px' },
  squadCol: { display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 },
  squadTeamHeader: { display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 },
  squadTeamName: { fontSize: 13, fontWeight: 700, color: 'var(--ac-gold)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  coachRow: { fontSize: 10, color: 'var(--tx-dim)', marginBottom: 8, fontStyle: 'italic' },
  posGroup: { marginBottom: 8 },
  posLabel: {
    fontSize: 8, fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase',
    color: 'var(--ac-gold)', marginBottom: 3,
  },
  playerRow: { fontSize: 11, color: 'var(--tx-secondary)', padding: '2px 0', display: 'flex', alignItems: 'center', gap: 5 },
  posDot: { width: 4, height: 4, borderRadius: '50%', background: 'var(--tx-dim2)', flexShrink: 0 },
  loading: { fontSize: 11, color: 'var(--tx-dim)', fontStyle: 'italic', padding: '8px 0' },
  noData: { fontSize: 11, color: 'var(--tx-dim2)', padding: '8px 0' },
};
