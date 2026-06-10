# FIFA World Cup 2026 Tracker — Full SEO Audit Report
**URL:** https://www.worldcuptracker.us  
**Audit Date:** 2026-06-10  
**Overall SEO Health Score: 48 / 100** *(up from 24/100 in previous audit)*

---

## Executive Summary

The June 9 deployment (canonical, OG tags, schema, sitemap, security headers) moved the score from 24 → 48. The live site is technically well-formed, fast, and properly indexed. **Three blockers now dominate the remaining gap:**

1. **Missing OG image** — `/og-image.png` returns the SPA HTML shell, not an image. Every social share is broken.
2. **JavaScript SPA with no SSR/prerendering** — AI crawlers and slow-render Googlebot see a 3,058-byte empty shell. All match data is invisible.
3. **Missing Content-Security-Policy** — The one security header still absent.

Fixing items 1 and 3 are low-effort (hours). Item 2 is architectural (significant effort but highest impact).

---

## Score by Category

| Category | Weight | Score | Weighted |
|---|---|---|---|
| Technical SEO | 22% | 58 | 12.8 |
| Content Quality | 23% | 28 | 6.4 |
| On-Page SEO | 20% | 52 | 10.4 |
| Schema / Structured Data | 10% | 60 | 6.0 |
| Performance (CWV) | 10% | 68 | 6.8 |
| AI Search Readiness | 10% | 42 | 4.2 |
| Images | 5% | 25 | 1.25 |
| **TOTAL** | 100% | — | **48 / 100** |

---

## 1. Technical SEO (58/100)

### Passing
- **robots.txt** — 200 OK, allows all crawlers, Sitemap directive present ✓
- **sitemap.xml** — 200 OK, well-formed, correct canonical URL, `changefreq=hourly`, `lastmod=2026-06-09` ✓
- **Canonical** — `<link rel="canonical" href="https://www.worldcuptracker.us/">` matches www-canonical destination ✓
- **Redirect chain** — All four entry variants converge correctly:
  - `http://worldcuptracker.us` → 308 → `https://worldcuptracker.us/` → 308 → `https://www.worldcuptracker.us/` ✓
  - `http://www.worldcuptracker.us` → 308 → `https://www.worldcuptracker.us/` ✓
  - `https://worldcuptracker.us` → 308 → `https://www.worldcuptracker.us/` ✓
  - `https://www.worldcuptracker.us` → 200 ✓
- **TTFB** — ~75ms (excellent; CDN edge hitting Portland region) ✓
- **Static asset caching** — `Cache-Control: public, max-age=31536000, immutable` on `/static/js/` and `/static/css/` ✓
- **llms.txt** — Present, returns 200, provides tournament context for AI crawlers ✓
- **Security headers** — X-Content-Type-Options, X-Frame-Options, HSTS (2yr + preload), Referrer-Policy, Permissions-Policy all present ✓

### Issues

| Severity | Issue |
|---|---|
| Critical | **og-image.png missing** — `HEAD /og-image.png` returns `200 text/html` (the SPA shell). No actual image file exists. Every platform social preview is broken: `og:image` and `twitter:image` both reference this URL. |
| High | **No Content-Security-Policy header** — The only major security header absent from `vercel.json`. For a site making runtime fetches (API calls in `api.js`), CSP is especially important. |
| High | **SPA without SSR/prerendering** — The HTML shell is 3,058 bytes with `<div id="root"></div>`. All fixture, standings, bracket, and squad data is rendered client-side. Googlebot indexes SPAs but with a multi-day rendering lag. AI crawlers (GPTBot, ClaudeBot) do not execute JavaScript at all. |
| Low | **api.js makes unauthenticated Anthropic API calls from the browser** — `src/api.js` calls `https://api.anthropic.com/v1/messages` without an `x-api-key` header. All calls fail (401) and the app silently falls back to static data. These are wasted network requests on every page load. If a key is ever added to this file, it would be exposed in the client bundle. |
| Low | **X-XSS-Protection: 1; mode=block** — Deprecated header ignored by Chrome and Firefox. Remove from `vercel.json` to avoid any edge-case CSP interaction. |

---

## 2. Content Quality (28/100)

The site is a JavaScript SPA — crawlers receive an empty `<div id="root"></div>`. The actual content (scores, standings, bracket, squads) is invisible to Googlebot until second-wave rendering (days to weeks lag) and permanently invisible to AI crawlers.

