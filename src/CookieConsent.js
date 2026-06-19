import React, { useState, useEffect } from 'react';

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('wc-cookie-consent')) {
      const t = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(t);
    }
  }, []);

  if (!visible) return null;

  function accept() {
    localStorage.setItem('wc-cookie-consent', 'accepted');
    setVisible(false);
  }

  function decline() {
    localStorage.setItem('wc-cookie-consent', 'declined');
    setVisible(false);
    if (window.googletag) {
      window.googletag.cmd = window.googletag.cmd || [];
      window.googletag.cmd.push(() => window.googletag.pubads().setRequestNonPersonalizedAds(1));
    }
  }

  return (
    <div style={S.overlay}>
      <div style={S.banner}>
        <div style={S.text}>
          <strong style={{ color: '#e8e5dc' }}>Cookie Notice</strong>
          <p style={S.desc}>
            We use cookies from Google AdSense to display ads and analyze traffic.
            These cookies help serve personalized ads based on your browsing activity.
            You can accept all cookies or opt for non-personalized ads.{' '}
            <a href="/privacy.html" style={S.link} target="_blank" rel="noopener noreferrer">
              Privacy Policy
            </a>
          </p>
        </div>
        <div style={S.buttons}>
          <button style={S.acceptBtn} onClick={accept}>Accept All</button>
          <button style={S.declineBtn} onClick={decline}>Non-Personalized Only</button>
        </div>
      </div>
    </div>
  );
}

const S = {
  overlay: {
    position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 10000,
    padding: '0 16px 16px',
    pointerEvents: 'none',
  },
  banner: {
    maxWidth: 720, margin: '0 auto',
    background: '#111d30', border: '1px solid #1f2d45', borderRadius: 12,
    padding: '16px 20px', display: 'flex', alignItems: 'center',
    gap: 16, flexWrap: 'wrap',
    boxShadow: '0 -4px 30px rgba(0,0,0,.5)',
    pointerEvents: 'auto',
  },
  text: { flex: 1, minWidth: 240 },
  desc: {
    color: '#8a9ab8', fontSize: 12, lineHeight: 1.6, margin: '6px 0 0',
  },
  link: { color: '#f0c040', textDecoration: 'underline', textUnderlineOffset: 2 },
  buttons: { display: 'flex', gap: 8, flexShrink: 0 },
  acceptBtn: {
    background: '#f0c040', color: '#080d1a', border: 'none', borderRadius: 8,
    padding: '10px 18px', fontWeight: 700, fontSize: 13, cursor: 'pointer',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  declineBtn: {
    background: 'transparent', color: '#8a9ab8',
    border: '1px solid #1f2d45', borderRadius: 8,
    padding: '10px 14px', fontWeight: 600, fontSize: 12, cursor: 'pointer',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
};
