import React from 'react';

const HISTORY = [
  { year: 1930, host: '🇺🇾 Uruguay',          champion: '🇺🇾 Uruguay',       runnerUp: '🇦🇷 Argentina',     score: '4 – 2' },
  { year: 1934, host: '🇮🇹 Italy',            champion: '🇮🇹 Italy',         runnerUp: '🇨🇿 Czechoslovakia', score: '2 – 1 (AET)' },
  { year: 1938, host: '🇫🇷 France',           champion: '🇮🇹 Italy',         runnerUp: '🇭🇺 Hungary',       score: '4 – 2' },
  { year: 1942, host: '—',                    champion: '—',                  runnerUp: '—',                  score: 'Not held (WWII)', noFinal: true },
  { year: 1946, host: '—',                    champion: '—',                  runnerUp: '—',                  score: 'Not held (WWII)', noFinal: true },
  { year: 1950, host: '🇧🇷 Brazil',           champion: '🇺🇾 Uruguay',       runnerUp: '🇧🇷 Brazil',        score: '2 – 1 ¹' },
  { year: 1954, host: '🇨🇭 Switzerland',      champion: '🇩🇪 West Germany',  runnerUp: '🇭🇺 Hungary',       score: '3 – 2' },
  { year: 1958, host: '🇸🇪 Sweden',           champion: '🇧🇷 Brazil',        runnerUp: '🇸🇪 Sweden',        score: '5 – 2' },
  { year: 1962, host: '🇨🇱 Chile',            champion: '🇧🇷 Brazil',        runnerUp: '🇨🇿 Czechoslovakia', score: '3 – 1' },
  { year: 1966, host: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 England',         champion: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 England',      runnerUp: '🇩🇪 West Germany',  score: '4 – 2 (AET)' },
  { year: 1970, host: '🇲🇽 Mexico',           champion: '🇧🇷 Brazil',        runnerUp: '🇮🇹 Italy',         score: '4 – 1' },
  { year: 1974, host: '🇩🇪 West Germany',     champion: '🇩🇪 West Germany',  runnerUp: '🇳🇱 Netherlands',   score: '2 – 1' },
  { year: 1978, host: '🇦🇷 Argentina',        champion: '🇦🇷 Argentina',     runnerUp: '🇳🇱 Netherlands',   score: '3 – 1 (AET)' },
  { year: 1982, host: '🇪🇸 Spain',            champion: '🇮🇹 Italy',         runnerUp: '🇩🇪 West Germany',  score: '3 – 1' },
  { year: 1986, host: '🇲🇽 Mexico',           champion: '🇦🇷 Argentina',     runnerUp: '🇩🇪 West Germany',  score: '3 – 2' },
  { year: 1990, host: '🇮🇹 Italy',            champion: '🇩🇪 West Germany',  runnerUp: '🇦🇷 Argentina',     score: '1 – 0' },
  { year: 1994, host: '🇺🇸 USA',              champion: '🇧🇷 Brazil',        runnerUp: '🇮🇹 Italy',         score: '0 – 0 (3–2 pens)' },
  { year: 1998, host: '🇫🇷 France',           champion: '🇫🇷 France',        runnerUp: '🇧🇷 Brazil',        score: '3 – 0' },
  { year: 2002, host: '🇰🇷🇯🇵 Korea/Japan',   champion: '🇧🇷 Brazil',        runnerUp: '🇩🇪 Germany',       score: '2 – 0' },
  { year: 2006, host: '🇩🇪 Germany',          champion: '🇮🇹 Italy',         runnerUp: '🇫🇷 France',        score: '1 – 1 (5–3 pens)' },
  { year: 2010, host: '🇿🇦 South Africa',     champion: '🇪🇸 Spain',         runnerUp: '🇳🇱 Netherlands',   score: '1 – 0 (AET)' },
  { year: 2014, host: '🇧🇷 Brazil',           champion: '🇩🇪 Germany',       runnerUp: '🇦🇷 Argentina',     score: '1 – 0 (AET)' },
  { year: 2018, host: '🇷🇺 Russia',           champion: '🇫🇷 France',        runnerUp: '🇭🇷 Croatia',       score: '4 – 2' },
  { year: 2022, host: '🇶🇦 Qatar',            champion: '🇦🇷 Argentina',     runnerUp: '🇫🇷 France',        score: '3 – 3 (4–2 pens)' },
  { year: 2026, host: '🇺🇸🇨🇦🇲🇽 USA/CAN/MEX', champion: '🏆 In Progress',  runnerUp: '—',                  score: 'Jul 19, 2026', current: true },
];

