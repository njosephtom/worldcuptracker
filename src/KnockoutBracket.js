import React, { useState, useMemo } from 'react';
import { FlagImg } from './FlagImg';
import { TEAM_CC, GROUPS } from './data';
import { MOCK_RESULTS } from './mockBracket';
import trophyUrl from './trophy.svg';

// ─── Layout constants ─────────────────────────────────────────────────────────
const CW  = 140;
const CH  = 62;
const SH  = 76;
const GX  = 36;
const TH  = 16 * SH;
const TW  = 5 * (CW + GX) - GX + 2;
const COL = (r) => ({ R32:0, R16:1, QF:2, SF:3, Final:4 }[r] ?? 0);

const GS_DIV = 20;
const GS_W   = 2 * (CW + GX) + GS_DIV;

// ─── Bracket structure ────────────────────────────────────────────────────────
function cardCY(round, pos) {
  const g = { R32:1, R16:2, QF:4, SF:8, Final:16 }[round] ?? 1;
  return (pos * g + g / 2) * SH;
}
function cardX(round) { return COL(round) * (CW + GX); }

const BD = {
  72: { r:'R32', p:0,  h:'1E',  a:'3+ABCDF', pid:88 },
  73: { r:'R32', p:1,  h:'1C',  a:'2F',      pid:88 },
  74: { r:'R32', p:2,  h:'1I',  a:'3+CDFGH', pid:89 },
  75: { r:'R32', p:3,  h:'2E',  a:'2I',      pid:89 },
  76: { r:'R32', p:4,  h:'2A',  a:'2B',      pid:90 },
  77: { r:'R32', p:5,  h:'1A',  a:'3+CEFHI', pid:90 },
  78: { r:'R32', p:6,  h:'1F',  a:'2C',      pid:91 },
  79: { r:'R32', p:7,  h:'1L',  a:'3+EHIJK', pid:91 },
  80: { r:'R32', p:8,  h:'2K',  a:'2L',      pid:92 },
  81: { r:'R32', p:9,  h:'1J',  a:'2H',      pid:92 },
  82: { r:'R32', p:10, h:'1H',  a:'2J',      pid:93 },
  83: { r:'R32', p:11, h:'2D',  a:'2G',      pid:93 },
  84: { r:'R32', p:12, h:'1D',  a:'3+BEFIJ', pid:94 },
  85: { r:'R32', p:13, h:'1G',  a:'3+AEHIJ', pid:94 },
  86: { r:'R32', p:14, h:'1B',  a:'3+EFGIJ', pid:95 },
  87: { r:'R32', p:15, h:'1K',  a:'3+DEIJL', pid:95 },
  88: { r:'R16', p:0,  h:'TBD', a:'TBD', pid:96,  kids:[72,73] },
  89: { r:'R16', p:1,  h:'TBD', a:'TBD', pid:96,  kids:[74,75] },
  90: { r:'R16', p:2,  h:'TBD', a:'TBD', pid:97,  kids:[76,77] },
  91: { r:'R16', p:3,  h:'TBD', a:'TBD', pid:97,  kids:[78,79] },
  92: { r:'R16', p:4,  h:'TBD', a:'TBD', pid:98,  kids:[80,81] },
  93: { r:'R16', p:5,  h:'TBD', a:'TBD', pid:98,  kids:[82,83] },
  94: { r:'R16', p:6,  h:'TBD', a:'TBD', pid:99,  kids:[84,85] },
  95: { r:'R16', p:7,  h:'TBD', a:'TBD', pid:99,  kids:[86,87] },
  96: { r:'QF',  p:0,  h:'TBD', a:'TBD', pid:100, kids:[88,89] },
  97: { r:'QF',  p:1,  h:'TBD', a:'TBD', pid:100, kids:[90,91] },
  98: { r:'QF',  p:2,  h:'TBD', a:'TBD', pid:101, kids:[92,93] },
  99: { r:'QF',  p:3,  h:'TBD', a:'TBD', pid:101, kids:[94,95] },
 100: { r:'SF',  p:0,  h:'TBD', a:'TBD', pid:103, kids:[96,97] },
 101: { r:'SF',  p:1,  h:'TBD', a:'TBD', pid:103, kids:[98,99] },
 103: { r:'Final', p:0, h:'TBD', a:'TBD',          kids:[100,101] },
 102: { r:'Bronze', p:0, h:'TBD', a:'TBD'                        },
};

