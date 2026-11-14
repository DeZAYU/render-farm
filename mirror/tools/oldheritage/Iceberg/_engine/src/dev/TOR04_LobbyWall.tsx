// TOR04 | LobbyWall: the bank's own lobby cameras as one security wall in 3-D. One large cell and two stacked cells in white
// frames, the whole wall turned a few degrees and drifting toward the camera, so the viewer watches several rooms of the same
// empty building fill with debris at once. Cells cut in one after another (stagger), each plays its own camera window.
import React from "react";
import { AbsoluteFill, Easing, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

type Cam = { src: string; from: number; pos?: string };
export const LobbyWall: React.FC<{ big: Cam; top: Cam; bottom: Cam; bg: Cam; stagger?: number }> = ({ big, top, bottom, bg, stagger = 7 }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const d = io(f / Math.max(1, durationInFrames - 1));
  const BW = 1060, BH = BW * 9 / 16, SW = 600, SH = SW * 9 / 16, gap = 26;
  const x0 = (width - (BW + gap + SW)) / 2, y0 = (height - BH) / 2 - 10;
  const cell = (c: Cam, i: number, x: number, y: number, w: number, h: number) => {
    const k = out(interpolate(f, [i * stagger, i * stagger + 12], [0, 1], cl));
    return (
      <div key={i} style={{ position: "absolute", left: x, top: y, width: w, height: h, border: "5px solid #fff", background: "#000", overflow: "hidden",
        boxShadow: "0 24px 60px rgba(0,0,0,.6)", opacity: k, transform: `scale(${0.92 + 0.08 * k})` }}>
        <OffthreadVideo src={staticFile(c.src)} startFrom={Math.round(c.from * 30)} muted style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: c.pos ?? "50% 50%" }} />
      </div>
    );
  };
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(bg.src)} startFrom={Math.round(bg.from * 30)} muted style={{ position: "absolute", inset: -60, width: width + 120, height: height + 120, objectFit: "cover", filter: "blur(18px) brightness(.45)" }} />
      <AbsoluteFill style={{ perspective: 1900 }}>
        <AbsoluteFill style={{ transformStyle: "preserve-3d", transform: `rotateY(${-9 + 5 * d}deg) rotateX(${2 - 1 * d}deg) translateZ(${60 * d}px)` }}>
          {cell(big, 0, x0, y0, BW, BH)}
          {cell(top, 1, x0 + BW + gap, y0, SW, SH)}
          {cell(bottom, 2, x0 + BW + gap, y0 + BH - SH, SW, SH)}
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
