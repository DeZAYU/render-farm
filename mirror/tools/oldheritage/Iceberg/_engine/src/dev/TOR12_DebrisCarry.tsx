// TOR12 DebrisCarry: how far the storm carried paper. Top-down real imagery of eastern Kansas (USGS NAIP, graded); the camera starts
// on Hesston, a dashed flight line arcs north-east to where the store's checks came down (Manhattan) and on to the personal check
// (near Blaine), each landing marked with a ring as it is spoken. Distances are the NWS Wichita figures. px = image px.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);
type K = { f: number; cx: number; cy: number; z: number };
const cam = (f: number, ks: K[]) => { if (f <= ks[0].f) return ks[0]; for (let i = 1; i < ks.length; i++) { const a = ks[i - 1], b = ks[i]; if (f <= b.f) { const t = io((f - a.f) / (b.f - a.f)); return { f, cx: a.cx + (b.cx - a.cx) * t, cy: a.cy + (b.cy - a.cy) * t, z: a.z + (b.z - a.z) * t }; } } return ks[ks.length - 1]; };

export type Drop = { to: [number, number]; at: number; len: number; label: string; labelAt: number; bend?: number };

export const DebrisCarry: React.FC<{ src: string; iw: number; ih: number; origin: [number, number]; originLabel: string; originAt?: number; keys: K[]; drops: Drop[] }> = ({ src, iw, ih, origin, originLabel, originAt = 6, keys, drops }) => {
  const f = useCurrentFrame(); const { width, height } = useVideoConfig();
  const c = cam(f, keys);
  const base = Math.max(width / iw, height / ih) * c.z;
  const ox = Math.min(0, Math.max(width - iw * base, width / 2 - c.cx * base)), oy = Math.min(0, Math.max(height - ih * base, height / 2 - c.cy * base));
  const P = (x: number, y: number): [number, number] => [ox + x * base, oy + y * base];
  const [hx, hy] = P(origin[0], origin[1]);
  const pulse = (a: number) => out(interpolate(f, [a, a + 12], [0, 1], cl));
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ position: "absolute", left: ox, top: oy, width: iw * base, height: ih * base, filter: "saturate(.85) contrast(1.05) brightness(.9)" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 75% at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,.55) 100%)" }} />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        {drops.map((d, i) => {
          const g = io(interpolate(f, [d.at, d.at + d.len], [0, 1], cl)); if (g <= 0) return null;
          const [tx, ty] = P(d.to[0], d.to[1]);
          const mx = (hx + tx) / 2, my = (hy + ty) / 2, nx = -(ty - hy), ny = tx - hx, nl = Math.hypot(nx, ny) || 1, b = (d.bend ?? 0.18) * Math.hypot(tx - hx, ty - hy);
          const qx = mx + (nx / nl) * b, qy = my + (ny / nl) * b;
          const path = `M${hx} ${hy} Q${qx} ${qy} ${tx} ${ty}`;
          const land = pulse(d.at + d.len - 2);
          return <g key={i}>
            <path d={path} fill="none" stroke="rgba(0,0,0,.45)" strokeWidth={9} pathLength={1} strokeDasharray={`${g} 1`} strokeLinecap="round" />
            <path d={path} fill="none" stroke="#fff" strokeWidth={4.5} pathLength={1000} strokeDasharray="18 12" style={{ clipPath: "none" }} mask={`url(#m${i})`} />
            <mask id={`m${i}`}><path d={path} fill="none" stroke="#fff" strokeWidth={14} pathLength={1} strokeDasharray={`${g} 1`} /></mask>
            {land > 0 && <><circle cx={tx} cy={ty} r={10 + 26 * land} fill="none" stroke="#fff" strokeWidth={4} opacity={1 - 0.6 * land} /><circle cx={tx} cy={ty} r={9} fill="#E3141B" stroke="#fff" strokeWidth={3} /></>}
          </g>;
        })}
        <circle cx={hx} cy={hy} r={10} fill="#fff" stroke="#E3141B" strokeWidth={4} opacity={pulse(originAt - 4)} />
      </svg>
      <RedLabel text={originLabel} at={originAt} hold={drops[0] ? drops[0].labelAt - originAt + 30 : 9999} x={hx / width} y={(hy + 48) / height} size={34} />
      {drops.map((d, i) => { const [tx, ty] = P(d.to[0], d.to[1]); return <RedLabel key={i} text={d.label} at={d.labelAt} x={tx / width} y={(ty - 50) / height} size={34} />; })}
    </AbsoluteFill>
  );
};
