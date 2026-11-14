// Censor family plumbing: footage plate with the Dashcam push, keyframed track interpolation, the soft region mask.
// Owner rule (FULL_PLAN "CENSORSHIP"): graphic injury / burns / bodies / the instant someone is hurt are NEVER shown raw; faces of victims are
// always blurred; check EVERY frame of a censored window (4 fps contact sheet minimum) so no recognisable injury leaks on any frame.
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { Media, Vignette, clamp01, linPush } from "../../core";

/** a tracked region keyframe (screen px of the final 1920x1080 frame, LOCAL frame) */
export type TrackKey = { f: number; cx: number; cy: number; rx: number; ry: number };
/** smooth (Catmull-Rom on positions, linear on radii) interpolation of the keys; holds outside the range */
export const trackAt = (keys: TrackKey[], f: number): TrackKey => {
  if (f <= keys[0].f) return keys[0];
  const L = keys.length - 1;
  if (f >= keys[L].f) return keys[L];
  let i = 0;
  while (i < L - 1 && f > keys[i + 1].f) i++;
  const a = keys[Math.max(0, i - 1)], b = keys[i], c = keys[i + 1], d = keys[Math.min(L, i + 2)];
  const t = clamp01((f - b.f) / (c.f - b.f));
  const cr = (p0: number, p1: number, p2: number, p3: number) => 0.5 * (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t + (-p0 + 3 * p1 - 3 * p2 + p3) * t * t * t);
  return { f, cx: cr(a.cx, b.cx, c.cx, d.cx), cy: cr(a.cy, b.cy, c.cy, d.cy), rx: b.rx + (c.rx - b.rx) * t, ry: b.ry + (c.ry - b.ry) * t };
};
/** CSS mask: a soft ellipse at the region (feather = fraction of the radius that fades) */
export const ellipseMask = (r: TrackKey, feather = 0.38) =>
  `radial-gradient(ellipse ${r.rx}px ${r.ry}px at ${r.cx}px ${r.cy}px, #000 ${(1 - feather) * 100}%, transparent 100%)`;

/** the footage under the censor, with the linear Dashcam push (the censor regions are given in final screen px, so they ride with it) */
export const Footage: React.FC<{ src: string; startFrom?: number; push?: number; style?: React.CSSProperties }> = ({ src, startFrom = 0, push = 0.04, style }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ overflow: "hidden", ...style }}>
      <AbsoluteFill style={{ transform: `scale(${linPush(f, push).toFixed(5)})` }}>
        <Sequence layout="none"><Media src={src} startFrom={startFrom} /></Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
export const Graded: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ background: "#000" }}>{children}<Vignette /></AbsoluteFill>
);
