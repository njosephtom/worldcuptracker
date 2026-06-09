const SYSTEM = `You are a FIFA World Cup 2026 live data assistant. The tournament runs June 11 – July 19, 2026.
Return ONLY valid JSON. No markdown, no backticks, no explanation.
Today's date is: ${new Date().toDateString()}.`;

export async function fetchWorldCupData() {
  const prompt = `Return the current FIFA World Cup 2026 standings and any live/recent match results.
Format EXACTLY as this JSON (all 48 teams required):
{
  "standings": {
    "Mexico": {"mp":0,"w":0,"d":0,"l":0,"gf":0,"ga":0,"pts":0},
    "South Korea": {"mp":0,"w":0,"d":0,"l":0,"gf":0,"ga":0,"pts":0},
    "South Africa": {"mp":0,"w":0,"d":0,"l":0,"gf":0,"ga":0,"pts":0},
    "Czechia": {"mp":0,"w":0,"d":0,"l":0,"gf":0,"ga":0,"pts":0},
    "Canada": {"mp":0,"w":0,"d":0,"l":0,"gf":0,"ga":0,"pts":0},
    "Switzerland": {"mp":0,"w":0,"d":0,"l":0,"gf":0,"ga":0,"pts":0},
    "Qatar": {"mp":0,"w":0,"d":0,"l":0,"gf":0,"ga":0,"pts":0},
    "Bosnia and Herzegovina": {"mp":0,"w":0,"d":0,"l":0,"gf":0,"ga":0,"pts":0},
    "Brazil": {"mp":0,"w":0,"d":0,"l":0,"gf":0,"ga":0,"pts":0},
    "Morocco": {"mp":0,"w":0,"d":0,"l":0,"gf":0,"ga":0,"pts":0},
    "Scotland": {"mp":0,"w":0,"d":0,"l":0,"gf":0,"ga":0,"pts":0},
    "Haiti": {"mp":0,"w":0,"d":0,"l":0,"gf":0,"ga":0,"pts":0},
    "United States": {"mp":0,"w":0,"d":0,"l":0,"gf":0,"ga":0,"pts":0},
    "Australia": {"mp":0,"w":0,"d":0,"l":0,"gf":0,"ga":0,"pts":0},
    "Paraguay": {"mp":0,"w":0,"d":0,"l":0,"gf":0,"ga":0,"pts":0},
    "Turkey": {"mp":0,"w":0,"d":0,"l":0,"gf":0,"ga":0,"pts":0},
    "Germany": {"mp":0,"w":0,"d":0,"l":0,"gf":0,"ga":0,"pts":0},
    "Ecuador": {"mp":0,"w":0,"d":0,"l":0,"gf":0,"ga":0,"pts":0},
    "Ivory Coast": {"mp":0,"w":0,"d":0,"l":0,"gf":0,"ga":0,"pts":0},
    "Curaçao": {"mp":0,"w":0,"d":0,"l":0,"gf":0,"ga":0,"pts":0},
    "Netherlands": {"mp":0,"w":0,"d":0,"l":0,"gf":0,"ga":0,"pts":0},
    "Japan": {"mp":0,"w":0,"d":0,"l":0,"gf":0,"ga":0,"pts":0},
    "Tunisia": {"mp":0,"w":0,"d":0,"l":0,"gf":0,"ga":0,"pts":0},
    "Sweden": {"mp":0,"w":0,"d":0,"l":0,"gf":0,"ga":0,"pts":0},
    "Belgium": {"mp":0,"w":0,"d":0,"l":0,"gf":0,"ga":0,"pts":0},
    "Iran": {"mp":0,"w":0,"d":0,"l":0,"gf":0,"ga":0,"pts":0},
    "Egypt": {"mp":0,"w":0,"d":0,"l":0,"gf":0,"ga":0,"pts":0},
    "New Zealand": {"mp":0,"w":0,"d":0,"l":0,"gf":0,"ga":0,"pts":0},
    "Spain": {"mp":0,"w":0,"d":0,"l":0,"gf":0,"ga":0,"pts":0},
    "Uruguay": {"mp":0,"w":0,"d":0,"l":0,"gf":0,"ga":0,"pts":0},
    "Saudi Arabia": {"mp":0,"w":0,"d":0,"l":0,"gf":0,"ga":0,"pts":0},
    "Cape Verde": {"mp":0,"w":0,"d":0,"l":0,"gf":0,"ga":0,"pts":0},
    "France": {"mp":0,"w":0,"d":0,"l":0,"gf":0,"ga":0,"pts":0},
    "Senegal": {"mp":0,"w":0,"d":0,"l":0,"gf":0,"ga":0,"pts":0},
    "Norway": {"mp":0,"w":0,"d":0,"l":0,"gf":0,"ga":0,"pts":0},
    "Iraq": {"mp":0,"w":0,"d":0,"l":0,"gf":0,"ga":0,"pts":0},
    "Argentina": {"mp":0,"w":0,"d":0,"l":0,"gf":0,"ga":0,"pts":0},
    "Algeria": {"mp":0,"w":0,"d":0,"l":0,"gf":0,"ga":0,"pts":0},
    "Austria": {"mp":0,"w":0,"d":0,"l":0,"gf":0,"ga":0,"pts":0},
    "Jordan": {"mp":0,"w":0,"d":0,"l":0,"gf":0,"ga":0,"pts":0},
    "Portugal": {"mp":0,"w":0,"d":0,"l":0,"gf":0,"ga":0,"pts":0},
    "DR Congo": {"mp":0,"w":0,"d":0,"l":0,"gf":0,"ga":0,"pts":0},
    "Uzbekistan": {"mp":0,"w":0,"d":0,"l":0,"gf":0,"ga":0,"pts":0},
    "Colombia": {"mp":0,"w":0,"d":0,"l":0,"gf":0,"ga":0,"pts":0},
    "England": {"mp":0,"w":0,"d":0,"l":0,"gf":0,"ga":0,"pts":0},
    "Croatia": {"mp":0,"w":0,"d":0,"l":0,"gf":0,"ga":0,"pts":0},
    "Ghana": {"mp":0,"w":0,"d":0,"l":0,"gf":0,"ga":0,"pts":0},
    "Panama": {"mp":0,"w":0,"d":0,"l":0,"gf":0,"ga":0,"pts":0}
  },
  "results": [
    {"id": 1, "homeScore": 2, "awayScore": 1, "status": "finished"}
  ],
  "liveMatches": [],
  "tournamentStatus": "Group Stage",
  "lastUpdated": "Jun 8 2026"
}
Only include matches in results[] that have actually been played. Fill standings with real data if matches have occurred.`;

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        system: SYSTEM,
        messages: [{ role: 'user', content: prompt }]
      })
    });
    const data = await res.json();
    const text = data.content?.filter(b => b.type === 'text').map(b => b.text).join('') || '';
    return JSON.parse(text.replace(/```json|```/g, '').trim());
  } catch (e) {
    console.error('API error:', e);
    return null;
  }
}
