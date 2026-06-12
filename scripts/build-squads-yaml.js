#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '../public/fifa_world_cup_2026_squads.yaml');

const POS_MAP = { G: 'Goalkeeper', D: 'Defender', M: 'Midfielder', F: 'Forward' };

// ESPN team ID → { yamlName, confederation }
const TEAMS = [
  // CONCACAF
  { id: 206,   name: 'Canada',                 conf: 'CONCACAF' },
  { id: 203,   name: 'Mexico',                 conf: 'CONCACAF' },
  { id: 660,   name: 'United States',          conf: 'CONCACAF' },
  { id: 2659,  name: 'Panama',                 conf: 'CONCACAF' },
  { id: 2654,  name: 'Haiti',                  conf: 'CONCACAF' },
  { id: 11678, name: 'Curaçao',               conf: 'CONCACAF' },
  // CONMEBOL
  { id: 202,   name: 'Argentina',              conf: 'CONMEBOL' },
  { id: 205,   name: 'Brazil',                 conf: 'CONMEBOL' },
  { id: 212,   name: 'Uruguay',                conf: 'CONMEBOL' },
  { id: 208,   name: 'Colombia',               conf: 'CONMEBOL' },
  { id: 209,   name: 'Ecuador',                conf: 'CONMEBOL' },
  { id: 210,   name: 'Paraguay',               conf: 'CONMEBOL' },
  // UEFA
  { id: 481,   name: 'Germany',                conf: 'UEFA' },
  { id: 478,   name: 'France',                 conf: 'UEFA' },
  { id: 164,   name: 'Spain',                  conf: 'UEFA' },
  { id: 448,   name: 'England',                conf: 'UEFA' },
  { id: 482,   name: 'Portugal',               conf: 'UEFA' },
  { id: 449,   name: 'Netherlands',            conf: 'UEFA' },
  { id: 459,   name: 'Belgium',                conf: 'UEFA' },
  { id: 477,   name: 'Croatia',                conf: 'UEFA' },
  { id: 475,   name: 'Switzerland',            conf: 'UEFA' },
  { id: 474,   name: 'Austria',                conf: 'UEFA' },
  { id: 464,   name: 'Norway',                 conf: 'UEFA' },
  { id: 466,   name: 'Sweden',                 conf: 'UEFA' },
  { id: 465,   name: 'Turkey',                 conf: 'UEFA' },
  { id: 580,   name: 'Scotland',               conf: 'UEFA' },
  { id: 450,   name: 'Czechia',                conf: 'UEFA' },
  { id: 452,   name: 'Bosnia and Herzegovina', conf: 'UEFA' },
  // AFC
  { id: 627,   name: 'Japan',                  conf: 'AFC' },
  { id: 469,   name: 'Iran',                   conf: 'AFC' },
  { id: 451,   name: 'South Korea',            conf: 'AFC' },
  { id: 628,   name: 'Australia',              conf: 'AFC' },
  { id: 655,   name: 'Saudi Arabia',           conf: 'AFC' },
  { id: 2570,  name: 'Uzbekistan',             conf: 'AFC' },
  { id: 4398,  name: 'Qatar',                  conf: 'AFC' },
  { id: 4375,  name: 'Iraq',                   conf: 'AFC' },
  { id: 2917,  name: 'Jordan',                 conf: 'AFC' },
  // CAF
  { id: 2869,  name: 'Morocco',                conf: 'CAF' },
  { id: 654,   name: 'Senegal',                conf: 'CAF' },
  { id: 2620,  name: 'Egypt',                  conf: 'CAF' },
  { id: 624,   name: 'Algeria',                conf: 'CAF' },
  { id: 4789,  name: 'Ivory Coast',            conf: 'CAF' },
  { id: 659,   name: 'Tunisia',                conf: 'CAF' },
  { id: 467,   name: 'South Africa',           conf: 'CAF' },
  { id: 4469,  name: 'Ghana',                  conf: 'CAF' },
  { id: 2850,  name: 'DR Congo',               conf: 'CAF' },
  { id: 2597,  name: 'Cape Verde',             conf: 'CAF' },
  // OFC
  { id: 2666,  name: 'New Zealand',            conf: 'OFC' },
];

