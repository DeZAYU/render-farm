// TOR13 SwathEdge: the path through the village on the NWS aerial taken after (public domain). The camera drifts down the swath while
// its two edges are traced in white, and the ground between them is washed faintly red: everything inside the lines is what the
// tornado took. px = photo pixels (oblique photo, so the edges are drawn by eye along the visible damage line).
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1);

export const SwathEdge: React.FC<{ src: string; iw: number; ih: number; north: [number, number][]; south: [number, number][]; at: number; len: number; z0?: number; z1?: number; focus0: [number, number]; focus1: [number, number]; corner?: [number, number][] }> = ({ src, iw, ih, north, south, at, len, z0 = 1.15, z1 = 1.3, focus0, focus1, corner = [] }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const u = io(f / Math.max(1, durationInFrames - 1));
  const z = z0 + (z1 - z0) * u, fx = focus0[0] + (focus1[0] - focus0[0]) * u, fy = focus0[1] + (focus1[1] - focus0[1]) * u;
  const k = Math.max(width / iw, height / ih) * z;
  const ox = Math.min(0, Math.max(width - iw * k, width / 2 - fx * k)), oy = Math.min(0, Math.max(height - ih * k, height / 2 - fy * k));
  const P = (p: [number, number]) => `${(ox + p[0] * k).toFixed(1)},${(oy + p[1] * k).toFixed(1)}`;
  const g = io(interpolate(f, [at, at + len], [0, 1], cl)), fill = interpolate(f, [at + len * 0.6, at + len + 12], [0, 1], cl);
  const poly = [...north, ...[...south].reverse(), ...corner].map(P).join(" ");
  const line = (pts: [number, number][]) => "M" + pts.map(P).join(" L");
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ position: "absolute", left: ox, top: oy, width: iw * k, height: ih * k }} />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        <polygon points={poly} fill={`rgba(227,20,27,${(0.2 * fill).toFixed(3)})`} />
        {[north, south].map((pts, i) => <g key={i}>
          <path d={line(pts)} fill="none" stroke="rgba(0,0,0,.5)" strokeWidth={11} pathLength={1} strokeDasharray={`${g} 1`} strokeLinecap="round" strokeLinejoin="round" />
          <path d={line(pts)} fill="none" stroke="#fff" strokeWidth={5} pathLength={1} strokeDasharray={`${g} 1`} strokeLinecap="round" strokeLinejoin="round" />
        </g>)}
      </svg>
    </AbsoluteFill>
  );
};
