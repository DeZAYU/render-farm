// TOR14 PathFollow: the NWS Des Moines survey map of the path through Greenfield (public domain). The camera rides the surveyed line
// from the south-west edge of town to the north-east, close in, a white ring travelling on the line at the head; the street grid
// slides past underneath, so the viewer sees which blocks the path crossed. px = map image px.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1);
const segLen = (p: [number, number][]) => { let L = 0; for (let i = 1; i < p.length; i++) L += Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]); return L; };
const at = (p: [number, number][], u: number): [number, number] => { const L = segLen(p) * u; let acc = 0;
  for (let i = 1; i < p.length; i++) { const l = Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]); if (acc + l >= L) { const t = (L - acc) / l; return [p[i - 1][0] + (p[i][0] - p[i - 1][0]) * t, p[i - 1][1] + (p[i][1] - p[i - 1][1]) * t]; } acc += l; }
  return p[p.length - 1]; };

export const PathFollow: React.FC<{ src: string; iw: number; ih: number; path: [number, number][]; u0?: number; u1?: number; z0?: number; z1?: number; rot?: number }> = ({ src, iw, ih, path, u0 = 0.05, u1 = 0.95, z0 = 1.9, z1 = 2.3, rot = -6 }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const t = io(interpolate(f, [4, durationInFrames - 4], [0, 1], cl));
  const u = u0 + (u1 - u0) * t, [hx, hy] = at(path, u);
  const z = z0 + (z1 - z0) * Math.sin(t * Math.PI) * 0.5 + (z1 - z0) * 0.5 * t;
  const k = Math.max(width / iw, height / ih) * z;
  // keep the head a little behind centre, looking ahead along the path
  const [ax, ay] = at(path, Math.min(1, u + 0.06));
  const cx = hx + (ax - hx) * 0.6, cy = hy + (ay - hy) * 0.6;
  const ox = width / 2 - cx * k, oy = height / 2 - cy * k;
  const d = "M" + path.map((p) => `${(ox + p[0] * k).toFixed(1)} ${(oy + p[1] * k).toFixed(1)}`).join(" L");
  const hxS = ox + hx * k, hyS = oy + hy * k, pulse = 0.5 + 0.5 * Math.sin(f / 4);
  return (
    <AbsoluteFill style={{ background: "#ececea", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `rotate(${rot}deg) scale(1.12)`, transformOrigin: "50% 50%" }}>
        <Img src={staticFile(src)} style={{ position: "absolute", left: ox, top: oy, width: iw * k, height: ih * k, filter: "contrast(1.04) saturate(.9)" }} />
        <svg width={width} height={height} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <path d={d} fill="none" stroke="rgba(227,20,27,.22)" strokeWidth={46} strokeLinecap="round" strokeLinejoin="round" />
          <circle cx={hxS} cy={hyS} r={30 + 10 * pulse} fill="none" stroke="#fff" strokeWidth={6} style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,.6))" }} />
          <circle cx={hxS} cy={hyS} r={10} fill="#E3141B" stroke="#fff" strokeWidth={4} />
        </svg>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 70% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,.35) 100%)" }} />
    </AbsoluteFill>
  );
};
