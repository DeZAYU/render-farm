// DC06 MedianLine: real USGS NAIP aerial of Riverside Drive at East 66th Place, south Tulsa (public domain). Eases down onto the
// divided road beside the Arkansas River while the officer's southbound carriageway is drawn in white, north to south, ending in a
// small arrowhead at the 66th Place junction ("heading south on Riverside Drive near East 66th Place"); on "a grassy median down the
// middle" the strip of grass between the two carriageways is lifted with a soft white glow along its length. Place label wipes on.
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { cl, ease, io } from "./DC01_kit";

export const MedianLine: React.FC<{ src: string; iw: number; ih: number; lane: [number, number][]; median: [number, number][];
  z0: number; z1: number; f0: [number, number]; f1: [number, number]; traceAt: number; traceLen: number; glowAt: number; children?: React.ReactNode }> =
  ({ src, iw, ih, lane, median, z0, z1, f0, f1, traceAt, traceLen, glowAt, children }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const u = io(Math.min(1, f / durationInFrames));
  const z = z0 + (z1 - z0) * u, fx = f0[0] + (f1[0] - f0[0]) * u, fy = f0[1] + (f1[1] - f0[1]) * u;
  const base = Math.max(width / iw, height / ih) * z;
  const ox = Math.min(0, Math.max(width - iw * base, width / 2 - fx * base)), oy = Math.min(0, Math.max(height - ih * base, height / 2 - fy * base));
  const P = (p: [number, number]) => [ox + p[0] * base, oy + p[1] * base];
  const d = (ps: [number, number][]) => "M" + ps.map((p) => P(p).join(" ")).join(" L");
  const g = ease(f, traceAt, traceAt + traceLen), gl = ease(f, glowAt, glowAt + 20);
  // arrowhead at the traced end
  const n = lane.length, [ex, ey] = P(lane[n - 1]), [px, py] = P(lane[n - 2]); const ang = Math.atan2(ey - py, ex - px) * 180 / Math.PI;
  const ah = interpolate(f, [traceAt + traceLen - 4, traceAt + traceLen + 6], [0, 1], cl);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden", opacity: interpolate(f, [0, 8], [0, 1], cl) }}>
      <Img src={staticFile(src)} style={{ position: "absolute", left: ox, top: oy, width: iw * base, height: ih * base, filter: `contrast(1.05) brightness(${1 - 0.18 * gl})` }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 70% at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,.5) 100%)" }} />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        <defs><filter id="mglow"><feGaussianBlur stdDeviation={10} /></filter></defs>
        <path d={d(median)} fill="none" stroke="#fff" strokeOpacity={0.5 * gl} strokeWidth={10 * base} strokeLinecap="round" filter="url(#mglow)" />
        <path d={d(median)} fill="none" stroke="#fff" strokeOpacity={0.35 * gl} strokeWidth={3 * base} strokeLinecap="round" filter="url(#mglow)" />
        <path d={d(lane)} fill="none" stroke="rgba(0,0,0,.45)" strokeWidth={13} pathLength={1} strokeDasharray={`${g} 1`} strokeLinecap="round" strokeLinejoin="round" />
        <path d={d(lane)} fill="none" stroke="#fff" strokeWidth={5} pathLength={1} strokeDasharray={`${g} 1`} strokeLinecap="round" strokeLinejoin="round" />
        <g transform={`translate(${ex} ${ey}) rotate(${ang})`} opacity={ah}><path d="M -4 -15 L 22 0 L -4 15 Z" fill="#fff" stroke="rgba(0,0,0,.45)" strokeWidth={3} /></g>
      </svg>
      {children}
    </AbsoluteFill>
  );
};
