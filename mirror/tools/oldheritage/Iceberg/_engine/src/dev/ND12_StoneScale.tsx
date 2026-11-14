// ND12 StoneScale: the logged stones at true relative size against the NWS hail-size reference objects, over a dim freeze of the hail
// on Preston's car. An inch ruler is drawn; the 2.00 in stone (hen egg) and the 2.75 in stone (baseball) drop onto it as white discs at
// the same scale (px per inch fixed), each with its reference object named (NWS hail size chart: 2.00 = hen egg, 2.75 = baseball).
// Built for "The weather service logged hailstones two to two and three quarter inches across."
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const out = Easing.bezier(0.16, 1, 0.3, 1), io = Easing.bezier(0.45, 0, 0.2, 1);

export const ND12_StoneScale: React.FC<{ freeze: string; aAt: number; bAt: number; aLabel: string; bLabel: string }> = ({ freeze, aAt, bAt, aLabel, bLabel }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const PPI = 190; // px per inch
  const Y = 760, X0 = 420;
  const rul = io(interpolate(f, [0, 16], [0, 1], cl));
  const a = out(interpolate(f, [aAt, aAt + 14], [0, 1], cl)), b = out(interpolate(f, [bAt, bAt + 14], [0, 1], cl));
  const disc = (cx: number, d: number, k: number) => (
    <g opacity={k} transform={`translate(${cx} ${Y - d * PPI / 2 - 10 - (1 - k) * 120})`}>
      <circle r={d * PPI / 2} fill="rgba(232,240,246,.9)" stroke="#fff" strokeWidth={4} />
      <circle r={d * PPI / 2 * 0.62} fill="none" stroke="rgba(150,170,185,.8)" strokeWidth={3} />
      <circle r={d * PPI / 2 * 0.3} fill="none" stroke="rgba(150,170,185,.8)" strokeWidth={3} />
      <line x1={-d * PPI / 2} y1={d * PPI / 2 + 34} x2={d * PPI / 2} y2={d * PPI / 2 + 34} stroke="#fff" strokeWidth={4} />
      <line x1={-d * PPI / 2} y1={d * PPI / 2 + 22} x2={-d * PPI / 2} y2={d * PPI / 2 + 46} stroke="#fff" strokeWidth={4} />
      <line x1={d * PPI / 2} y1={d * PPI / 2 + 22} x2={d * PPI / 2} y2={d * PPI / 2 + 46} stroke="#fff" strokeWidth={4} />
    </g>
  );
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Img src={staticFile(freeze)} style={{ position: "absolute", inset: 0, width, height, objectFit: "cover", transform: `scale(${1.05 + 0.05 * f / durationInFrames})`, filter: "brightness(.36) saturate(.6) blur(3px)" }} />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0, filter: "drop-shadow(0 3px 8px rgba(0,0,0,.6))" }}>
        {/* the inch ruler */}
        <line x1={X0} y1={Y + 70} x2={X0 + 6 * PPI * rul} y2={Y + 70} stroke="#fff" strokeWidth={4} />
        {Array.from({ length: 25 }, (_, i) => i).filter((i) => i / 4 <= 6 * rul).map((i) => (
          <g key={i}><line x1={X0 + i / 4 * PPI} y1={Y + 70} x2={X0 + i / 4 * PPI} y2={Y + 70 + (i % 4 === 0 ? 30 : 14)} stroke="#fff" strokeWidth={i % 4 === 0 ? 4 : 2} />
            {i % 4 === 0 && <text x={X0 + i / 4 * PPI} y={Y + 136} fill="rgba(255,255,255,.85)" fontFamily="ArchivoBlk" fontWeight={800} fontSize={30} textAnchor="middle">{i / 4} IN</text>}</g>))}
        {disc(X0 + 1.0 * PPI, 2.0, a)}
        {disc(X0 + 3.625 * PPI, 2.75, b)}
      </svg>
      <RedLabel text={aLabel} at={aAt + 8} x={(X0 + 1.0 * PPI) / width} y={0.12} size={38} />
      <RedLabel text={bLabel} at={bAt + 8} x={(X0 + 3.625 * PPI) / width} y={0.12} size={38} />
    </AbsoluteFill>
  );
};
