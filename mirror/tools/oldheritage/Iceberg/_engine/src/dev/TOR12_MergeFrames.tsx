// TOR12 MergeFrames: the four still photographs that caught the merge (Nancy Franzen, via NWS Wichita / Grazulis), each in a white
// frame on a receding 3-D row; the camera trucks from the first frame to the last as the line says "circled ... and merged".
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

export const MergeFrames: React.FC<{ frames: string[]; ar: number; bg: string }> = ({ frames, ar, bg }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const W = 860, H = W / ar, gap = 120, N = frames.length;
  const u = io(interpolate(f, [4, durationInFrames - 6], [0, 1], cl));
  const camX = u * (N - 1) * (W + gap); // truck along the row
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Img src={staticFile(bg)} style={{ position: "absolute", inset: -60, width: width + 120, height: height + 120, objectFit: "cover", filter: "blur(22px) brightness(.45) saturate(.6)", transform: `translateX(${-u * 60}px)` }} />
      <AbsoluteFill style={{ perspective: 1800, perspectiveOrigin: "50% 45%" }}>
        <div style={{ position: "absolute", left: width / 2 - W / 2, top: height / 2 - H / 2 - 20, width: W, height: H, transformStyle: "preserve-3d", transform: `rotateY(-16deg) translateX(${-camX}px)` }}>
          {frames.map((s, i) => {
            const d = Math.abs(i * (W + gap) - camX) / (W + gap); // 0 = in focus
            const k = out(interpolate(f, [i * 3, i * 3 + 12], [0, 1], cl));
            return <div key={i} style={{ position: "absolute", left: i * (W + gap), top: 0, width: W, height: H, border: "6px solid #fff", boxShadow: "0 24px 60px rgba(0,0,0,.65)", overflow: "hidden",
              opacity: k * (1 - Math.min(0.55, d * 0.35)), transform: `translateZ(${-Math.min(1.5, d) * 160}px)`, filter: `brightness(${1 - Math.min(0.4, d * 0.3)})` }}>
              <Img src={staticFile(s)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>;
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
