// WP11 device: SameCamWipe. The refinery's own camera, same view, before and after: the frame from minutes before the rupture
// (the unit quiet) holds full frame, then a white seam sweeps across it and wipes it away to the live picture of the same unit
// swallowed by the vapour cloud; the seam fades and the shot pushes slowly into the cloud where the crews were.
import React from "react";
import { AbsoluteFill, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FrameAt, cl, io } from "./WP01_kit";

export const SameCamWipe: React.FC<{ src: string; tBefore: number; fromAfter: number; n: number; w0: number; w1: number; fx?: number; fy?: number }> = ({ src, tBefore, fromAfter, n, w0, w1, fx = 0.5, fy = 0.5 }) => {
  const f = useCurrentFrame();
  const u = io(interpolate(f, [w0, w1], [0, 1], cl));
  const x = u * 1920;
  const s = 1.02 + 0.12 * io(interpolate(f, [0, n], [0, 1], cl));
  const seamO = interpolate(f, [w0, w0 + 4, w1 - 2, w1 + 10], [0, 1, 1, 0], cl);
  const st: React.CSSProperties = { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" };
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale3d(${s},${s},1)`, transformOrigin: `${fx * 100}% ${fy * 100}%` }}>
        <OffthreadVideo src={staticFile(src)} startFrom={Math.round(fromAfter * 30)} muted style={st} />
        <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 0 0 ${x}px)` }}>
          <FrameAt src={src} t={tBefore} style={st} />
        </div>
        <div style={{ position: "absolute", top: 0, bottom: 0, left: x - 3, width: 6, background: "#F2F2F0", opacity: seamO, boxShadow: "0 0 24px rgba(255,255,255,.55)" }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
