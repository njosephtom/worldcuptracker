import React from 'react';
import { GROUPS, flagLabel } from './data';
import { FlagImg } from './FlagImg';

export function Groups({ standings, matches, onTeamSelect, isMobile }) {
  const cols = isMobile ? '1fr' : 'repeat(4, minmax(0, 1fr))';
  return (
    <div style={{ display: 'grid', gridTemplateColumns: cols, gap: 10, padding: 12, fontFamily: 'var(--font-sans)' }}>
      {Object.keys(GROUPS).map(g => {
        const sorted = GROUPS[g].teams.map(n => {
          const s = standings[n] || { mp:0,w:0,d:0,l:0,gf:0,ga:0,pts:0 };
          return { name: n, ...s };
        }).sort((a,b) => b.pts-a.pts||(b.gf-b.ga)-(a.gf-a.ga)||b.gf-a.gf);

        const gMatches = matches.filter(m => m.g === g);
        const upcoming = gMatches.filter(m => m.status === 'upcoming').slice(0, 3);
        const played = gMatches.filter(m => m.status === 'finished');

        return (
          <div key={g} style={{ background: 'var(--bg-card)', border: '1px solid var(--bd-card)', borderRadius: 8, overflow: 'hidden' }}>
            {/* Header */}
            <div style={{ background: 'var(--bg-panel)', padding: '6px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 'var(--fs-sm)', fontWeight: 700, color: 'var(--ac-gold)', textTransform: 'uppercase', letterSpacing: '.6px' }}>Group {g}</span>
              <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--tx-dim2)', letterSpacing: '.3px' }}>P W D L GD Pts</span>
            </div>

            {/* Team rows */}
            {sorted.map((t, i) => (
              <div
                key={t.name}
                onClick={() => onTeamSelect?.(t.name)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px',
                  borderBottom: '1px solid var(--bg-inner)',
                  background: i < 2 ? 'var(--bg-qualified)' : (i % 2 === 0 ? 'var(--bg-stripe)' : 'transparent'),
                  borderLeft: i < 2 ? '2px solid var(--ac-green)' : '2px solid transparent',
                  cursor: 'pointer',
                }}
              >
                <span style={{ fontSize: 'var(--fs-xs)', color: i < 2 ? 'var(--ac-green)' : 'var(--tx-dim)', width: 11, fontWeight: i < 2 ? 700 : 400, flexShrink: 0 }}>{i+1}</span>
                <FlagImg name={t.name} w={20} h={14} />
                <span style={{ flex: 1, color: 'var(--tx-team)', fontSize: 'var(--fs-sm)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: 1.4 }}>{t.name}</span>
                {[t.mp,t.w,t.d,t.l].map((v,j) => (
                  <span key={j} style={{ fontSize: 'var(--fs-xs)', color: 'var(--tx-muted)', width: 18, textAlign: 'center' }}>{v}</span>
                ))}
                <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--tx-muted)', width: 20, textAlign: 'center' }}>{t.gf-t.ga}</span>
                <span style={{ fontSize: 'var(--fs-xs)', fontWeight: 700, color: 'var(--tx-primary)', background: 'var(--bg-inner)', padding: '1px 5px', borderRadius: 3, minWidth: 20, textAlign: 'center' }}>{t.pts}</span>
              </div>
            ))}

            {/* Results */}
            {played.length > 0 && (
              <div style={{ padding: '6px 10px 5px', borderTop: '1px solid var(--bg-inner)' }}>
                <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--tx-dim2)', textTransform: 'uppercase', letterSpacing: '.4px', marginBottom: 4, fontWeight: 600 }}>Results</div>
                {played.map(m => (
                  <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--fs-sm)', padding: '2px 0', color: 'var(--tx-muted)', lineHeight: 1.5 }}>
                    <span>{flagLabel(m.h)} <b style={{color:'var(--ac-gold)'}}>{m.homeScore}–{m.awayScore}</b> {flagLabel(m.a)}</span>
                    <span style={{ color: 'var(--tx-dim2)', flexShrink: 0, marginLeft: 8 }}>{m.d.slice(5)}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Upcoming */}
            {upcoming.length > 0 && (
              <div style={{ padding: '6px 10px 7px', borderTop: '1px solid var(--bg-inner)' }}>
                <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--tx-dim2)', textTransform: 'uppercase', letterSpacing: '.4px', marginBottom: 4, fontWeight: 600 }}>Upcoming</div>
                {upcoming.map(m => (
                  <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--fs-sm)', padding: '2px 0', color: 'var(--tx-dim)', lineHeight: 1.5 }}>
                    <span>{flagLabel(m.h)} vs {flagLabel(m.a)}</span>
                    <span style={{ flexShrink: 0, marginLeft: 8 }}>{m.d.slice(5)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
