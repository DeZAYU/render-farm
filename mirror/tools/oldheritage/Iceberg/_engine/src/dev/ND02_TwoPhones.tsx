// ND02 TwoPhones: two phones on the same stretch of road (Luis Roldan's and the rider's), side by side as white-framed panels turned
// slightly toward each other in 3-D over a blurred copy, drifting apart then settling; the two sources play at the same time.
import React from "react";
import { AbsoluteFill, Easing, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const out = Easing.bezier(0.16, 1, 0.3, 1);

export const TwoPhones: React.FC<{ a: { src: string; from: number }; b: { src: string; from: number } }> = ({ a, b }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const k = out(interpolate(f, [0, 18], [0, 1], cl)), d = f / durationInFrames;
  const W = 900, H = W * 352 / 640;
  const panel = (m: { src: string; from: number }, side: -1 | 1) => (
    <div style={{ position: "absolute", left: width / 2 - W / 2 + side * (W / 2 + 24) * k, top: height / 2 - H / 2, width: W, height: H,
      transform: `translateZ(${-60 * k}px) rotateY(${-side * (14 - 4 * d) * k}deg)`, border: "6px solid #fff", boxShadow: "0 24px 60px rgba(0,0,0,.65)", overflow: "hidden", opacity: interpolate(f, [0, 6], [0, 1], cl) }}>
      <OffthreadVideo src={staticFile(m.src)} startFrom={Math.round(m.from * 30)} muted style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.03 + 0.04 * d})` }} />
    </div>
  );
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(a.src)} startFrom={Math.round(a.from * 30)} muted style={{ position: "absolute", inset: -60, width: width + 120, height: height + 120, objectFit: "cover", filter: "blur(26px) brightness(.55)" }} />
      <AbsoluteFill style={{ perspective: 1500 }}>{panel(a, -1)}{panel(b, 1)}</AbsoluteFill>
    </AbsoluteFill>
  );
};
