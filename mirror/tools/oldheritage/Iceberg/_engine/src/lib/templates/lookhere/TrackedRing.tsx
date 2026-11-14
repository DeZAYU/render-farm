// lookhere / TrackedRing: REF Dashcam Vol.1 E5 tracked ring @0:08.45-0:09.30 (pickup truck) and @15:38-15:48 (plane): core ~7 px #C8060A + a soft
// ~5 px glow (#E54A48 -> transparent); STROKE DRAW-ON clockwise from 12 o'clock in 5-6 f (160/270/320/350/360 deg per frame); the centre FOLLOWS
// the object every frame and the radius scales with it; exit = opacity fade in 3 f; lands on the noun that names the hazard.
// wp3 Intro3 TrackedRing (Dadifeng raft @ abs 23). `track` keys are source px; the footage push is applied to them.
import React from "react";
import { useCurrentFrame } from "remotion";
import { DrawRing, clamp01, linPush } from "../../core";
import { FootPlate, type TrackKey, scr, trackAt } from "../labels/kit";

export type TrackedRingProps = { media: string; mediaStart?: number; push?: number; track: TrackKey[]; at: number; outAt?: number; r?: number; core?: number; ry?: number };
export const TrackedRing: React.FC<TrackedRingProps> = ({ media, mediaStart = 0, push = 0.045, track, at, outAt, r, core = 7, ry }) => {
  const f = useCurrentFrame();
  const s = linPush(f, push);
  const a = trackAt(track, f);
  const p = scr(a, s);
  const R = (r ?? a.r) * s;
  const o = outAt === undefined ? 1 : 1 - clamp01((f - outAt) / 3);
  return (
    <FootPlate src={media} startFrom={mediaStart} push={push}>
      {f >= at && o > 0 ? <div style={{ position: "absolute", inset: 0, opacity: o }}><DrawRing k={f - at} x={p.x} y={p.y} r={R} ry={ry !== undefined ? ry * s : undefined} core={core} /></div> : null}
    </FootPlate>
  );
};
