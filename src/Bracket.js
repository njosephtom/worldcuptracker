import React from 'react';
import { GROUPS, TEAM_CC } from './data';
import { FlagImg } from './FlagImg';

const GC = {
  A: '#22c55e', B: '#ef4444', C: '#f97316', D: '#3b82f6',
  E: '#a855f7', F: '#eab308', G: '#ec4899', H: '#06b6d4',
  I: '#8b5cf6', J: '#1d4ed8', K: '#ea580c', L: '#0d9488',
};

const STAGE_LBL = {
  fontSize: 7, color: 'var(--ac-gold)', textTransform: 'uppercase',
  letterSpacing: 0.8, textAlign: 'center', paddingBottom: 5, whiteSpace: 'nowrap',
};

// Rectangular standings-style group card: flag | CC | P W D L Pts
function GroupCard({ g, teams, onTeamSelect, onTT, onMoveTT, onHideTT }) {
  const color = GC[g];
  return (
    <div style={{ border: `2px solid ${color}`, borderRadius: 6, overflow: 'hidden', flexShrink: 0, width: 162 }}>
      {/* GROUP label */}
      <div style={{
        background: color, color: g === 'F' ? '#000' : '#fff',
        fontWeight: 900, fontSize: 8, textAlign: 'center',
        padding: '3px 6px', letterSpacing: 1.5, textTransform: 'uppercase',
        fontFamily: 'monospace',
      }}>
        GROUP {g}
      </div>
      {/* Column headers */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '2px 5px', background: 'var(--brk-cell)', borderBottom: '1px solid var(--brk-div)' }}>
        <div style={{ flex: 1 }} />
        {['P', 'W', 'D', 'L', 'Pts'].map(h => (
          <div key={h} style={{ width: 20, textAlign: 'center', fontSize: 7, color: 'var(--brk-dim)', fontWeight: 700 }}>{h}</div>
        ))}
      </div>
      {/* Team rows */}
      {teams.map((t, i) => {
        const cc = TEAM_CC[t.name] || t.name.slice(0, 3).toUpperCase();
        const ttHtml = `<div style="font-weight:700;color:var(--ac-gold);font-size:13px;margin-bottom:2px">${cc}</div><div style="color:var(--tx-secondary);font-size:10px">${t.name}</div>`;
        return (
          <div
            key={t.name}
            onClick={() => onTeamSelect?.(t.name)}
            onMouseEnter={e => onTT(e, ttHtml)}
            onMouseMove={onMoveTT}
            onMouseLeave={onHideTT}
            style={{
              display: 'flex', alignItems: 'center', gap: 4, padding: '3px 5px',
              background: i < 2 ? 'var(--bg-qualified)' : 'var(--brk-cell)',
              borderBottom: i < 3 ? '1px solid var(--brk-div)' : 'none',
              cursor: 'pointer',
            }}
          >
            <FlagImg name={t.name} w={18} h={12} />
            <span style={{ flex: 1, fontSize: 8, color: 'var(--brk-txt)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cc}</span>
            {[t.mp, t.w, t.d, t.l, t.pts].map((v, j) => (
              <span key={j} style={{
                width: 20, textAlign: 'center', fontSize: 8,
                color: j === 4 ? 'var(--ac-gold)' : 'var(--brk-txt)',
                fontWeight: j === 4 ? 700 : 400,
              }}>{v}</span>
            ))}
          </div>
        );
      })}
    </div>
  );
}

// Single bracket slot
function Slot({ label }) {
  return (
    <div style={{
      background: 'var(--brk-slot)', border: '1px solid var(--brk-bd)',
      borderRadius: 3, padding: '4px 7px', height: 27,
      display: 'flex', alignItems: 'center',
    }}>
      <span style={{
        fontSize: 9, color: label ? 'var(--brk-txt)' : 'transparent',
        fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
      }}>
        {label || '.'}
      </span>
    </div>
  );
}

// Pair of slots with a bracket arm pointing inward
function Pair({ top = '', bottom = '', side = 'left' }) {
  const armStyle = {
    width: 13, flexShrink: 0,
    borderTop: '2px solid var(--brk-arm)',
    borderBottom: '2px solid var(--brk-arm)',
    [side === 'left' ? 'borderRight' : 'borderLeft']: '2px solid var(--brk-arm)',
  };
  return (
    <div style={{ display: 'flex', alignItems: 'stretch', width: '100%' }}>
      {side === 'right' && <div style={armStyle} />}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3, flex: 1, minWidth: 0 }}>
        <Slot label={top} />
        <Slot label={bottom} />
      </div>
      {side === 'left' && <div style={armStyle} />}
    </div>
  );
}

// A stage column with n evenly-distributed pairs and an optional date label
function StageCol({ n, side, label }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 104, padding: '0 1px' }}>
      {label && <div style={STAGE_LBL}>{label}</div>}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', flex: 1 }}>
        {Array.from({ length: n }).map((_, i) => <Pair key={i} side={side} />)}
      </div>
    </div>
  );
}