// ─── Merge mock results into bracket ─────────────────────────────────────────
const BDM = {};
Object.entries(BD).forEach(([id, m]) => {
  const r = MOCK_RESULTS[+id];
  BDM[+id] = r ? { ...m, h:r.h, a:r.a, hs:r.hs, as:r.as } : { ...m };
});

function pathFor(slot) {
  if (!slot || slot === 'TBD') return new Set();
  const ids = new Set();
  for (const [id, m] of Object.entries(BDM)) {
    if (m.r !== 'R32') continue;
    if (m.h === slot || m.a === slot) {
      let cur = +id;
      while (cur) { ids.add(cur); cur = BD[cur]?.pid; }
    }
  }
  return ids;
}

function slotLine(slot) {
  if (!slot || slot === 'TBD') return { main:'TBD', sub:null, tbd:true };
  if (slot.startsWith('3+'))   return { main:'3 ' + slot.slice(2), sub:null, tbd:false };
  return { main:slot, sub:null, tbd:false };
}
const teamCC = (name) => TEAM_CC[name] || name.slice(0,3).toUpperCase();

// ─── SVG connectors ───────────────────────────────────────────────────────────
function ConnectorLines({ highlighted }) {
  const paths = useMemo(() => {
    const lines = [];
    for (const [id, m] of Object.entries(BD)) {
      if (!m.kids || m.r === 'Bronze') continue;
      const px = cardX(m.r);
      const py = cardCY(m.r, m.p);
      for (const kid of m.kids) {
        const km = BD[kid];
        if (!km) continue;
        const kx = cardX(km.r);
        const ky = cardCY(km.r, km.p);
        const mx = kx + CW + GX / 2;
        const on = highlighted.has(+id) && highlighted.has(kid);
        lines.push({ key:`${id}-${kid}`, x1:kx+CW, y1:ky, x2:px, y2:py, mx, on });
      }
    }
    return lines;
  }, [highlighted]);

  return (
    <svg style={{ position:'absolute', top:0, left:0, pointerEvents:'none', overflow:'visible' }}
      width={TW} height={TH}>
      {paths.map(({ key, x1, y1, x2, y2, mx, on }) => (
        <path key={key} d={`M${x1},${y1} H${mx} V${y2} H${x2}`} fill="none"
          stroke={on ? '#f0c040' : 'var(--brk-arm)'}
          strokeWidth={on ? 2 : 1} strokeOpacity={on ? 0.9 : 0.5}
          style={{ transition:'stroke .18s, stroke-width .18s' }} />
      ))}
    </svg>
  );
}

