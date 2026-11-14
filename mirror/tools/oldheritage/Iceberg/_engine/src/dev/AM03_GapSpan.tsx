// AM03 GapSpan: "That's true, but it isn't a break down the middle. The head and its first car pull away and run on alone, while everyone
// else falls back." The far side of the loop replayed at 0.4x (motion-interpolated from the 14 fps source), the camera easing in on the worm's
// head as it comes round; at the frame where the gap is widest the picture freezes and a white measuring span (two end ticks and a line)
// opens across the gap between the first car and the second, while the cars behind sink into shade and the head and its first car keep the
// light. One eased camera path. No text. Coordinates in screen space (0..1 of the 1920x1080 frame, clip shown cover-fit).
import React from "react";
import { AbsoluteFill, Easing, Freeze, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.25, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

export const GapSpan: React.FC<{ src: string; freeze: number; gap: [number, number, number]; front: [number, number]; spanAt: number; shadeAt: number; z0: number; z1: number; focus: [number, number] }> = ({ src, freeze, gap, front, spanAt, shadeAt, z0, z1, focus }) => {
  const f = useCurrentFrame(); const { durationInFrames: dur } = useVideoConfig();
  const z = z0 + (z1 - z0) * io(interpolate(f, [0, freeze + 20], [0, 1], cl)) + 0.05 * interpolate(f, [freeze + 20, dur], [0, 1], cl);
  const sp = out(interpolate(f, [spanAt, spanAt + 16], [0, 1], cl));
  const sh = io(interpolate(f, [shadeAt, shadeAt + 24], [0, 1], cl));
  const [gx0, gx1, gy] = gap.map((v, i) => v * (i < 2 ? 1920 : 1080));
  const mid = (gx0 + gx1) / 2, half = ((gx1 - gx0) / 2) * sp, tick = 26;
  const vid = <OffthreadVideo src={staticFile(src)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: `${focus[0] * 100}% ${focus[1] * 100}%` }}>
        {f < freeze ? vid : <Freeze frame={freeze}>{vid}</Freeze>}
        {/* the cars behind the gap fall into shade, the head and its first car keep the light */}
        <AbsoluteFill style={{ opacity: sh, background: `linear-gradient(90deg, rgba(0,3,10,.35) 0%, rgba(0,3,10,0) ${front[0] * 100}%, rgba(0,3,10,0) ${front[1] * 100}%, rgba(0,3,10,.72) ${gap[1] * 100 + 3}%, rgba(0,3,10,.8) 100%)` }} />
        {sp > 0 && (
          <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", filter: "drop-shadow(0 0 3px rgba(0,0,0,.9))" }}>
            <line x1={mid - half} y1={gy} x2={mid + half} y2={gy} stroke="#fff" strokeWidth={3} />
            <line x1={mid - half} y1={gy - tick / 2} x2={mid - half} y2={gy + tick / 2} stroke="#fff" strokeWidth={3} />
            <line x1={mid + half} y1={gy - tick / 2} x2={mid + half} y2={gy + tick / 2} stroke="#fff" strokeWidth={3} />
          </svg>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
