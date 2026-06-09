import React from 'react';
import { FLAGS, GROUPS, flagLabel } from './data';

export function Groups({ standings, matches, onTeamSelect }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 10, padding: 12 }}>
      {Object.keys(GROUPS).map(g => {
        const sorted = GROUPS[g].teams.map(n => {
          const s = standings[n] || { mp:0,w:0,d:0,l:0,gf:0,ga:0,pts:0 };
          return { name: n, ...s };
        }).sort((a,b) => b.pts-a.pts||(b.gf-b.ga)-(a.gf-a.ga)||b.gf-a.gf);

        const gMatches = matches.filter(m => m.g === g);
        const upcoming = gMatches.filter(m => m.status === 'upcoming').slice(0, 3);
        const played = gMatches.filter(m => m.status === 'finished');

        return (
          <div key={g} style={{ background: '#0f1828', border: '1px solid #1a2a40', borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ background: '#0a1420', padding: '5px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#f0c040', textTransform: 'uppercase', letterSpacing: '.8px' }}>Group {g}</span>
              <span style={{ fontSize: 9, color: '#3a4a60' }}>P W D L GD Pts</span>
            </div>
            {sorted.map((t, i) => (
              <div key={t.name} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderBottom: '1px solid #111d30', fontSize: 10, background: i < 2 ? '#0d1f12' : 'transparent', borderLeft: i < 2 ? '2px solid #22c55e' : '2px solid transparent', cursor: 'pointer' }} onClick={() => onTeamSelect?.(t.name)}>
                <span style={{ fontSize: 8, color: i < 2 ? '#22c55e' : '#3a4a60', width: 10, fontWeight: i < 2 ? 700 : 400 }}>{i+1}</span>
                <span style={{ fontSize: 13 }}>{FLAGS[t.name] || '🏳️'}</span>
                <span style={{ flex: 1, color: '#b0aaa0', fontSize: 10, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.name}</span>
                {[t.mp,t.w,t.d,t.l].map((v,j) => <span key={j} style={{ fontSize: 9, color: '#5a6a85', width: 18, textAlign: 'center' }}>{v}</span>)}
                <span style={{ fontSize: 9, color: '#5a6a85', width: 20, textAlign: 'center' }}>{t.gf-t.ga}</span>
                <span style={{ fontSize: 9, fontWeight: 600, color: '#e0ddd5', background: '#111d30', padding: '1px 4px', borderRadius: 2, minWidth: 18, textAlign: 'center' }}>{t.pts}</span>
              </div>
            ))}
            {played.length > 0 && (
              <div style={{ padding: '5px 10px 4px', borderTop: '1px solid #111d30' }}>
                <div style={{ fontSize: 8, color: '#3a4a60', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 3 }}>Results</div>
                {played.map(m => (
                  <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, padding: '2px 0', color: '#5a6a85' }}>
                    <span>{flagLabel(m.h)} <b style={{color:'#f0c040'}}>{m.homeScore}–{m.awayScore}</b> {flagLabel(m.a)}</span>
                    <span style={{ color: '#3a4a60' }}>{m.d.slice(5)}</span>
                  </div>
                ))}
              </div>
            )}
            {upcoming.length > 0 && (
              <div style={{ padding: '5px 10px 6px', borderTop: '1px solid #111d30' }}>
                <div style={{ fontSize: 8, color: '#3a4a60', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 3 }}>Upcoming</div>
                {upcoming.map(m => (
                  <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, padding: '2px 0', color: '#4a5a70' }}>
                    <span>{flagLabel(m.h)} vs {flagLabel(m.a)}</span>
                    <span>{m.d.slice(5)}</span>
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
