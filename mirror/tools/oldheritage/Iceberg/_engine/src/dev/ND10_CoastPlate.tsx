// ND10 CoastPlate: the 2011 hit coast on NASA's Blue Marble relief + bathymetry plate (GIBS, public domain), tilted in perspective.
// The camera glides north along the Pacific coast of Tohoku while the hit coastline is traced in white (Choshi -> Hachinohe), and lands on
// Hachinohe at the coast's northern end: pin + red label. Built for "Hachinohe, in Aomori Prefecture, sits at the northern end of the coast
// that was hit." Plate px: x = (lon - 138.5) * 320, y = (42 - lat) * 320 (3040 x 2080, bbox 35.5-42N, 138.5-148E).
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED, RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);
const P = (lat: number, lon: number): [number, number] => [(lon - 138.5) * 320, (42 - lat) * 320];
// the Pacific coast that the 2011 tsunami hit, south -> north (town coordinates on the shore)
const COAST: [number, number][] = [
  [35.71, 140.86], [36.31, 140.58], [36.79, 140.75], [36.95, 140.92], [37.42, 141.04], [37.8, 140.98], [38.08, 140.89], [38.22, 140.99],
  [38.35, 141.06], [38.4, 141.3], [38.44, 141.46], [38.6, 141.5], [38.9, 141.62], [39.06, 141.73], [39.27, 141.89], [39.46, 141.97],
  [39.64, 141.98], [39.73, 141.97], [40.0, 141.88], [40.19, 141.8], [40.36, 141.66], [40.52, 141.52],
].map(([a, b]) => P(a, b));
const HACHI = P(40.52, 141.52);

export const ND10_CoastPlate: React.FC<{ src: string; iw?: number; ih?: number; drawAt?: number; drawLen?: number; pinAt?: number; label: string }> = ({ src, iw = 3040, ih = 2080, drawAt = 6, drawLen = 92, pinAt = 100, label }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const t = io(interpolate(f, [0, durationInFrames - 1], [0, 1], cl));
  const s0 = P(38.25, 141.2);
  const cx = s0[0] + (HACHI[0] - s0[0]) * t, cy = s0[1] + (HACHI[1] - s0[1]) * t;
  const sc = 0.62 + 0.5 * t, tilt = 48 - 12 * t, rz = -10 + 6 * t;
  const g = io(interpolate(f, [drawAt, drawAt + drawLen], [0, 1], cl));
  const pin = out(interpolate(f, [pinAt, pinAt + 12], [0, 1], cl));
  const d = "M" + COAST.map((p) => p.map((v) => v.toFixed(1)).join(" ")).join(" L");
  const o = interpolate(f, [0, 8], [0, 1], cl);
  return (
    <AbsoluteFill style={{ background: "#03060a", overflow: "hidden", perspective: 1500, perspectiveOrigin: "50% 38%", opacity: o }}>
      <div style={{ position: "absolute", left: width / 2, top: height * 0.56, width: iw, height: ih, transformOrigin: "0 0",
        transform: `rotateX(${tilt.toFixed(3)}deg) rotateZ(${rz.toFixed(3)}deg) scale(${sc.toFixed(4)}) translate(${(-cx).toFixed(2)}px, ${(-cy).toFixed(2)}px)` }}>
        <Img src={staticFile(src)} style={{ position: "absolute", inset: 0, width: iw, height: ih, filter: "brightness(1.38) contrast(1.06) saturate(1.05)" }} />
        <svg width={iw} height={ih} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <path d={d} fill="none" stroke="rgba(0,0,0,.5)" strokeWidth={16 / sc} pathLength={1} strokeDasharray={`${g} 1`} strokeLinecap="round" strokeLinejoin="round" />
          <path d={d} fill="none" stroke="#fff" strokeWidth={7 / sc} pathLength={1} strokeDasharray={`${g} 1`} strokeLinecap="round" strokeLinejoin="round" />
          {pin > 0 && <g opacity={pin}>
            <circle cx={HACHI[0]} cy={HACHI[1]} r={(46 * (1.6 - 0.6 * pin)) / sc} fill="none" stroke="#fff" strokeWidth={4 / sc} />
            <circle cx={HACHI[0]} cy={HACHI[1]} r={15 / sc} fill={RED} stroke="#fff" strokeWidth={4 / sc} />
          </g>}
        </svg>
      </div>
      {/* depth haze toward the horizon so the tilted plate reads as a landscape, not a flat card */}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(3,6,10,1) 0%, rgba(3,6,10,.92) 18%, rgba(3,6,10,.25) 32%, rgba(3,6,10,0) 46%, rgba(0,0,0,0) 80%, rgba(0,0,0,.45) 100%)" }} />
      <RedLabel text={label} at={pinAt + 6} x={0.5} y={0.42} />
    </AbsoluteFill>
  );
};
