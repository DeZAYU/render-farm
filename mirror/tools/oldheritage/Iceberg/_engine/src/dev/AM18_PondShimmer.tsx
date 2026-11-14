// AM18 PondShimmer (Black Sunday, "He reached down to splash the water, a jolt went through him, and he fell in."): the real photo of
// the Oktoberfest area at Kings Island (the fountain in the lake by Viking Fury, 2014) held big; the park around drains into shade and
// only the water stays lit, and the water alone moves: a slow live ripple (SVG turbulence displacement, animated) inside a soft oval
// over the lake. On the jolt the frame gives one small shudder (real impact SFX in the case). No text, no red, no figure.
// Props: src/iw/ih, center/rx/ry = the water oval in image coords (0..1), a/b cameras, jolt frame.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { frameOf, type Cam } from "./AM1720_Still";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.25, 1);

export const PondShimmer: React.FC<{ src: string; iw: number; ih: number; center: [number, number]; rx: number; ry: number; a: Cam; b: Cam; jolt: number }> = ({ src, iw, ih, center, rx, ry, a, b, jolt }) => {
  const f = useCurrentFrame(); const { durationInFrames: dur } = useVideoConfig();
  const u = f / Math.max(1, dur - 1);
  const c = { x: a.x + (b.x - a.x) * u, y: a.y + (b.y - a.y) * u, s: a.s + (b.s - a.s) * u };
  const { k, ox, oy } = frameOf(c, iw, ih);
  const h = interpolate(f, [jolt, jolt + 2, jolt + 10], [0, 1, 0], cl);
  const sx = Math.sin(f * 3.3) * 8 * h, sy = Math.cos(f * 2.7) * 5 * h;
  const dim = io(interpolate(f, [0, 20], [0, 1], cl));
  const cxp = ox + center[0] * iw * k, cyp = oy + center[1] * ih * k, RX = rx * iw * k, RY = ry * ih * k;
  const mask = `radial-gradient(ellipse ${RX}px ${RY}px at ${cxp}px ${cyp}px, #000 55%, transparent 100%)`;
  const id = `am18w_${f}`;
  const pic = (st: React.CSSProperties) => <Img src={staticFile(src)} style={{ position: "absolute", left: 0, top: 0, width: iw, height: ih, transformOrigin: "0 0",
    transform: `translate3d(${(ox + sx).toFixed(3)}px, ${(oy + sy).toFixed(3)}px, 0) scale3d(${k.toFixed(5)}, ${k.toFixed(5)}, 1)`, ...st }} />;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      {pic({ filter: `brightness(${1 - 0.55 * dim}) saturate(${1 - 0.6 * dim})` })}
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <filter id={id} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.006 0.03" numOctaves={2} seed={3} result="n">
          </feTurbulence>
          <feOffset in="n" dx={0} dy={(f * 1.6) % 400} result="m" />
          <feDisplacementMap in="SourceGraphic" in2="m" scale={9} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      <AbsoluteFill style={{ WebkitMaskImage: mask, maskImage: mask, opacity: dim, filter: `url(#${id})` }}>{pic({ filter: "brightness(1.05)" })}</AbsoluteFill>
    </AbsoluteFill>
  );
};
