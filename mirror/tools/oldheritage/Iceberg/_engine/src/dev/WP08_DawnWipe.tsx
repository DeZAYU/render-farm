// WP08 DawnWipe — night becomes morning on the same fence line: the bystander's night clip of the burning perimeter is swept away by a
// soft, warm band of daylight moving left to right, uncovering the morning clip of the tanks still burning behind the perimeter fence.
// Both layers run live with a slow push; the band carries a faint warm glow (screen blend). Built for "By daylight, the tanks along the
// perimeter were still burning."
import React from "react";
import { AbsoluteFill, Easing, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from "remotion";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1);

export const WP08_DawnWipe: React.FC<{ night: { src: string; from: number }; day: { src: string; from: number }; n: number; w0?: number; w1?: number }> = ({ night, day, n, w0 = 0.1, w1 = 0.62 }) => {
  const f = useCurrentFrame();
  const p = io(interpolate(f / n, [w0, w1], [0, 1], cl));
  const edge = -25 + p * 150; // % across the frame (band 25 % wide)
  const sN = 1.04 + 0.05 * io(f / n), sD = 1.1 - 0.06 * io(f / n);
  // clip the morning layer to a slanted edge (x at the top is 6 % ahead of the bottom); the glow band softens the seam
  const e = edge - 12, clip = `polygon(-10% 0%, ${e + 3}% 0%, ${e - 3}% 100%, -10% 100%)`;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale3d(${sN},${sN},1)`, transformOrigin: "50% 60%" }}>
        <OffthreadVideo src={staticFile(night.src)} startFrom={Math.round(night.from * 30)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ clipPath: clip }}>
        <AbsoluteFill style={{ transform: `scale3d(${sD},${sD},1)`, transformOrigin: "50% 60%" }}>
          <OffthreadVideo src={staticFile(day.src)} startFrom={Math.round(day.from * 30)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </AbsoluteFill>
      </AbsoluteFill>
      {p > 0 && p < 1 && (
        <AbsoluteFill style={{ mixBlendMode: "screen", opacity: Math.sin(p * Math.PI) * 0.55,
          background: `linear-gradient(104deg, rgba(0,0,0,0) ${edge - 26}%, rgba(255,196,120,.55) ${edge - 12}%, rgba(255,236,200,.8) ${edge - 4}%, rgba(0,0,0,0) ${edge + 2}%)` }} />
      )}
    </AbsoluteFill>
  );
};
