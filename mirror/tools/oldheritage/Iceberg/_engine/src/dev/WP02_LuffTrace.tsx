// WP02 device: the filmer's frame of the burning crane frozen; the camera pushes up the crane while one white line traces the luffing
// cable from the jib down to the machinery deck; where the line enters the fire it turns red and flickers (optionally eases back to
// the full frame at the end, for a raw that starts on the same frame).
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { RedLabel } from "../brand";
import { FrameAt, cl, io, out, useWpFonts } from "./WP01_kit";

type P = { src: string; t: number; n: number; path: [number, number][]; hotFrom: number; focus: [number, number]; zoom?: number; label?: string; settle?: boolean };
const segLen = (p: [number, number][]) => p.slice(1).reduce((s, q, i) => s + Math.hypot(q[0] - p[i][0], q[1] - p[i][1]), 0);
const pts = (p: [number, number][]) => p.map((q) => q.join(",")).join(" ");

export const WP02_LuffTrace: React.FC<P> = ({ src, t, n, path, hotFrom, focus, zoom = 1.42, label, settle = false }) => {
  useWpFonts();
  const f = useCurrentFrame();
  const back = settle ? n - 24 : n + 60; // settle: ease back to the full frame over the last 24 frames
  const push = io(interpolate(f, [0, 70], [0, 1], cl));
  const ret = settle ? io(interpolate(f, [back, n - 2], [0, 1], cl)) : 0;
  const s = 1 + (zoom - 1) * push * (1 - ret);
  const cold = path.slice(0, hotFrom + 1), hot = path.slice(hotFrom);
  const L1 = segLen(cold), L2 = segLen(hot);
  const d1 = out(interpolate(f, [14, 58], [0, 1], cl)), d2 = io(interpolate(f, [58, 78], [0, 1], cl));
  const lineO = interpolate(f, [back - 6, back + 10], [1, 0], cl);
  const fl = 0.75 + 0.25 * Math.sin(f * 0.9) * Math.sin(f * 0.37 + 1);
  const spot = interpolate(f, [10, 40], [0, 1], cl) * (1 - ret);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale3d(${s},${s},1)`, transformOrigin: `${focus[0]}px ${focus[1]}px`, willChange: "transform" }}>
        <FrameAt src={src} t={t} style={{ width: 1920, height: 1080, objectFit: "cover" }} />
        <AbsoluteFill style={{ opacity: spot, background: `radial-gradient(ellipse 760px 820px at ${focus[0]}px ${focus[1] + 80}px, rgba(0,0,0,0) 35%, rgba(0,0,0,.42) 100%)` }} />
        <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, opacity: lineO }}>
          <defs><filter id="lt_glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6" /></filter></defs>
          <polyline points={pts(cold)} fill="none" stroke="rgba(0,0,0,.55)" strokeWidth={7 / zoom + 2} strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray={L1} strokeDashoffset={L1 * (1 - d1)} />
          <polyline points={pts(cold)} fill="none" stroke="#fff" strokeWidth={4.5 / zoom + 1} strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray={L1} strokeDashoffset={L1 * (1 - d1)} />
          <polyline points={pts(hot)} fill="none" stroke="#FF3B1F" strokeWidth={14} opacity={0.65 * fl * d2} filter="url(#lt_glow)" strokeLinecap="round"
            strokeDasharray={L2} strokeDashoffset={L2 * (1 - d2)} />
          <polyline points={pts(hot)} fill="none" stroke="#E3141B" strokeWidth={5 / zoom + 1.5} strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray={L2} strokeDashoffset={L2 * (1 - d2)} opacity={0.85 + 0.15 * fl} />
        </svg>
      </AbsoluteFill>
      {label && <RedLabel text={label} at={30} hold={Math.min(back, n) - 36} x={0.5} y={0.88} size={42} />}
    </AbsoluteFill>
  );
};
