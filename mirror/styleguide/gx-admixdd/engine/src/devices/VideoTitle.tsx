// D2 video title on the berg: scramble decode (line 1 titleWhite f4-f16, line 2 cyan f10-f22), hold, dive under the waterline f96-f120, black after.
import React from 'react';
import { AbsoluteFill, Img, interpolate, random, staticFile, useCurrentFrame } from 'remotion';
import { CameraMotionBlur } from '@remotion/motion-blur';
import { C, E, PUSH } from '../tokens';
import { ARCHIVO } from '../fonts';

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

const Decode: React.FC<{ text: string; f: number; start: number; span: number; seed: string }> = ({ text, f, start, span, seed }) => {
  const n = text.length;
  return (
    <>
      {text.split('').map((ch, i) => {
        const settle = start + Math.round((i / Math.max(1, n - 1)) * span);
        const cyc = 3 + Math.floor(random(`${seed}c${i}`) * 3);
        const appear = settle - cyc;
        let shown = ch;
        let vis = f >= appear;
        if (ch !== ' ' && f >= appear && f < settle) shown = GLYPHS[Math.floor(random(`${seed}${i}-${f}`) * GLYPHS.length)];
        return <span key={i} style={{ visibility: vis ? 'visible' : 'hidden' }}>{shown}</span>;
      })}
    </>
  );
};

const Scene: React.FC<{ f: number }> = ({ f }) => {
  const d = interpolate(f, [96, 120], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: E.dive });
  const bergScale = (1 + PUSH.berg * (f / 30)) * (1 + 1.2 * d);
  const bergY = -38 * d; // tilt down through the waterline (content rises)
  const titleScale = interpolate(f, [4, 22], [1.04, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: E.settle });
  const fringe = interpolate(f, [4, 22], [3, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const titleY = -70 * d;
  const titleO = 1 - interpolate(d, [0.35, 0.9], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const under = interpolate(d, [0.3, 1], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const base: React.CSSProperties = { position: 'absolute', left: 0, right: 0, textAlign: 'center', fontFamily: ARCHIVO, fontWeight: 800, fontVariationSettings: "'wdth' 125, 'wght' 800", fontSize: 92, letterSpacing: '0.10em', lineHeight: 1, transform: 'translateY(-50%)', whiteSpace: 'pre' };
  return (
    <AbsoluteFill style={{ backgroundColor: C.black, overflow: 'hidden' }}>
      <AbsoluteFill style={{ transform: `translateY(${bergY}%) scale(${bergScale})`, transformOrigin: '50% 45%' }}>
        <Img src={staticFile('intro/berg_src.jpg')} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 52%', filter: 'saturate(0.5) brightness(0.72) contrast(1.12)' }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ backgroundColor: C.bergTeal, mixBlendMode: 'multiply', opacity: 0.3 + 0.5 * under }} />
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse 75% 70% at 50% 45%, rgba(5,6,7,0) 40%, rgba(5,6,7,0.7) 100%)' }} />
      <AbsoluteFill style={{ backgroundColor: '#03161b', opacity: 0.55 * under }} />
      <AbsoluteFill style={{ transform: `translateY(${titleY}%) scale(${titleScale})`, opacity: titleO }}>
        <div style={{ ...base, top: '40%', color: C.titleWhite, textShadow: `${-fringe}px 0 rgba(255,60,60,0.55), ${fringe}px 0 rgba(69,253,252,0.6), 0 3px 10px rgba(0,0,0,0.75)` }}>
          <Decode text="20 MOST DISTURBING" f={f} start={4} span={12} seed="l1" />
        </div>
        <div style={{ ...base, top: '49%', color: C.cyan, WebkitTextStroke: `1px ${C.cyanRim}`, textShadow: `${-fringe}px 0 rgba(10,43,255,0.6), 0 0 14px ${C.cyanGlow}, 0 3px 10px rgba(0,0,0,0.7)` }}>
          <Decode text="DASHCAM MOMENTS" f={f} start={10} span={12} seed="l2" />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const VideoTitle: React.FC = () => {
  const f = useCurrentFrame();
  if (f >= 120) return <AbsoluteFill style={{ backgroundColor: C.black }} />;
  if (f >= 96) {
    return (
      <CameraMotionBlur samples={10} shutterAngle={180}>
        <SceneAtFrame />
      </CameraMotionBlur>
    );
  }
  return <Scene f={f} />;
};

const SceneAtFrame: React.FC = () => <Scene f={useCurrentFrame()} />;
