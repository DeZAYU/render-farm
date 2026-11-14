// TOR17 SailPanel: "A loaded trailer is basically a sail.": the dashcam frame where the trailer's flank stands broadside to the camera
// (src 7.0 s) freezes; the rest of the picture dims while a white outline traces the flank panel corner to corner and the panel takes a
// faint white wash, so the viewer sees the size of the flat wall the wind was pushing on. Footage-based, no diagram.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1);

export const SailPanel: React.FC<{ still: string; quad: [number, number][]; at?: number; len?: number }> = ({ still, quad, at = 6, len = 26 }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const z = 1.0 + 0.07 * io(f / durationInFrames);
  const g = io(interpolate(f, [at, at + len], [0, 1], cl));
  const dim = interpolate(f, [at, at + 18], [0, 0.45], cl);
  const tf = (p: [number, number]) => [width / 2 + (p[0] - width / 2) * z, height * 0.45 + (p[1] - height * 0.45) * z];
  const pts = quad.map(tf);
  const d = "M" + pts.map((p) => p.join(" ")).join(" L") + " Z";
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Img src={staticFile(still)} style={{ position: "absolute", inset: 0, width, height, objectFit: "cover", transformOrigin: "50% 45%", transform: `scale(${z})` }} />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        <defs><mask id="sp"><rect width={width} height={height} fill="#fff" /><path d={d} fill="#000" /></mask></defs>
        <rect width={width} height={height} fill="#000" opacity={dim} mask="url(#sp)" />
        <path d={d} fill="#fff" opacity={0.1 * g} />
        <path d={d} fill="none" stroke="rgba(0,0,0,.5)" strokeWidth={12} pathLength={1} strokeDasharray={`${g} 1`} strokeLinejoin="round" />
        <path d={d} fill="none" stroke="#fff" strokeWidth={5} pathLength={1} strokeDasharray={`${g} 1`} strokeLinejoin="round" />
      </svg>
    </AbsoluteFill>
  );
};
