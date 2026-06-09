import React from 'react';
import { FLAGS, GROUPS, flagLabel } from './data';

function GroupBlock({ g, standings, matches, onTeamSelect, onTT, onMoveTT, onHideTT }) {
  const sorted = (standings[g] || GROUPS[g].teams.map(n => ({ name: n, mp:0,w:0,d:0,l:0,gf:0,ga:0,pts:0 })));
  return (
    <div style={S.bgrp}>
      <div style={S.bgrpLbl}>Group {g}</div>
      {sorted.map((t, i) => {
        const upcoming = matches.filter(m => m.g === g && (m.h === t.name || m.a === t.name) && m.status === 'upcoming').slice(0, 2);
        const ttHtml = `<div style="font-weight:500;color:#f0c040;margin-bottom:4px">${flagLabel(t.name)}</div><div style="color:#9ca3af">P${t.mp} W${t.w} D${t.d} L${t.l} · <b style="color:#e0ddd5">${t.pts}pts</b></div><div style="color:#6a7a90">GF${t.gf} GA${t.ga} GD${t.gf-t.ga}</div>${upcoming.map(m=>`<div style="margin-top:3px;color:#5a6a85;font-size:10px">vs ${flagLabel(m.h===t.name?m.a:m.h)} · ${m.d.slice(5)}</div>`).join('')}`;
        return (
          <div key={t.name} style={{ ...S.bteam, background: i < 2 ? '#0d1f12' : 'transparent', borderLeft: i < 2 ? '2px solid #22c55e' : '2px solid transparent' }}
            onClick={() => onTeamSelect?.(t.name)} onMouseEnter={e => onTT(e, ttHtml)} onMouseMove={onMoveTT} onMouseLeave={onHideTT}
          >
            <span style={{ fontSize: 8, color: i < 2 ? '#22c55e' : '#3a4a60', width: 10, fontWeight: i < 2 ? 600 : 400 }}>{i + 1}</span>
            <span style={{ fontSize: 12 }}>{FLAGS[t.name] || '🏳️'}</span>
            <span style={S.bname}>{t.name}</span>
            <span style={S.bpts}>{t.pts}</span>
          </div>
        );
      })}
    </div>
  );
}

