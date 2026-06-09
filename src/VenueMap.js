import React, { useEffect, useRef } from 'react';
import { VENUES, COUNTRY_FLAGS, flagLabel, fmtDate } from './data';

export function VenueMap({ dayMatches, selectedDate, onTT, onMoveTT, onHideTT }) {
  const svgRef = useRef(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const activeVenues = new Set(dayMatches.map((match) => match.v));

    svg.querySelectorAll('.vpin').forEach((element) => element.remove());

    Object.entries(VENUES).forEach(([key, venue]) => {
      const venueMatches = dayMatches.filter((match) => match.v === key);
      const isActive = activeVenues.has(key);
      const fill = venue.cc === 'MX' ? '#f0c040' : venue.cc === 'CA' ? '#ef4444' : '#3b82f6';
      const stroke = venue.cc === 'MX' ? '#b08000' : venue.cc === 'CA' ? '#a02020' : '#1d4ed8';
      const radius = isActive ? 10 : 6;

      const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      group.setAttribute('class', 'vpin');
      group.style.cursor = 'pointer';
      group.style.opacity = isActive ? '1' : '0.3';

      if (isActive) {
        const ring = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        ring.setAttribute('cx', venue.x);
        ring.setAttribute('cy', venue.y);
        ring.setAttribute('r', '16');
        ring.setAttribute('fill', 'none');
        ring.setAttribute('stroke', fill);
        ring.setAttribute('stroke-width', '1.3');
        ring.setAttribute('opacity', '0.4');

        const pulseRadius = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
        pulseRadius.setAttribute('attributeName', 'r');
        pulseRadius.setAttribute('values', '10;22');
        pulseRadius.setAttribute('dur', '1.8s');
        pulseRadius.setAttribute('repeatCount', 'indefinite');

        const pulseOpacity = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
        pulseOpacity.setAttribute('attributeName', 'opacity');
        pulseOpacity.setAttribute('values', '0.5;0');
        pulseOpacity.setAttribute('dur', '1.8s');
        pulseOpacity.setAttribute('repeatCount', 'indefinite');

        ring.appendChild(pulseRadius);
        ring.appendChild(pulseOpacity);
        group.appendChild(ring);
      }

      const marker = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      marker.setAttribute('cx', venue.x);
      marker.setAttribute('cy', venue.y);
      marker.setAttribute('r', radius);
      marker.setAttribute('fill', fill);
      marker.setAttribute('stroke', stroke);
      marker.setAttribute('stroke-width', '1.5');
      group.appendChild(marker);

      if (isActive && venueMatches.length) {
        const count = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        count.setAttribute('x', venue.x);
        count.setAttribute('y', venue.y + 1);
        count.setAttribute('text-anchor', 'middle');
        count.setAttribute('dominant-baseline', 'central');
        count.setAttribute('font-size', '9');
        count.setAttribute('font-weight', '600');
        count.setAttribute('fill', '#fff');
        count.textContent = venueMatches.length;
        group.appendChild(count);

        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        const labelX = venue.x > 500 ? venue.x + 14 : venue.x - 14;
        label.setAttribute('x', labelX);
        label.setAttribute('y', venue.y - 14);
        label.setAttribute('text-anchor', venue.x > 500 ? 'start' : 'end');
        label.setAttribute('font-size', '9');
        label.setAttribute('font-weight', '500');
        label.setAttribute('fill', '#f0c040');
        label.textContent = venue.city;
        group.appendChild(label);
      }

      const ttHtml = `<div style="font-weight:500;color:var(--ac-gold);margin-bottom:4px">${COUNTRY_FLAGS[venue.cc] || ''} ${venue.name}</div><div style="color:var(--tx-secondary);font-size:10px">${venue.city} · Cap. ${venue.cap}</div>${venueMatches.length ? venueMatches.map((match) => `<div style="margin-top:4px;padding-top:4px;border-top:1px solid var(--bd-main);font-size:10px;color:var(--tx-secondary)">${flagLabel(match.h)} vs ${flagLabel(match.a)}<br><span style="color:var(--tx-dim)">${match.t} · Group ${match.g}</span></div>`).join('') : '<div style="color:var(--tx-dim2);font-style:italic;font-size:10px;margin-top:4px">No match today</div>'}`;

      group.addEventListener('mouseenter', (event) => onTT(event, ttHtml));
      group.addEventListener('mousemove', onMoveTT);
      group.addEventListener('mouseleave', onHideTT);
      svg.appendChild(group);
    });

  }, [dayMatches, onHideTT, onMoveTT, onTT]);

  return (
    <div>
      <div style={{ background: 'var(--bg-panel)', borderTop: '1px solid var(--bd-main)', borderBottom: '1px solid var(--bd-main)', padding: '5px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 10 }}>
        <div style={{ display: 'flex', gap: 10 }}>
          {[['🇺🇸', 'US'], ['🇨🇦', 'CA'], ['🇲🇽', 'MX']].map(([flag, code]) => (
            <span key={code} style={{ color: 'var(--tx-muted)' }}>{flag} {code}</span>
          ))}
          <span style={{ color: 'var(--tx-dim2)' }}>· dim = no match today</span>
        </div>
        <span style={{ color: 'var(--ac-gold)' }}>{fmtDate(selectedDate)}</span>
      </div>
      <svg ref={svgRef} viewBox="418 432 490 428" style={{ width: '100%', display: 'block', background: '#8ab8dc' }} xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="1000" height="902" fill="#8ab8dc" />
        <image href="/north-america.svg" x="0" y="0" width="1000" height="902" />
      </svg>
    </div>
  );
}
