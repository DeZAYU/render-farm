// AM17 PillarDrain (Mindbender, "It rolled backwards, and the wrecked car slammed into a concrete pillar."): a real photo of Mindbender's
// loops from the floor (JasonParis, 2011). The camera starts high on the loops and eases DOWN the track the way the car rolled back,
// settling low on one of the ride's concrete footings; as it lands, the colour drains out of everything except a soft vertical band
// round that pillar (the rest goes grey and dark), with one small jolt of the frame on "slammed" (real impact SFX in the case).
// Props: src/iw/ih, from/to cameras (image point + scale), band = [x0, x1] image x range of the pillar, drainAt / hitAt frames.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { frameOf, type Cam } from "./AM1720_Still";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.25, 1);

export const PillarDrain: React.FC<{ src: string; iw: number; ih: number; from: Cam; to: Cam; band: [number, number]; moveEnd?: number; drainAt: number; hitAt: number }> = ({ src, iw, ih, from, to, band, moveEnd, drainAt, hitAt }) => {
  const f = useCurrentFrame(); const { durationInFrames: dur } = useVideoConfig();
  const u = io(interpolate(f, [0, moveEnd ?? Math.round(dur * 0.62)], [0, 1], cl));
  const drift = 0.03 * interpolate(f, [moveEnd ?? Math.round(dur * 0.62), dur], [0, 1], cl);
  const c = { x: from.x + (to.x - from.x) * u, y: from.y + (to.y - from.y) * u, s: from.s + (to.s - from.s) * u + drift };
  const { k, ox, oy } = frameOf(c, iw, ih);
  const hit = interpolate(f, [hitAt, hitAt + 2, hitAt + 9], [0, 1, 0], cl);
  const sx = Math.sin(f * 3.1) * 9 * hit, sy = Math.cos(f * 2.3) * 6 * hit;
  const dr = io(interpolate(f, [drainAt, drainAt + 16], [0, 1], cl));
  const x0 = ox + band[0] * iw * k, x1 = ox + band[1] * iw * k, soft = 70;
  const mask = `linear-gradient(90deg, transparent ${x0 - soft}px, #000 ${x0}px, #000 ${x1}px, transparent ${x1 + soft}px)`;
  const pic = (st: React.CSSProperties) => <Img src={staticFile(src)} style={{ position: "absolute", left: 0, top: 0, width: iw, height: ih, transformOrigin: "0 0",
    transform: `translate3d(${(ox + sx).toFixed(3)}px, ${(oy + sy).toFixed(3)}px, 0) scale3d(${k.toFixed(5)}, ${k.toFixed(5)}, 1)`, ...st }} />;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      {pic({ filter: `saturate(${1 - 0.95 * dr}) brightness(${1 - 0.5 * dr}) contrast(${1 + 0.08 * dr})` })}
      <AbsoluteFill style={{ WebkitMaskImage: mask, maskImage: mask, opacity: dr }}>{pic({ filter: "brightness(1.04)" })}</AbsoluteFill>
    </AbsoluteFill>
  );
};