### Noscript Fallback (inadequate)
Current noscript:
```html
<h1>FIFA World Cup 2026 Tracker</h1>
<p>Live fixtures, scores, and standings for the FIFA World Cup 2026 (June 11 – July 19, 2026) across USA, Canada, and Mexico. Enable JavaScript to access the live tracker.</p>
```
This is better than nothing but doesn't include any fixture data, group standings, or team information that crawlers could index.

### E-E-A-T Assessment
| Signal | Status |
|---|---|
| Experience | No (no byline, no tournament coverage history) |
| Expertise | No (no data source attribution, no methodology) |
| Authoritativeness | No (zero backlinks, new domain) |
| Trustworthiness | Low (no "last updated" timestamp, no data provenance) |

**Gap:** For a live data tool competing against FIFA.com and ESPN, trust signals are critical. At minimum, a visible "Data source: [source] · Updated [time]" indicator above the standings would help both E-E-A-T and user trust.

---

## 3. On-Page SEO (52/100)

### Passing
- **Title:** "FIFA World Cup 2026 Tracker ⚽ Live Scores, Fixtures & Standings" (57 chars) — good keyword density ✓
- **Meta description:** "Live FIFA World Cup 2026 tracker — fixtures, real-time scores, group standings, squad info, and venue map for all 48 teams across USA, Canada & Mexico." (152 chars) ✓
- **robots meta:** `index, follow, max-image-preview:large, max-snippet:-1` ✓
- **OG title, OG description, OG url, OG site_name, OG locale** — all present ✓
- **Twitter Card:** `summary_large_image` with title, description ✓
- **lang="en"** on `<html>` element ✓

### Issues

| Severity | Issue |
|---|---|
| Critical | **og:image points to missing file** — `https://www.worldcuptracker.us/og-image.png` returns HTML. Twitter, Facebook, LinkedIn, Slack, iMessage all read this URL — all will show broken/empty card previews. |
| Medium | **⚽ emoji in title and OG title** — Google may strip the emoji in SERPs (inconsistent rendering). |
| Medium | **H1 only in noscript** — The `<h1>` is inside `<noscript>`. Googlebot's first-pass (pre-render) sees no visible H1. |

---

## 4. Schema / Structured Data (60/100)

### Issues Found

| Severity | Issue |
|---|---|
| High | **WebApplication.url missing trailing slash** — Schema has `"url": "https://www.worldcuptracker.us"` but canonical is `https://www.worldcuptracker.us/`. Should match exactly. |
| High | **SportsEvent.location is a plain string** — Should be a `Place` entity array. Google ignores plain-string location for event rich results. |
| Medium | **No @id on SportsEvent** — Cannot be linked from `WebApplication.about` using JSON-LD graph references. |
| Medium | **No organizer on SportsEvent** — Required for Event rich result eligibility. |
| Medium | **offers.price is string "0"** — Should be integer `0` per Schema.org spec. |
| Low | **operatingSystem: "Web Browser"** — Non-standard. Omit or use `"Any"`. |

### Recommended Replacement Schema

Replace the single `<script type="application/ld+json">` in `public/index.html` with:

```json
[
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "FIFA World Cup 2026 Tracker",
    "url": "https://www.worldcuptracker.us/",
    "description": "Live FIFA World Cup 2026 tracker — fixtures, real-time scores, group standings, squad info, and venue map for all 48 teams across USA, Canada and Mexico.",
    "applicationCategory": "SportsApplication",
    "inLanguage": "en",
    "isAccessibleForFree": true,
    "offers": { "@type": "Offer", "price": 0, "priceCurrency": "USD" },
    "about": { "@id": "https://www.worldcuptracker.us/#wc2026" }
  },
  {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    "@id": "https://www.worldcuptracker.us/#wc2026",
    "name": "FIFA World Cup 2026",
    "url": "https://www.worldcuptracker.us/",
    "startDate": "2026-06-11",
    "endDate": "2026-07-19",
    "eventStatus": "https://schema.org/EventScheduled",
    "location": [
      { "@type": "Country", "name": "United States" },
      { "@type": "Country", "name": "Canada" },
      { "@type": "Country", "name": "Mexico" }
    ],
    "organizer": {
      "@type": "SportsOrganization",
      "name": "FIFA",
      "url": "https://www.fifa.com"
    }
  }
]
```