// ─── Knockout team slot ───────────────────────────────────────────────────────
function TeamSlot({ slot, score, isWinner, isActive, onEnter, onLeave, onClick }) {
  const { main, sub, tbd } = slotLine(slot);
  return (
    <div onMouseEnter={onEnter} onMouseLeave={onLeave} onClick={onClick} style={{
      display:'flex', alignItems:'center', gap:5, padding:'4px 7px', minHeight:CH/2,
      cursor: tbd ? 'default' : 'pointer',
      background: isActive ? 'rgba(240,192,64,0.10)' : (isWinner ? 'rgba(34,197,94,0.09)' : 'transparent'),
      boxShadow: isWinner ? 'inset 3px 0 0 var(--ac-green)' : 'none',
      transition:'background .15s', borderRadius:3, flexShrink:0,
    }}>
      {!tbd && <FlagImg name={slot} w={18} h={12} />}
      {tbd  && <span style={{ width:18, height:12, display:'inline-block', background:'var(--brk-div)', borderRadius:2 }} />}
      <div style={{ minWidth:0, flex:1 }}>
        <div style={{ fontSize:'var(--fs-sm)', fontWeight:tbd?400:600,
          color: isWinner ? 'var(--ac-gold)' : (tbd?'var(--brk-dim)':'var(--brk-txt)'),
          whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', lineHeight:1.4 }}>{main}</div>
        {sub && <div style={{ fontSize:'var(--fs-xs)', color:'var(--brk-dim)', marginTop:1 }}>{sub}</div>}
      </div>
      {isWinner && (
        <span style={{ fontSize:7, background:'var(--ac-green)', color:'#fff', fontWeight:800,
          padding:'1px 3px', borderRadius:3, flexShrink:0, letterSpacing:0.3 }}>W</span>
      )}
      {score !== undefined && (
        <span style={{ fontSize:'var(--fs-sm)', fontWeight:800, flexShrink:0, minWidth:14, textAlign:'right',
          color: isWinner ? 'var(--ac-gold)' : 'var(--brk-dim)' }}>{score}</span>
      )}
    </div>
  );
}

// ─── Knockout match card ──────────────────────────────────────────────────────
function MatchCard({ id, m, highlighted, hoveredSlot, onSlotEnter, onSlotLeave, onSlotClick }) {
  const isOnPath = highlighted.has(id);
  const fin      = m.hs !== undefined;
  const homeWins = fin && m.hs > m.as;
  const awayWins = fin && m.as > m.hs;
  const isFinal  = id === 103;
  return (
    <div style={{
      position:'absolute', left:cardX(m.r), top:cardCY(m.r, m.p) - CH/2,
      width:CW, minHeight:CH,
      background: isOnPath ? 'rgba(240,192,64,0.06)' : 'var(--brk-cell)',
      border:`1px solid ${(isOnPath || (isFinal && fin)) ? 'rgba(240,192,64,0.55)' : 'var(--brk-bd)'}`,
      borderRadius:5,
      boxShadow: isFinal && fin ? '0 0 24px rgba(240,192,64,0.4)' : isOnPath ? '0 0 10px rgba(240,192,64,0.15)' : 'none',
      transition:'border-color .18s, box-shadow .18s, background .18s',
      zIndex: isFinal && fin ? 3 : isOnPath ? 2 : 1,
    }}>
      <TeamSlot slot={m.h} score={fin ? m.hs : undefined} isWinner={homeWins}
        isActive={m.h === hoveredSlot}
        onEnter={() => onSlotEnter(m.h)} onLeave={onSlotLeave} onClick={() => onSlotClick(m.h)} />
      <div style={{ height:1, background:'var(--brk-div)', margin:'0 7px' }} />
      <TeamSlot slot={m.a} score={fin ? m.as : undefined} isWinner={awayWins}
        isActive={m.a === hoveredSlot}
        onEnter={() => onSlotEnter(m.a)} onLeave={onSlotLeave} onClick={() => onSlotClick(m.a)} />
    </div>
  );
}

// ─── Bronze card ──────────────────────────────────────────────────────────────
function BronzeCard() {
  const mock = MOCK_RESULTS[102];
  const x    = cardX('Final');
  const y    = TH - SH * 2.5;
  const fin      = !!mock;
  const homeWins = fin && mock.hs > mock.as;
  const awayWins = fin && mock.as > mock.hs;

  const Row = ({ name, score, wins }) => (
    <div style={{ display:'flex', alignItems:'center', gap:5, padding:'3px 7px', minHeight:(CH-14)/2,
      background: wins ? 'rgba(34,197,94,0.09)' : 'transparent',
      boxShadow: wins ? 'inset 3px 0 0 var(--ac-green)' : 'none' }}>
      {fin
        ? <FlagImg name={name} w={18} h={12} />
        : <span style={{ width:18, height:12, display:'inline-block', background:'var(--brk-div)', borderRadius:2 }} />}
      <span style={{ flex:1, fontSize:'var(--fs-xs)', fontWeight:600, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
        color: wins ? 'var(--ac-gold)' : (fin ? 'var(--brk-txt)' : 'var(--brk-dim)') }}>
        {fin ? name : 'TBD'}
      </span>
      {wins && <span style={{ fontSize:7, background:'var(--ac-green)', color:'#fff', fontWeight:800, padding:'1px 3px', borderRadius:3, flexShrink:0 }}>W</span>}
      {fin && <span style={{ fontSize:'var(--fs-xs)', fontWeight:800, color: wins ? 'var(--ac-gold)' : 'var(--brk-dim)' }}>{score}</span>}
    </div>
  );

  return (
    <div style={{ position:'absolute', left:x, top:y, width:CW, minHeight:CH,
      background:'var(--brk-cell)', border:'1px solid var(--brk-bd)', borderRadius:5 }}>
      <div style={{ fontSize:'var(--fs-xs)', color:'var(--brk-dim)', textAlign:'center',
        padding:'2px 0', borderBottom:'1px solid var(--brk-div)', letterSpacing:0.5, textTransform:'lowercase' }}>
        🥉 3rd Place · Jul 19
      </div>
      <Row name={mock?.h} score={mock?.hs} wins={homeWins} />
      <div style={{ height:1, background:'var(--brk-div)', margin:'0 7px' }} />
      <Row name={mock?.a} score={mock?.as} wins={awayWins} />
    </div>
  );
}

// ─── Champion banner ──────────────────────────────────────────────────────────
function ChampionBanner() {
  const m = MOCK_RESULTS[103];
  if (!m) return null;
  const champion = m.as > m.hs ? m.a : m.h;
  const score    = m.as > m.hs ? `${m.as}–${m.hs}` : `${m.hs}–${m.as}`;
  const x = cardX('Final');
  const y = cardCY('Final', 0) + CH / 2 + 10;
  return (
    <div style={{
      position:'absolute', left:x - 12, top:y, width:CW + 24,
      background:'linear-gradient(135deg,rgba(240,192,64,0.18),rgba(240,192,64,0.07))',
      border:'1px solid rgba(240,192,64,0.55)',
      borderRadius:8, padding:'8px 10px', textAlign:'center', zIndex:5,
    }}>
      <div style={{ fontSize:8, color:'var(--brk-dim)', letterSpacing:1, textTransform:'uppercase', marginBottom:5 }}>
        🏆 World Champions
      </div>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, marginBottom:4 }}>
        <FlagImg name={champion} w={28} h={20} />
        <span style={{ fontSize:'var(--fs-base)', fontWeight:800, color:'var(--ac-gold)', letterSpacing:0.3 }}>{champion}</span>
      </div>
      <div style={{ fontSize:9, color:'var(--brk-dim)', letterSpacing:0.5 }}>
        Final: {m.h} {score} {m.a} · Jul 19, 2026
      </div>
    </div>
  );
}

