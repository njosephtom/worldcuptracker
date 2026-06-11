// Mock simulation: "Argentina wins World Cup 2026"
// Group stage entries use {hs, as} only — teams come from data.js
// Knockout entries use {h, a, hs, as} — resolved real team names

export const MOCK_RESULTS = {
  // ── Group A: Mexico, South Korea, South Africa, Czechia ──────────────────
  1:  { hs:2, as:0 }, // Mexico 2-0 South Africa
  2:  { hs:1, as:1 }, // South Korea 1-1 Czechia
  25: { hs:2, as:1 }, // Czechia 2-1 South Africa
  26: { hs:1, as:0 }, // Mexico 1-0 South Korea
  50: { hs:1, as:2 }, // Czechia 1-2 Mexico
  51: { hs:0, as:2 }, // South Africa 0-2 South Korea
  // → Mexico 9 | South Korea 4 | Czechia 4 | South Africa 0

  // ── Group B: Canada, Switzerland, Qatar, Bosnia ───────────────────────────
  3:  { hs:2, as:1 }, // Canada 2-1 Bosnia
  5:  { hs:0, as:2 }, // Qatar 0-2 Switzerland
  28: { hs:3, as:0 }, // Canada 3-0 Qatar
  29: { hs:1, as:0 }, // Switzerland 1-0 Bosnia
  54: { hs:2, as:0 }, // Bosnia 2-0 Qatar
  55: { hs:1, as:2 }, // Switzerland 1-2 Canada
  // → Canada 9 | Switzerland 6 | Bosnia 3 | Qatar 0

  // ── Group C: Brazil, Morocco, Scotland, Haiti ─────────────────────────────
  6:  { hs:2, as:0 }, // Brazil 2-0 Morocco
  7:  { hs:0, as:3 }, // Haiti 0-3 Scotland
  31: { hs:4, as:0 }, // Brazil 4-0 Haiti
  34: { hs:1, as:0 }, // Morocco 1-0 Scotland
  48: { hs:0, as:1 }, // Scotland 0-1 Brazil
  49: { hs:2, as:1 }, // Morocco 2-1 Haiti
  // → Brazil 9 | Morocco 6 | Scotland 3 | Haiti 0

  // ── Group D: USA, Australia, Paraguay, Turkey ─────────────────────────────
  4:  { hs:3, as:0 }, // USA 3-0 Paraguay
  8:  { hs:2, as:1 }, // Australia 2-1 Turkey
  27: { hs:1, as:0 }, // USA 1-0 Australia
  30: { hs:1, as:0 }, // Turkey 1-0 Paraguay
  56: { hs:0, as:1 }, // Turkey 0-1 USA
  57: { hs:0, as:2 }, // Paraguay 0-2 Australia
  // → USA 9 | Australia 6 | Turkey 3 | Paraguay 0

  // ── Group E: Germany, Ecuador, Ivory Coast, Curaçao ──────────────────────
  9:  { hs:4, as:0 }, // Germany 4-0 Curaçao
  11: { hs:1, as:2 }, // Ivory Coast 1-2 Ecuador
  32: { hs:2, as:1 }, // Germany 2-1 Ivory Coast
  33: { hs:3, as:0 }, // Ecuador 3-0 Curaçao
  52: { hs:1, as:1 }, // Ecuador 1-1 Germany
  53: { hs:1, as:2 }, // Curaçao 1-2 Ivory Coast
  // → Germany 7 (GD+5) | Ecuador 7 (GD+4) | Ivory Coast 3 | Curaçao 0

  // ── Group F: Netherlands, Japan, Sweden, Tunisia ──────────────────────────
  10:  { hs:2, as:1 }, // Netherlands 2-1 Japan
  13:  { hs:1, as:0 }, // Sweden 1-0 Tunisia
  36:  { hs:1, as:0 }, // Netherlands 1-0 Sweden
  104: { hs:1, as:1 }, // Tunisia 1-1 Japan
  60:  { hs:2, as:1 }, // Japan 2-1 Sweden
  61:  { hs:0, as:2 }, // Tunisia 0-2 Netherlands
  // → Netherlands 9 | Japan 4 | Sweden 3 | Tunisia 1

  // ── Group G: Belgium, Egypt, Iran, New Zealand ────────────────────────────
  15: { hs:3, as:0 }, // Belgium 3-0 New Zealand
  16: { hs:1, as:1 }, // Egypt 1-1 Iran
  40: { hs:2, as:0 }, // Belgium 2-0 Egypt
  42: { hs:2, as:1 }, // Iran 2-1 New Zealand
  64: { hs:0, as:1 }, // New Zealand 0-1 Belgium
  65: { hs:0, as:2 }, // Iran 0-2 Egypt
  // → Belgium 9 | Egypt 4 (GD 0) | Iran 4 (GD -1) | New Zealand 0

  // ── Group H: Spain, Uruguay, Saudi Arabia, Cape Verde ────────────────────
  12: { hs:3, as:0 }, // Spain 3-0 Cape Verde
  14: { hs:0, as:2 }, // Saudi Arabia 0-2 Uruguay
  35: { hs:2, as:0 }, // Spain 2-0 Saudi Arabia
  37: { hs:2, as:1 }, // Uruguay 2-1 Cape Verde
  62: { hs:1, as:1 }, // Cape Verde 1-1 Saudi Arabia
  63: { hs:0, as:1 }, // Uruguay 0-1 Spain
  // → Spain 9 | Uruguay 6 | Cape Verde 1 | Saudi Arabia 1

  // ── Group I: France, Senegal, Norway, Iraq ────────────────────────────────
  17: { hs:2, as:0 }, // France 2-0 Senegal
  18: { hs:0, as:3 }, // Iraq 0-3 Norway
  39: { hs:3, as:0 }, // France 3-0 Iraq
  41: { hs:1, as:1 }, // Norway 1-1 Senegal
  58: { hs:0, as:1 }, // Norway 0-1 France
  59: { hs:2, as:0 }, // Senegal 2-0 Iraq
  // → France 9 | Norway 4 (GD+2) | Senegal 4 (GD 0) | Iraq 0

  // ── Group J: Argentina, Algeria, Austria, Jordan ──────────────────────────
  19: { hs:3, as:1 }, // Argentina 3-1 Algeria
  20: { hs:2, as:0 }, // Austria 2-0 Jordan
  38: { hs:2, as:0 }, // Argentina 2-0 Austria
  43: { hs:1, as:1 }, // Jordan 1-1 Algeria
  70: { hs:0, as:1 }, // Algeria 0-1 Austria
  71: { hs:0, as:2 }, // Jordan 0-2 Argentina
  // → Argentina 9 | Austria 6 | Jordan 1 | Algeria 1

  // ── Group K: Portugal, DR Congo, Colombia, Uzbekistan ────────────────────
  21: { hs:2, as:0 }, // Portugal 2-0 DR Congo
  24: { hs:0, as:2 }, // Uzbekistan 0-2 Colombia
  44: { hs:3, as:0 }, // Portugal 3-0 Uzbekistan
  46: { hs:2, as:1 }, // Colombia 2-1 DR Congo
  68: { hs:1, as:0 }, // DR Congo 1-0 Uzbekistan
  69: { hs:1, as:2 }, // Colombia 1-2 Portugal
  // → Portugal 9 | Colombia 6 | DR Congo 3 | Uzbekistan 0

  // ── Group L: England, Croatia, Ghana, Panama ──────────────────────────────
  22: { hs:3, as:0 }, // England 3-0 Panama
  23: { hs:1, as:1 }, // Croatia 1-1 Ghana
  45: { hs:2, as:0 }, // England 2-0 Croatia
  47: { hs:2, as:1 }, // Ghana 2-1 Panama
  66: { hs:0, as:1 }, // Ghana 0-1 England
  67: { hs:3, as:0 }, // Croatia 3-0 Panama
  // → England 9 | Croatia 4 (GD+1) | Ghana 4 (GD 0) | Panama 0

  // ── Round of 32 ──────────────────────────────────────────────────────────
  72: { h:'Germany',       a:'Tunisia',      hs:3, as:0 },
  73: { h:'Brazil',        a:'Japan',        hs:2, as:0 },
  74: { h:'France',        a:'Senegal',      hs:1, as:0 },
  75: { h:'Ecuador',       a:'Egypt',        hs:2, as:1 },
  76: { h:'South Korea',   a:'Switzerland',  hs:1, as:2 },
  77: { h:'Mexico',        a:'Sweden',       hs:2, as:1 },
  78: { h:'Netherlands',   a:'Morocco',      hs:3, as:0 },
  79: { h:'England',       a:'Saudi Arabia', hs:3, as:1 },
  80: { h:'Colombia',      a:'Croatia',      hs:2, as:1 },
  81: { h:'Argentina',     a:'Uruguay',      hs:2, as:0 },
  82: { h:'Spain',         a:'Algeria',      hs:2, as:1 },
  83: { h:'Australia',     a:'Norway',       hs:1, as:0 },
  84: { h:'United States', a:'Turkey',       hs:2, as:0 },
  85: { h:'Belgium',       a:'Ivory Coast',  hs:2, as:0 },
  86: { h:'Canada',        a:'Ghana',        hs:2, as:1 },
  87: { h:'Portugal',      a:'Austria',      hs:2, as:1 },

  // ── Round of 16 ──────────────────────────────────────────────────────────
  88: { h:'Germany',       a:'Brazil',       hs:1, as:2 },
  89: { h:'France',        a:'Ecuador',      hs:2, as:0 },
  90: { h:'Switzerland',   a:'Mexico',       hs:1, as:2 },
  91: { h:'Netherlands',   a:'England',      hs:1, as:2 },
  92: { h:'Colombia',      a:'Argentina',    hs:1, as:2 },
  93: { h:'Spain',         a:'Australia',    hs:3, as:0 },
  94: { h:'United States', a:'Belgium',      hs:1, as:2 },
  95: { h:'Canada',        a:'Portugal',     hs:0, as:2 },

  // ── Quarter-finals ───────────────────────────────────────────────────────
  96: { h:'Brazil',        a:'France',       hs:0, as:1 },
  97: { h:'Mexico',        a:'England',      hs:1, as:2 },
  98: { h:'Argentina',     a:'Spain',        hs:2, as:1 },
  99: { h:'Belgium',       a:'Portugal',     hs:1, as:2 },

  // ── Semi-finals ──────────────────────────────────────────────────────────
  100: { h:'France',       a:'England',      hs:2, as:1 },
  101: { h:'Argentina',    a:'Portugal',     hs:3, as:0 },

  // ── 3rd Place ────────────────────────────────────────────────────────────
  102: { h:'England',      a:'Portugal',     hs:2, as:1 },

  // ── Final ─────────────────────────────────────────────────────────────────
  103: { h:'France',       a:'Argentina',    hs:1, as:3 }, // 🏆 Argentina champions!
};