// Win counts per country (excluding WWII gaps and 2026)
const WINS = {
  'Brazil':       { count: 5, years: '1958, 1962, 1970, 1994, 2002', flag: '🇧🇷' },
  'Germany':      { count: 4, years: '1954, 1974, 1990, 2014',       flag: '🇩🇪' },
  'Italy':        { count: 4, years: '1934, 1938, 1982, 2006',        flag: '🇮🇹' },
  'Argentina':    { count: 3, years: '1978, 1986, 2022',              flag: '🇦🇷' },
  'France':       { count: 2, years: '1998, 2018',                    flag: '🇫🇷' },
  'Uruguay':      { count: 2, years: '1930, 1950',                    flag: '🇺🇾' },
  'England':      { count: 1, years: '1966',                          flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  'Spain':        { count: 1, years: '2010',                          flag: '🇪🇸' },
};

export function WorldCupHistory({ onHide }) {
  return (
    <section id="wc-history" style={S.section} aria-label="FIFA World Cup History">
      <div style={S.container}>

        <h2 style={S.h1}>FIFA World Cup History — All Champions (1930–2026)</h2>
        <p style={S.intro}>
          The <strong>FIFA World Cup</strong> has been held every four years since 1930 (except 1942 and 1946 due to World War II).
          Only <strong>8 nations</strong> have ever won it. Brazil leads with <strong>5 titles</strong>, followed by Germany and Italy with 4 each.
          The 2026 edition in USA, Canada &amp; Mexico is the largest World Cup in history — 48 teams, 104 matches.
        </p>

        {/* Champion wins summary */}
        <div style={S.winsGrid}>
          {Object.entries(WINS).sort((a, b) => b[1].count - a[1].count).map(([nation, w]) => (
            <div key={nation} style={S.winCard}>
              <div style={S.winFlag}>{w.flag}</div>
              <div style={S.winNation}>{nation}</div>
              <div style={S.winCount}>{w.count}× Champion</div>
              <div style={S.winYears}>{w.years}</div>
            </div>
          ))}
        </div>

        {/* Main table */}
        <div style={S.tableWrap}>
          <table style={S.table}>
            <thead>
              <tr>
                <th style={S.th}>Year</th>
                <th style={S.th}>Host Country</th>
                <th style={{ ...S.th, color: 'var(--ac-gold)' }}>Champion 🏆</th>
                <th style={S.th}>Runner-Up</th>
                <th style={{ ...S.th, textAlign: 'center' }}>Final Score</th>
              </tr>
            </thead>
            <tbody>
              {HISTORY.map((r, i) => (
                <tr key={r.year} style={{
                  background: r.current
                    ? 'rgba(240,192,64,0.08)'
                    : r.noFinal
                    ? 'rgba(255,255,255,0.02)'
                    : i % 2 === 0
                    ? 'var(--bg-stripe)'
                    : 'transparent',
                }}>
                  <td style={{ ...S.td, fontWeight: 700, color: r.current ? 'var(--ac-gold)' : 'var(--tx-secondary)', width: 54 }}>{r.year}</td>
                  <td style={{ ...S.td, color: r.noFinal ? 'var(--tx-dim2)' : 'var(--tx-dim)' }}>{r.host}</td>
                  <td style={{ ...S.td, fontWeight: r.noFinal ? 400 : 700, color: r.current ? 'var(--ac-gold)' : r.noFinal ? 'var(--tx-dim2)' : 'var(--tx-primary)' }}>{r.champion}</td>
                  <td style={{ ...S.td, color: r.noFinal ? 'var(--tx-dim2)' : 'var(--tx-dim)' }}>{r.runnerUp}</td>
                  <td style={{ ...S.td, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 10, color: r.noFinal ? 'var(--tx-dim2)' : r.current ? 'var(--ac-gold)' : 'var(--tx-secondary)' }}>{r.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p style={{ ...S.footnote }}>
          ¹ 1950 used a final round-robin group instead of a single knockout final. Uruguay's last-game win over Brazil decided the title.
          &nbsp; AET = After Extra Time &nbsp; Pens = Penalty shootout
        </p>

        {/* Bottom hide button */}
        {onHide && (
          <div style={{ textAlign: 'center', marginTop: 28, paddingBottom: 8 }}>
            <button onClick={onHide} style={S.hideBtn}>Hide History ▲</button>
          </div>
        )}

      </div>
    </section>
  );
}

const S = {
  section: {
    background: 'var(--bg-topbar)',
    borderTop: '1px solid var(--bd-main)',
    flexShrink: 0,
  },
  container: {
    maxWidth: 900,
    margin: '0 auto',
    padding: '32px 20px 44px',
  },
  h1: {
    fontSize: 'var(--fs-sm)',
    fontWeight: 800,
    color: 'var(--ac-gold)',
    letterSpacing: .4,
    marginBottom: 10,
    lineHeight: 1.3,
  },
  intro: {
    fontSize: 'var(--fs-xs)',
    color: 'var(--tx-dim)',
    lineHeight: 1.65,
    marginBottom: 20,
    borderLeft: '2px solid var(--ac-gold)',
    paddingLeft: 12,
  },
  winsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
    gap: 8,
    marginBottom: 24,
  },
  winCard: {
    background: 'var(--bg-inner)',
    border: '1px solid var(--bd-main)',
    borderRadius: 8,
    padding: '10px 12px',
    textAlign: 'center',
  },
  winFlag: { fontSize: 22, marginBottom: 4 },
  winNation: { fontSize: 11, fontWeight: 700, color: 'var(--tx-secondary)', marginBottom: 2 },
  winCount: { fontSize: 13, fontWeight: 800, color: 'var(--ac-gold)', marginBottom: 3 },
  winYears: { fontSize: 9, color: 'var(--tx-dim2)', lineHeight: 1.4 },
  tableWrap: {
    overflowX: 'auto',
    borderRadius: 10,
    border: '1px solid var(--bd-main)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: 11,
  },
  th: {
    background: 'var(--bg-inner)',
    color: 'var(--tx-muted)',
    fontWeight: 700,
    fontSize: 9,
    letterSpacing: '.7px',
    textTransform: 'uppercase',
    padding: '9px 12px',
    textAlign: 'left',
    borderBottom: '1px solid var(--bd-main)',
    whiteSpace: 'nowrap',
  },
  td: {
    padding: '7px 12px',
    borderBottom: '1px solid rgba(255,255,255,0.03)',
    fontSize: 11,
    whiteSpace: 'nowrap',
  },
  footnote: {
    fontSize: 9,
    color: 'var(--tx-dim2)',
    marginTop: 10,
    lineHeight: 1.6,
    fontStyle: 'italic',
  },
  hideBtn: {
    background: 'var(--bg-inner)',
    border: '1px solid var(--bd-btn)',
    color: 'var(--ac-gold)',
    padding: '8px 24px',
    borderRadius: 20,
    cursor: 'pointer',
    fontSize: 11,
    fontWeight: 700,
    fontFamily: 'var(--font-sans)',
    letterSpacing: '.4px',
  },
};
