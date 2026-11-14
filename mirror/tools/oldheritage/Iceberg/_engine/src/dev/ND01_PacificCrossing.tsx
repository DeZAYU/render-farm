// ND01 PacificCrossing: the 1960 Chile tsunami crossing the Pacific on NASA Blue Marble (shaded relief + bathymetry, public domain).
// The camera starts close on the Chilean coast (red point, place/date label), then pulls back over the whole ocean while a soft wavefront
// ring spreads from the source and a white great-circle line draws across to Ofunato, where the second label lands.
// Image: equirectangular, lon 110..300 E, lat 55..-60, 20 px per degree.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED, RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1);
const IW = 3800, IH = 2300;
const px = (lon: number, lat: number): [number, number] => [((lon < 0 ? lon + 360 : lon) - 110) * 20, (55 - lat) * 20];
const rad = Math.PI / 180;
const gc = (a: [number, number], b: [number, number], n = 64) => { // great circle lon/lat points
  const v = ([lo, la]: [number, number]) => [Math.cos(la * rad) * Math.cos(lo * rad), Math.cos(la * rad) * Math.sin(lo * rad), Math.sin(la * rad)];
  const A = v(a), B = v(b); const w = Math.acos(A[0] * B[0] + A[1] * B[1] + A[2] * B[2]);
  return Array.from({ length: n + 1 }, (_, i) => { const t = i / n, s1 = Math.sin((1 - t) * w) / Math.sin(w), s2 = Math.sin(t * w) / Math.sin(w);
    const x = s1 * A[0] + s2 * B[0], y = s1 * A[1] + s2 * B[1], z = s1 * A[2] + s2 * B[2];
    return [Math.atan2(y, x) / rad, Math.atan2(z, Math.hypot(x, y)) / rad] as [number, number]; });
};

export const PacificCrossing: React.FC<{ src: string; from: [number, number]; to: [number, number]; fromLabel: string; toLabel: string; goAt: number; len: number }> = ({ src, from, to, fromLabel, toLabel, goAt, len }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const A = px(...from), B = px(...to);
  const k = io(interpolate(f, [goAt - 10, goAt + len * 0.8], [0, 1], cl));
  // camera: centre + scale (screen px per image px)
  const c0: [number, number] = [A[0] - 120, A[1] - 260], c1: [number, number] = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2 - 40];
  const s0 = 1.15, s1 = Math.max((width / IW) * 1.02, Math.min(width / (Math.abs(B[0] - A[0]) + 700), height / (Math.abs(B[1] - A[1]) + 500)));
  const s = (s0 * (1 - k) + s1 * k) * (1 + 0.03 * (f / durationInFrames));
  const cx = c0[0] + (c1[0] - c0[0]) * k, cy = c0[1] + (c1[1] - c0[1]) * k;
  const ox = Math.min(0, Math.max(width - IW * s, width / 2 - cx * s)), oy = Math.min(0, Math.max(height - IH * s, height / 2 - cy * s));
  const pts = gc(from, to).map(([lo, la]) => px(lo, la));
  const d = "M" + pts.map((p) => `${p[0]} ${p[1]}`).join(" L");
  const g = io(interpolate(f, [goAt, goAt + len], [0, 1], cl));
  const ring = interpolate(f, [goAt, goAt + len], [0, 3300], cl);
  const S = (p: [number, number]) => [ox + p[0] * s, oy + p[1] * s];
  const [ax, ay] = S(A), [bx, by] = S(B);
  const pulse = 1 + 0.25 * Math.sin(f / 5);
  return (
    <AbsoluteFill style={{ background: "#01040a", overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ position: "absolute", left: ox, top: oy, width: IW * s, height: IH * s, filter: "brightness(1.45) contrast(1.05) saturate(.9)" }} />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        <g transform={`translate(${ox} ${oy}) scale(${s})`}>
          {ring > 0 && ring < 3250 && <circle cx={A[0]} cy={A[1]} r={ring} fill="none" stroke="rgba(255,255,255,.35)" strokeWidth={10 / s} opacity={1 - ring / 3300} />}
          {ring > 300 && ring < 3250 && <circle cx={A[0]} cy={A[1]} r={ring - 260} fill="none" stroke="rgba(255,255,255,.15)" strokeWidth={6 / s} opacity={1 - ring / 3300} />}
          <path d={d} fill="none" stroke="rgba(0,0,0,.55)" strokeWidth={12 / s} pathLength={1} strokeDasharray={`${g} 1`} strokeLinecap="round" />
          <path d={d} fill="none" stroke="#fff" strokeWidth={5 / s} pathLength={1} strokeDasharray={`${g} 1`} strokeLinecap="round" />
        </g>
        <circle cx={ax} cy={ay} r={11 * pulse} fill={RED} stroke="#fff" strokeWidth={3} />
        {g > 0.98 && <circle cx={bx} cy={by} r={11} fill={RED} stroke="#fff" strokeWidth={3} />}
      </svg>
      <RedLabel text={fromLabel} at={6} hold={goAt + 20} x={Math.min(0.75, Math.max(0.25, ax / width))} y={Math.min(0.9, (ay + 70) / height)} size={40} />
      <RedLabel text={toLabel} at={goAt + len + 2} x={Math.min(0.78, Math.max(0.22, bx / width))} y={Math.min(0.9, (by + 70) / height)} size={40} />
    </AbsoluteFill>
  );
};
