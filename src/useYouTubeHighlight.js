import { useState, useEffect } from 'react';

// ── Name mapping ──────────────────────────────────────────────────────────────

const YT_NAME_MAP = {
  'Cape Verde':              'Cabo Verde',
  'United States':           'USA',
  'Bosnia and Herzegovina':  'Bosnia',
};

export function ytName(n) { return YT_NAME_MAP[n] || n; }

export function youtubeSearchUrl(home, away) {
  const q = encodeURIComponent(
    `${ytName(home)} vs. ${ytName(away)} Full Highlights | FIFA World Cup 2026`
  );
  return `https://www.youtube.com/results?search_query=${q}`;
}

// ── Tier 1: static match-highlights.json ─────────────────────────────────────
// Populated by GitHub Actions every 6 hours (scripts/fetch-highlights.js).
// Served from CDN — instant lookup, zero YouTube quota cost.
//   null  = not yet attempted
//   false = fetch failed or file missing
//   {...} = loaded data

let _highlightsDB = null;

async function loadHighlightsDB() {
  if (_highlightsDB !== null) return _highlightsDB;
  try {
    const res = await fetch('/match-highlights.json');
    if (!res.ok) { _highlightsDB = false; return false; }
    const data = await res.json();
    _highlightsDB = (data && typeof data === 'object') ? data : false;
    return _highlightsDB;
  } catch {
    _highlightsDB = false;
    return false;
  }
}

// ── Tier 2: live YouTube Data API v3 ─────────────────────────────────────────
// Resolves @TSN_Sports handle once per session, then searches within that channel.
// Cost: 1 unit for handle resolution + 100 units per search.

let _tsnChannelId = null;

async function resolveTSNChannelId(apiKey) {
  if (_tsnChannelId !== null) return _tsnChannelId;
  try {
    const res  = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=id&forHandle=TSN_Sports&key=${apiKey}`
    );
    const data = await res.json();
    _tsnChannelId = data?.items?.[0]?.id || '';
  } catch {
    _tsnChannelId = '';
  }
  return _tsnChannelId;
}

// Session cache for live API results — avoids re-searching the same match
const _ytCache = {};

// ── Hook ──────────────────────────────────────────────────────────────────────
//
// useYouTubeHighlight(homeTeam, awayTeam, enabled, matchId)
//
// Lookup order:
//   1. public/match-highlights.json (pre-fetched by cron, instant)
//   2. Live YouTube API (real-time, uses quota)
//
// Returns { videoId, title, thumbnail, status, loading }
//   status: 'found' | 'pending' | 'not-found' | 'no-key' | 'fetch-error' | null

export function useYouTubeHighlight(homeTeam, awayTeam, enabled, matchId) {
  const [videoId,   setVideoId]   = useState(null);
  const [title,     setTitle]     = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [status,    setStatus]    = useState(null);
  const [loading,   setLoading]   = useState(false);

  useEffect(() => {
    if (!enabled || !homeTeam || !awayTeam) {
      setVideoId(null); setTitle(null); setThumbnail(null);
      setStatus(null);  setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setVideoId(null); setTitle(null); setThumbnail(null); setStatus(null);

    (async () => {
      // ── Tier 1: static highlights DB ─────────────────────────────────────
      const db = await loadHighlightsDB();
      if (db && matchId != null) {
        const entry = db[String(matchId)];
        if (entry?.status === 'found' && entry.videoId) {
          if (!cancelled) {
            setVideoId(entry.videoId);
            setTitle(entry.title || null);
            setThumbnail(entry.thumbnail || null);
            setStatus('found');
            setLoading(false);
          }
          return;
        }
        if (entry?.status === 'pending') {
          if (!cancelled) { setStatus('pending'); setLoading(false); }
          return;
        }
        if (entry?.status === 'not-found') {
          if (!cancelled) { setStatus('not-found'); setLoading(false); }
          return;
        }
      }

      // ── Tier 2: live YouTube API ──────────────────────────────────────────
      const apiKey = process.env.REACT_APP_YOUTUBE_API_KEY;
      if (!apiKey) {
        if (!cancelled) { setStatus('no-key'); setLoading(false); }
        return;
      }

      const cacheKey = `${homeTeam}__${awayTeam}`;
      if (_ytCache[cacheKey] !== undefined) {
        if (!cancelled) {
          const cached = _ytCache[cacheKey];
          if (cached) {
            setVideoId(cached.videoId);
            setTitle(cached.title || null);
            setThumbnail(cached.thumbnail || null);
            setStatus('found');
          } else {
            setStatus('not-found');
          }
          setLoading(false);
        }
        return;
      }

      try {
        const channelId = await resolveTSNChannelId(apiKey);
        const q         = `${ytName(homeTeam)} vs. ${ytName(awayTeam)} Full Highlights FIFA World Cup 2026`;
        const params    = new URLSearchParams({
          part: 'snippet', q, type: 'video',
          videoDuration: 'medium',  // 4–20 min: highlights, not full-match replays
          maxResults: '3', key: apiKey,
          ...(channelId ? { channelId } : {}),
        });
        const res  = await fetch(`https://www.googleapis.com/youtube/v3/search?${params}`);
        const data = await res.json();

        const item  = data?.items?.[0] ?? null;
        const vidId = item?.id?.videoId || null;
        const snip  = item?.snippet;

        if (cancelled) return;

        if (vidId && snip) {
          const result = {
            videoId:   vidId,
            title:     snip.title || null,
            thumbnail: snip.thumbnails?.high?.url || snip.thumbnails?.medium?.url || null,
          };
          _ytCache[cacheKey] = result;
          setVideoId(result.videoId);
          setTitle(result.title);
          setThumbnail(result.thumbnail);
          setStatus('found');
        } else {
          _ytCache[cacheKey] = null;
          setStatus('not-found');
        }
      } catch {
        if (cancelled) return;
        _ytCache[cacheKey] = null;
        setStatus('fetch-error');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [homeTeam, awayTeam, enabled, matchId]);

  return { videoId, title, thumbnail, status, loading };
}
