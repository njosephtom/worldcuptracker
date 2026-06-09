import { useState, useCallback } from 'react';

export function useTooltip() {
  const [tooltip, setTooltip] = useState({ visible: false, html: '', x: 0, y: 0 });

  const show = useCallback((e, html) => {
    let x = e.clientX + 14, y = e.clientY - 10;
    if (x + 250 > window.innerWidth) x = e.clientX - 260;
    if (y + 160 > window.innerHeight) y = e.clientY - 170;
    setTooltip({ visible: true, html, x, y });
  }, []);

  const move = useCallback((e) => {
    let x = e.clientX + 14, y = e.clientY - 10;
    if (x + 250 > window.innerWidth) x = e.clientX - 260;
    if (y + 160 > window.innerHeight) y = e.clientY - 170;
    setTooltip(t => ({ ...t, x, y }));
  }, []);

  const hide = useCallback(() => setTooltip(t => ({ ...t, visible: false })), []);

  return { tooltip, show, move, hide };
}

export function TooltipPortal({ tooltip }) {
  if (!tooltip.visible) return null;
  return (
    <div style={{
      position: 'fixed', left: tooltip.x, top: tooltip.y,
      background: '#0f1828', border: '1px solid #2a3d5a',
      borderRadius: 8, padding: '9px 13px', fontSize: 11,
      color: '#e0ddd5', zIndex: 9999, pointerEvents: 'none',
      maxWidth: 240, boxShadow: '0 4px 24px rgba(0,0,0,.7)',
      lineHeight: 1.5,
    }} dangerouslySetInnerHTML={{ __html: tooltip.html }} />
  );
}
