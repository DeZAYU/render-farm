// ND05 RavineTrace — the dry ravine beds on the real orthophoto (Spain's PNOA), their courses drawn in white from OpenStreetMap
// geometry as they are named, the town pinned; the camera moves between eased views (one smooth spline through the keys, no stops).
// Used twice in ND05 with different views: close on Aldaia (the Saleta through the town, the Poyo to the south), and pulled back to
// the hills where the rain fell (Turís).
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED, RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

type Line = { pts: [number, number][]; at: number; len: number; label?: string; labelAt?: number; lx?: number; ly?: number };
type Pin = { x: number; y: number; label: string; at: number; dy?: number };
type View = { at: number; x: number; y: number; z: number }; // image px focus + zoom (1 = image fills the frame)
export const RavineTrace: React.FC<{ src: string; iw: number; ih: number; lines: Line[]; pins: Pin[]; views: View[]; done?: boolean }> = ({ src, iw, ih, lines, pins, views, done }) => {
  const f = useCurrentFrame(); const { width: W, height: H, durationInFrames: D } = useVideoConfig();
  // camera: ease between consecutive views over the gap between their `at`s
  let v = views[0];
  for (let i = 1; i < views.length; i++) {
    const a = views[i - 1], b = views[i]; const k = io(interpolate(f, [a.at, b.at], [0, 1], cl));
    if (f >= a.at) v = { at: 0, x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k, z: a.z * Math.pow(b.z / a.z, k) };
  }
  const drift = 1 + 0.03 * (f / D);
  const base = Math.max(W / iw, H / ih) * v.z * drift;
  const ox = Math.min(0, Math.max(W - iw * base, W / 2 - v.x * base)), oy = Math.min(0, Math.max(H - ih * base, H / 2 - v.y * base));
  const S = (x: number, y: number) => [ox + x * base, oy + y * base];
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ position: "absolute", left: ox, top: oy, width: iw * base, height: ih * base }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 75% at 50% 50%, rgba(0,0,0,0) 50%, rgba(0,0,0,.55) 100%)" }} />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        {lines.map((l, i) => {
          const g = done ? 1 : io(interpolate(f, [l.at, l.at + l.len], [0, 1], cl)); if (g <= 0) return null;
          const d = "M" + l.pts.map(([x, y]) => S(x, y).map((n) => n.toFixed(1)).join(" ")).join(" L");
          return <g key={i}>
            <path d={d} fill="none" stroke="rgba(0,0,0,.5)" strokeWidth={13} strokeLinejoin="round" strokeLinecap="round" pathLength={1} strokeDasharray={`${g} 1`} />
            <path d={d} fill="none" stroke="#fff" strokeWidth={6} strokeLinejoin="round" strokeLinecap="round" pathLength={1} strokeDasharray={`${g} 1`} />
          </g>;
        })}
        {pins.map((p, i) => { const g = out(interpolate(f, [p.at, p.at + 12], [0, 1], cl)); if (g <= 0) return null; const [x, y] = S(p.x, p.y);
          return <g key={i}><circle cx={x} cy={y} r={30 * (1.6 - 0.6 * g)} fill="none" stroke="#fff" strokeWidth={4} opacity={g} /><circle cx={x} cy={y} r={12 * g} fill={RED} stroke="#fff" strokeWidth={4} /></g>; })}
      </svg>
      {pins.map((p, i) => { const [x, y] = S(p.x, p.y); return <RedLabel key={"p" + i} text={p.label} at={p.at + 4} x={x / W} y={(y + (p.dy ?? -70)) / H} size={42} />; })}
      {lines.map((l, i) => { if (!l.label) return null; const [x, y] = S(l.lx ?? l.pts[0][0], l.ly ?? l.pts[0][1]);
        return <RedLabel key={"l" + i} text={l.label} at={l.labelAt ?? l.at + 6} x={Math.min(0.85, Math.max(0.15, x / W))} y={Math.min(0.92, Math.max(0.08, y / H))} size={38} />; })}
    </AbsoluteFill>
  );
};
