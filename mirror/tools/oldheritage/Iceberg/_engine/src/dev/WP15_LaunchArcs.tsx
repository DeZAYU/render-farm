// WP15 device: LaunchArcs. The high downtown filmer's frame (the yard burning beside the freeways, Reunion Arena's roof in front) is
// frozen full frame with a slow push into the fire. The two roads the pieces fell on are drawn as white lines along the real decks,
// then burning pieces are thrown out of the fire one by one: each a hot ember head pulling a fading trail along its arc, landing on a
// road deck, a parking lot or a roof, where a small orange glow stays smouldering. Coordinates are the source frame's (640x480) mapped
// through objectFit cover (x*3, y*3-180) so they sit on the real picture.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { FrameAt, cl, io, out } from "./WP01_kit";

const P = (sx: number, sy: number): [number, number] => [sx * 3, sy * 3 - 180];
type Arc = { to: [number, number]; at: number; h: number; dur?: number };

export const LaunchArcs: React.FC<{ src: string; t: number; n: number; fire: [number, number]; roads: [number, number][][]; arcs: Arc[] }> = ({ src, t, n, fire, roads, arcs }) => {
  const f = useCurrentFrame();
  const [fx, fy] = P(...fire);
  const s = 1.0 + 0.1 * io(interpolate(f, [0, n], [0, 1], cl));
  const dim = 0.32 * out(interpolate(f, [0, 18], [0, 1], cl));
  const pts = (ps: [number, number][]) => ps.map((p) => P(...p));
  const len = (ps: [number, number][]) => ps.slice(1).reduce((a, p, i) => a + Math.hypot(p[0] - ps[i][0], p[1] - ps[i][1]), 0);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale3d(${s},${s},1)`, transformOrigin: `${(fx / 1920) * 100}% ${(fy / 1080) * 100}%` }}>
        <FrameAt src={src} t={t} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <AbsoluteFill style={{ background: `radial-gradient(ellipse 60% 70% at ${(fx / 1920) * 100}% ${(fy / 1080) * 100}%, rgba(0,0,0,${dim * 0.4}) 30%, rgba(0,0,0,${dim}) 100%)` }} />
        <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          <defs>
            <radialGradient id="la_glow"><stop offset="0" stopColor="#FFE2A0" stopOpacity="1" /><stop offset="0.35" stopColor="#FF7A1A" stopOpacity="0.85" /><stop offset="1" stopColor="#FF4A00" stopOpacity="0" /></radialGradient>
          </defs>
          {roads.map((r, i) => {
            const q = pts(r); const L = len(q); const k = io(interpolate(f, [4 + i * 6, 30 + i * 6], [0, 1], cl));
            return <polyline key={"r" + i} points={q.map((p) => p.join(",")).join(" ")} fill="none" stroke="#F2F2F0" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round"
              strokeDasharray={L} strokeDashoffset={L * (1 - k)} opacity={0.92} style={{ filter: "drop-shadow(0 0 6px rgba(0,0,0,.8))" }} />;
          })}
          {arcs.map((a, i) => {
            const D = a.dur ?? 26; const u = interpolate(f, [a.at, a.at + D], [0, 1], cl); if (f < a.at) return null;
            const [tx, ty] = P(...a.to); const cx = (fx + tx) / 2, cy = Math.min(fy, ty) - a.h;
            const B = (v: number): [number, number] => [(1 - v) ** 2 * fx + 2 * v * (1 - v) * cx + v * v * tx, (1 - v) ** 2 * fy + 2 * v * (1 - v) * cy + v * v * ty];
            const e = u; // pieces fly at even speed along the curve (no ease: thrown objects)
            const N = 28; const trail = Array.from({ length: N + 1 }, (_, j) => B(Math.max(0, e - 0.45 + (0.45 * j) / N)));
            const tail = interpolate(f, [a.at + D, a.at + D + 30], [1, 0.35], cl);
            const full = Array.from({ length: 41 }, (_, j) => B((j / 40) * e));
            const [hx, hy] = B(e); const landed = u >= 1;
            const ring = interpolate(f, [a.at + D, a.at + D + 16], [0, 1], cl);
            const flick = 0.75 + 0.25 * Math.sin(f * 1.7 + i * 2.1);
            return (
              <g key={"a" + i}>
                <polyline points={full.map((p) => p.join(",")).join(" ")} fill="none" stroke="#F2F2F0" strokeWidth={2.5} strokeDasharray="10 12" opacity={0.55 * tail} />
                {!landed && <polyline points={trail.map((p) => p.join(",")).join(" ")} fill="none" stroke="#FF8A2A" strokeWidth={5} strokeLinecap="round" opacity={0.9} />}
                {!landed && <circle cx={hx} cy={hy} r={13} fill="url(#la_glow)" />}
                {landed && <circle cx={tx} cy={ty} r={10 + 30 * ring} fill="none" stroke="#F2F2F0" strokeWidth={3} opacity={(1 - ring) * 0.9} />}
                {landed && <circle cx={tx} cy={ty} r={15 * flick} fill="url(#la_glow)" opacity={0.95} />}
              </g>
            );
          })}
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
