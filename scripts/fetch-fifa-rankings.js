#!/usr/bin/env node
// Fetches the latest FIFA Men's World Rankings and updates public/fifa_ranking.yaml.
// Uses only Node built-ins + native fetch (Node 18+) — no npm install required.
// Run by GitHub Actions as part of the update-match-events cron job.

'use strict';
const fs   = require('fs');
const path = require('path');

const OUT_PATH = path.join(__dirname, '../public/fifa_ranking.yaml');
const API_URL  = 'https://api.fifa.com/api/v3/rankings/FIFA?locale=en&count=250&rankingDateId=latest';

async function fetchRankings() {
  const res = await fetch(API_URL, {
    headers: {
      'Accept':     'application/json',
      'User-Agent': 'Mozilla/5.0 (compatible; worldcuptracker-bot/1.0)',
    },
  });
  if (!res.ok) throw new Error(`FIFA API ${res.status} ${res.statusText}`);
  return res.json();
}

function extractItems(data) {
  const items = data.RankingItems || data.rankings || data.data || data.Items || [];
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error(`Unexpected API response shape. Keys: ${Object.keys(data).join(', ')}`);
  }
  return items;
}

function mapItem(item, idx) {
  const rank     = item.Rank         ?? item.rank         ?? idx + 1;
  const prevRank = item.PreviousRank ?? item.previousRank ?? null;
  const rawPts   = item.Points       ?? item.points       ?? null;
  const country  = item.Association?.Name ?? item.AssociationName ?? item.name   ?? item.country ?? 'Unknown';
  const code     = item.Association?.ShortName             ?? item.code          ?? item.shortName ?? null;
  const confed   = item.Confederation ?? item.confederation ?? null;

  return {
    rank,
    country,
    confederation: confed,
    code:          code || undefined,
    points:        rawPts !== null ? Math.round(rawPts * 100) / 100 : null,
    previous_rank: prevRank,
  };
}

// Minimal YAML serialiser — avoids any npm dependency
function toYaml(rankings) {
  const today = new Date().toISOString().slice(0, 10);

  const header = [
    `metadata:`,
    `  title: "FIFA World Rankings — Men's"`,
    `  updated: "${today}"`,
    `  source: "FIFA"`,
    `  total_nations: ${rankings.length}`,
    ``,
    `rankings:`,
  ].join('\n');

  const rows = rankings.map(r => {
    const lines = [
      `  - rank: ${r.rank}`,
      `    country: ${JSON.stringify(r.country)}`,
    ];
    if (r.confederation) lines.push(`    confederation: ${JSON.stringify(r.confederation)}`);
    if (r.code)          lines.push(`    code: "${r.code}"`);
    if (r.points !== null && r.points !== undefined) lines.push(`    points: ${r.points}`);
    if (r.previous_rank !== null && r.previous_rank !== undefined) lines.push(`    previous_rank: ${r.previous_rank}`);
    return lines.join('\n');
  });

  return header + '\n' + rows.join('\n\n') + '\n';
}

async function main() {
  console.log('Fetching FIFA World Rankings…');
  const data     = await fetchRankings();
  const items    = extractItems(data);
  const rankings = items.map(mapItem);
  const yaml     = toYaml(rankings);

  // Only write when content actually changed
  let existing = '';
  if (fs.existsSync(OUT_PATH)) existing = fs.readFileSync(OUT_PATH, 'utf8');
  if (yaml === existing) {
    console.log('Rankings unchanged — no write needed.');
    return;
  }

  fs.writeFileSync(OUT_PATH, yaml, 'utf8');
  console.log(`Wrote ${rankings.length} rankings to ${OUT_PATH}`);
}

main().catch(err => { console.error(`✗ ${err.message}`); process.exit(1); });
