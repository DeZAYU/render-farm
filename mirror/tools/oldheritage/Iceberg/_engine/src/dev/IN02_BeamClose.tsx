// IN02 BeamClose: the diver's torch-lit helmet camera; as he follows the lobster deeper, the darkness at the edges of the frame closes
// in toward the torch spot (a soft oval that shrinks and breathes slightly), the picture pushes in and loses a little colour, so the
// rock seems to close round the beam. Footage stays live; no text, no lines.
import React from "react";
import { AbsoluteFill, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from "remotion";
import { cl, io } from "./DC01_kit";

export const BeamClose: React.FC<{ src: string; from: number; n: number; spot?: [number, number]; r0?: number; r1?: number; s0?: number; s1?: number }> = ({ src, from, n, spot = [0.5, 0.48], r0 = 1300, r1 = 520, s0 = 1.05, s1 = 1.3 }) => {
  const f = useCurrentFrame();
  const u = io(interpolate(f, [6, n - 4], [0, 1], cl));
  const r = r0 + (r1 - r0) * u + 18 * Math.sin(f / 9);
  const s = s0 + (s1 - s0) * u;
  const X = spot[0] * 1920, Y = spot[1] * 1080;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${s})`, transformOrigin: `${spot[0] * 100}% ${spot[1] * 100}%` }}>
        <OffthreadVideo src={staticFile(src)} startFrom={Math.round(from * 30)} muted style={{ width: "100%", height: "100%", objectFit: "cover", filter: `saturate(${1 - 0.3 * u})` }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse ${r}px ${r * 0.72}px at ${X}px ${Y}px, rgba(0,0,0,0) 30%, rgba(0,0,0,${0.35 + 0.6 * u}) 100%)` }} />
    </AbsoluteFill>
  );
};
