// DC02 VergeLight: the dashcam held on the frame where the car is almost stopped beside the bus; the street sinks into shade except a
// long soft pool of light lying along the left verge and the road edge (where the men are about to come from); the camera eases toward
// it, then the shade lifts so the raw can run on from this exact frame. No text.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Cam, type CK, cl, io } from "./DC01_kit";

export const VergeLight: React.FC<{
  src: string; t: number; keys: CK[];
  pool: { x: number; y: number; rx: number; ry: number; rot: number }; // ellipse in picture fractions (rx/ry of the picture size)
  inAt: number; inLen: number; outAt: number; outLen: number; dim?: number;
}> = ({ src, t, keys, pool, inAt, inLen, outAt, outLen, dim = 0.72 }) => {
  const f = useCurrentFrame();
  const a = io(interpolate(f, [inAt, inAt + inLen], [0, 1], cl)) * (1 - io(interpolate(f, [outAt, outAt + outLen], [0, 1], cl)));
  const shade = (
    <AbsoluteFill style={{ opacity: a }}>
      <svg width="100%" height="100%" viewBox="0 0 1000 1000" preserveAspectRatio="none" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id="vl_g" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#000" /><stop offset="0.55" stopColor="#000" stopOpacity={0.9} /><stop offset="1" stopColor="#000" stopOpacity={0} />
          </radialGradient>
          <mask id="vl_m">
            <rect width="1000" height="1000" fill="#fff" />
            <ellipse cx={pool.x * 1000} cy={pool.y * 1000} rx={pool.rx * 1000} ry={pool.ry * 1000} fill="url(#vl_g)" transform={`rotate(${pool.rot} ${pool.x * 1000} ${pool.y * 1000})`}
/>
          </mask>
        </defs>
        <rect width="1000" height="1000" fill={`rgba(4,6,10,${dim})`} mask="url(#vl_m)" />
      </svg>
    </AbsoluteFill>
  );
  return <Cam src={src} t={t} keys={keys} layers={shade} filter={`saturate(${1 - 0.25 * a})`} />;
};
