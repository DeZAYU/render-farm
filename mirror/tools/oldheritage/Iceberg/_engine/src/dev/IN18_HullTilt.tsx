// IN18 HullTilt: a crew member's shot of the trawler frozen as she leans. From the foot of her main mast a dashed white line rises
// straight up (true vertical), then a solid white line draws up the mast itself; the thin wedge between them fills pale. The gap is
// how far a ship of this size has already rolled. Slow push; no numbers, no text.
import React from "react";
import { AbsoluteFill, Easing, Freeze, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from "remotion";
import { camAt, placeOf, type CK } from "./DC01_kit";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1);

export const HullTilt: React.FC<{ src: string; t: number; keys: CK[]; foot: [number, number]; top: [number, number]; at: number }> = ({ src, t, keys, foot, top, at }) => {
  const f = useCurrentFrame();
  const p = placeOf(camAt(f, keys));
  const v = io(interpolate(f, [at, at + 18], [0, 1], cl)), m = io(interpolate(f, [at + 16, at + 36], [0, 1], cl)), w = io(interpolate(f, [at + 34, at + 52], [0, 1], cl));
  const X = (x: number) => x * p.w, Y = (y: number) => y * p.h;
  const fx = X(foot[0]), fy = Y(foot[1]), tx = X(top[0]), ty = Y(top[1]);
  const len = Math.hypot(tx - fx, ty - fy), vy = fy - len; // vertical of the same length
  const ang = Math.atan2(tx - fx, fy - ty); // lean (radians, negative = left)
  const r = len * 0.55, ax = fx + r * Math.sin(ang * w), ay = fy - r * Math.cos(ang * w);
  const st: React.CSSProperties = { position: "absolute", left: p.left, top: p.top, width: p.w, height: p.h };
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Freeze frame={0}><OffthreadVideo src={staticFile(src)} startFrom={Math.round(t * 30)} muted style={{ ...st, filter: `brightness(${1 - 0.18 * v})` }} /></Freeze>
      <svg style={{ position: "absolute", left: p.left, top: p.top, width: p.w, height: p.h, overflow: "visible" }}>
        <path d={`M ${fx} ${fy} L ${fx} ${fy - r} A ${r} ${r} 0 0 ${ang < 0 ? 0 : 1} ${ax} ${ay} Z`} fill={`rgba(242,242,240,${0.16 * w})`} />
        <line x1={fx} y1={fy} x2={fx} y2={fy - (fy - vy) * v} stroke="#F2F2F0" strokeWidth={4} strokeDasharray="14 12" opacity={0.95} />
        <line x1={fx} y1={fy} x2={fx + (tx - fx) * m} y2={fy + (ty - fy) * m} stroke="#F2F2F0" strokeWidth={5} />
        <circle cx={fx} cy={fy} r={7 * v} fill="#F2F2F0" />
      </svg>
    </AbsoluteFill>
  );
};
