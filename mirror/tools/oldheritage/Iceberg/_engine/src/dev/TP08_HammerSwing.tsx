// TP08 (Almería Martillo): what a hammer ride does, in white line over a dark, blurred frame of the real ride.
// mode "swing": the arm turns right over the top about its single pivot, the gondola's circle traced as it goes, slowing to a dead stop
//               with the gondola near the peak (where the real arm locked).
// mode "pivot": the stopped arm; the load path is lit from the gondola and the counterweight back to the one central pivot, which pulses.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

export const HammerSwing: React.FC<{ mode: "swing" | "pivot"; bg: string; bgPos?: string; stopDeg?: number }> = ({ mode, bg, bgPos = "50% 40%", stopDeg = -24 }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames: n } = useVideoConfig();
  const k = out(interpolate(f, [0, 10], [0, 1], cl));
  const cx = 960, cy = 520, G = 990, R1 = 330, R2 = 190;
  // swing: 1.6 turns from the bottom, decelerating to the stop angle (deg, 0 = gondola straight up, + clockwise)
  const u = interpolate(f, [4, Math.round(n * 0.78)], [0, 1], cl);
  const turns = 1.6;
  const start = stopDeg - 360 * turns;
  const ang = mode === "swing" ? start + (stopDeg - start) * (1 - Math.pow(1 - u, 2.6)) : stopDeg;
  const rad = (ang * Math.PI) / 180;
  const gx = cx + R1 * Math.sin(rad), gy = cy - R1 * Math.cos(rad);
  const wx = cx - R2 * Math.sin(rad), wy = cy + R2 * Math.cos(rad);
  const stopped = mode === "pivot" || u >= 1;
  const trail = mode === "swing" ? Math.min(1, (ang - start) / 360) : 0; // the full circle is drawn during the first turn
  const pulse = mode === "pivot" ? 0.5 + 0.5 * Math.sin(f * 0.22) : 0;
  const lit = mode === "pivot" ? io(interpolate(f, [10, 40], [0, 1], cl)) : 0;
  const cam = 1 + 0.05 * io(f / n);
  const W = "#fff";
  const Gondola = (
    <g transform={`translate(${gx} ${gy}) rotate(${ang})`}>
      <rect x={-78} y={-34} width={156} height={56} rx={10} fill="rgba(0,0,0,.35)" stroke={stopped && mode === "swing" ? RED : W} strokeWidth={6} />
      {[-54, -18, 18, 54].map((x) => <line key={x} x1={x} y1={-24} x2={x} y2={10} stroke={stopped && mode === "swing" ? RED : W} strokeWidth={4} />)}
    </g>
  );
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden", opacity: k }}>
      <Img src={staticFile(bg)} style={{ position: "absolute", inset: -60, width: width + 120, height: height + 120, objectFit: "cover", objectPosition: bgPos, filter: "blur(16px) brightness(.3) saturate(.6)" }} />
      <AbsoluteFill style={{ transform: `scale(${cam})`, transformOrigin: "50% 45%" }}>
        <svg width={width} height={height} style={{ position: "absolute", inset: 0, filter: "drop-shadow(0 2px 6px rgba(0,0,0,.7))" }}>
          <line x1={520} y1={G} x2={1400} y2={G} stroke="rgba(255,255,255,.4)" strokeWidth={3} />
          {/* A-frame tower */}
          <path d={`M ${cx - 150} ${G} L ${cx} ${cy} L ${cx + 150} ${G}`} fill="none" stroke={W} strokeWidth={8} strokeLinejoin="round" />
          <line x1={cx - 95} y1={G - 150} x2={cx + 95} y2={G - 150} stroke={W} strokeWidth={4} opacity={0.7} />
          {mode === "swing" && <circle cx={cx} cy={cy} r={R1} fill="none" stroke="rgba(255,255,255,.45)" strokeWidth={3} strokeDasharray={`${2 * Math.PI * R1 * trail} 99999`} transform={`rotate(${start - 90 + 360} ${cx} ${cy})`} />}
          {/* the arm: gondola end + counterweight end */}
          <line x1={wx} y1={wy} x2={gx} y2={gy} stroke={W} strokeWidth={14} strokeLinecap="round" />
          {lit > 0 && <line x1={gx} y1={gy} x2={gx + (cx - gx) * lit} y2={gy + (cy - gy) * lit} stroke={RED} strokeWidth={8} strokeLinecap="round" />}
          {lit > 0 && <line x1={wx} y1={wy} x2={wx + (cx - wx) * lit} y2={wy + (cy - wy) * lit} stroke={RED} strokeWidth={8} strokeLinecap="round" />}
          <rect x={wx - 46} y={wy - 46} width={92} height={92} rx={8} transform={`rotate(${ang} ${wx} ${wy})`} fill="rgba(0,0,0,.4)" stroke={W} strokeWidth={6} />
          {Gondola}
          <circle cx={cx} cy={cy} r={20} fill={W} />
          {mode === "pivot" && <circle cx={cx} cy={cy} r={34 + 26 * pulse} fill="none" stroke={W} strokeWidth={4} opacity={(1 - pulse * 0.6) * lit} />}
          {mode === "swing" && stopped && <circle cx={gx} cy={gy} r={110} fill="none" stroke={W} strokeWidth={3} opacity={out(interpolate(f, [Math.round(n * 0.78), Math.round(n * 0.78) + 12], [0, 0.9], cl))} />}
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
