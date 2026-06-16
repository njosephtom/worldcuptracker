import React from 'react';

const TEAMS_BY_GROUP = [
  { g: 'A', teams: [{ n:'Mexico', r:14 }, { n:'South Korea', r:25 }, { n:'South Africa', r:60 }, { n:'Czechia', r:40 }] },
  { g: 'B', teams: [{ n:'Canada', r:30 }, { n:'Switzerland', r:19 }, { n:'Qatar', r:56 }, { n:'Bosnia & Herzegovina', r:64 }] },
  { g: 'C', teams: [{ n:'Brazil', r:6 }, { n:'Morocco', r:7 }, { n:'Scotland', r:42 }, { n:'Haiti', r:83 }] },
  { g: 'D', teams: [{ n:'United States', r:17 }, { n:'Australia', r:27 }, { n:'Paraguay', r:41 }, { n:'Turkey', r:22 }] },
  { g: 'E', teams: [{ n:'Germany', r:10 }, { n:'Ecuador', r:23 }, { n:'Ivory Coast', r:33 }, { n:'Curaçao', r:82 }] },
  { g: 'F', teams: [{ n:'Netherlands', r:8 }, { n:'Japan', r:18 }, { n:'Tunisia', r:45 }, { n:'Sweden', r:38 }] },
  { g: 'G', teams: [{ n:'Belgium', r:9 }, { n:'Egypt', r:29 }, { n:'Iran', r:20 }, { n:'New Zealand', r:85 }] },
  { g: 'H', teams: [{ n:'Spain', r:2 }, { n:'Uruguay', r:16 }, { n:'Saudi Arabia', r:61 }, { n:'Cape Verde', r:67 }] },
  { g: 'I', teams: [{ n:'France', r:3 }, { n:'Senegal', r:15 }, { n:'Norway', r:31 }, { n:'Iraq', r:57 }] },
  { g: 'J', teams: [{ n:'Argentina', r:1 }, { n:'Algeria', r:28 }, { n:'Austria', r:24 }, { n:'Jordan', r:63 }] },
  { g: 'K', teams: [{ n:'Portugal', r:5 }, { n:'DR Congo', r:46 }, { n:'Colombia', r:13 }, { n:'Uzbekistan', r:50 }] },
  { g: 'L', teams: [{ n:'England', r:4 }, { n:'Croatia', r:11 }, { n:'Ghana', r:73 }, { n:'Panama', r:34 }] },
];

const TEAM_PAGES = [
  { name: 'Argentina', slug: 'argentina' },
  { name: 'Brazil', slug: 'brazil' },
  { name: 'England', slug: 'england' },
  { name: 'France', slug: 'france' },
  { name: 'Germany', slug: 'germany' },
  { name: 'Portugal', slug: 'portugal' },
  { name: 'United States', slug: 'usa' },
  { name: 'Canada', slug: 'canada' },
];

const FAQS = [
  {
    q: 'How many teams are in the World Cup 2026?',
    a: 'The 2026 FIFA World Cup features a record 48 national teams — the largest field in tournament history, up from 32 in 2022. The 48 teams are split into 12 groups of 4 and play a total of 104 matches.',
  },
  {
    q: 'Where is the 2026 FIFA World Cup hosted?',
    a: 'The 2026 FIFA World Cup is co-hosted by the United States (13 venues), Canada (2 venues — Vancouver and Toronto), and Mexico (3 venues — Mexico City, Guadalajara, and Monterrey). It is the first World Cup hosted by three nations.',
  },
  {
    q: 'When does the World Cup 2026 start and end?',
    a: 'The FIFA World Cup 2026 started on June 11, 2026, with the opening match at Estadio Azteca in Mexico City. The tournament concludes with the World Cup Final on July 19, 2026, at MetLife Stadium, New York/New Jersey.',
  },
  {
    q: 'How does the 2026 World Cup format work?',
    a: '48 teams play a group stage (12 groups of 4, 3 matches each). The top 2 from each group plus the 8 best third-placed teams (32 teams total) advance to a new Round of 32, then the Round of 16, Quarterfinals, Semifinals, and the Final.',
  },
  {
    q: 'What is the World Cup 2026 bracket?',
    a: 'The World Cup 2026 knockout bracket runs from the Round of 32 (June 29) through the Round of 16, Quarterfinals (July 9–10), Semifinals (July 14–15), and the Final (July 19, 2026). WorldCupTracker.us shows a live-updating bracket.',
  },
  {
    q: 'Where is the 2026 World Cup Final?',
    a: 'The 2026 FIFA World Cup Final is at MetLife Stadium in East Rutherford, New Jersey (New York metro area) on July 19, 2026. MetLife Stadium is the tournament\'s largest venue with a capacity of 82,500.',
  },
  {
    q: 'Who plays today in the World Cup?',
    a: 'Today\'s World Cup matches are shown at the top of WorldCupTracker.us with live scores, kickoff times in your local timezone, and match event logs. The tracker updates automatically every 5 minutes.',
  },
  {
    q: 'Which stadiums host the 2026 FIFA World Cup?',
    a: '16 stadiums host FIFA World Cup 2026 matches: MetLife Stadium (NJ), AT&T Stadium (Dallas), SoFi Stadium (LA), NRG Stadium (Houston), Mercedes-Benz Stadium (Atlanta), Lumen Field (Seattle), Arrowhead Stadium (Kansas City), Lincoln Financial Field (Philadelphia), Gillette Stadium (Boston), Hard Rock Stadium (Miami), Levi\'s Stadium (San Francisco Bay Area), BC Place (Vancouver), BMO Field (Toronto), Estadio Azteca (Mexico City), Estadio Akron (Guadalajara), and Estadio BBVA (Monterrey).',
  },
];

