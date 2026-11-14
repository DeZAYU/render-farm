// ND14 StoreyStack: scale of two buildings in the same quake, drawn as white storey outlines over the darkened CCTV room:
// the third-floor home we have been watching (its floor lit) beside a twelve-storey block, whose floors then pancake down.
import React from "react";
import { AbsoluteFill, Easing, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED, RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

export const StoreyStack: React.FC<{ bg: string; bgFrom: number; small: number; lit: number; tall: number; smallLabel: string; tallLabel: string; tallAt: number; fallAt: number }> =
  ({ bg, bgFrom, small, lit, tall, smallLabel, tallLabel, tallAt, fallAt }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const fh = 54, ground = height * 0.86, bw = 300;
  const xs = width * 0.3 - bw / 2, xt = width * 0.64 - bw / 2;
  const fall = io(interpolate(f, [fallAt, fallAt + 34], [0, 1], cl));
  const shake = fall > 0 && fall < 1 ? Math.sin(f * 2.7) * 6 * (1 - fall) : 0;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(bg)} startFrom={Math.round(bgFrom * 30)} muted style={{ position: "absolute", inset: 0, width, height, objectFit: "cover", filter: "blur(10px) brightness(.3) saturate(.6)", transform: `scale(${1.06 + 0.04 * f / durationInFrames})` }} />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0, transform: `translateX(${shake}px)` }}>
        <line x1={width * 0.12} y1={ground} x2={width * 0.88} y2={ground} stroke="rgba(255,255,255,.7)" strokeWidth={3} />
        {Array.from({ length: small }, (_, i) => { const g = out(interpolate(f, [i * 3, i * 3 + 10], [0, 1], cl)); const y = ground - (i + 1) * fh;
          return <rect key={"s" + i} x={xs} y={y + (1 - g) * 20} width={bw} height={fh - 6} fill={i === lit - 1 ? "rgba(227,20,27,.75)" : "rgba(255,255,255,.08)"} stroke="#fff" strokeWidth={4} opacity={g} />; })}
        {Array.from({ length: tall }, (_, i) => {
          const g = out(interpolate(f, [tallAt + i * 2.5, tallAt + i * 2.5 + 10], [0, 1], cl)); if (g <= 0) return null;
          // pancake: each floor drops to a heap height; upper floors fall further and tilt a little
          const y0 = ground - (i + 1) * fh, heap = ground - (i + 1) * 15.5;
          const y = y0 + (heap - y0) * fall, rot = fall * ((i % 3) - 1) * 1.6, hh = (fh - 6) * (1 - 0.7 * fall);
          return <rect key={"t" + i} x={xt + fall * ((i % 2 ? 1 : -1) * (4 + i * 1.5))} y={y + (1 - g) * 20} width={bw} height={hh} fill="rgba(255,255,255,.08)" stroke="#fff" strokeWidth={4} opacity={g}
            transform={`rotate(${rot} ${xt + bw / 2} ${y + hh / 2})`} />; })}
        {fall > 0.9 && <rect x={xt - 30} y={ground - 70} width={bw + 60} height={70} fill="none" stroke={RED} strokeWidth={5} opacity={(fall - 0.9) * 10} />}
      </svg>
      <RedLabel text={smallLabel} at={8} x={(xs + bw / 2) / width} y={(ground - small * fh - 50) / height} size={34} />
      <RedLabel text={tallLabel} at={tallAt + 30} x={(xt + bw / 2) / width} y={Math.max(0.08, (ground - tall * fh - 50) / height)} size={34} />
    </AbsoluteFill>
  );
};
