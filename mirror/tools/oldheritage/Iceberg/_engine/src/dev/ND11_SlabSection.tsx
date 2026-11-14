// ND11 SlabSection: how a slab avalanche releases, as a cut through the snowpack on the slope, drawn over a dark copy of the slide footage.
// Layers: the cohesive slab on top, a thin weak layer, the old bed surface. A crack opens at the crown, runs along the weak layer, and the
// whole slab slides off as one block, breaking up as it goes; the red point is the skier standing on it. Built for "The snow he was
// standing on broke away as one slab and took him with it."
import React from "react";
import { AbsoluteFill, Easing, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED, RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), acc = Easing.bezier(0.5, 0, 0.9, 0.6);

// the slope: a line from top-left to bottom-right; positions along it s (px) and depth d (px, perpendicular, into the snow)
const A = [140, 250], B = [1820, 900];
const L = Math.hypot(B[0] - A[0], B[1] - A[1]), ux = (B[0] - A[0]) / L, uy = (B[1] - A[1]) / L, nx = -uy, ny = ux; // n points down-left -> into the snow
const P = (s: number, d: number): [number, number] => [A[0] + ux * s + nx * -d * -1, A[1] + uy * s + ny * d];
const poly = (pts: [number, number][]) => "M" + pts.map((p) => p.map((v) => v.toFixed(1)).join(" ")).join(" L") + " Z";
const SLAB = 70, WEAK = 14, BED = 170; // layer thickness (px)

export const ND11_SlabSection: React.FC<{ bg: string; bgFrom?: number; crackAt: number; runLen: number; slideAt: number; labels: [string, string, string] }> = ({ bg, bgFrom = 0, crackAt, runLen, slideAt, labels }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const crown = 520, toe = 1500; // the slab that releases spans s = crown..toe
  const run = io(interpolate(f, [crackAt, crackAt + runLen], [0, 1], cl));
  const slide = acc(interpolate(f, [slideAt, durationInFrames], [0, 1], cl)) * 520; // px down the slope
  const crownOpen = interpolate(f, [crackAt, crackAt + 6], [0, 1], cl);
  const o = interpolate(f, [0, 8], [0, 1], cl);
  // the released slab as blocks that separate a little as it slides
  const blocks = [0, 1, 2, 3, 4].map((i) => { const s0 = crown + (toe - crown) * (i / 5), s1 = crown + (toe - crown) * ((i + 1) / 5); const sh = slide * (1 + i * 0.06) + (slide > 0 ? i * 6 * (slide / 520) : 0);
    const lift = slide > 0 ? Math.sin((f + i * 7) * 0.4) * 3 * (slide / 520) : 0;
    return poly([P(s0 + sh, -lift), P(s1 + sh - 4, -lift), P(s1 + sh - 4, SLAB - lift), P(s0 + sh, SLAB - lift)]); });
  const skier = P(crown + 260 + slide, -6);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden", opacity: o }}>
      <OffthreadVideo src={staticFile(bg)} startFrom={Math.round(bgFrom * 30)} muted style={{ position: "absolute", inset: -40, width: width + 80, height: height + 80, objectFit: "cover", filter: "blur(12px) brightness(.3) saturate(.4)" }} />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        {/* ground below the bed */}
        <path d={poly([P(-200, SLAB + WEAK + BED), P(L + 200, SLAB + WEAK + BED), P(L + 200, 1400), P(-200, 1400)])} fill="rgba(10,10,10,.9)" />
        {/* old bed surface */}
        <path d={poly([P(-200, SLAB + WEAK), P(L + 200, SLAB + WEAK), P(L + 200, SLAB + WEAK + BED), P(-200, SLAB + WEAK + BED)])} fill="rgba(170,180,190,.35)" stroke="rgba(255,255,255,.5)" strokeWidth={2} />
        {/* weak layer: the crack runs along it from the crown */}
        <path d={poly([P(-200, SLAB), P(L + 200, SLAB), P(L + 200, SLAB + WEAK), P(-200, SLAB + WEAK)])} fill="rgba(120,130,140,.5)" />
        <line x1={P(crown, SLAB + WEAK / 2)[0]} y1={P(crown, SLAB + WEAK / 2)[1]} x2={P(crown + (toe - crown) * run, SLAB + WEAK / 2)[0]} y2={P(crown + (toe - crown) * run, SLAB + WEAK / 2)[1]} stroke={RED} strokeWidth={6} opacity={run > 0 ? 1 : 0} />
        {/* the snow that stays: above the crown and below the toe */}
        <path d={poly([P(-200, 0), P(crown, 0), P(crown, SLAB), P(-200, SLAB)])} fill="rgba(235,240,245,.92)" stroke="#fff" strokeWidth={3} />
        <path d={poly([P(toe + Math.max(0, slide * 1.3), 0), P(L + 200, 0), P(L + 200, SLAB), P(toe + Math.max(0, slide * 1.3), SLAB)])} fill="rgba(235,240,245,.92)" stroke="#fff" strokeWidth={3} />
        {/* the slab */}
        {blocks.map((d, i) => <path key={i} d={d} fill="rgba(235,240,245,.95)" stroke="#fff" strokeWidth={3} />)}
        {/* the crown fracture */}
        {crownOpen > 0 && <line x1={P(crown, -4)[0]} y1={P(crown, -4)[1]} x2={P(crown, SLAB)[0]} y2={P(crown, SLAB)[1]} stroke={RED} strokeWidth={7} opacity={crownOpen} />}
        <circle cx={skier[0]} cy={skier[1] - 14} r={13} fill={RED} stroke="#fff" strokeWidth={4} />
      </svg>
      <RedLabel text={labels[0]} at={10} hold={crackAt + runLen - 10} x={0.36} y={0.2} size={38} />
      <RedLabel text={labels[1]} at={crackAt + 8} hold={slideAt - crackAt + 10} x={0.62} y={0.86} size={38} />
      <RedLabel text={labels[2]} at={slideAt + 6} x={0.62} y={0.2} size={38} />
    </AbsoluteFill>
  );
};
