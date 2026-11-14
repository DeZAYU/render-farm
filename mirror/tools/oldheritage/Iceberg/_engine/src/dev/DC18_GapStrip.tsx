// DC18 GapStrip: "That gap is what got him out." The frame from just before the trap is sprung, held: the car ahead stopped at the
// bottom of the ramp, the dashcam's own car hanging back. A pale strip of light lays itself along the lane on the road surface, in
// perspective, from this car's bonnet up to the other car's rear bumper (the gap he left), thin white edges, rest of the frame
// eased darker, slow push. No text.
import React from "react";
import { AbsoluteFill, Freeze, OffthreadVideo, staticFile, useCurrentFrame } from "remotion";
import { CK, camAt, ease, placeOf } from "./DC01_kit";

type P = [number, number];
export const GapStrip: React.FC<{ src: string; t: number; keys: CK[]; near: [P, P]; far: [P, P]; at: number; len?: number }> = ({ src, t, keys, near, far, at, len = 40 }) => {
  const f = useCurrentFrame();
  const p = placeOf(camAt(f, keys));
  const g = ease(f, at, at + len), d = ease(f, at - 10, at + 16);
  const st: React.CSSProperties = { position: "absolute", inset: 0, width: "100%", height: "100%" };
  const lerp = (a: P, b: P, u: number): P => [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u];
  const L = lerp(near[0], far[0], g), R = lerp(near[1], far[1], g);
  const S = (q: P) => `${q[0] * 1000} ${q[1] * 1000}`;
  const poly = `M${S(near[0])} L${S(L)} L${S(R)} L${S(near[1])} Z`;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: p.left, top: p.top, width: p.w, height: p.h }}>
        <Freeze frame={0}><OffthreadVideo src={staticFile(src)} startFrom={Math.round(t * 30)} muted style={{ ...st, filter: `brightness(${1 - 0.35 * d})` }} /></Freeze>
        <svg viewBox="0 0 1000 1000" preserveAspectRatio="none" style={st}>
          <defs><linearGradient id="gs" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="rgba(255,255,255,.34)" /><stop offset="1" stopColor="rgba(255,255,255,.12)" /></linearGradient></defs>
          <path d={poly} fill="url(#gs)" />
          <path d={`M${S(near[0])} L${S(L)}`} stroke="#fff" strokeWidth={3} vectorEffect="non-scaling-stroke" fill="none" />
          <path d={`M${S(near[1])} L${S(R)}`} stroke="#fff" strokeWidth={3} vectorEffect="non-scaling-stroke" fill="none" />
          {g > 0.98 && <path d={`M${S(far[0])} L${S(far[1])}`} stroke="#fff" strokeWidth={3} vectorEffect="non-scaling-stroke" />}
        </svg>
      </div>
    </AbsoluteFill>
  );
};
