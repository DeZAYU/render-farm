// IN25 EndRecede (the video's last shot, under the outro line): the drive-home footage plays full frame, then on "watch this one
// next" it eases back and to the left into a thin white frame over its own darkened, blurred copy, leaving the right half of the
// frame quiet and dark for the end-screen video; the plate settles, holds, and everything fades to black on the last frames. No text.
import React from "react";
import { AbsoluteFill, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from "remotion";
import { io } from "./DC01_kit";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const EndRecede: React.FC<{ src: string; from: number; n: number; at: number; len?: number; rate?: number }> = ({ src, from, n, at, len = 34, rate = 1 }) => {
  const f = useCurrentFrame();
  const u = io(interpolate(f, [at, at + len], [0, 1], cl));
  const w = 1920 * (1 - 0.53 * u), h = 1080 * (1 - 0.53 * u);
  const x = (1920 - w) / 2 - 420 * u, y = (1080 - h) / 2 - 10 * u;
  const end = interpolate(f, [n - 22, n - 2], [1, 0], cl);
  const v = <OffthreadVideo src={staticFile(src)} startFrom={Math.round(from * 30)} playbackRate={rate} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ opacity: end }}>
        <AbsoluteFill style={{ filter: `blur(${18 * u}px) brightness(${1 - 0.72 * u}) saturate(${1 - 0.4 * u})`, transform: `scale(${1 + 0.08 * u})` }}>{v}</AbsoluteFill>
        <div style={{ position: "absolute", left: x, top: y, width: w, height: h, overflow: "hidden", boxShadow: `0 0 0 ${5 * u}px #fff, 0 24px 60px rgba(0,0,0,${0.6 * u})` }}>
          {v}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
