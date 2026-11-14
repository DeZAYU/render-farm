// TP03 NightClock: a plain white clock face over the darkened rescue footage; the hand runs from the time of the jam to the time the last
// rider was off, sweeping a pale sector behind it; red labels give the two ends.
import React from "react";
import { AbsoluteFill, Easing, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1);
export const NightClock: React.FC<{ bg: string; bgFrom: number; h0: number; h1: number; at: number; len: number; l0: string; l1: string }> = ({ bg, bgFrom, h0, h1, at, len, l0, l1 }) => {
  const f = useCurrentFrame(); const { width, height } = useVideoConfig();
  const g = io(interpolate(f, [at, at + len], [0, 1], cl)), h = h0 + (h1 - h0) * g;
  const cx = width / 2, cy = height * 0.47, R = 300, o = interpolate(f, [0, 10], [0, 1], cl);
  const ang = (hh: number) => (hh % 12) / 12 * 2 * Math.PI - Math.PI / 2;
  const P = (a: number, r: number) => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  const a0 = ang(h0), a1 = a0 + (h - h0) / 12 * 2 * Math.PI;
  const [sx, sy] = P(a0, R - 26), [ex, ey] = P(a1, R - 26);
  const large = a1 - a0 > Math.PI ? 1 : 0;
  const mins = (h % 1) * 2 * Math.PI - Math.PI / 2;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden", opacity: o }}>
      <OffthreadVideo src={staticFile(bg)} startFrom={Math.round(bgFrom * 30)} muted style={{ position: "absolute", inset: -60, width: width + 120, height: height + 120, objectFit: "cover", filter: "blur(12px) brightness(.3) saturate(.7)" }} />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0, filter: "drop-shadow(0 6px 20px rgba(0,0,0,.7))" }}>
        <circle cx={cx} cy={cy} r={R} fill="rgba(0,0,0,.35)" stroke="#fff" strokeWidth={6} />
        {g > 0 && <path d={`M ${cx} ${cy} L ${sx} ${sy} A ${R - 26} ${R - 26} 0 ${large} 1 ${ex} ${ey} Z`} fill="rgba(255,255,255,.22)" />}
        {Array.from({ length: 60 }, (_, i) => { const a = i / 60 * 2 * Math.PI, big = i % 5 === 0; const [x1, y1] = P(a, R - (big ? 34 : 18)), [x2, y2] = P(a, R - 6);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#fff" strokeWidth={big ? 5 : 2} opacity={big ? 1 : 0.6} />; })}
        <line x1={cx} y1={cy} x2={P(ang(h), R * 0.55)[0]} y2={P(ang(h), R * 0.55)[1]} stroke="#fff" strokeWidth={12} strokeLinecap="round" />
        <line x1={cx} y1={cy} x2={P(mins, R * 0.82)[0]} y2={P(mins, R * 0.82)[1]} stroke="#fff" strokeWidth={6} strokeLinecap="round" />
        <circle cx={cx} cy={cy} r={12} fill="#fff" />
      </svg>
      <RedLabel text={l0} at={4} hold={at + len - 8} x={0.5} y={0.88} />
      <RedLabel text={l1} at={at + len} x={0.5} y={0.88} />
    </AbsoluteFill>
  );
};