// ─── Group stage: compact flag card ──────────────────────────────────────────
const ALL_GROUPS   = ['A','B','C','D','E','F','G','H','I','J','K','L'];
const LEFT_GROUPS  = ['A','B','C','D','E','F'];
const RIGHT_GROUPS = ['G','H','I','J','K','L'];

function BracketGroupCard({ g, standings, onTT, onMoveTT, onHideTT }) {
  const [activeTeam, setActiveTeam] = useState(null);

  const teams = useMemo(() => {
    return (GROUPS[g]?.teams || []).map(name => {
      const s = standings[name] || { mp:0, w:0, d:0, l:0, gf:0, ga:0, pts:0 };
      return { name, ...s };
    }).sort((a,b) => b.pts - a.pts || (b.gf - b.ga) - (a.gf - a.ga) || b.gf - a.gf);
  }, [g, standings]);

  return (
    <div style={{ border:'1px solid var(--brk-bd)', borderRadius:5, overflow:'visible', marginBottom:7, flexShrink:0, width:CW }}>
      <div style={{ background:'var(--brk-div)', padding:'4px 7px',
        fontSize:9, fontWeight:700, color:'var(--ac-gold)',
        textTransform:'uppercase', letterSpacing:0.8, borderRadius:'4px 4px 0 0' }}>
        Group {g}
      </div>
      {teams.map((t, i) => {
        const isActive = activeTeam === t.name;
        const ccCode = teamCC(t.name);
        const ttHtml = `<div style="font-weight:700;color:var(--ac-gold);font-size:12px;margin-bottom:4px">${ccCode} · ${t.name}</div><div style="display:flex;gap:10px;font-size:10px"><span><span style="color:var(--tx-dim2)">P&nbsp;</span><b>${t.mp}</b></span><span><span style="color:var(--tx-dim2)">W&nbsp;</span><b>${t.w}</b></span><span><span style="color:var(--tx-dim2)">D&nbsp;</span><b>${t.d}</b></span><span><span style="color:var(--tx-dim2)">L&nbsp;</span><b>${t.l}</b></span><span style="color:var(--ac-gold)"><span style="color:var(--tx-dim2)">Pts&nbsp;</span><b>${t.pts}</b></span></div>`;
        return (
          <div key={t.name}>
            <div
              onClick={() => setActiveTeam(isActive ? null : t.name)}
              onMouseEnter={e => onTT?.(e, ttHtml)}
              onMouseMove={onMoveTT}
              onMouseLeave={onHideTT}
              style={{
                display:'flex', alignItems:'center', gap:5, padding:'4px 7px',
                background: i < 2 ? 'var(--bg-qualified)' : 'var(--brk-cell)',
                borderBottom:'1px solid var(--brk-div)',
                borderLeft: i < 2 ? '2px solid var(--ac-green)' : '2px solid transparent',
                cursor:'pointer', transition:'background .12s',
              }}>
              <span style={{ fontSize:8, color:i < 2 ? 'var(--ac-green)' : 'var(--brk-dim)', width:9, flexShrink:0 }}>{i+1}</span>
              <FlagImg name={t.name} w={22} h={15} />
              <span style={{ flex:1, fontSize:9, color:'var(--brk-txt)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', fontWeight:600 }}>{ccCode}</span>
              {t.pts > 0 && <span style={{ fontSize:8, color:'var(--ac-gold)', fontWeight:700, flexShrink:0 }}>{t.pts}</span>}
            </div>
            {isActive && (
              <div style={{ display:'flex', flexWrap:'wrap', gap:4, padding:'4px 7px',
                background:'rgba(240,192,64,0.07)', borderBottom:'1px solid var(--brk-div)' }}>
                {[['P', t.mp],['W', t.w],['D', t.d],['L', t.l],['Pts', t.pts]].map(([lbl, val]) => (
                  <span key={lbl} style={{ fontSize:9 }}>
                    <span style={{ color:'var(--brk-dim)' }}>{lbl}:</span>
                    <b style={{ color: lbl==='Pts' ? 'var(--ac-gold)' : 'var(--brk-txt)', marginLeft:2 }}>{val}</b>
                  </span>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Group stage: desktop section ─────────────────────────────────────────────
function GroupStageDesktop({ standings, onTT, onMoveTT, onHideTT }) {
  const renderCol = (groups) => (
    <div style={{ width:CW, flexShrink:0, overflowY:'auto', overflowX:'visible', height:TH }}>
      {groups.map(g => (
        <BracketGroupCard key={g} g={g} standings={standings}
          onTT={onTT} onMoveTT={onMoveTT} onHideTT={onHideTT} />
      ))}
    </div>
  );
  return (
    <div style={{ display:'flex', gap:GX, flexShrink:0, paddingRight:GS_DIV }}>
      {renderCol(LEFT_GROUPS)}
      {renderCol(RIGHT_GROUPS)}
    </div>
  );
}

// ─── Round headers ─────────────────────────────────────────────────────────────
const ROUND_HEADERS = [
  { r:'R32',   label:'Round of 32',    date:'Jun 29–Jul 4'  },
  { r:'R16',   label:'Round of 16',    date:'Jul 6–9'       },
  { r:'QF',    label:'Quarter-finals', date:'Jul 11–12'     },
  { r:'SF',    label:'Semi-finals',    date:'Jul 15–16'     },
  { r:'Final', label:'Final',          date:'Jul 19'        },
];

// ─── Desktop bracket ──────────────────────────────────────────────────────────
function DesktopBracket({ standings, hoveredSlot, setHoveredSlot, onTT, onMoveTT, onHideTT }) {
  const highlighted    = useMemo(() => pathFor(hoveredSlot), [hoveredSlot]);
  const allKnockoutIds = Object.keys(BD).map(Number).filter(id => BD[id].r !== 'Bronze');
  const TOTAL_W        = GS_W + TW;
  const hasMock        = !!MOCK_RESULTS[103];
  const trophyTop      = cardCY('Final', 0) + CH / 2 + (hasMock ? 110 : 14);

  return (
    <div style={{ overflowX:'auto', overflowY:'auto', flex:1, minHeight:0 }}>
      <div style={{ display:'flex', position:'sticky', top:0, zIndex:10,
        background:'var(--brk-bg)', borderBottom:'1px solid var(--brk-div)', minWidth:TOTAL_W + 2 }}>
        <div style={{ width:GS_W, flexShrink:0, textAlign:'center', padding:'6px 0 5px' }}>
          <div style={{ fontSize:'var(--fs-xs)', fontWeight:700, color:'var(--ac-gold)', letterSpacing:0.8, textTransform:'uppercase' }}>Group Stage</div>
          <div style={{ fontSize:'var(--fs-xs)', color:'var(--brk-dim)', marginTop:2 }}>Jun 11 – 27</div>
        </div>
        {ROUND_HEADERS.map(({ r, label, date }) => (
          <div key={r} style={{ width:CW + (r !== 'Final' ? GX : 0), padding:'6px 0 5px', textAlign:'center', flexShrink:0 }}>
            <div style={{ fontSize:'var(--fs-xs)', fontWeight:700, color:'var(--ac-gold)', letterSpacing:0.8, textTransform:'uppercase' }}>{label}</div>
            <div style={{ fontSize:'var(--fs-xs)', color:'var(--brk-dim)', marginTop:2 }}>{date}</div>
          </div>
        ))}
      </div>

      <div style={{ display:'flex', alignItems:'flex-start', minWidth:TOTAL_W + 2, margin:'8px 1px 16px' }}>
        <GroupStageDesktop standings={standings} onTT={onTT} onMoveTT={onMoveTT} onHideTT={onHideTT} />
        <div style={{ width:1, height:TH, background:'var(--brk-arm)', opacity:0.4, flexShrink:0, alignSelf:'stretch' }} />
        <div style={{ position:'relative', width:TW, height:TH, flexShrink:0 }}>
          <ConnectorLines highlighted={highlighted} />
          {allKnockoutIds.map(id => (
            <MatchCard key={id} id={id} m={BDM[id]} highlighted={highlighted}
              hoveredSlot={hoveredSlot}
              onSlotEnter={slot => slot && slot !== 'TBD' && setHoveredSlot(slot)}
              onSlotLeave={() => setHoveredSlot(null)}
              onSlotClick={slot => { if (!slot || slot === 'TBD') return; setHoveredSlot(s => s === slot ? null : slot); }} />
          ))}
          <BronzeCard />
          {hasMock && <ChampionBanner />}
          <img src={trophyUrl} alt="World Cup Trophy"
            style={{ position:'absolute', left:cardX('Final') + CW / 2 - 40, top:trophyTop,
              width:80, height:110, filter:'drop-shadow(0 0 12px rgba(240,192,64,0.6))', pointerEvents:'none' }} />
        </div>
      </div>
    </div>
  );
}

// ─── Mobile: knockout match row ───────────────────────────────────────────────
function MobileMatchRow({ id, m, highlighted, hoveredSlot, onSlotToggle }) {
  const isOnPath = highlighted.has(id);
  const fin      = m.hs !== undefined;
  const homeWins = fin && m.hs > m.as;
  const awayWins = fin && m.as > m.hs;
  const isFinal  = id === 103;

  return (
    <div style={{
      background: isOnPath ? 'rgba(240,192,64,0.06)' : 'var(--brk-cell)',
      border:`1px solid ${(isOnPath || (isFinal && fin)) ? 'rgba(240,192,64,0.45)' : 'var(--brk-bd)'}`,
      borderRadius:7, overflow:'hidden', marginBottom:8,
      boxShadow: isFinal && fin ? '0 0 20px rgba(240,192,64,0.3)' : isOnPath ? '0 0 8px rgba(240,192,64,0.12)' : 'none',
      transition:'all .18s',
    }}>
      {[
        { slot:m.h, score:fin?m.hs:undefined, wins:homeWins },
        { slot:m.a, score:fin?m.as:undefined, wins:awayWins },
      ].map(({ slot, score, wins }, i) => {
        const { main, sub, tbd } = slotLine(slot);
        const active = slot === hoveredSlot;
        return (
          <React.Fragment key={i}>
            {i === 1 && (
              <div style={{ display:'flex', alignItems:'center', padding:'0 12px', gap:6 }}>
                <div style={{ flex:1, height:1, background:'var(--brk-div)' }} />
                <span style={{ fontSize:9, color:'var(--brk-dim)', letterSpacing:0.5 }}>{fin ? 'FT' : 'vs'}</span>
                <div style={{ flex:1, height:1, background:'var(--brk-div)' }} />
              </div>
            )}
            <div onClick={() => !tbd && onSlotToggle(slot)} style={{
              display:'flex', alignItems:'center', gap:8, padding:'8px 12px',
              cursor: tbd ? 'default' : 'pointer',
              background: active ? 'rgba(240,192,64,0.10)' : (wins ? 'rgba(34,197,94,0.09)' : 'transparent'),
              boxShadow: wins ? 'inset 4px 0 0 var(--ac-green)' : 'none',
              transition:'background .15s',
            }}>
              {!tbd
                ? <FlagImg name={slot} w={22} h={15} />
                : <span style={{ width:22, height:15, display:'inline-block', background:'var(--brk-div)', borderRadius:2 }} />}
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:'var(--fs-base)', fontWeight:tbd?400:600,
                  color: wins ? 'var(--ac-gold)' : (tbd?'var(--brk-dim)':'var(--brk-txt)'),
                  whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', lineHeight:1.4 }}>{main}</div>
                {sub && <div style={{ fontSize:'var(--fs-sm)', color:'var(--brk-dim)', marginTop:2 }}>{sub}</div>}
              </div>
              {wins && (
                <span style={{ fontSize:10, background:'var(--ac-green)', color:'#fff', fontWeight:800,
                  padding:'2px 5px', borderRadius:4, flexShrink:0, letterSpacing:0.3 }}>W</span>
              )}
              {score !== undefined && (
                <span style={{ fontSize:22, fontWeight:800, color:wins?'var(--ac-gold)':'var(--brk-dim)', flexShrink:0 }}>{score}</span>
              )}
            </div>
          </React.Fragment>
        );
      })}

      {isFinal && fin && (
        <div style={{ background:'rgba(240,192,64,0.10)', borderTop:'1px solid rgba(240,192,64,0.3)',
          padding:'6px 12px', display:'flex', alignItems:'center', gap:8 }}>
          <FlagImg name={m.as > m.hs ? m.a : m.h} w={22} h={15} />
          <span style={{ fontSize:'var(--fs-sm)', fontWeight:700, color:'var(--ac-gold)' }}>
            🏆 {m.as > m.hs ? m.a : m.h} — World Champions 2026
          </span>
        </div>
      )}
    </div>
  );
}

// ─── Mobile: group stage tab ──────────────────────────────────────────────────
function GroupStageTab({ standings, onTT, onMoveTT, onHideTT }) {
  return (
    <div style={{ overflowY:'auto', flex:1, padding:'8px 12px 16px' }}>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
        {ALL_GROUPS.map(g => (
          <BracketGroupCard key={g} g={g} standings={standings}
            onTT={onTT} onMoveTT={onMoveTT} onHideTT={onHideTT} />
        ))}
      </div>
    </div>
  );
}

// ─── Mobile bracket ───────────────────────────────────────────────────────────
const MOBILE_ROUNDS = [
  { key:'GS',    label:'Groups', full:'Group Stage',    date:'Jun 11–27',    ids:null },
  { key:'R32',   label:'R32',    full:'Round of 32',    date:'Jun 29–Jul 4', ids:[72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87] },
  { key:'R16',   label:'R16',    full:'Round of 16',    date:'Jul 6–9',      ids:[88,89,90,91,92,93,94,95] },
  { key:'QF',    label:'QF',     full:'Quarter-finals', date:'Jul 11–12',    ids:[96,97,98,99] },
  { key:'SF',    label:'SF',     full:'Semi-finals',    date:'Jul 15–16',    ids:[100,101] },
  { key:'Final', label:'Final',  full:'Final + Bronze', date:'Jul 19',       ids:[103,102] },
];

function MobileBracket({ standings, hoveredSlot, setHoveredSlot, onTT, onMoveTT, onHideTT }) {
  const [activeRound, setActiveRound] = useState('GS');
  const rnd = MOBILE_ROUNDS.find(r => r.key === activeRound);
  const highlighted = useMemo(() => pathFor(hoveredSlot), [hoveredSlot]);
  function toggleSlot(slot) { setHoveredSlot(s => s === slot ? null : slot); }

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%' }}>
      <div style={{ display:'flex', overflowX:'auto', borderBottom:'1px solid var(--brk-div)',
        background:'var(--brk-bg)', flexShrink:0 }}>
        {MOBILE_ROUNDS.map(({ key, label }) => {
          const on = activeRound === key;
          return (
            <button key={key} onClick={() => { setActiveRound(key); setHoveredSlot(null); }} style={{
              flexShrink:0, padding:'9px 14px',
              fontSize:'var(--fs-sm)', fontWeight:on?700:500,
              color:on?'var(--ac-gold)':'var(--brk-dim)',
              background:'none', border:'none',
              borderBottom:on?'2px solid var(--ac-gold)':'2px solid transparent',
              cursor:'pointer', letterSpacing:0.5, textTransform:'uppercase', transition:'color .15s',
            }}>{label}</button>
          );
        })}
      </div>

      <div style={{ padding:'10px 12px 6px', flexShrink:0 }}>
        <span style={{ fontSize:'var(--fs-base)', fontWeight:700, color:'var(--ac-gold)', letterSpacing:0.3 }}>{rnd.full}</span>
        <span style={{ fontSize:'var(--fs-sm)', color:'var(--brk-dim)', marginLeft:10 }}>{rnd.date}</span>
      </div>

      {hoveredSlot && activeRound !== 'GS' && (
        <div style={{ margin:'0 12px 8px', padding:'6px 10px',
          background:'rgba(240,192,64,0.10)', border:'1px solid rgba(240,192,64,0.3)',
          borderRadius:5, fontSize:'var(--fs-sm)', color:'var(--ac-gold)' }}>
          Path: <b>{hoveredSlot}</b> — tap again to clear
        </div>
      )}

      {activeRound === 'GS'
        ? <GroupStageTab standings={standings} onTT={onTT} onMoveTT={onMoveTT} onHideTT={onHideTT} />
        : (
          <div style={{ overflowY:'auto', flex:1, padding:'0 12px 12px' }}>
            {rnd.ids.map(id => (
              <MobileMatchRow key={id} id={id} m={BDM[id]}
                highlighted={highlighted} hoveredSlot={hoveredSlot} onSlotToggle={toggleSlot} />
            ))}
          </div>
        )
      }
    </div>
  );
}

// ─── Path legend ──────────────────────────────────────────────────────────────
function PathLegend({ slot, onClear }) {
  if (!slot) return null;
  const { main } = slotLine(slot);
  return (
    <div style={{ position:'absolute', bottom:12, right:12, zIndex:20,
      background:'var(--brk-cell)', border:'1px solid rgba(240,192,64,0.4)',
      borderRadius:6, padding:'6px 10px',
      display:'flex', alignItems:'center', gap:8,
      fontSize:'var(--fs-sm)', color:'var(--ac-gold)', pointerEvents:'auto' }}>
      <span>Path: <b>{main}</b></span>
      <button onClick={onClear} style={{ background:'none', border:'none',
        color:'var(--brk-dim)', cursor:'pointer', fontSize:'var(--fs-sm)', lineHeight:1, padding:0 }}>✕</button>
    </div>
  );
}

// ─── Root export ──────────────────────────────────────────────────────────────
export function KnockoutBracket({ isMobile, standings = {}, onTT, onMoveTT, onHideTT }) {
  const [hoveredSlot, setHoveredSlot] = useState(null);

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column',
      background:'var(--brk-bg)', fontFamily:'var(--font-sans)',
      position:'relative', userSelect:'none' }}>
      {isMobile
        ? <MobileBracket standings={standings} hoveredSlot={hoveredSlot} setHoveredSlot={setHoveredSlot}
            onTT={onTT} onMoveTT={onMoveTT} onHideTT={onHideTT} />
        : <DesktopBracket standings={standings} hoveredSlot={hoveredSlot} setHoveredSlot={setHoveredSlot}
            onTT={onTT} onMoveTT={onMoveTT} onHideTT={onHideTT} />
      }
      {!isMobile && <PathLegend slot={hoveredSlot} onClear={() => setHoveredSlot(null)} />}
    </div>
  );
}
