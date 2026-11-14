// WP25 device: CloudGhost — "there was a leak, though it never said where". The plant's fixed CCTV view of the quiet yard plays full
// frame with a slow push. Because the camera never moves, the same view from a few minutes later lines up exactly: the black cloud of
// that later moment rises into the quiet picture as a cold, translucent ghost (darken blend, so only what the cloud darkens shows),
// rolling in from beyond the edge of the frame — from somewhere the camera cannot see — then sinks away again, leaving the calm yard.
import React from "react";
import { AbsoluteFill, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { cl, io } from "./WP01_kit";

export const CloudGhost: React.FC<{
  src: string; from: number; ghostFrom: number; n: number; at: number; until: number; ghostRate?: number;
  s0?: number; s1?: number; fx?: number; fy?: number;
}> = ({ src, from, ghostFrom, n, at, until, ghostRate = 0.6, s0 = 1.02, s1 = 1.1, fx = 0.4, fy = 0.4 }) => {
  const f = useCurrentFrame();
  const s = s0 + (s1 - s0) * io(Math.min(1, f / n));
  const g = 0.78 * io(interpolate(f, [at, at + 30], [0, 1], cl)) * (1 - io(interpolate(f, [until, until + 30], [0, 1], cl)));
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale3d(${s},${s},1)`, transformOrigin: `${fx * 100}% ${fy * 100}%`, willChange: "transform" }}>
        <OffthreadVideo src={staticFile(src)} startFrom={Math.round(from * 30)} muted style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }} />
        {f <= until + 32 && (
          <Sequence from={at - 2} layout="none"><AbsoluteFill style={{ opacity: g, mixBlendMode: "darken" }}>
            <OffthreadVideo src={staticFile(src)} startFrom={Math.round(ghostFrom * 30)} playbackRate={ghostRate} muted
              style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0, filter: "saturate(0.2) brightness(0.9) contrast(1.15)" }} />
          </AbsoluteFill></Sequence>
        )}
        <AbsoluteFill style={{ background: `rgba(20,35,60,${0.18 * g})`, mixBlendMode: "multiply" }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
