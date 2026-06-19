import React, { useMemo } from 'react';
import { GROUPS, makeCmpTeams, FIFA_RANKING } from './data';
import { FlagImg } from './FlagImg';

function computeR32(standings, fifaRankings) {
  const cmp = makeCmpTeams(fifaRankings);
  const qualified = [];
  const thirdPlaced = [];

  Object.keys(GROUPS).forEach(g => {
    const sorted = GROUPS[g].teams
      .map(n => ({ name: n, group: g, ...(standings[n] || { mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 }) }))
      .sort(cmp);

    if (sorted[0]) qualified.push({ ...sorted[0], pos: 1, tag: 'auto' });
    if (sorted[1]) qualified.push({ ...sorted[1], pos: 2, tag: 'auto' });
    if (sorted[2]) thirdPlaced.push({ ...sorted[2], pos: 3, tag: '3rd' });
  });

  thirdPlaced.sort(cmp);
  const best8 = thirdPlaced.slice(0, 8).map(t => ({ ...t, tag: 'best3rd' }));
  const eliminated3rd = thirdPlaced.slice(8).map(t => ({ ...t, tag: 'out' }));

  const fourthPlaced = [];
  Object.keys(GROUPS).forEach(g => {
    const sorted = GROUPS[g].teams
      .map(n => ({ name: n, group: g, ...(standings[n] || { mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 }) }))
      .sort(cmp);
    if (sorted[3]) fourthPlaced.push({ ...sorted[3], pos: 4, tag: 'out' });
  });

  return {
    autoQualified: qualified,
    best8,
    eliminated3rd,
    fourthPlaced,
    allAdvancing: [...qualified, ...best8],
  };
}

export function R32Prediction({ standings, isMobile, fifaRankings }) {
  const rankings = fifaRankings || FIFA_RANKING;
  const pred = useMemo(() => computeR32(standings, rankings), [standings, rankings]);

  const hasData = pred.allAdvancing.some(t => t.mp > 0);

  return (
    <div style={{ padding: 12, fontFamily: 'var(--font-sans)' }}>
      {/* Header */}
      <div style={S.header}>
        <span style={S.headerTitle}>Round of 32 Prediction</span>
        <span style={S.headerSub}>
          Based on current group standings · Top 2 per group + 8 best 3rd-placed teams
        </span>
      </div>

      {!hasData && (
        <div style={S.noData}>
          No matches played yet. Predictions will appear once the group stage begins.
          Currently showing teams ranked by FIFA ranking within each group.
        </div>
      )}

      {/* Advancing: 32 teams */}
      <div style={S.sectionHeader}>
        <span style={{ color: 'var(--ac-green)' }}>✓</span> Advancing to Round of 32
        <span style={S.count}>{pred.allAdvancing.length}/32</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: 6, marginBottom: 16 }}>
        {pred.allAdvancing.map(t => (
          <TeamChip key={t.name} team={t} rankings={rankings} advancing />
        ))}
      </div>

      {/* Best 3rd place cutoff */}
      {pred.best8.length > 0 && pred.eliminated3rd.length > 0 && (
        <div style={S.cutoffLine}>
          <span style={S.cutoffDot} />
          <span style={S.cutoffText}>
            3rd-place cutoff: {pred.best8[pred.best8.length - 1].pts} pts
            {pred.best8[pred.best8.length - 1].mp > 0 && ` · GD ${pred.best8[pred.best8.length - 1].gf - pred.best8[pred.best8.length - 1].ga}`}
          </span>
          <span style={S.cutoffDot} />
        </div>
      )}

      {/* Eliminated */}
      <div style={S.sectionHeader}>
        <span style={{ color: 'var(--ac-red)' }}>✗</span> Eliminated
        <span style={S.count}>{pred.eliminated3rd.length + pred.fourthPlaced.length}</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: 6 }}>
        {[...pred.eliminated3rd, ...pred.fourthPlaced].map(t => (
          <TeamChip key={t.name} team={t} rankings={rankings} advancing={false} />
        ))}
      </div>
    </div>
  );
}

function TeamChip({ team, rankings, advancing }) {
  const gd = team.gf - team.ga;
  return (
    <div style={{
      ...S.chip,
      borderColor: advancing ? 'var(--ac-green)' : 'var(--bd-card)',
      background: advancing ? 'rgba(34,197,94,0.06)' : 'var(--bg-card)',
      opacity: advancing ? 1 : 0.6,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <FlagImg name={team.name} w={20} h={14} />
        <span style={{ fontSize: 'var(--fs-sm)', fontWeight: 600, color: 'var(--tx-primary)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {team.name}
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
        <span style={S.groupBadge}>
          {team.group}{team.pos}
        </span>
        <span style={{ fontSize: 10, color: 'var(--tx-dim)' }}>
          {team.mp > 0 ? `${team.pts}pts · GD ${gd > 0 ? '+' : ''}${gd}` : `#${rankings[team.name] || '?'}`}
        </span>
        {team.tag === 'best3rd' && (
          <span style={S.best3Tag}>Best 3rd</span>
        )}
      </div>
    </div>
  );
}

const S = {
  header: {
    background: 'var(--bg-panel)', borderRadius: 8, padding: '10px 14px', marginBottom: 12,
    border: '1px solid var(--bd-card)',
  },
  headerTitle: {
    fontSize: 'var(--fs-sm)', fontWeight: 700, color: 'var(--ac-gold)',
    textTransform: 'uppercase', letterSpacing: '.8px', display: 'block',
  },
  headerSub: {
    fontSize: 'var(--fs-xs)', color: 'var(--tx-dim)', marginTop: 2, display: 'block',
  },
  noData: {
    background: 'rgba(240,192,64,0.06)', border: '1px solid rgba(240,192,64,0.2)',
    borderRadius: 8, padding: '12px 14px', marginBottom: 14,
    fontSize: 'var(--fs-sm)', color: 'var(--tx-muted)', lineHeight: 1.5,
  },
  sectionHeader: {
    fontSize: 'var(--fs-sm)', fontWeight: 700, color: 'var(--tx-secondary)',
    textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 8,
    display: 'flex', alignItems: 'center', gap: 6,
  },
  count: {
    fontSize: 10, color: 'var(--tx-dim)', fontWeight: 400, marginLeft: 'auto',
  },
  chip: {
    border: '1px solid var(--bd-card)', borderRadius: 8, padding: '8px 10px',
  },
  groupBadge: {
    fontSize: 9, fontWeight: 700, color: 'var(--ac-gold)',
    background: 'rgba(240,192,64,0.12)', padding: '1px 5px', borderRadius: 3,
    textTransform: 'uppercase', letterSpacing: '.3px',
  },
  best3Tag: {
    fontSize: 8, fontWeight: 700, color: 'var(--ac-green)',
    background: 'rgba(34,197,94,0.12)', padding: '1px 5px', borderRadius: 3,
    textTransform: 'uppercase', letterSpacing: '.3px',
  },
  cutoffLine: {
    display: 'flex', alignItems: 'center', gap: 10, margin: '14px 0',
  },
  cutoffDot: {
    flex: 1, height: 1, background: 'var(--bd-card)',
  },
  cutoffText: {
    fontSize: 10, color: 'var(--tx-dim)', whiteSpace: 'nowrap',
    textTransform: 'uppercase', letterSpacing: '.4px', fontWeight: 600,
  },
};
