// TP19 RoofLift: the same corner on two NYS orthophotos (spring 2008 / spring 2012, same export box) lying in 3-D. The arcade's
// footprint is outlined on 2008; on "taken down" its roof is cut out of the photo, lifts off the ground as its own plate (shadow
// left below) and fades, uncovering the bare 2012 slab; then the rest of the ground turns to 2012 as well. Year labels name the
// photo dates. Coordinates are image px of the 3200x1800 exports.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);
const IW = 3200, IH = 1800;

export const RoofLift: React.FC<{ before: string; after: string; foot: [number, number, number, number]; liftAt: number; swapAt: number; beforeLabel: string; afterLabel: string }> = ({ before, after, foot, liftAt, swapAt, beforeLabel, afterLabel }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames: N } = useVideoConfig();
  const u = io(interpolate(f, [0, N], [0, 1], cl));
  const cx = (foot[0] + foot[2]) / 2, cy = (foot[1] + foot[3]) / 2;
  const z = 2.35 + 0.25 * u, tilt = 38 + 12 * u, rot = -9 + 7 * u;
  const plane = `translate(${width / 2}px, ${height * 0.54}px) rotateX(${tilt}deg) rotateZ(${rot}deg) scale(${z}) translate(${-cx}px, ${-cy}px)`;
  const gBox = out(interpolate(f, [6, 22], [0, 1], cl));
  const L = io(interpolate(f, [liftAt, liftAt + 34], [0, 1], cl));
  const gone = interpolate(f, [liftAt + 20, liftAt + 40], [1, 0], cl);
  const swap = io(interpolate(f, [swapAt, swapAt + 20], [0, 1], cl));
  const clip = `polygon(${foot[0]}px ${foot[1]}px, ${foot[2]}px ${foot[1]}px, ${foot[2]}px ${foot[3]}px, ${foot[0]}px ${foot[3]}px)`;
  const w = foot[2] - foot[0], h = foot[3] - foot[1], P = 2 * (w + h), sw = 1 / z;
  const full: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: IW, height: IH };
  return (
    <AbsoluteFill style={{ background: "#0b0d10", overflow: "hidden", perspective: 1400, perspectiveOrigin: "50% 30%" }}>
      <div style={{ ...full, transformOrigin: "0 0", transform: plane, transformStyle: "preserve-3d" }}>
        <Img src={staticFile(after)} style={{ ...full }} />
        <Img src={staticFile(before)} style={{ ...full, opacity: 1 - swap, clipPath: undefined, WebkitMaskImage: undefined }} />
        {/* the footprint shows 2012 underneath as soon as the roof leaves */}
        <Img src={staticFile(after)} style={{ ...full, clipPath: clip, opacity: L > 0 ? 1 : 0 }} />
        {L > 0 && <div style={{ position: "absolute", left: foot[0], top: foot[1], width: w, height: h, background: "rgba(0,0,0,.45)", filter: `blur(${6 + 18 * L}px)`, opacity: gone * (1 - 0.5 * L) }} />}
        <svg width={IW} height={IH} style={{ ...full }}>
          <rect x={foot[0]} y={foot[1]} width={w} height={h} fill="none" stroke="rgba(0,0,0,.5)" strokeWidth={10 * sw} strokeDasharray={P} strokeDashoffset={P * (1 - gBox)} />
          <rect x={foot[0]} y={foot[1]} width={w} height={h} fill="none" stroke="#fff" strokeWidth={5 * sw} strokeDasharray={P} strokeDashoffset={P * (1 - gBox)} />
        </svg>
        {/* the roof plate: cut from the 2008 photo, lifts straight up and turns away */}
        <div style={{ ...full, transformOrigin: `${cx}px ${cy}px`, transform: `translateZ(${L * 260}px) rotateX(${L * 14}deg) rotateZ(${L * 10}deg)`, opacity: gone }}>
          <Img src={staticFile(before)} style={{ ...full, clipPath: clip, filter: `brightness(${1 + 0.15 * L})` }} />
          <svg width={IW} height={IH} style={{ ...full }}>
            <rect x={foot[0]} y={foot[1]} width={w} height={h} fill="none" stroke="#fff" strokeWidth={5 * sw} opacity={gBox} />
          </svg>
        </div>
      </div>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(8,10,12,.8) 0%, rgba(8,10,12,.2) 24%, rgba(0,0,0,0) 42%, rgba(0,0,0,0) 82%, rgba(0,0,0,.35) 100%)" }} />
      <RedLabel text={beforeLabel} at={10} hold={swapAt - 10} x={0.5} y={0.88} />
      <RedLabel text={afterLabel} at={swapAt + 8} x={0.5} y={0.88} />
    </AbsoluteFill>
  );
};
