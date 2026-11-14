// D9b solarize spot: footage plays, 12 f dissolve into a frozen frame whose ellipse is solarized; ellipse shrinks 9% over the hold; hard cut out.
import React from 'react';
import { AbsoluteFill, Freeze, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from 'remotion';

export const SolarizeSpot: React.FC<{ src: string; solSrc: string; freezeAt: number; dur: number; cx: string; cy: string; w: number }> = ({ src, solSrc, freezeAt, dur, cx, cy, w }) => {
  const f = useCurrentFrame();
  const push = 1 + 0.015 * (f / 30);
  const mix = interpolate(f, [freezeAt - 12, freezeAt], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const shrink = interpolate(f, [freezeAt, dur], [1, 0.91], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const rx = (w / 2) * shrink;
  const mask = `radial-gradient(ellipse ${rx}% ${rx * 1.25}% at ${cx} ${cy}, #000 72%, transparent 100%)`;
  const vid = (s: string) => <OffthreadVideo muted src={staticFile(s)} style={{ width: '100%', height: '100%' }} />;
  const live = f < freezeAt;
  return (
    <AbsoluteFill style={{ overflow: 'hidden', transform: `scale(${push})` }}>
      {live ? vid(src) : <Freeze frame={freezeAt}>{vid(src)}</Freeze>}
      <AbsoluteFill style={{ opacity: mix, WebkitMaskImage: mask, maskImage: mask }}>
        {live ? vid(solSrc) : <Freeze frame={freezeAt}>{vid(solSrc)}</Freeze>}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
