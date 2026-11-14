// ND13 EmberRun: a real relief map (USGS NAIP x 3DEP hillshade) laid in perspective; the camera flies from the fire's origin to the
// town it reached while a white line runs over the ridges between them and embers drift along it. Red labels name both ends.
// Points are image pixels; everything on the ground (line, rings, embers) lives on the tilted plane, labels are projected in 2-D.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);
type Pt = [number, number];

export const EmberRun: React.FC<{ src: string; iw: number; ih: number; a: Pt; b: Pt; ctrl: Pt; k?: number; tilt?: number; aLabel: string; bLabel: string; runAt: number; runLen: number; bAt: number; distLabel?: string; distAt?: number }> =
  ({ src, iw, ih, a, b, ctrl, k = 1.5, tilt = 52, aLabel, bLabel, runAt, runLen, bAt, distLabel, distAt }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const P = 1500, th = (tilt * Math.PI) / 180;
  const u = io(interpolate(f, [0, durationInFrames - 1], [0, 1], cl));
  // camera focus slides from a toward b (stops a little short so the town sits upper-centre)
  const fx = a[0] + (b[0] - a[0]) * (0.08 + 0.78 * u), fy = a[1] + (b[1] - a[1]) * (0.08 + 0.78 * u);
  const kk = k * (1 + 0.06 * u);
  const cx = width / 2, cy = height * 0.6;
  const proj = (p: Pt) => { const dx = (p[0] - fx) * kk, dy = (p[1] - fy) * kk; const y = dy * Math.cos(th), z = dy * Math.sin(th); const s = P / (P - z); return [cx + dx * s, cy + y * s]; };
  const bez = (t: number): Pt => [(1 - t) ** 2 * a[0] + 2 * (1 - t) * t * ctrl[0] + t * t * b[0], (1 - t) ** 2 * a[1] + 2 * (1 - t) * t * ctrl[1] + t * t * b[1]];
  const N = 80, pts = Array.from({ length: N + 1 }, (_, i) => bez(i / N));
  const d = "M" + pts.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" L");
  const g = io(interpolate(f, [runAt, runAt + runLen], [0, 1], cl));
  const ring = (at: number) => out(interpolate(f, [at, at + 14], [0, 1], cl));
  const [ax, ay] = proj(a), [bx, by] = proj(b);
  const mid = proj(bez(0.5));
  return (
    <AbsoluteFill style={{ background: "#06080a", overflow: "hidden" }}>
      <AbsoluteFill style={{ perspective: P, perspectiveOrigin: `${cx}px ${cy}px` }}>
        <div style={{ position: "absolute", left: cx - fx * kk, top: cy - fy * kk, width: iw * kk, height: ih * kk, transformOrigin: `${fx * kk}px ${fy * kk}px`, transform: `rotateX(${tilt}deg)` }}>
          <Img src={staticFile(src)} style={{ width: "100%", height: "100%", filter: "brightness(.78) contrast(1.08) saturate(.85)" }} />
          <svg viewBox={`0 0 ${iw} ${ih}`} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
            <path d={d} fill="none" stroke="rgba(0,0,0,.5)" strokeWidth={14} pathLength={1} strokeDasharray={`${g} 1`} strokeLinecap="round" />
            <path d={d} fill="none" stroke="#fff" strokeWidth={6} pathLength={1} strokeDasharray={`${g} 1`} strokeLinecap="round" />
            {/* embers riding the line once it is drawn */}
            {g > 0.05 && Array.from({ length: 26 }, (_, i) => {
              const t = ((i / 26) + f * 0.006 + (i % 3) * 0.013) % 1; if (t > g) return null;
              const [x, y] = bez(t); const j = Math.sin(i * 7.3 + f * 0.21) * 9;
              return <circle key={i} cx={x + j} cy={y + Math.cos(i * 3.1 + f * 0.17) * 9} r={2.6 + (i % 4) * 0.8} fill={i % 2 ? "#FFB347" : "#FFE2A8"} opacity={0.55 + 0.4 * Math.sin(f * 0.4 + i)} style={{ filter: "drop-shadow(0 0 6px #ff8a1c)" }} />;
            })}
            {[[a, runAt - 6], [b, bAt]].map(([p, at], i) => { const r = ring(at as number); if (r <= 0) return null; const q = p as Pt;
              return <g key={i} opacity={r}><circle cx={q[0]} cy={q[1]} r={34 * (1.5 - 0.5 * r)} fill="none" stroke="#fff" strokeWidth={6} /><circle cx={q[0]} cy={q[1]} r={9} fill="#E3141B" stroke="#fff" strokeWidth={3} /></g>; })}
          </svg>
        </div>
      </AbsoluteFill>
      {/* night falls toward the horizon */}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(4,6,8,1) 0%, rgba(4,6,8,.92) 22%, rgba(4,6,8,0) 52%, rgba(4,6,8,0) 80%, rgba(4,6,8,.55) 100%)" }} />
      <RedLabel text={aLabel} at={runAt - 2} x={Math.min(0.85, Math.max(0.15, ax / width))} y={Math.min(0.92, (ay + 70) / height)} size={40} />
      <RedLabel text={bLabel} at={bAt + 4} x={Math.min(0.85, Math.max(0.15, bx / width))} y={Math.max(0.1, (by - 70) / height)} size={40} />
      {distLabel && <RedLabel text={distLabel} at={distAt ?? runAt + runLen} x={Math.min(0.85, Math.max(0.15, (mid[0] + 150) / width))} y={mid[1] / height} size={34} />}
    </AbsoluteFill>
  );
};
