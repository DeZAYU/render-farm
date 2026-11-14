// TOR03 | TwoDistances: two filmers of the same tornado at two distances, shown as two white-framed footage planes in 3-D.
// The far view (a backyard, about a mile off) settles first, tilted away on the left; the near view (Lechus's car, across the
// street) swings in on the right and the camera dollies toward it, so the viewer feels the gap close. Labels give the real
// distances (research notes), not the VO's words.
import React from "react";
import { AbsoluteFill, Easing, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

type Clip = { src: string; from: number; pos?: string; label: string };
export const TwoDistances: React.FC<{ far: Clip; near: Clip; bg: Clip; nearAt: number }> = ({ far, near, bg, nearAt }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const a = out(interpolate(f, [0, 16], [0, 1], cl));
  const b = out(interpolate(f, [nearAt, nearAt + 18], [0, 1], cl));
  const dolly = io(interpolate(f, [nearAt, durationInFrames], [0, 1], cl)); // camera drifts toward the near plane
  const W = 820, H = W * 9 / 16;
  const plane = (c: Clip, k: number, side: -1 | 1, z: number, ry: number): React.ReactNode => (
    <div style={{ position: "absolute", left: width / 2 - W / 2 + side * 445, top: height / 2 - H / 2 - 40, width: W, height: H,
      transform: `translateZ(${z}px) rotateY(${ry}deg) scale(${0.9 + 0.1 * k})`, opacity: k, border: "5px solid #fff",
      boxShadow: "0 30px 70px rgba(0,0,0,.65)", overflow: "hidden", background: "#000" }}>
      <OffthreadVideo src={staticFile(c.src)} startFrom={Math.round(c.from * 30)} muted style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: c.pos ?? "50% 50%" }} />
    </div>
  );
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(bg.src)} startFrom={Math.round(bg.from * 30)} muted style={{ position: "absolute", inset: -60, width: width + 120, height: height + 120, objectFit: "cover", filter: "blur(16px) brightness(.5) saturate(.8)", transform: `scale(${1.04 + 0.04 * dolly})` }} />
      <AbsoluteFill style={{ perspective: 1600, perspectiveOrigin: "50% 45%" }}>
        <AbsoluteFill style={{ transformStyle: "preserve-3d", transform: `translateX(${-70 * dolly}px) translateZ(${50 * dolly}px)` }}>
          {plane(far, a, -1, -220 - 60 * b, 14)}
          {b > 0 && plane(near, b, 1, 40 * b, -10 + 4 * dolly)}
        </AbsoluteFill>
      </AbsoluteFill>
      <RedLabel text={far.label} at={10} x={0.27 - 0.02 * dolly} y={0.75} size={34} />
      <RedLabel text={near.label} at={nearAt + 12} x={0.73 - 0.03 * dolly} y={0.77} size={40} />
    </AbsoluteFill>
  );
};
