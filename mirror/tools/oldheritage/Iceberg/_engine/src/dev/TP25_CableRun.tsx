// TP25 CableRun — a freeze of the night midway (Sky Glider, West Allis, 5 Aug 2010): one white line is traced along the haul cable
// through every visible chair to a white-line drive (bull wheel) at the end of the line. While the drive turns, ticks run along the
// cable; when the motor goes the wheel stops and goes dark, the ticks stop, and every chair gets a white bracket where it hangs.
// Coordinates are in the source frame's pixels (1280x720), drawn in the same transformed layer as the photo so they stay locked.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

export type Chair = [number, number, number, number]; // cx, cy, w, h (source px)

export const CableRun: React.FC<{
  src: string; iw: number; ih: number;
  cable: [number, number][];        // haul cable, source px, last point = where it leaves frame toward the drive
  chairs: Chair[];
  drive: [number, number, number];  // bull wheel cx, cy, r (source px, may sit off the photo's edge)
  traceAt: number; traceLen: number; driveAt: number; stopAt: number; holdAt: number;
  z0?: number; z1?: number; fx?: number; fy?: number;
}> = ({ src, iw, ih, cable, chairs, drive, traceAt, traceLen, driveAt, stopAt, holdAt, z0 = 1.0, z1 = 1.07, fx = 0.6, fy = 0.4 }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const k = width / iw;
  const z = z0 + (z1 - z0) * io(f / durationInFrames);
  const P = (p: [number, number]) => `${p[0] * k} ${p[1] * k}`;
  const d = "M" + cable.map(P).join(" L") + ` L${(drive[0] + drive[2] * 0.25) * k} ${(drive[1] - drive[2] * 0.97) * k}`;
  const tr = io(interpolate(f, [traceAt, traceAt + traceLen], [0, 1], cl));
  // the cable runs (ticks travel) until the stop, then they ease to a halt in ~10 frames
  const run = (t: number) => (t < stopAt ? t : stopAt + 10 * out(Math.min(1, (t - stopAt) / 10)) * 0.5);
  const travel = run(f) * 3.2;
  const dg = out(interpolate(f, [driveAt, driveAt + 12], [0, 1], cl));
  const dark = interpolate(f, [stopAt, stopAt + 14], [0, 1], cl);
  const spin = run(f) * 4; // degrees
  const [wx, wy, wr] = [drive[0] * k, drive[1] * k, drive[2] * k];
  const dim = interpolate(f, [stopAt, stopAt + 14], [1, 0.82], cl);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: `${fx * 100}% ${fy * 100}%` }}>
        <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: `brightness(${0.78 * dim}) contrast(1.06)` }} />
        <svg width={width} height={height} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          {/* the traced cable */}
          <path d={d} fill="none" stroke="rgba(0,0,0,.5)" strokeWidth={12} pathLength={1} strokeDasharray={`${tr} 1`} strokeLinecap="round" strokeLinejoin="round" />
          <path d={d} fill="none" stroke="#fff" strokeWidth={5} pathLength={1} strokeDasharray={`${tr} 1`} strokeLinecap="round" strokeLinejoin="round" style={{ filter: "drop-shadow(0 0 6px rgba(255,255,255,.45))" }} />
          {/* ticks running along the cable while the drive turns */}
          {tr > 0.98 && <path d={d} fill="none" stroke="#fff" strokeWidth={11} strokeDasharray="4 46" strokeDashoffset={-travel} opacity={interpolate(f, [traceAt + traceLen, traceAt + traceLen + 8], [0, 0.95], cl)} />}
          {/* every chair, bracketed where it stopped */}
          {chairs.map(([cx, cy, w, h], i) => {
            const g = out(interpolate(f, [holdAt + i * 2, holdAt + i * 2 + 9], [0, 1], cl)); if (g <= 0) return null;
            const X = cx * k, Y = cy * k, W = w * k * (1.25 - 0.25 * g), H = h * k * (1.25 - 0.25 * g), c = Math.min(W, H) * 0.3;
            const br = (sx: number, sy: number) => `M${X + sx * W / 2} ${Y + sy * (H / 2 - c)} L${X + sx * W / 2} ${Y + sy * H / 2} L${X + sx * (W / 2 - c)} ${Y + sy * H / 2}`;
            return <g key={i} opacity={g} fill="none" stroke="#fff" strokeWidth={4} strokeLinecap="square" style={{ filter: "drop-shadow(0 1px 4px rgba(0,0,0,.8))" }}>
              <path d={br(-1, -1)} /><path d={br(1, -1)} /><path d={br(-1, 1)} /><path d={br(1, 1)} />
            </g>;
          })}
          {/* the drive: bull wheel + motor, white line; goes dark when the motor fails */}
          {dg > 0 && <g opacity={dg * (1 - 0.62 * dark)} transform={`translate(${wx} ${wy}) scale(${0.9 + 0.1 * dg})`}>
            <circle r={wr} fill="rgba(0,0,0,.55)" stroke="#fff" strokeWidth={6} />
            <circle r={wr * 0.16} fill="#fff" />
            <g transform={`rotate(${spin})`}>{Array.from({ length: 6 }, (_, i) => (
              <line key={i} x1={0} y1={0} x2={Math.cos((i * Math.PI) / 3) * wr * 0.9} y2={Math.sin((i * Math.PI) / 3) * wr * 0.9} stroke="#fff" strokeWidth={4} />))}</g>
            <rect x={-wr * 0.55} y={wr * 1.2} width={wr * 1.1} height={wr * 0.62} fill="rgba(0,0,0,.55)" stroke="#fff" strokeWidth={5} />
            <line x1={0} y1={wr * 0.16} x2={0} y2={wr * 1.2} stroke="#fff" strokeWidth={5} />
          </g>}
        </svg>
      </AbsoluteFill>
      <RedLabel text="DRIVE" at={driveAt + 6} hold={stopAt - driveAt + 4} x={Math.min(0.93, (wx * z - (z - 1) * fx * width) / width)} y={0.9} size={40} />
    </AbsoluteFill>
  );
};
