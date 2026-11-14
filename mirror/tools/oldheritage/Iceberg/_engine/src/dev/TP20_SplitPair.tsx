// TP20 SplitPair: two views of the same burning pavilion, side by side. Left: the portrait photo from the beach (close, the roof going),
// kept tall in its own half; right: the beach camera's wide shot of the smoke column. A white seam draws down the middle, both halves
// slide in from their own side and push slowly. Built for the line "which the fire brigade said stopped it getting worse".
import React from "react";
import { AbsoluteFill, Easing, Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

export const SplitPair: React.FC<{ photo: string; photoPos?: string; video: string; videoFrom?: number; videoPos?: string }> = ({ photo, photoPos = "50% 60%", video, videoFrom = 0, videoPos = "50% 50%" }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const d = io(f / durationInFrames);
  const kL = out(interpolate(f, [0, 16], [0, 1], cl)), kR = out(interpolate(f, [4, 20], [0, 1], cl));
  const seam = out(interpolate(f, [6, 22], [0, 1], cl));
  const half = width / 2, gap = 4;
  return (
    <AbsoluteFill style={{ background: "#07090c", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: half - gap, height, overflow: "hidden", opacity: kL, transform: `translateX(${(1 - kL) * -70}px)` }}>
        <Img src={staticFile(photo)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: photoPos, transform: `scale(${1.03 + 0.06 * d})`, transformOrigin: "50% 62%" }} />
      </div>
      <div style={{ position: "absolute", left: half + gap, top: 0, width: half - gap, height, overflow: "hidden", opacity: kR, transform: `translateX(${(1 - kR) * 70}px)` }}>
        <OffthreadVideo src={staticFile(video)} startFrom={Math.round(videoFrom * 30)} muted style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: videoPos, transform: `scale(${1.02 + 0.04 * d})` }} />
      </div>
      <div style={{ position: "absolute", left: half - 3, top: (height * (1 - seam)) / 2, width: 6, height: height * seam, background: "#fff", boxShadow: "0 0 18px rgba(0,0,0,.6)" }} />
    </AbsoluteFill>
  );
};
