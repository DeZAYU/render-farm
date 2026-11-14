// ND15 ForceSquares: why wind damage doesn't climb in a straight line. Two wind speeds as white squares whose AREA is the force
// (it grows with the square of the speed): the 100 mph square, then the 140 mph square grows to almost exactly twice the area, and
// the first square's outline is laid inside it twice to prove it. Over the darkened garage footage.
import React from "react";
import { AbsoluteFill, Easing, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED, RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

export const ForceSquares: React.FC<{ bg: string; bgFrom: number; a: number; b: number; aAt: number; bAt: number; proofAt: number; aLabel: string; bLabel: string }> =
  ({ bg, bgFrom, a, b, aAt, bAt, proofAt, aLabel, bLabel }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const unit = 360 / a; // px per mph for the side of the first square
  const sa = a * unit, sb = b * unit; // side lengths: area ratio (b/a)^2
  const ga = out(interpolate(f, [aAt, aAt + 18], [0, 1], cl)), gb = io(interpolate(f, [bAt, bAt + 26], [0, 1], cl));
  const gp = io(interpolate(f, [proofAt, proofAt + 30], [0, 1], cl));
  const base = height * 0.8, xa = width * 0.27 - sa / 2, xb = width * 0.66 - sb / 2;
  const sbNow = sa + (sb - sa) * gb;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(bg)} startFrom={Math.round(bgFrom * 30)} muted style={{ position: "absolute", inset: 0, width, height, objectFit: "cover", filter: "blur(9px) brightness(.33) saturate(.6)", transform: `scale(${1.04 + 0.04 * f / durationInFrames})` }} />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        <line x1={width * 0.08} y1={base} x2={width * 0.92} y2={base} stroke="rgba(255,255,255,.6)" strokeWidth={3} />
        {ga > 0 && <rect x={xa} y={base - sa * ga} width={sa} height={sa * ga} fill="rgba(255,255,255,.16)" stroke="#fff" strokeWidth={5} />}
        {gb > 0 && <rect x={xb + (sb - sbNow) / 2} y={base - sbNow} width={sbNow} height={sbNow} fill="rgba(227,20,27,.28)" stroke={RED} strokeWidth={6} />}
        {/* proof: the small square's area laid twice inside the big one (as two strips of equal area) */}
        {gp > 0 && [0, 1].map((i) => { const h = (sa * sa) / sb; return <rect key={i} x={xb} y={base - h * (i + 1)} width={sb * gp} height={h} fill="none" stroke="#fff" strokeWidth={4} strokeDasharray="14 10" />; })}
      </svg>
      <RedLabel text={aLabel} at={aAt + 8} x={(xa + sa / 2) / width} y={(base + 50) / height} size={40} />
      <RedLabel text={bLabel} at={bAt + 14} x={(xb + sb / 2) / width} y={(base + 50) / height} size={40} />
    </AbsoluteFill>
  );
};
