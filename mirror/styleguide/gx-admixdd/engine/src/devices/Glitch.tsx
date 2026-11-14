// D10 glitch burst on a designed plate: slab bands (offset), RGB split, scanlines. No flash/inverted/blown frames (owner SOP bans flash frames, lead review v1); bursts end on a clean hard cut.
import React from 'react';
import { AbsoluteFill, random } from 'remotion';

const SVG_DEFS = (
  <svg width="0" height="0" style={{ position: 'absolute' }}>
    <filter id="gxR"><feColorMatrix type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" /></filter>
    <filter id="gxGB"><feColorMatrix type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0" /></filter>
  </svg>
);

/** i = burst frame index (0..n-1), n = burst length, seed for deterministic bands. */
export const GlitchFrame: React.FC<{ i: number; n: number; seed: string; children: React.ReactNode }> = ({ i, n, seed, children }) => {
  const split = 10 - i; // RGB split px, shrinking
  const bands = Array.from({ length: 5 }, (_, k) => {
    const top = random(`${seed}t${i}${k}`) * 88;
    const h = 6 + random(`${seed}h${i}${k}`) * 8;
    const off = (random(`${seed}o${i}${k}`) - 0.5) * 2 * (4 + random(`${seed}m${i}${k}`) * 8);
    return { top, h, off };
  });
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {SVG_DEFS}
      <AbsoluteFill style={{ filter: 'url(#gxR)', transform: `translateX(${split}px)` }}>{children}</AbsoluteFill>
      <AbsoluteFill style={{ filter: 'url(#gxGB)', transform: `translateX(${-split}px)`, mixBlendMode: 'screen' }}>{children}</AbsoluteFill>
      {bands.map((b, k) => (
        <AbsoluteFill key={k} style={{ clipPath: `inset(${b.top}% 0 ${Math.max(0, 100 - b.top - b.h)}% 0)`, transform: `translateX(${b.off}%)`, filter: k % 2 ? 'brightness(1.3) saturate(1.6)' : 'brightness(0.4)' }}>
          {children}
        </AbsoluteFill>
      ))}
      <AbsoluteFill style={{ backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.35) 0 2px, transparent 2px 4px)' }} />
    </AbsoluteFill>
  );
};
