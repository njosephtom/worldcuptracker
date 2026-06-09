import React from 'react';
import { FLAGS, FLAG_IMGS } from './data';

/**
 * Renders a PNG flag image from /public/flags/, falling back to emoji.
 * w / h control rendered size; radius adds rounded corners.
 */
export function FlagImg({ name, w = 28, h = 19, radius = 2, style = {} }) {
  const src = FLAG_IMGS[name];
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        style={{
          width: w,
          height: h,
          objectFit: 'cover',
          borderRadius: radius,
          display: 'inline-block',
          verticalAlign: 'middle',
          flexShrink: 0,
          ...style,
        }}
      />
    );
  }
  return <span style={{ fontSize: Math.max(w, h) - 2, lineHeight: 1, verticalAlign: 'middle' }}>{FLAGS[name] || '🏳️'}</span>;
}