---

## 5. Performance (68/100)

*Note: PageSpeed Insights API was rate-limited during audit. Metrics derived from direct resource analysis.*

| Metric | Value | Status |
|---|---|---|
| TTFB (measured, 3 runs avg) | 76ms | Excellent ✓ |
| HTML shell size | 3,058 bytes | Excellent ✓ |
| JS bundle (main.js, gzipped) | 107.7 KB | Good ✓ |
| CSS bundle (main.css, gzipped) | 0.9 KB | Excellent ✓ |
| Static asset cache | public, immutable, 1yr | Excellent ✓ |
| Content-Encoding (JS/CSS) | gzip | ✓ |

### Issues

| Severity | Issue |
|---|---|
| Medium | **web-vitals v2.1.4** — Does not measure INP (replaced FID in March 2024). Upgrade to `web-vitals@^4`. |
| Medium | **SPA mount CLS risk** — App starts in loading state, populates after async (currently failing) API call. Layout shift from skeleton→data contributes to CLS. |
| Low | **No Brotli** — Vercel serves gzip. Brotli offers 15–25% better compression on text assets. |

---

## 6. AI Search Readiness (42/100)

| Platform | Score | Notes |
|---|---|---|
| Google AI Overviews | 35/100 | JS executed on second-wave delay; live data stale by then |
| ChatGPT (Web) | 28/100 | No JS execution; llms.txt is only citable surface |
| Perplexity | 44/100 | Inconsistent JS execution; llms.txt helps |
| Bing Copilot | 38/100 | No JS execution; schema parsed from static HTML |

### Issues

| Severity | Issue |
|---|---|
| High | **SPA means AI crawlers see nothing** — GPTBot and ClaudeBot do not execute JavaScript. They receive the 3,058-byte shell. The llms.txt is the only indexable artifact. |
| Medium | **llms.txt lacks citable passage blocks** — Current entries are 30–50 word bullets. Optimal AI citation passages are 134–167 words. Add per-group team listings and per-venue match schedules as self-contained answer blocks. |
| Low | **No named AI crawler entries in robots.txt** — The wildcard works, but explicitly naming GPTBot, ClaudeBot, PerplexityBot signals intentional optimization. |

---

## 7. Images (25/100)

| File | Status | Notes |
|---|---|---|
| `/og-image.png` | **BROKEN** | Returns `text/html` (SPA shell). Needed: 1200×630px PNG. |
| `/logo192.png` | OK | 5,347 bytes image/png ✓ |
| `/logo512.png` | OK | 9,664 bytes image/png ✓ |
| `/favicon.ico` | OK | 3,870 bytes ✓ |

---

## 8. Backlinks / Domain Authority

New domain — no Common Crawl data available yet (index is quarterly). Expected profile:

| Metric | Expected | Status |
|---|---|---|
| Referring domains | 0–3 | New domain |
| Estimated DA | 1–5 | Build through community links |
| Ranking potential (competitive terms) | Minimal | FIFA.com/ESPN/Google SERP feature dominate |

**Best organic opportunities:** Long-tail developer/tool queries (low competition), community sharing on r/soccer and r/worldcup during live match windows.

---

## Improvements Since Last Audit (2026-06-09)

| Item | Before | After |
|---|---|---|
| SEO Health Score | 24/100 | 48/100 |
| Meta description | CRA boilerplate | Keyword-rich, 152 chars |
| Canonical tag | Missing | Present ✓ |
| OG tags (6 properties) | Missing | All present ✓ |
| Twitter Card | Missing | summary_large_image ✓ |
| JSON-LD schema | Missing | WebApplication + SportsEvent ✓ |
| robots.txt Sitemap | Missing | Added ✓ |
| sitemap.xml | Missing | Present, valid ✓ |
| llms.txt | Missing | Present, substantive ✓ |
| Security headers | None | 6 of 7 major headers ✓ |
| manifest.json | CRA defaults | Proper name/theme ✓ |
| Page title | "React App" | Keyword-optimised ✓ |

---

*Audit: 2026-06-10 | Claude Sonnet 4.6 + subagents (seo-technical, seo-schema, seo-geo, seo-sxo, seo-backlinks)*
