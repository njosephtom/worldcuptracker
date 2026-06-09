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
      const radius = isActive ? 8 : 5;

      const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      group.setAttribute('class', 'vpin');
      group.style.cursor = 'pointer';
      group.style.opacity = isActive ? '1' : '0.3';

      if (isActive) {
        const ring = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        ring.setAttribute('cx', venue.x);
        ring.setAttribute('cy', venue.y);
        ring.setAttribute('r', '12');
        ring.setAttribute('fill', 'none');
        ring.setAttribute('stroke', fill);
        ring.setAttribute('stroke-width', '1');
        ring.setAttribute('opacity', '0.4');

        const pulseRadius = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
        pulseRadius.setAttribute('attributeName', 'r');
        pulseRadius.setAttribute('values', '8;16');
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
      marker.setAttribute('stroke-width', '1.2');
      group.appendChild(marker);

      if (isActive && venueMatches.length) {
        const count = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        count.setAttribute('x', venue.x);
        count.setAttribute('y', venue.y + 1);
        count.setAttribute('text-anchor', 'middle');
        count.setAttribute('dominant-baseline', 'central');
        count.setAttribute('font-size', '7');
        count.setAttribute('font-weight', '600');
        count.setAttribute('fill', '#fff');
        count.textContent = venueMatches.length;
        group.appendChild(count);

        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        const labelX = venue.x > 250 ? venue.x + 11 : venue.x - 11;
        label.setAttribute('x', labelX);
        label.setAttribute('y', venue.y - 11);
        label.setAttribute('text-anchor', venue.x > 250 ? 'start' : 'end');
        label.setAttribute('font-size', '7.5');
        label.setAttribute('font-weight', '500');
        label.setAttribute('fill', '#f0c040');
        label.textContent = venue.city;
        group.appendChild(label);
      }

      const ttHtml = `<div style="font-weight:500;color:#f0c040;margin-bottom:4px">${COUNTRY_FLAGS[venue.cc] || ''} ${venue.name}</div><div style="color:#9ca3af;font-size:10px">${venue.city} · Cap. ${venue.cap}</div>${venueMatches.length ? venueMatches.map((match) => `<div style="margin-top:4px;padding-top:4px;border-top:1px solid #1a2540;font-size:10px;color:#9ca3af">${flagLabel(match.h)} vs ${flagLabel(match.a)}<br><span style="color:#4a5a70">${match.t} · Group ${match.g}</span></div>`).join('') : '<div style="color:#3a4a60;font-style:italic;font-size:10px;margin-top:4px">No match today</div>'}`;

      group.addEventListener('mouseenter', (event) => onTT(event, ttHtml));
      group.addEventListener('mousemove', onMoveTT);
      group.addEventListener('mouseleave', onHideTT);
      svg.appendChild(group);
    });
  }, [dayMatches, onHideTT, onMoveTT, onTT]);

  return (
    <div>
      <div style={{ background: '#0a1420', borderTop: '1px solid #1a2540', borderBottom: '1px solid #1a2540', padding: '5px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 10 }}>
        <div style={{ display: 'flex', gap: 10 }}>
          {[['🇺🇸', 'USA'], ['🇨🇦', 'Canada'], ['🇲🇽', 'Mexico']].map(([flag, label]) => (
            <span key={label} style={{ color: '#5a6a85' }}>{flag} {label}</span>
          ))}
          <span style={{ color: '#3a4a60' }}>· dim = no match</span>
        </div>
        <span style={{ color: '#f0c040' }}>{fmtDate(selectedDate)}</span>
      </div>
      <svg ref={svgRef} viewBox="0 0 520 300" style={{ width: '100%', display: 'block', background: '#050c18' }} xmlns="http://www.w3.org/2000/svg">
        <style>{`
          .land{stroke:#1a2a40;stroke-width:.8;stroke-linejoin:round;stroke-linecap:round}
          .coast{fill:none;stroke:#233756;stroke-width:.55;opacity:.55}
          .label{font:600 10px 'Roboto Mono', monospace;letter-spacing:.8px;fill:#6f86a9}
        `}</style>
        <rect x="0" y="0" width="520" height="300" fill="#06111f" />
        <path className="land" fill="#112338" d="M44,42 L62,28 L92,22 L126,24 L158,16 L198,18 L232,10 L278,16 L316,14 L354,20 L388,18 L422,28 L448,40 L470,58 L482,74 L486,94 L474,102 L460,100 L446,106 L434,102 L420,110 L404,108 L388,116 L370,114 L356,124 L338,122 L322,132 L304,130 L288,140 L270,138 L252,148 L234,146 L216,154 L196,152 L176,162 L156,158 L138,166 L120,162 L102,170 L84,164 L72,152 L60,132 L52,110 L46,88 Z" />
        <path className="coast" d="M62,40 L92,34 L126,36 L158,30 L196,30 L234,24 L274,28 L316,26 L350,30 L390,32 L424,42 L452,56" />
        <path className="land" fill="#0f1d2f" d="M62,176 L80,168 L100,172 L120,166 L140,170 L160,164 L182,168 L202,162 L224,166 L246,160 L270,164 L292,158 L316,162 L338,154 L362,158 L386,150 L410,152 L434,146 L454,154 L466,170 L470,186 L464,200 L456,214 L448,226 L444,240 L440,256 L428,266 L410,262 L392,270 L374,266 L356,272 L336,268 L318,274 L300,270 L282,276 L264,272 L246,266 L228,270 L210,262 L194,264 L180,256 L164,258 L148,246 L132,248 L116,236 L102,238 L88,226 L76,210 L66,194 Z" />
        <path className="coast" d="M88,176 L120,180 L148,176 L178,180 L210,176 L242,178 L274,174 L306,174 L340,168 L374,166 L410,160 L436,162" />
        <path className="land" fill="#14304a" d="M96,236 L112,244 L126,242 L142,252 L158,248 L172,260 L188,258 L202,270 L216,268 L230,278 L224,292 L210,298 L192,296 L176,292 L160,294 L144,290 L128,292 L112,286 L102,274 Z" />
        <path className="land" fill="#14304a" d="M128,254 L122,266 L112,274 L106,264 L112,254 Z" />
        <path className="land" fill="#0f1d2f" d="M382,264 L392,270 L398,286 L390,280 Z" />
        <path className="land" fill="#0b1727" d="M330,292 Q348,288 370,292 Q356,298 336,298 Z" />
        <ellipse cx="338" cy="151" rx="14" ry="6" fill="#07121f" opacity=".75" />
        <ellipse cx="360" cy="156" rx="11" ry="4.5" fill="#07121f" opacity=".7" />
        <ellipse cx="377" cy="149" rx="8" ry="3.5" fill="#07121f" opacity=".55" />
        <text className="label" x="190" y="72">CANADA</text>
        <text className="label" x="215" y="196">UNITED STATES</text>
        <text className="label" x="140" y="280">MEXICO</text>
      </svg>
    </div>
  );
}
