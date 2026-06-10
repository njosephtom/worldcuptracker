# SEO Action Plan — worldcuptracker.us
**Updated:** 2026-06-10 | **Score:** 48/100 (up from 24/100) | **Priority order:** Critical → High → Medium → Low

---

## CRITICAL — Fix immediately

### C1. Create og-image.png (breaks all social previews)
**File:** `public/og-image.png`  
**Why:** `/og-image.png` returns `text/html` — the SPA shell is served instead of an image. `og:image` and `twitter:image` both reference this URL. Every share on Twitter/X, Facebook, LinkedIn, Slack, iMessage shows a broken card.  
**Fix:** Create a 1200×630px PNG branded image (dark navy background, soccer ball, "FIFA World Cup 2026 Tracker" text, worldcuptracker.us). Add to `public/` and redeploy.  
**Effort:** 1–2 hours  
**Impact:** High (social sharing UX + CTR from social referrals)

---

## HIGH — Fix within 1 week

### H1. Add Content-Security-Policy header
**File:** `vercel.json`  
**Why:** CSP is the only major security header missing. The app makes fetch calls at runtime (api.js), making CSP especially important for XSS prevention.  
**Fix:** Add to `vercel.json` headers block:
```json
{ "key": "Content-Security-Policy", "value": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; connect-src 'self' https://api.anthropic.com; img-src 'self' data: https:; font-src 'self' data:; frame-ancestors 'none'" }
```
**Effort:** 30 minutes  
**Impact:** Security compliance; required for A-grade security header score

### H2. Fix schema: trailing slash, location type, add @id and organizer
**File:** `public/index.html` — replace the `<script type="application/ld+json">` block  
**Why:** WebApplication.url missing trailing slash (doesn't match canonical); SportsEvent.location is a plain string (Google ignores for rich results); no @id blocks graph linking; no organizer blocks Event rich result eligibility.  
**Fix:** Replace with the two-block JSON-LD structure shown in FULL-AUDIT-REPORT.md §4.  
**Effort:** 30 minutes  
**Impact:** Event rich result eligibility; structured data correctness

### H3. Remove deprecated X-XSS-Protection header
**File:** `vercel.json`  
**Why:** `X-XSS-Protection: 1; mode=block` is deprecated and ignored by Chrome/Firefox. Remove to avoid CSP interaction edge cases.  
**Effort:** 5 minutes  
**Impact:** Low SEO; hygiene / security header score

### H4. Fix or remove api.js Anthropic API calls
**File:** `src/api.js`  
**Why:** Every page load fires a `fetch('https://api.anthropic.com/v1/messages')` with no API key — the call fails with 401, creating wasted network requests. If an API key is ever added to this file it would be exposed in the client bundle.  
**Options:**
- Remove `api.js` entirely (app already uses static data from `data.js`)
- Move to a Vercel serverless function (`/api/worldcup-data.js`) so the key stays server-side
**Effort:** 1 hour  
**Impact:** Performance (eliminates failed request on every load); security (prevents future key exposure)

---

## MEDIUM — Fix within 1 month

### M1. Expand llms.txt with citable passage blocks
**File:** `public/llms.txt`  
**Why:** Current entries are 30–50 word bullets — below the 134–167 word minimum for AI citation confidence. GPTBot and ClaudeBot currently see only llms.txt (no JS execution), making this the sole AI-citable surface.  
**Fix:** Add one 150-word block per group (team names, match dates, venue) and one per host city (stadium, capacity, matches scheduled). Use direct answer format: "Group A contains Mexico, South Korea, South Africa, and Czechia. Their matches are..."  
**Effort:** 2–3 hours  
**Impact:** AI citation readiness; ChatGPT/Perplexity visibility

### M2. Add named AI crawler rules to robots.txt
**File:** `public/robots.txt`  
**Why:** Wildcard rule works, but explicit entries signal intentional optimization.  
**Fix:**
```
User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /
```
**Effort:** 5 minutes  
**Impact:** Low direct ranking impact; signals AI-friendly posture

### M3. Upgrade web-vitals to v4
**File:** `package.json`  
**Why:** `web-vitals@2.1.4` does not measure INP (replaced FID as Core Web Vital March 2024). You cannot currently monitor your INP score.  
**Fix:** `npm install web-vitals@^4`  
**Effort:** 15 minutes  
**Impact:** Accurate CWV monitoring; INP visibility

### M4. Add data source attribution to the UI
**Why:** No E-E-A-T signal currently — the app shows scores and standings without any indication of data source or update time. Google's quality raters and AI systems look for this.  
**Fix:** Add a small footer or header line: "Data updated [timestamp] · Source: [official data source]"  
**Effort:** 1 hour  
**Impact:** E-E-A-T / trustworthiness signal

### M5. Register in Google Search Console and submit sitemap
**Why:** The sitemap exists at `https://www.worldcuptracker.us/sitemap.xml` but has not been submitted. GSC also reveals indexation status, crawl errors, and actual query impressions.  
**Fix:** Add property at search.google.com/search-console, verify via HTML tag or DNS, submit sitemap URL.  
**Effort:** 30 minutes  
**Impact:** Indexation visibility; faster discovery of new URLs

---

## LOW — Backlog / nice-to-have

### L1. Remove emoji from title tag
**File:** `public/index.html`  
**Why:** ⚽ in title may be stripped by Google in SERPs, creating visual inconsistency. Replace with em dash: "FIFA World Cup 2026 Tracker — Live Scores, Fixtures & Standings"  
**Effort:** 5 minutes

### L2. Build community backlinks
**Why:** Zero backlinks limits all ranking potential.  
**Fix:** Post the tracker to r/soccer and r/worldcup during high-traffic match windows. One well-received post can generate 5–20 referring domains.  
**Effort:** 1 hour active; ongoing

### L3. Add prerendering for static content
**Why:** The fundamental reason content is invisible to crawlers. This is an architectural change.  
**Options:** `react-snap` for static prerendering at build time; or migrate to Next.js for SSG/SSR.  
**Effort:** High (days)  
**Impact:** Highest possible — unlocks all crawlers, AI indexing, and removes the SPA rendering lag entirely

### L4. Configure Brotli compression
**Why:** 15–25% smaller than gzip for JS/CSS bundles. Vercel supports Brotli via Edge config.  
**Effort:** 1 hour

---

## Estimated Score Trajectory

| After completing | Estimated score |
|---|---|
| Current | 48/100 |
| C1 + H1 + H2 + H3 | 57/100 |
| + M1–M5 | 63/100 |
| + L1–L3 (including prerendering) | 75/100 |
| + backlinks (6+ months) | 82/100 |
