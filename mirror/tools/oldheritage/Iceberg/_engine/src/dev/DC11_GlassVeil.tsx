// DC11 GlassVeil: the side camera's close-up of the man at the van window, held still. Breath-like condensation spreads across the
// glass from his (already blurred) face outward with a soft, uneven edge, until only a shape is left behind a fogged window: the man
// nobody ever named. Slow push. No text.
import React from "react";
import { AbsoluteFill, Freeze, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from "remotion";
import { camAt, placeOf, type CK, cl, io } from "./DC01_kit";

export const GlassVeil: React.FC<{ src: string; t: number; from: [number, number]; at: number; len: number; keys: CK[] }> = ({ src, t, from, at, len, keys }) => {
  const f = useCurrentFrame();
  const p = placeOf(camAt(f, keys));
  const g = io(interpolate(f, [at, at + len], [0, 1], cl));
  const R = 8 + 150 * g; // % radius of the fogged area
  const id = "gv" + Math.round(t * 100);
  const pic = (filter: string) => (
    <Freeze frame={0}><OffthreadVideo src={staticFile(src)} startFrom={Math.round(t * 30)} muted style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", filter }} /></Freeze>
  );
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: p.left, top: p.top, width: p.w, height: p.h }}>
        {pic("none")}
        <svg width="100%" height="100%" viewBox="0 0 1000 562" preserveAspectRatio="none" style={{ position: "absolute", inset: 0 }}>
          <defs>
            <filter id={id + "e"} x="-20%" y="-20%" width="140%" height="140%">
              <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves={3} seed={7} />
              <feDisplacementMap in="SourceGraphic" scale={110} xChannelSelector="R" yChannelSelector="G" />
              <feGaussianBlur stdDeviation={14} />
            </filter>
            <mask id={id + "m"}>
              <ellipse cx={from[0] * 1000} cy={from[1] * 562} rx={R * 6} ry={R * 4.4} fill="#fff" filter={`url(#${id}e)`} opacity={g > 0 ? 1 : 0} />
            </mask>
            <filter id={id + "n"}><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={3} /><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.5 0" /></filter>
          </defs>
          <g mask={`url(#${id}m)`}>
            <foreignObject x={0} y={0} width={1000} height={562}>
              <div style={{ width: 1000, height: 562, position: "relative", overflow: "hidden" }}>{pic("blur(9px) brightness(1.18) saturate(0.55) contrast(0.8)")}</div>
            </foreignObject>
            <rect x={0} y={0} width={1000} height={562} fill="rgba(215,222,228,0.22)" />
            <rect x={0} y={0} width={1000} height={562} filter={`url(#${id}n)`} opacity={0.12} />
          </g>
        </svg>
      </div>
    </AbsoluteFill>
  );
};
