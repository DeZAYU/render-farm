// Designed place beat: underwater berg/depth plate (dark grade, push, slow tilt deeper) + typed VT323 place label (D4 look) + D10 bursts in/out.
import React from 'react';
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { C, PUSH } from '../tokens';
import { VT323 } from '../fonts';
import { GlitchFrame } from './Glitch';

const Plate: React.FC<{ f: number; y0: number; y1: number; dur: number; text: string; typeAt: number; cps: number; cursorFrom: number }> = ({ f, y0, y1, dur, text, typeAt, cps, cursorFrom }) => {
  const s = 1.6 + PUSH.berg * (f / 30);
  const oy = interpolate(f, [0, dur], [y0, y1]);
  const typed = Math.max(0, Math.min(text.length, Math.floor((f - typeAt) / cps) + 1));
  const doneAt = typeAt + text.length * cps;
  const cursorOn = f < doneAt || Math.floor((f - doneAt) / 8) % 2 === 0;
  return (
    <AbsoluteFill style={{ backgroundColor: C.black, overflow: 'hidden' }}>
      <Img src={staticFile('intro/berg_src.jpg')} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${s})`, transformOrigin: `50% ${oy}%`, filter: 'saturate(0.6) brightness(0.5) contrast(1.15)' }} />
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse 70% 65% at 50% 50%, rgba(5,6,7,0) 30%, rgba(5,6,7,0.85) 100%)' }} />
      <AbsoluteFill style={{ backgroundColor: C.bergTeal, mixBlendMode: 'multiply', opacity: 0.35 }} />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ fontFamily: VT323, fontSize: 119, letterSpacing: '0.08em', color: C.label, textShadow: `-2px 0 rgba(255,40,40,0.75), 2px 0 rgba(40,140,255,0.75), 0 2px 3px ${C.labelShadow}`, display: 'flex', alignItems: 'center', whiteSpace: 'pre' }}>
          <span>{text.slice(0, typed)}</span>
          <span style={{ display: 'inline-block', width: '0.62em', height: '0.95em', backgroundColor: C.cursor, marginLeft: '0.08em', visibility: f >= cursorFrom && (f >= typeAt || Math.floor(f / 8) % 2 === 0) && cursorOn ? 'visible' : 'hidden' }} />
          <span style={{ visibility: 'hidden' }}>{text.slice(typed)}</span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const PlacePlate: React.FC<{ dur: number; text: string; y0: number; y1: number; typeAt: number; cps?: number; burstIn: number; burstOut: number; seed: string }> = ({ dur, text, y0, y1, typeAt, cps = 3, burstIn, burstOut, seed }) => {
  const f = useCurrentFrame();
  const plate = <Plate f={f} y0={y0} y1={y1} dur={dur} text={text} typeAt={typeAt} cps={cps} cursorFrom={burstIn} />;
  if (f < burstIn) return <GlitchFrame i={f} n={burstIn} seed={`${seed}in`}>{plate}</GlitchFrame>;
  const o = f - (dur - burstOut);
  if (o >= 0) return <GlitchFrame i={o} n={burstOut} seed={`${seed}out`}>{plate}</GlitchFrame>;
  return plate;
};
