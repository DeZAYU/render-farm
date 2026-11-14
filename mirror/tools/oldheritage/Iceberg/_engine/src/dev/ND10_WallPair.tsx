// ND10 WallPair: the same seawall before and after, as two white-framed prints in 3-D space. Tarō (Iwate) had the most famous wall on
// the coast (completed 1958; photo 2007, Kihkyef, CC BY-SA 3.0). The 2011 wave went over it; the second print is what was left in 2014
// (Yoshio Kohara, CC BY 3.0). The first print sits angled; on the turn it swings back and darkens as the second slides in over it.
// Built for "Japan spent decades building seawalls along this coast, and in a lot of places the 2011 wave went straight over them."
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

const Print: React.FC<{ src: string; w: number; h: number; pos?: string; style: React.CSSProperties; drift: number }> = ({ src, w, h, pos = "50% 50%", style, drift }) => (
  <div style={{ position: "absolute", width: w, height: h, border: "6px solid #fff", boxShadow: "0 30px 70px rgba(0,0,0,.65)", overflow: "hidden", background: "#111", ...style }}>
    <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: pos, transform: `scale(${1.04 + drift})` }} />
  </div>
);

export const ND10_WallPair: React.FC<{ a: string; b: string; at: number; aLabel: string; bLabel: string; aPos?: string; bPos?: string }> = ({ a, b, at, aLabel, bLabel, aPos, bPos }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const t = f / durationInFrames;
  const w = interpolate(f, [at - 6, at + 22], [0, 1], { ...cl, easing: io });
  const k = out(interpolate(f, [0, 14], [0, 1], cl));
  const W = 1180, H = 664;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden", perspective: 1800 }}>
      <Img src={staticFile(a)} style={{ position: "absolute", inset: -40, width: width + 80, height: height + 80, objectFit: "cover", filter: "blur(18px) brightness(.45) saturate(.8)" }} />
      <Img src={staticFile(b)} style={{ position: "absolute", inset: -40, width: width + 80, height: height + 80, objectFit: "cover", filter: "blur(18px) brightness(.45) saturate(.8)", opacity: w }} />
      <Print src={a} w={W} h={H} pos={aPos} drift={0.05 * t} style={{ left: (width - W) / 2, top: (height - H) / 2 - 40, opacity: k,
        transform: `translateX(${(-60 - 260 * w).toFixed(1)}px) translateZ(${(-40 - 380 * w).toFixed(1)}px) rotateY(${(10 + 16 * w).toFixed(2)}deg) scale(${(0.95 + 0.05 * k).toFixed(3)})`,
        filter: `brightness(${(1 - 0.5 * w).toFixed(3)})` }} />
      {w > 0 && <Print src={b} w={W} h={H} pos={bPos} drift={0.05 * Math.max(0, (f - at) / durationInFrames)} style={{ left: (width - W) / 2, top: (height - H) / 2 - 40,
        transform: `translateX(${((1 - w) * 1200 + 70 * w).toFixed(1)}px) translateZ(${(60 * w).toFixed(1)}px) rotateY(${(-22 * (1 - w) - 6 * w).toFixed(2)}deg)` }} />}
      <RedLabel text={aLabel} at={10} hold={at - 16} x={0.42} y={0.86} size={42} />
      <RedLabel text={bLabel} at={at + 14} x={0.54} y={0.86} size={42} />
    </AbsoluteFill>
  );
};