const R32L = [
  ['1E', '3+ABCDF'], ['1I', '2I'], ['2A', '2B'], ['1F', '2C'],
  ['2K', '2L'], ['1H', '2J'], ['1D', '3+BEFIJ'], ['1G', '3+AEHIJ'],
];
const R32R = [
  ['1C', '2F'], ['2E', '2I'], ['1A', '3+CEFHI'], ['1L', '3+EHIJK'],
  ['1J', '2H'], ['2D', '2G'], ['1B', '3+CEFIJ'], ['1K', '3+DEIJL'],
];

export function Bracket({ matches, standings, onTeamSelect, onTT, onMoveTT, onHideTT }) {
  const leftG = ['A', 'B', 'C', 'D', 'E', 'F'];
  const rightG = ['G', 'H', 'I', 'J', 'K', 'L'];

  const gs = Object.fromEntries(
    Object.keys(GROUPS).map(g => [g,
      GROUPS[g].teams.map(n => {
        const s = standings[n] || { mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 };
        return { name: n, ...s };
      }).sort((a, b) => b.pts - a.pts || (b.gf - b.ga) - (a.gf - a.ga) || b.gf - a.gf)
    ])
  );

  return (
    <div style={{
      height: '100%', background: 'var(--brk-bg)', color: 'var(--brk-txt)',
      display: 'flex', flexDirection: 'column',
      padding: '10px 6px 8px', userSelect: 'none', minWidth: 1100,
      fontFamily: "'Roboto Mono', monospace",
    }}>

      {/* BRACKET BODY */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0, alignItems: 'stretch', gap: 0 }}>

        {/* LEFT GROUPS */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', flexShrink: 0, paddingRight: 4 }}>
          {leftG.map(g => (
            <GroupCard key={g} g={g} teams={gs[g]}
              onTeamSelect={onTeamSelect} onTT={onTT} onMoveTT={onMoveTT} onHideTT={onHideTT} />
          ))}
        </div>

        {/* LEFT R32 */}
        <div style={{ display: 'flex', flexDirection: 'column', flexShrink: 0, width: 118, padding: '0 2px' }}>
          <div style={STAGE_LBL}>R32 · Jun 29–Jul 4</div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', flex: 1 }}>
            {R32L.map(([top, bottom], i) => (
              <Pair key={i} top={top} bottom={bottom} side="left" />
            ))}
          </div>
        </div>

        {/* LEFT R16 → QF → SF */}
        <StageCol n={4} side="left" label="R16 · Jul 6–9" />
        <StageCol n={2} side="left" label="QF · Jul 11–12" />
        <StageCol n={1} side="left" label="SF · Jul 15–16" />

        {/* CENTER — FINAL + TROPHY + BRONZE */}
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, width: 148, padding: '0 6px', gap: 10,
        }}>
          {/* FINAL */}
          <div style={{ width: '100%' }}>
            <div style={{ fontSize: 8, color: 'var(--ac-gold)', textTransform: 'uppercase', letterSpacing: 1.5, textAlign: 'center', marginBottom: 5, fontWeight: 700 }}>
              🏆 Final · Jul 19
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              <Slot />
              <div style={{ textAlign: 'center', fontSize: 9, color: 'var(--brk-arm)', padding: '3px 0', letterSpacing: 1 }}>vs</div>
              <Slot />
            </div>
          </div>

          {/* TROPHY */}
          <div style={{ fontSize: 58, lineHeight: 1, textAlign: 'center', filter: 'drop-shadow(0 0 14px rgba(240,192,64,.5))' }}>🏆</div>

          {/* BRONZE */}
          <div style={{ width: '100%' }}>
            <div style={{ fontSize: 8, color: 'var(--brk-dim)', textTransform: 'uppercase', letterSpacing: 1.5, textAlign: 'center', marginBottom: 5 }}>
              🥉 Third Place · Jul 19
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              <Slot />
              <div style={{ textAlign: 'center', fontSize: 9, color: 'var(--brk-arm)', padding: '3px 0', letterSpacing: 1 }}>vs</div>
              <Slot />
            </div>
          </div>
        </div>

        {/* RIGHT SF → QF → R16 */}
        <StageCol n={1} side="right" label="SF · Jul 15–16" />
        <StageCol n={2} side="right" label="QF · Jul 11–12" />
        <StageCol n={4} side="right" label="R16 · Jul 6–9" />

        {/* RIGHT R32 */}
        <div style={{ display: 'flex', flexDirection: 'column', flexShrink: 0, width: 118, padding: '0 2px' }}>
          <div style={STAGE_LBL}>R32 · Jun 29–Jul 4</div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', flex: 1 }}>
            {R32R.map(([top, bottom], i) => (
              <Pair key={i} top={top} bottom={bottom} side="right" />
            ))}
          </div>
        </div>

        {/* RIGHT GROUPS */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', flexShrink: 0, paddingLeft: 4 }}>
          {rightG.map(g => (
            <GroupCard key={g} g={g} teams={gs[g]}
              onTeamSelect={onTeamSelect} onTT={onTT} onMoveTT={onMoveTT} onHideTT={onHideTT} />
          ))}
        </div>

      </div>
    </div>
  );
}
