// Footage shot with linear push (BUILD_SPEC §4). Pre-cut clips are 1920x1080 30 fps, muted.
import React from 'react';
import { AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';

export const Footage: React.FC<{ src: string; rate: number; base?: number; origin?: string }> = ({ src, rate, base, origin }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = base ?? (rate < 0 ? 1.04 : 1.0);
  const s = b + rate * (f / fps);
  return (
    <AbsoluteFill style={{ overflow: 'hidden', backgroundColor: '#050607' }}>
      <OffthreadVideo muted src={staticFile(src)} style={{ width: '100%', height: '100%', transform: `scale(${s})`, transformOrigin: origin ?? '50% 50%' }} />
    </AbsoluteFill>
  );
};
