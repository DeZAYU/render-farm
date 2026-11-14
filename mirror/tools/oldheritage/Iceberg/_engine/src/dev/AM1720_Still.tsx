// AM17-20 helper (not a device): a still photo moved like footage. The camera frames image point (x, y) at scale s (1 = cover) and
// travels linearly from `a` to `b` over the shot (constant push/tilt, never a dead still), the image edge never enters the frame.
// Optional `look`: [start, end] of a dim/desaturate amount 0..1 (lights going down on a line), `ease` for a designed tilt (eased).
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const io = Easing.bezier(0.45, 0, 0.25, 1);
export type Cam = { x: number; y: number; s: number };
export const frameOf = (c: Cam, iw: number, ih: number) => {
  const k = Math.max(1920 / iw, 1080 / ih) * c.s;
  const ox = Math.min(0, Math.max(1920 - iw * k, 960 - c.x * iw * k));
  const oy = Math.min(0, Math.max(1080 - ih * k, 540 - c.y * ih * k));
  return { k, ox, oy };
};
export const Still: React.FC<{ src: string; iw: number; ih: number; a: Cam; b: Cam; ease?: boolean; look?: [number, number]; gray?: number }> = ({ src, iw, ih, a, b, ease, look, gray = 0 }) => {
  const f = useCurrentFrame(); const { durationInFrames: dur } = useVideoConfig();
  let u = Math.min(1, f / Math.max(1, dur - 1)); if (ease) u = io(u);
  const c = { x: a.x + (b.x - a.x) * u, y: a.y + (b.y - a.y) * u, s: a.s + (b.s - a.s) * u };
  const { k, ox, oy } = frameOf(c, iw, ih);
  const d = look ? look[0] + (look[1] - look[0]) * u : 0;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ position: "absolute", left: 0, top: 0, width: iw, height: ih, transformOrigin: "0 0", willChange: "transform",
        transform: `translate3d(${ox.toFixed(3)}px, ${oy.toFixed(3)}px, 0) scale3d(${k.toFixed(5)}, ${k.toFixed(5)}, 1)`,
        filter: d > 0 || gray > 0 ? `brightness(${1 - 0.55 * d}) saturate(${Math.max(0, 1 - 0.7 * d - gray)})` : undefined }} />
    </AbsoluteFill>
  );
};
export const lerpI = interpolate;