export function Bracket({ matches, standings, onTeamSelect, onTT, onMoveTT, onHideTT }) {
  const left = ['A','B','C','D','E','F'];
  const right = ['G','H','I','J','K','L'];
  
  const groupStandingsArr = Object.fromEntries(
    Object.keys(GROUPS).map(g => [g, 
      GROUPS[g].teams.map(n => {
        const s = standings[n] || {mp:0,w:0,d:0,l:0,gf:0,ga:0,pts:0};
        return { name: n, ...s };
      }).sort((a,b) => b.pts-a.pts||(b.gf-b.ga)-(a.gf-a.ga)||b.gf-a.gf)
    ])
  );

  const r32left = ['1E','3+ABCDF','1I','2I','2A','2B','1F','2C','2K','2L','1H','2J','1D','3+BEFIJ','1G','3+AEHIJ'];
  const r32right = ['1C','2F','2E','2I','1A','3+CEFHI','1L','3+EHIJK','1J','2H','2D','2G','1B','3+CEFIJ','1K','3+DEIJL'];

  const ttKO = (label, when) => `<div style="font-weight:500;color:#f0c040;margin-bottom:4px">${label}</div><div style="color:#5a6a85;font-size:10px">${when}</div>`;

  return (
    <div style={{ overflowX: 'auto', padding: 10 }}>
      <div style={{ display: 'flex', gap: 0, alignItems: 'flex-start', minWidth: 880 }}>
        {/* LEFT GROUPS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5, minWidth: 168 }}>
          {left.map(g => <GroupBlock key={g} g={g} standings={groupStandingsArr} matches={matches} onTeamSelect={onTeamSelect} onTT={onTT} onMoveTT={onMoveTT} onHideTT={onHideTT} />)}
        </div>
        {/* LEFT R32 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 185, padding: '0 5px' }}>
          <div style={S.rlbl}>R32 · Jul 1–8</div>
          {r32left.map((s, i) => (
            <div key={i} style={S.kslot} onMouseEnter={e => onTT(e, ttKO(s, 'Round of 32 · Jul 1–8'))} onMouseMove={onMoveTT} onMouseLeave={onHideTT}>
              <div style={S.kteam}><span style={{fontSize:11}}>🏳️</span> {s}</div>
              <div style={{ ...S.kteam, color: '#2a3a50', fontSize: 8 }}>vs TBD</div>
            </div>
          ))}
        </div>
        {/* CENTER */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, minWidth: 200, padding: '0 6px' }}>
          <div style={S.rlbl}>Quarterfinals · Jul 4–5</div>
          {[0,1,2,3].map(i => (
            <div key={i} style={S.kslot} onMouseEnter={e => onTT(e, ttKO('Quarterfinal', 'Jul 4–5 · TBD'))} onMouseMove={onMoveTT} onMouseLeave={onHideTT}>
              <div style={S.kteam}><span style={{fontSize:11}}>🏳️</span> TBD</div>
              <div style={{ ...S.kteam, color: '#2a3a50', fontSize: 8 }}>vs TBD</div>
            </div>
          ))}
          <div style={{ ...S.rlbl, marginTop: 8 }}>Semifinals · Jul 11–15</div>
          {[0,1].map(i => (
            <div key={i} style={S.kslot} onMouseEnter={e => onTT(e, ttKO('Semifinal', i===0?'Jul 11 · Mercedes-Benz, Atlanta':'Jul 15 · AT&T, Dallas'))} onMouseMove={onMoveTT} onMouseLeave={onHideTT}>
              <div style={S.kteam}><span style={{fontSize:11}}>🏳️</span> TBD</div>
              <div style={{ ...S.kteam, color: '#2a3a50', fontSize: 8 }}>vs TBD</div>
            </div>
          ))}
          <div style={{ textAlign: 'center', padding: '6px 0' }}>
            <div style={{ fontSize: 26, marginBottom: 2 }}>🏆</div>
            <div style={S.rlbl}>Final · Jul 19</div>
            <div style={{ fontSize: 9, color: '#4a5a70', marginBottom: 4 }}>MetLife Stadium, NJ</div>
            <div style={{ ...S.kslot, maxWidth: 155, margin: '0 auto' }} onMouseEnter={e => onTT(e, ttKO('🏆 World Cup Final', 'Jul 19, 2026 · MetLife Stadium, East Rutherford NJ'))} onMouseMove={onMoveTT} onMouseLeave={onHideTT}>
              <div style={S.kteam}><span style={{fontSize:11}}>🏳️</span> TBD</div>
              <div style={{ ...S.kteam, color: '#2a3a50', fontSize: 8 }}>vs TBD</div>
            </div>
          </div>
        </div>
        {/* RIGHT R32 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 185, padding: '0 5px' }}>
          <div style={S.rlbl}>R32 · Jul 1–8</div>
          {r32right.map((s, i) => (
            <div key={i} style={S.kslot} onMouseEnter={e => onTT(e, ttKO(s, 'Round of 32 · Jul 1–8'))} onMouseMove={onMoveTT} onMouseLeave={onHideTT}>
              <div style={S.kteam}><span style={{fontSize:11}}>🏳️</span> {s}</div>
              <div style={{ ...S.kteam, color: '#2a3a50', fontSize: 8 }}>vs TBD</div>
            </div>
          ))}
        </div>
        {/* RIGHT GROUPS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5, minWidth: 168 }}>
          {right.map(g => <GroupBlock key={g} g={g} standings={groupStandingsArr} matches={matches} onTeamSelect={onTeamSelect} onTT={onTT} onMoveTT={onMoveTT} onHideTT={onHideTT} />)}
        </div>
      </div>
    </div>
  );
}

const S = {
  bgrp: { background: '#0f1828', border: '1px solid #1a2a40', borderRadius: 6, overflow: 'hidden' },
  bgrpLbl: { fontSize: 8, fontWeight: 600, color: '#f0c040', textTransform: 'uppercase', letterSpacing: '.8px', padding: '3px 8px', background: '#0a1420', borderBottom: '1px solid #1a2540' },
  bteam: { display: 'flex', alignItems: 'center', gap: 4, padding: '3px 8px', fontSize: 10, borderBottom: '1px solid #111d30', cursor: 'pointer', transition: 'background .12s' },
  bname: { flex: 1, color: '#b0aaa0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: 10 },
  bpts: { fontSize: 8, fontWeight: 600, background: '#111d30', color: '#7a8a9a', padding: '1px 4px', borderRadius: 2, minWidth: 16, textAlign: 'center' },
  kslot: { background: '#0f1828', border: '1px solid #1a2a40', borderRadius: 5, padding: '4px 7px', cursor: 'pointer', transition: 'border-color .12s' },
  kteam: { display: 'flex', alignItems: 'center', gap: 4, fontSize: 9, color: '#6a7a90', padding: '1px 0', overflow: 'hidden' },
  rlbl: { fontSize: 8, color: '#f0c040', textTransform: 'uppercase', letterSpacing: '.8px', textAlign: 'center', marginBottom: 3 },
};
