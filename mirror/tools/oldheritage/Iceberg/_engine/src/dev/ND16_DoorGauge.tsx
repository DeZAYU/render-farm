// ND16 device: the survey's "five to eight feet" measured on the pawn shop's own glass doors. A frame of the case footage (the pavers piled
// against the sill), slow push; a white foot-ruler stands on the door track, calibrated from the sill to the door handle (~3 ft); a pale
// water line climbs to the 5 ft tick on "five" and to 8 ft on "eight" — above the handle the filmers kept watching, near the top of the doors.
// Coordinates are in the 1920x1080 frame of assets door168 (source 1280x720 x1.5): sill y 627, handle y 412 -> 71.5 px per foot.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED, RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);
const SILL = 627, PXFT = 71.5, RX = 640;

export const DoorGauge: React.FC<{ src: string; fiveAt: number; eightAt: number }> = ({ src, fiveAt, eightAt }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames: D } = useVideoConfig();
  const s = 1.0 + 0.07 * io(f / D);
  const ruler = out(interpolate(f, [4, 22], [0, 1], cl));
  const ft = interpolate(f, [8, fiveAt, fiveAt + 6, eightAt, eightAt + 24], [0, 5, 5, 5, 8], { ...cl, easing: io });
  const lvl = SILL - ft * PXFT + Math.sin(f / 6) * 3;
  const lab = (n: number, at: number) => { const g = out(interpolate(f, [at, at + 10], [0, 1], cl)); const y = SILL - n * PXFT;
    return g > 0 && <g opacity={g}><line x1={RX - 60} y1={y} x2={RX + 60 * g} y2={y} stroke={RED} strokeWidth={6} />
      <text x={RX + 78} y={y + 14} fill="#fff" fontFamily="ArchivoBlk" fontWeight={900} fontSize={40} style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,.85))" }}>{n} FT</text></g>; };
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale3d(${s}, ${s}, 1)`, transformOrigin: `${RX}px ${SILL - 3 * PXFT}px` }}>
        <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(1.08)" }} />
        <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
          {/* the water: pale band from the sill to the level, bright line on top */}
          <rect x={0} y={lvl} width={width} height={Math.max(0, SILL + 40 - lvl)} fill="rgba(170,205,225,.30)" />
          <line x1={0} y1={lvl} x2={width} y2={lvl} stroke="#fff" strokeWidth={4} opacity={ft > 0.1 ? 0.95 : 0} />
          {/* the ruler */}
          <g opacity={ruler}>
            <line x1={RX} y1={SILL} x2={RX} y2={SILL - 8.4 * PXFT * ruler} stroke="#fff" strokeWidth={5} style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,.8))" }} />
            {Array.from({ length: 9 }, (_, i) => i).map((i) => <line key={i} x1={RX - (i % 4 === 0 ? 26 : 14)} y1={SILL - i * PXFT} x2={RX} y2={SILL - i * PXFT} stroke="#fff" strokeWidth={4} opacity={SILL - i * PXFT >= SILL - 8.4 * PXFT * ruler ? 1 : 0} />)}
          </g>
          {lab(5, fiveAt)}
          {lab(8, eightAt)}
        </svg>
      </AbsoluteFill>
      <RedLabel text=" " at={100000} />{/* loads the brand fonts for the tick labels */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 75% at 45% 45%, rgba(0,0,0,0) 50%, rgba(0,0,0,.5) 100%)" }} />
    </AbsoluteFill>
  );
};