export function SEOContent({ onHide }) {
  return (
    <section id="wc2026-guide" style={S.section} aria-label="FIFA World Cup 2026 Information">
      <div style={S.container}>

        <h1 style={S.h1}>FIFA World Cup 2026 — Live Scores, Schedule, Fixtures &amp; Standings</h1>

        <p style={S.intro}>
          <strong>WorldCupTracker.us</strong> is your free, real-time tracker for the <strong>FIFA World Cup 2026</strong> — the largest and most exciting World Cup in history.
          Get live scores, complete World Cup 2026 schedule &amp; fixtures, group stage standings, the full knockout bracket,
          match highlights, and squad information for all 48 teams. No login required.
        </p>

        {/* Schedule section */}
        <div style={S.section2}>
          <h2 style={S.h2}>FIFA World Cup 2026 Schedule &amp; Fixtures</h2>
          <p style={S.p}>The <strong>FIFA World Cup 2026 schedule</strong> spans June 11 – July 19, 2026, across 16 host stadiums in the United States, Canada, and Mexico.
            104 total matches make this the biggest World Cup fixture list ever. The <strong>World Cup group stage schedule</strong> runs June 11–26, followed
            by the knockout rounds: Round of 32 (June 29 – July 1), Round of 16 (July 4–7), Quarterfinals (July 9–10), Semifinals (July 14–15), and
            the <strong>World Cup Final on July 19, 2026</strong> at MetLife Stadium, New York/New Jersey.
          </p>
          <p style={S.p}>
            Track the complete <strong>World Cup fixtures</strong> and live results on the Match Day tab above, with kickoff times shown in your local timezone.
            The tracker auto-highlights today's World Cup matches so you always know who plays next.
          </p>
        </div>

        {/* Groups section */}
        <div style={S.section2}>
          <h2 style={S.h2}>World Cup 2026 Groups &amp; Standings</h2>
          <p style={S.p}>
            The 2026 FIFA World Cup group stage features <strong>12 groups (A–L) of 4 teams</strong> each. The <strong>World Cup group standings</strong> (points table)
            update live after every match, ranked by points, goal difference, goals scored, and FIFA ranking.
            The top 2 teams from each group (24 teams) plus the 8 best third-placed teams advance to the Round of 32.
          </p>
          <div style={S.groupGrid}>
            {TEAMS_BY_GROUP.map(({ g, teams }) => (
              <div key={g} style={S.groupCard}>
                <div style={S.groupLabel}>Group {g}</div>
                {teams.map(t => (
                  <div key={t.n} style={S.groupTeam}>
                    <span style={S.teamName}>{t.n}</span>
                    <span style={S.rank}>#{t.r}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Host cities */}
        <div style={S.section2}>
          <h2 style={S.h2}>FIFA World Cup 2026 Host Cities &amp; Stadiums</h2>
          <p style={S.p}>
            The 2026 FIFA World Cup is played across <strong>16 stadiums in 16 host cities</strong> spanning three countries.
            In the <strong>United States</strong>: MetLife Stadium (New York/NJ, 82,500 — Final venue), AT&T Stadium (Dallas, 80,000),
            Arrowhead Stadium (Kansas City, 76,416), NRG Stadium (Houston, 72,220), Mercedes-Benz Stadium (Atlanta, 71,000),
            SoFi Stadium (Los Angeles, 70,240), Lincoln Financial Field (Philadelphia, 69,796),
            Lumen Field (Seattle, 68,740), Levi's Stadium (San Francisco Bay Area, 68,500),
            Gillette Stadium (Boston, 65,878), and Hard Rock Stadium (Miami, 64,767).
            In <strong>Canada</strong>: BC Place (Vancouver, 54,500) and BMO Field (Toronto, 45,736).
            In <strong>Mexico</strong>: Estadio Azteca (Mexico City, 83,000 — Opening Match), Estadio Akron (Guadalajara, 49,850), and Estadio BBVA (Monterrey, 53,500).
          </p>
        </div>

        {/* Tournament format */}
        <div style={S.section2}>
          <h2 style={S.h2}>2026 FIFA World Cup Tournament Format</h2>
          <p style={S.p}>
            The 2026 World Cup introduces the <strong>largest format in tournament history</strong>. Here's how it works:
          </p>
          <ul style={S.list}>
            <li style={S.li}><strong>Group Stage (June 11–26):</strong> 48 teams in 12 groups of 4. Each team plays 3 matches. Top 2 per group (24 teams) + 8 best third-placed teams = 32 advance.</li>
            <li style={S.li}><strong>Round of 32 — NEW (June 29 – July 1):</strong> The new knockout round introduced for 2026. 32 teams play 16 single-elimination matches.</li>
            <li style={S.li}><strong>Round of 16 (July 4–7):</strong> 16 surviving teams, 8 matches.</li>
            <li style={S.li}><strong>Quarterfinals (July 9–10):</strong> 8 teams, 4 matches.</li>
            <li style={S.li}><strong>Semifinals (July 14–15):</strong> 4 teams, 2 matches.</li>
            <li style={S.li}><strong>World Cup Final (July 19, 2026):</strong> MetLife Stadium, New York/NJ. 2 teams compete for the FIFA World Cup trophy.</li>
          </ul>
        </div>

        {/* Team pages */}
        <div style={S.section2}>
          <h2 style={S.h2}>World Cup 2026 Team Schedule Pages</h2>
          <p style={S.p}>Get team-specific World Cup 2026 schedule, fixtures, group standings, and squad information:</p>
          <div style={S.teamLinks}>
            {TEAM_PAGES.map(t => (
              <a key={t.slug} href={`/team/${t.slug}`} style={S.teamLink}>
                {t.name} World Cup Schedule →
              </a>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div style={S.section2}>
          <h2 style={S.h2}>FIFA World Cup 2026 — Frequently Asked Questions</h2>
          {FAQS.map((faq, i) => (
            <div key={i} style={S.faqItem}>
              <h3 style={S.faqQ}>{faq.q}</h3>
              <p style={S.faqA}>{faq.a}</p>
            </div>
          ))}
        </div>

        {/* Bottom hide button */}
        {onHide && (
          <div style={{ textAlign: 'center', marginTop: 32, paddingBottom: 8 }}>
            <button onClick={onHide} style={S.hideBtn}>Hide Guide ▲</button>
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
    marginTop: 'auto',
    flexShrink: 0,
  },
  container: {
    maxWidth: 900,
    margin: '0 auto',
    padding: '36px 20px 48px',
  },
  h1: {
    fontSize: 'var(--fs-sm)',
    fontWeight: 800,
    color: 'var(--ac-gold)',
    letterSpacing: .4,
    marginBottom: 12,
    lineHeight: 1.3,
  },
  intro: {
    fontSize: 'var(--fs-xs)',
    color: 'var(--tx-secondary)',
    lineHeight: 1.65,
    marginBottom: 8,
    borderLeft: '2px solid var(--ac-gold)',
    paddingLeft: 12,
  },
  section2: {
    marginTop: 28,
  },
  h2: {
    fontSize: 'var(--fs-xs)',
    fontWeight: 700,
    color: 'var(--tx-muted)',
    textTransform: 'uppercase',
    letterSpacing: '.8px',
    marginBottom: 10,
    paddingBottom: 6,
    borderBottom: '1px solid var(--bd-main)',
  },
  p: {
    fontSize: 'var(--fs-xs)',
    color: 'var(--tx-dim)',
    lineHeight: 1.65,
    marginBottom: 8,
  },
  groupGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
    gap: 8,
    marginTop: 10,
  },
  groupCard: {
    background: 'var(--bg-inner)',
    border: '1px solid var(--bd-main)',
    borderRadius: 8,
    padding: '8px 10px',
  },
  groupLabel: {
    fontSize: 9,
    fontWeight: 700,
    color: 'var(--ac-gold)',
    textTransform: 'uppercase',
    letterSpacing: '.6px',
    marginBottom: 6,
  },
  groupTeam: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '2px 0',
  },
  teamName: {
    fontSize: 10,
    color: 'var(--tx-secondary)',
  },
  rank: {
    fontSize: 9,
    color: 'var(--tx-dim2)',
    fontWeight: 600,
  },
  list: {
    paddingLeft: 16,
    marginTop: 6,
  },
  li: {
    fontSize: 'var(--fs-xs)',
    color: 'var(--tx-dim)',
    lineHeight: 1.65,
    marginBottom: 5,
  },
  teamLinks: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  teamLink: {
    fontSize: 10,
    color: 'var(--ac-gold)',
    textDecoration: 'none',
    background: 'var(--bg-inner)',
    border: '1px solid var(--bd-main)',
    borderRadius: 6,
    padding: '4px 10px',
  },
  faqItem: {
    marginTop: 14,
  },
  faqQ: {
    fontSize: 'var(--fs-xs)',
    fontWeight: 700,
    color: 'var(--tx-secondary)',
    marginBottom: 4,
  },
  faqA: {
    fontSize: 'var(--fs-xs)',
    color: 'var(--tx-dim)',
    lineHeight: 1.6,
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
