// WP24 device: FenceSplit — "the cause came from inside the fence". The filmer's night frame of the terminal's boundary wall with the
// fire beyond it holds full frame (near-frozen, slow push). The picture splits along the top of the real wall: everything on the
// filmer's side (wall, street, trees) drains to a cold, dim grey while the terminal side above the wall keeps its full fire colour,
// then the frame eases up over the wall into the fire. No lines or text: the real wall is the edge.
import React from "react";
import { AbsoluteFill, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from "remotion";
import { cl, io } from "./WP01_kit";

export const FenceSplit: React.FC<{
  src: string; from: number; n: number; rate?: number; at: number;
  pts: [number, number][];            // the top of the wall, left -> right, in 1920x1080 shot coords
  fx?: number; fy?: number; s1?: number;
}> = ({ src, from, n, rate = 0.25, at, pts, fx = 0.5, fy = 0.3, s1 = 1.22 }) => {
  const f = useCurrentFrame();
  const k = io(interpolate(f, [at, at + 40], [0, 1], cl));
  const s = 1.0 + (s1 - 1.0) * io(Math.min(1, f / n));
  const ring: [number, number][] = [[-200, -200], [2120, -200], [2120, pts[pts.length - 1][1]], ...[...pts].reverse(), [-200, pts[0][1]]];
  // soft-edged mask (a blurred polygon) so the split melts along the real edge instead of cutting a hard shape
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1920 1080' width='1920' height='1080'><filter id='b' x='-10%' y='-10%' width='120%' height='120%'><feGaussianBlur stdDeviation='34'/></filter><polygon filter='url(#b)' fill='white' points='${ring.map(([x, y]) => `${x},${y}`).join(" ")}'/></svg>`;
  const mask = `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
  const vid = (filter?: string) => (
    <OffthreadVideo src={staticFile(src)} startFrom={Math.round(from * 30)} playbackRate={rate} muted
      style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0, filter }} />
  );
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale3d(${s},${s},1)`, transformOrigin: `${fx * 100}% ${fy * 100}%`, willChange: "transform" }}>
        {vid(`saturate(${1 - 0.92 * k}) brightness(${1 - 0.72 * k}) sepia(${0}) hue-rotate(0deg)`)}
        <AbsoluteFill style={{ background: `rgba(40,70,110,${0.22 * k})`, mixBlendMode: "color" }} />
        <AbsoluteFill style={{ maskImage: mask, WebkitMaskImage: mask, maskSize: "100% 100%", WebkitMaskSize: "100% 100%" } as React.CSSProperties}>{vid(`brightness(${1 + 0.08 * k})`)}</AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
