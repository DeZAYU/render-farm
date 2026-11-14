// TOR18 SkipPath: the NWS-surveyed path on a real NAIP aerial, drawn TO SCALE (50 yards wide): it touches down, lifts briefly and
// comes down again on the highway, as the survey describes. The city limits (Census TIGER boundary) run in as a dashed white line, then
// the highway the path ends on is traced. Slow eased push; px = image pixels.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED, RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1);
type Pt = [number, number];

export const SkipPath: React.FC<{ src: string; iw: number; ih: number; focus: Pt; z0?: number; z1?: number;
  segs: [Pt, Pt][]; width: number; pathAt: number; pathLen: number;
  limits: Pt[]; limitsAt: number; limitsLabel: string; limitsLabelPt: Pt;
  road: Pt[]; roadAt: number; roadLabel: string; roadLabelPt: Pt }> = (p) => {
  const f = useCurrentFrame(); const { width: W, height: H, durationInFrames } = useVideoConfig();
  const z = (p.z0 ?? 1.0) + ((p.z1 ?? 1.15) - (p.z0 ?? 1.0)) * io(f / durationInFrames);
  const b = Math.max(W / p.iw, H / p.ih) * z;
  const ox = Math.min(0, Math.max(W - p.iw * b, W / 2 - p.focus[0] * b)), oy = Math.min(0, Math.max(H - p.ih * b, H / 2 - p.focus[1] * b));
  const S = ([x, y]: Pt): Pt => [ox + x * b, oy + y * b];
  const d = (pts: Pt[]) => "M" + pts.map((q) => S(q).map((v) => v.toFixed(1)).join(" ")).join(" L");
  // the path segments draw one after another over pathLen (total length shared out by segment length)
  const lens = p.segs.map(([a, c]) => Math.hypot(c[0] - a[0], c[1] - a[1])); const tot = lens.reduce((x, y) => x + y, 0) + 0.0001;
  const gap = 0.12; // the lift: a pause in the drawing
  const g = interpolate(f, [p.pathAt, p.pathAt + p.pathLen], [0, 1 + gap * (p.segs.length - 1)], cl);
  let acc = 0;
  const lim = io(interpolate(f, [p.limitsAt, p.limitsAt + 22], [0, 1], cl));
  const rd = io(interpolate(f, [p.roadAt, p.roadAt + 22], [0, 1], cl));
  const bw = p.width * b; // band width on screen
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Img src={staticFile(p.src)} style={{ position: "absolute", left: ox, top: oy, width: p.iw * b, height: p.ih * b, filter: "brightness(.82) saturate(.9)" }} />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        {/* city limits */}
        <path d={d(p.limits)} fill="none" stroke="rgba(0,0,0,.5)" strokeWidth={7} pathLength={1} strokeDasharray={`${lim} 1`} />
        <path d={d(p.limits)} fill="none" stroke="#fff" strokeWidth={4} strokeDasharray="16 12" opacity={lim > 0 ? 0.95 : 0}
          mask="url(#limMask)" />
        <mask id="limMask"><path d={d(p.limits)} fill="none" stroke="#fff" strokeWidth={12} pathLength={1} strokeDasharray={`${lim} 1`} /></mask>
        {/* the highway */}
        <path d={d(p.road)} fill="none" stroke="rgba(255,255,255,.35)" strokeWidth={16} pathLength={1} strokeDasharray={`${rd} 1`} strokeLinecap="round" strokeLinejoin="round" />
        <path d={d(p.road)} fill="none" stroke="#fff" strokeWidth={5} pathLength={1} strokeDasharray={`${rd} 1`} strokeLinecap="round" strokeLinejoin="round" />
        {/* the tornado path, to scale */}
        {p.segs.map(([a, c], i) => {
          const share = lens[i] / tot; const start = acc + i * gap; acc += share;
          const k = Math.max(0, Math.min(1, (g - start) / share)); if (k <= 0) return null;
          const A = S(a), C = S(c), E: Pt = [A[0] + (C[0] - A[0]) * k, A[1] + (C[1] - A[1]) * k];
          return <g key={i}>
            <line x1={A[0]} y1={A[1]} x2={E[0]} y2={E[1]} stroke="rgba(0,0,0,.45)" strokeWidth={bw + 8} strokeLinecap="round" />
            <line x1={A[0]} y1={A[1]} x2={E[0]} y2={E[1]} stroke={RED} strokeWidth={bw} strokeLinecap="round" opacity={0.9} />
            <line x1={A[0]} y1={A[1]} x2={E[0]} y2={E[1]} stroke="#fff" strokeWidth={2} strokeLinecap="round" opacity={0.85} />
          </g>;
        })}
      </svg>
      <RedLabel text={p.limitsLabel} at={p.limitsAt + 8} x={S(p.limitsLabelPt)[0] / W} y={S(p.limitsLabelPt)[1] / H} size={34} />
      <RedLabel text={p.roadLabel} at={p.roadAt + 8} x={S(p.roadLabelPt)[0] / W} y={S(p.roadLabelPt)[1] / H} size={34} />
    </AbsoluteFill>
  );
};
