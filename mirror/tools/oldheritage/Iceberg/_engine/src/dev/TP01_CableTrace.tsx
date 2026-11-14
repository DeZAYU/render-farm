// TP01 CableTrace: a freeze of the filmer's own frame of the slingshot at rest; the two masts, then the two cables down to the capsule,
// are drawn on it in white (dark under-stroke) as the VO names them, while the frame pushes slowly toward the capsule. px = source pixels.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1);
type Ln = { pts: [number, number][]; at: number; len: number; w?: number };
export const CableTrace: React.FC<{ src: string; iw: number; ih: number; focus: [number, number]; z0?: number; z1?: number; lines: Ln[]; ring?: { c: [number, number]; r: number; at: number } }> = ({ src, iw, ih, focus, z0 = 1.0, z1 = 1.12, lines, ring }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const z = z0 + (z1 - z0) * io(f / durationInFrames);
  const base = Math.max(width / iw, height / ih) * z;
  const ox = Math.min(0, Math.max(width - iw * base, width / 2 - focus[0] * base)), oy = Math.min(0, Math.max(height - ih * base, height / 2 - focus[1] * base));
  const P = ([x, y]: [number, number]) => `${(ox + x * base).toFixed(1)} ${(oy + y * base).toFixed(1)}`;
  const dim = interpolate(f, [0, 18], [1, 0.72], cl);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ position: "absolute", left: ox, top: oy, width: iw * base, height: ih * base, filter: `brightness(${dim}) saturate(.85)` }} />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        {lines.map((l, i) => {
          const g = io(interpolate(f, [l.at, l.at + l.len], [0, 1], cl)); if (g <= 0) return null;
          const d = "M" + l.pts.map(P).join(" L");
          return <g key={i}>
            <path d={d} fill="none" stroke="rgba(0,0,0,.5)" strokeWidth={(l.w ?? 5) + 8} pathLength={1} strokeDasharray={`${g} 1`} strokeLinecap="round" />
            <path d={d} fill="none" stroke="#fff" strokeWidth={l.w ?? 5} pathLength={1} strokeDasharray={`${g} 1`} strokeLinecap="round" style={{ filter: "drop-shadow(0 0 6px rgba(255,255,255,.45))" }} />
          </g>;
        })}
        {ring && (() => { const g = io(interpolate(f, [ring.at, ring.at + 14], [0, 1], cl)); if (g <= 0) return null;
          const cx = ox + ring.c[0] * base, cy = oy + ring.c[1] * base, r = ring.r * base;
          return <g><circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(0,0,0,.5)" strokeWidth={13} pathLength={1} strokeDasharray={`${g} 1`} transform={`rotate(-90 ${cx} ${cy})`} />
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="#fff" strokeWidth={5} pathLength={1} strokeDasharray={`${g} 1`} transform={`rotate(-90 ${cx} ${cy})`} /></g>; })()}
      </svg>
    </AbsoluteFill>
  );
};
