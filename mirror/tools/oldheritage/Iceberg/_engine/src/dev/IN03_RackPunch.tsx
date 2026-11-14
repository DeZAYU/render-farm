// IN03 RackPunch: the filmer's top-down frame held while the climber reaches; the camera eases off the climber and punches in on the
// rack of small spring-loaded cams hanging at his harness, holds under a soft spotlight, then glides down the thin crack those cams go
// into (camera only: no lines, no text).
import React from "react";
import { AbsoluteFill, Freeze, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from "remotion";
import { type CK, camAt, placeOf, cl, io } from "./DC01_kit";

export const RackPunch: React.FC<{ src: string; t: number; keys: CK[]; spot: [number, number][]; spotKeys: number[] }> = ({ src, t, keys, spot, spotKeys }) => {
  const f = useCurrentFrame();
  const c = camAt(f, keys), p = placeOf(c);
  // spotlight centre follows a path of picture points at the given frames
  let sx = spot[0][0], sy = spot[0][1];
  for (let i = 1; i < spot.length; i++) {
    if (f >= spotKeys[i - 1]) {
      const u = io(interpolate(f, [spotKeys[i - 1], spotKeys[i]], [0, 1], cl));
      sx = spot[i - 1][0] + (spot[i][0] - spot[i - 1][0]) * u; sy = spot[i - 1][1] + (spot[i][1] - spot[i - 1][1]) * u;
    }
  }
  const X = p.left + sx * p.w, Y = p.top + sy * p.h;
  const on = io(interpolate(f, [6, 30], [0, 1], cl));
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Freeze frame={0}><OffthreadVideo src={staticFile(src)} startFrom={Math.round(t * 30)} muted style={{ position: "absolute", left: p.left, top: p.top, width: p.w, height: p.h }} /></Freeze>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 520px 380px at ${X}px ${Y}px, rgba(0,0,0,0) 35%, rgba(0,0,0,${0.62 * on}) 100%)` }} />
    </AbsoluteFill>
  );
};
