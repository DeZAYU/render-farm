// TOR19 LoopTrace: the Elie path drawn on a real Sentinel-2 image (EOX s2cloudless 2016, CC BY 4.0) with a FOLLOW camera: the frame
// rides the head of the line as it is spoken (touchdown north of the Trans-Canada, across the highway, the loop round the flour mill, the
// swing into the south-west edge of Elie). Geometry re-traced from the CC BY-SA 4.0 Wikimedia track (Wikiwillz) and checked against the
// image (6.1 km traced = the 6 km survey length). Used in two parts (g0 -> g1) so a footage cut can sit between them.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED, RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1);
type Pt = [number, number];

const cum = (p: Pt[]) => { const c = [0]; for (let i = 1; i < p.length; i++) c.push(c[i - 1] + Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1])); return c; };
const at = (p: Pt[], c: number[], g: number): Pt => {
  const L = c[c.length - 1] * Math.max(0, Math.min(1, g));
  let i = 1; while (i < c.length - 1 && c[i] < L) i++;
  const k = (L - c[i - 1]) / Math.max(1e-6, c[i] - c[i - 1]);
  return [p[i - 1][0] + (p[i][0] - p[i - 1][0]) * k, p[i - 1][1] + (p[i][1] - p[i - 1][1]) * k];
};

export type LoopMark = { g: number; label: string; pt: Pt; dy?: number };
export const LoopTrace: React.FC<{ src: string; iw: number; ih: number; path: Pt[]; g0: number; g1: number; drawFrom: number; drawLen: number;
  z: [number, number]; road?: { a: Pt; b: Pt; at: number }; marks: LoopMark[]; start?: boolean }> = ({ src, iw, ih, path, g0, g1, drawFrom, drawLen, z, road, marks, start }) => {
  const f = useCurrentFrame(); const { width: W, height: H, durationInFrames } = useVideoConfig();
  const c = cum(path);
  const g = g0 + (g1 - g0) * io(interpolate(f, [drawFrom, drawFrom + drawLen], [0, 1], cl));
  // camera follows a lagged, averaged head (smooth through the loops)
  const cam = [0, 0.025, 0.05, 0.075, 0.1].map((d) => at(path, c, Math.max(0, g - d))).reduce((a, q) => [a[0] + q[0] / 5, a[1] + q[1] / 5], [0, 0]);
  const zz = z[0] + (z[1] - z[0]) * io(f / durationInFrames);
  const b = Math.max(W / iw, H / ih) * zz;
  const ox = Math.min(0, Math.max(W - iw * b, W / 2 - cam[0] * b)), oy = Math.min(0, Math.max(H - ih * b, H / 2 - cam[1] * b));
  const S = (q: Pt): Pt => [ox + q[0] * b, oy + q[1] * b];
  // drawn part = all points up to g
  const L = c[c.length - 1] * g; const pts: Pt[] = [];
  for (let i = 0; i < path.length && c[i] <= L; i++) pts.push(path[i]);
  const head = at(path, c, g); pts.push(head);
  const d = "M" + pts.map((q) => S(q).map((v) => v.toFixed(1)).join(" ")).join(" L");
  const H0 = S(head), S0 = S(path[0]);
  const rd = road ? io(interpolate(f, [road.at, road.at + 18], [0, 1], cl)) : 0;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ position: "absolute", left: ox, top: oy, width: iw * b, height: ih * b, filter: "brightness(.9) contrast(1.08)" }} />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        {road && rd > 0 && (() => { const A = S(road.a), B = S(road.b), E: Pt = [A[0] + (B[0] - A[0]) * rd, A[1] + (B[1] - A[1]) * rd];
          return <line x1={A[0]} y1={A[1]} x2={E[0]} y2={E[1]} stroke="rgba(255,255,255,.55)" strokeWidth={9} strokeLinecap="round" />; })()}
        <path d={d} fill="none" stroke="rgba(0,0,0,.5)" strokeWidth={13} strokeLinecap="round" strokeLinejoin="round" />
        <path d={d} fill="none" stroke="#fff" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
        {start && <g><circle cx={S0[0]} cy={S0[1]} r={15} fill="none" stroke="#fff" strokeWidth={4} /><circle cx={S0[0]} cy={S0[1]} r={5} fill="#fff" /></g>}
        <circle cx={H0[0]} cy={H0[1]} r={13} fill={RED} stroke="#fff" strokeWidth={4} />
      </svg>
      {marks.map((m, i) => { const fr = Math.round(drawFrom + drawLen * Math.max(0, (m.g - g0) / Math.max(1e-6, g1 - g0))); const P = S(m.pt);
        return <RedLabel key={i} text={m.label} at={fr} x={P[0] / W} y={(P[1] + (m.dy ?? 70)) / H} size={36} />; })}
    </AbsoluteFill>
  );
};
