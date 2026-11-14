// DC17 SwayTrace: "The car wasn't swerving. The deck itself was rolling." The stopped dashcam runs on, pushed in on the nearest lamp
// post; the lamp's light is tracked frame by frame (DC17_lamp, measured from the footage) and a small white point rides on it, leaving
// a short fading trail, against a fixed dashed white plumb line at the lamp's resting place: the side-to-side wander is the bridge.
import React from "react";
import { AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame } from "remotion";
import { CK, camAt, ease, placeOf } from "./DC01_kit";
import { LAMP, LAMP_T0 } from "./DC17_lamp";

export const SwayTrace: React.FC<{ src: string; from: number; keys: CK[]; at: number; trail?: number }> = ({ src, from, keys, at, trail = 40 }) => {
  const f = useCurrentFrame();
  const p = placeOf(camAt(f, keys));
  const i0 = Math.round((from - LAMP_T0) * 30) + f;
  const idx = Math.max(0, Math.min(LAMP.length - 1, i0));
  const restX = LAMP.reduce((s, q) => s + q[0], 0) / LAMP.length;
  const k = ease(f, at, at + 14);
  const X = (q: [number, number]) => p.left + q[0] * p.w, Y = (q: [number, number]) => p.top + q[1] * p.h;
  const pts: [number, number][] = [];
  for (let j = Math.max(0, idx - trail); j <= idx; j++) pts.push(LAMP[j]);
  const cur = LAMP[idx];
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(src)} startFrom={Math.round(from * 30)} muted style={{ position: "absolute", left: p.left, top: p.top, width: p.w, height: p.h }} />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: k }}>
        <line x1={p.left + restX * p.w} y1={Y(cur) - 230} x2={p.left + restX * p.w} y2={Y(cur) + 230} stroke="rgba(255,255,255,.75)" strokeWidth={2.5} strokeDasharray="10 9" />
        {pts.slice(1).map((q, j) => {
          const a = pts[j]; const o = (j + 1) / pts.length;
          return <line key={j} x1={X(a)} y1={Y(a)} x2={X(q)} y2={Y(q)} stroke={`rgba(255,255,255,${0.9 * o})`} strokeWidth={2 + 3 * o} strokeLinecap="round" />;
        })}
        <circle cx={X(cur)} cy={Y(cur)} r={9} fill="none" stroke="#fff" strokeWidth={3} />
      </svg>
    </AbsoluteFill>
  );
};
