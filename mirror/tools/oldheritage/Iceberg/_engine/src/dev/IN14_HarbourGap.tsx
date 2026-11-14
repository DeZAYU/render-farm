// IN14 HarbourGap: the real NAIP aerial of King Harbor and the Redondo Beach Pier. Slow eased push; the breakwater is traced in white from
// its root to its tip (the line the boat could not get back behind), then a dashed measure runs from the breakwater tip to the pier's outer
// pilings with end ticks and its length, and a thin white outline closes round the pier. Place labels (RedLabel) on the VO words.
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { RedLabel } from "../brand";
import { cl, io, out, useDcFonts } from "./DC01_kit";

type P = [number, number];
const len = (p: P[]) => p.slice(1).reduce((s, q, i) => s + Math.hypot(q[0] - p[i][0], q[1] - p[i][1]), 0);

export const HarbourGap: React.FC<{
  src: string; iw: number; ih: number; n: number; z0: number; z1: number; f0: P; f1: P;
  wall: P[]; wallAt: number; gap: [P, P]; gapAt: number; gapText: string; pier: P[]; pierAt: number;
  labels: { text: string; at: number; hold: number; x?: number; y?: number }[];
}> = ({ src, iw, ih, n, z0, z1, f0, f1, wall, wallAt, gap, gapAt, gapText, pier, pierAt, labels }) => {
  useDcFonts();
  const f = useCurrentFrame();
  const u = io(Math.min(1, f / n));
  const z = z0 + (z1 - z0) * u, fx = f0[0] + (f1[0] - f0[0]) * u, fy = f0[1] + (f1[1] - f0[1]) * u;
  const base = Math.max(1920 / iw, 1080 / ih) * z;
  const ox = Math.min(0, Math.max(1920 - iw * base, 960 - fx * base)), oy = Math.min(0, Math.max(1080 - ih * base, 540 - fy * base));
  const X = (p: P) => [ox + p[0] * base, oy + p[1] * base] as P;
  const pts = (p: P[]) => p.map((q) => X(q).join(",")).join(" ");
  const wl = len(wall) * base, wk = out(interpolate(f, [wallAt, wallAt + 40], [0, 1], cl));
  const g = out(interpolate(f, [gapAt, gapAt + 24], [0, 1], cl));
  const a = X(gap[0]), b = X(gap[1]), bx = a[0] + (b[0] - a[0]) * g, by = a[1] + (b[1] - a[1]) * g;
  const ang = Math.atan2(b[1] - a[1], b[0] - a[0]), nx = -Math.sin(ang) * 14, ny = Math.cos(ang) * 14;
  const tOp = out(interpolate(f, [gapAt + 20, gapAt + 34], [0, 1], cl));
  const pl = len([...pier, pier[0]]) * base, pk = out(interpolate(f, [pierAt, pierAt + 30], [0, 1], cl));
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ position: "absolute", left: ox, top: oy, width: iw * base, height: ih * base }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 65% 60% at 50% 50%, rgba(0,0,0,0) 40%, rgba(0,0,0,.55) 100%)" }} />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <polyline points={pts(wall)} fill="none" stroke="#fff" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round"
          strokeDasharray={wl} strokeDashoffset={wl * (1 - wk)} style={{ filter: "drop-shadow(0 0 6px rgba(0,0,0,.8))" }} />
        {g > 0 && <g style={{ filter: "drop-shadow(0 0 5px rgba(0,0,0,.9))" }}>
          <line x1={a[0]} y1={a[1]} x2={bx} y2={by} stroke="#fff" strokeWidth={4} strokeDasharray="14 9" />
          <line x1={a[0] - nx} y1={a[1] - ny} x2={a[0] + nx} y2={a[1] + ny} stroke="#fff" strokeWidth={3} />
          {g > 0.98 && <line x1={b[0] - nx} y1={b[1] - ny} x2={b[0] + nx} y2={b[1] + ny} stroke="#fff" strokeWidth={3} />}
        </g>}
        {pk > 0 && <polygon points={pts(pier)} fill="none" stroke="#fff" strokeWidth={3.5} strokeDasharray={pl} strokeDashoffset={pl * (1 - pk)}
          style={{ filter: "drop-shadow(0 0 6px rgba(0,0,0,.8))" }} />}
      </svg>
      <div style={{ position: "absolute", left: (a[0] + b[0]) / 2 + nx * 5.5 - 60, top: (a[1] + b[1]) / 2 + ny * 5.5, transform: "translate(-50%,-50%)", opacity: tOp,
        fontFamily: "Elite", fontSize: 38, color: "#fff", letterSpacing: "0.06em", whiteSpace: "nowrap", textShadow: "0 0 10px rgba(0,0,0,.95), 0 2px 4px rgba(0,0,0,.9)" }}>{gapText}</div>
      {labels.map((l, i) => <RedLabel key={i} text={l.text} at={l.at} hold={l.hold} x={l.x} y={l.y} size={42} />)}
    </AbsoluteFill>
  );
};
