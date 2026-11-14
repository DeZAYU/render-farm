// IN07 OpenWater: a real NAIP aerial of the lake; the water (a mask made from the image itself) sinks to a cold near-black so the open
// water reads as one dark expanse between the shores, while the land stays lit. A small white box settles on the launch point, then a
// dashed white line crosses the dark water to the far shore he named (the island), ending in a short white tick. Slow eased push toward
// the middle of the crossing. No numbers, no text beyond the place label passed in by the case.
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { cl, io, out } from "./DC01_kit";

type P = [number, number];
const len = (p: P[]) => p.slice(1).reduce((s, q, i) => s + Math.hypot(q[0] - p[i][0], q[1] - p[i][1]), 0);

export const OpenWater: React.FC<{ src: string; mask: string; iw: number; ih: number; n: number; focus0: P; focus1: P; z0: number; z1: number;
  box: [number, number, number, number]; boxAt: number; path: P[]; lineAt: number; lineLen: number; sinkAt?: number }> =
  ({ src, mask, iw, ih, n, focus0, focus1, z0, z1, box, boxAt, path, lineAt, lineLen, sinkAt = 20 }) => {
  const f = useCurrentFrame();
  const u = io(interpolate(f, [0, n], [0, 1], cl));
  const s = (1920 / iw) * (z0 + (z1 - z0) * u);
  const fx = focus0[0] + (focus1[0] - focus0[0]) * u, fy = focus0[1] + (focus1[1] - focus0[1]) * u;
  const sink = io(interpolate(f, [sinkAt, sinkAt + 30], [0, 1], cl));
  const b = out(interpolate(f, [boxAt, boxAt + 12], [0, 1], cl));
  const L = len(path), d = L * io(interpolate(f, [lineAt, lineAt + lineLen], [0, 1], cl));
  const tick = out(interpolate(f, [lineAt + lineLen - 4, lineAt + lineLen + 8], [0, 1], cl));
  const end = path[path.length - 1], prev = path[path.length - 2];
  const ang = Math.atan2(end[1] - prev[1], end[0] - prev[0]) + Math.PI / 2;
  const pts = path.map((p) => p.join(",")).join(" ");
  const [bx0, by0, bx1, by1] = box, pad = 30 * (1 - b);
  return (
    <AbsoluteFill style={{ background: "#05080b", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 960 - iw / 2, top: 540 - ih / 2, width: iw, height: ih, transformOrigin: "50% 50%",
        transform: `scale(${s}) translate(${iw / 2 - fx}px, ${ih / 2 - fy}px)` }}>
        <Img src={staticFile(src)} style={{ position: "absolute", inset: 0, width: iw, height: ih }} />
        <Img src={staticFile(mask)} style={{ position: "absolute", inset: 0, width: iw, height: ih, opacity: sink }} />
        <svg width={iw} height={ih} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          {b > 0 && <rect x={bx0 - pad} y={by0 - pad} width={bx1 - bx0 + 2 * pad} height={by1 - by0 + 2 * pad} fill="none" stroke="#fff" strokeWidth={4 / (s / (1920 / iw))} opacity={b} />}
                  </svg>
        {/* the dashed line is revealed by a growing solid mask drawn along the same path */}
        <svg width={iw} height={ih} style={{ position: "absolute", inset: 0 }}>
          <defs><mask id="ow"><polyline points={pts} fill="none" stroke="#fff" strokeWidth={14} strokeLinecap="round" strokeDasharray={`${d} ${L}`} /></mask></defs>
          <polyline points={pts} fill="none" stroke="#fff" strokeWidth={4.5} strokeLinecap="round" strokeDasharray="14 12" mask="url(#ow)" />
          <line x1={end[0] - Math.cos(ang) * 16 * tick} y1={end[1] - Math.sin(ang) * 16 * tick} x2={end[0] + Math.cos(ang) * 16 * tick} y2={end[1] + Math.sin(ang) * 16 * tick} stroke="#fff" strokeWidth={5} />
        </svg>
      </div>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 70% at 50% 50%, rgba(0,0,0,0) 50%, rgba(0,0,0,.55) 100%)" }} />
    </AbsoluteFill>
  );
};
