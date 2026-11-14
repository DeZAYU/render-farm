// IN16 BlindWater: the deck camera frozen a split second before the hit. Everything drains to cold grey except a soft pool of colour on
// the patch of choppy water just ahead of the bow, where the boat is about to strike something nobody could see; the camera eases in
// on that empty water (nothing drawn: what he hit was never confirmed). On `releaseAt` the colour floods back and the clip runs on at
// half speed into the burst of spray (from a 60 fps copy when given, so the slow motion has real frames).
import React from "react";
import { AbsoluteFill, Easing, Freeze, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { camAt, placeOf, type CK } from "./DC01_kit";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1);

export const BlindWater: React.FC<{ src: string; t: number; keys: CK[]; spot: [number, number, number, number]; drainAt: number; releaseAt: number; n: number; slow?: string; slowT?: number }> =
  ({ src, t, keys, spot, drainAt, releaseAt, n, slow, slowT = 0 }) => {
  const f = useCurrentFrame();
  const p = placeOf(camAt(f, keys));
  const drain = io(interpolate(f, [drainAt, drainAt + 30], [0, 1], cl)) * (1 - io(interpolate(f, [releaseAt - 4, releaseAt + 10], [0, 1], cl)));
  const [sx, sy, rw, rh] = spot; // centre + radii as fractions of the picture
  const st: React.CSSProperties = { position: "absolute", left: p.left, top: p.top, width: p.w, height: p.h };
  const mask = `radial-gradient(${rw * p.w}px ${rh * p.h}px at ${p.left + sx * p.w}px ${p.top + sy * p.h}px, rgba(0,0,0,0) 35%, #000 100%)`;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Sequence durationInFrames={releaseAt} layout="none">
        <Freeze frame={0}><OffthreadVideo src={staticFile(src)} startFrom={Math.round(t * 30)} muted style={st} /></Freeze>
        <AbsoluteFill style={{ opacity: drain, WebkitMaskImage: mask, maskImage: mask }}>
          <Freeze frame={0}><OffthreadVideo src={staticFile(src)} startFrom={Math.round(t * 30)} muted style={{ ...st, filter: "grayscale(1) brightness(0.55) contrast(0.95)" }} /></Freeze>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={releaseAt} durationInFrames={Math.max(1, n - releaseAt)} layout="none">
        <OffthreadVideo src={staticFile(slow ?? src)} startFrom={Math.round((slow ? slowT : t) * 30)} playbackRate={0.5} muted style={st} />
      </Sequence>
    </AbsoluteFill>
  );
};
