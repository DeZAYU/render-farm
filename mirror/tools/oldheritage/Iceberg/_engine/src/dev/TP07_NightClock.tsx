// TP07 (Joker's Jinx): the four hours of the rescue as light. Two frames of the SAME view from the fire department's camera, one at
// dusk when crews arrived and one in full dark near the end, cross-fade while a clock face sweeps from the stop to the last rider down;
// the swept sector fills red. Times are the spoken ones (stop ~5:30 pm, everyone down by 9:30 pm).
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED, RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

export const NightClock: React.FC<{ dusk: string; night: string; h0: number; h1: number; at?: number; len?: number; cx?: number; cy?: number; r?: number; l0: string; l1: string }> = ({ dusk, night, h0, h1, at = 6, len = 70, cx = 1380, cy = 470, r = 220, l0, l1 }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const k = out(interpolate(f, [0, 12], [0, 1], cl));
  const u = io(interpolate(f, [at, at + len], [0, 1], cl));
  const h = h0 + (h1 - h0) * u;
  const hourA = ((h % 12) / 12) * 2 * Math.PI, minA = (h % 1) * 2 * Math.PI;
  const P = (a: number, rr: number) => [cx + rr * Math.sin(a), cy - rr * Math.cos(a)];
  const a0 = ((h0 % 12) / 12) * 2 * Math.PI;
  const [sx, sy] = P(a0, r - 18), [ex, ey] = P(hourA, r - 18);
  const sector = u > 0.001 ? `M ${cx} ${cy} L ${sx} ${sy} A ${r - 18} ${r - 18} 0 ${hourA - a0 > Math.PI ? 1 : 0} 1 ${ex} ${ey} Z` : "";
  const z = 1.04 + 0.06 * io(f / durationInFrames);
  const [hx, hy] = P(hourA, r * 0.52), [mx, my] = P(minA, r * 0.78);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: "40% 60%" }}>
        <Img src={staticFile(dusk)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "brightness(.7)" }} />
        <Img src={staticFile(night)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: u, filter: "brightness(.7)" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: `radial-gradient(circle at ${cx}px ${cy}px, rgba(0,0,0,.55) 0px, rgba(0,0,0,.35) ${r + 60}px, rgba(0,0,0,0) ${r + 380}px)`, opacity: k }} />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0, opacity: k, filter: "drop-shadow(0 2px 6px rgba(0,0,0,.7))" }}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#fff" strokeWidth={6} />
        {Array.from({ length: 60 }, (_, i) => { const a = (i / 60) * 2 * Math.PI, big = i % 5 === 0; const [x1, y1] = P(a, r - (big ? 30 : 14)), [x2, y2] = P(a, r - 4);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#fff" strokeWidth={big ? 5 : 2} opacity={big ? 1 : 0.6} />; })}
        {sector && <path d={sector} fill={RED} opacity={0.55} />}
        <line x1={cx} y1={cy} x2={mx} y2={my} stroke="#fff" strokeWidth={5} strokeLinecap="round" />
        <line x1={cx} y1={cy} x2={hx} y2={hy} stroke="#fff" strokeWidth={10} strokeLinecap="round" />
        <circle cx={cx} cy={cy} r={12} fill="#fff" />
      </svg>
      <RedLabel text={l0} at={at - 2} hold={len * 0.45} x={cx / width} y={(cy + r + 70) / height} size={44} />
      <RedLabel text={l1} at={at + len - 4} x={cx / width} y={(cy + r + 70) / height} size={44} />
    </AbsoluteFill>
  );
};