// Correct 2026 managers (ESPN coach endpoint returns outdated data)
const MANAGERS = {
  'Canada':                 'Jesse Marsch',
  'Mexico':                 'Javier Aguirre',
  'United States':          'Mauricio Pochettino',
  'Panama':                 'Thomas Christiansen',
  'Haiti':                  'Sébastien Migné',
  'Curaçao':               'Dick Advocaat',
  'Argentina':              'Lionel Scaloni',
  'Brazil':                 'Carlo Ancelotti',
  'Uruguay':                'Marcelo Bielsa',
  'Colombia':               'Néstor Lorenzo',
  'Ecuador':                'Sebastián Beccacece',
  'Paraguay':               'Gustavo Alfaro',
  'Germany':                'Julian Nagelsmann',
  'France':                 'Didier Deschamps',
  'Spain':                  'Luis de la Fuente',
  'England':                'Thomas Tuchel',
  'Portugal':               'Roberto Martínez',
  'Netherlands':            'Ronald Koeman',
  'Belgium':                'Domenico Tedesco',
  'Croatia':                'Zlatko Dalić',
  'Switzerland':            'Murat Yakin',
  'Austria':                'Ralf Rangnick',
  'Norway':                 'Ståle Solbakken',
  'Sweden':                 'Jon Dahl Tomasson',
  'Turkey':                 'Vincenzo Montella',
  'Scotland':               'Steve Clarke',
  'Czechia':                'Miroslav Koubek',
  'Bosnia and Herzegovina': 'Sergej Barbarez',
  'Japan':                  'Hajime Moriyasu',
  'Iran':                   'Amir Ghalenoei',
  'South Korea':            'Hong Myung-bo',
  'Australia':              'Tony Popovic',
  'Saudi Arabia':           'Hervé Renard',
  'Uzbekistan':             'Srečko Katanec',
  'Qatar':                  'Julen Lopetegui',
  'Iraq':                   'Jesús Casas',
  'Jordan':                 'Jamal Sellami',
  'Morocco':                'Walid Regragui',
  'Senegal':                'Pape Thiaw',
  'Egypt':                  'Hossam Hassan',
  'Algeria':                'Vladimir Petković',
  'Ivory Coast':            'Emerse Faé',
  'Tunisia':                'Kais Yaâkoubi',
  'South Africa':           'Hugo Broos',
  'Ghana':                  'Otto Addo',
  'DR Congo':               'Sébastien Desabre',
  'Cape Verde':             'Bubista',
  'New Zealand':            'Darren Bazeley',
};

async function fetchRoster(team) {
  const url = `https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/teams/${team.id}/roster`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${team.name}`);
  const data = await res.json();

  const manager = MANAGERS[team.name] || 'TBA';

  const players = (data.athletes || []).map(a => ({
    name: a.displayName || a.fullName || '',
    position: POS_MAP[a.position?.abbreviation] || a.position?.displayName || 'Unknown',
  }));

  return { ...team, manager, players };
}

function indent(n) { return '  '.repeat(n); }

function yamlStr(s) {
  // Quote strings that contain special YAML chars
  if (/[:#\[\]{}&*!|>'"%@`,]/.test(s) || s.includes('\n')) {
    return `"${s.replace(/"/g, '\\"')}"`;
  }
  return s;
}

function buildYaml(results) {
  const confOrder = ['CONCACAF', 'CONMEBOL', 'UEFA', 'AFC', 'CAF', 'OFC'];
  const byConf = {};
  for (const r of results) {
    if (!byConf[r.conf]) byConf[r.conf] = [];
    byConf[r.conf].push(r);
  }

  let out = `tournament: "FIFA World Cup 2026"\n`;
  out += `hosts:\n  - Canada\n  - Mexico\n  - United States\n`;
  out += `total_teams: 48\n\n`;
  out += `confederations:\n`;

  for (const conf of confOrder) {
    if (!byConf[conf]) continue;
    out += `${indent(1)}${conf}:\n`;
    for (const team of byConf[conf]) {
      out += `${indent(2)}${yamlStr(team.name)}:\n`;
      out += `${indent(3)}manager: ${yamlStr(team.manager)}\n`;
      out += `${indent(3)}squad:\n`;
      for (const p of team.players) {
        out += `${indent(4)}- name: ${yamlStr(p.name)}\n`;
        out += `${indent(5)}position: "${p.position}"\n`;
      }
    }
  }
  return out;
}

async function main() {
  console.log(`Fetching ${TEAMS.length} team rosters from ESPN...`);
  const results = await Promise.all(
    TEAMS.map(t => fetchRoster(t).then(r => {
      console.log(`  ✓ ${r.name} — ${r.players.length} players (${r.manager})`);
      return r;
    }).catch(err => {
      console.error(`  ✗ ${t.name}: ${err.message}`);
      return { ...t, manager: 'TBA', players: [] };
    }))
  );

  const yaml = buildYaml(results);
  fs.writeFileSync(OUT, yaml, 'utf8');
  console.log(`\nWrote ${OUT}`);
  console.log(`Total players: ${results.reduce((s, r) => s + r.players.length, 0)}`);
}

main().catch(err => { console.error(err); process.exit(1); });
