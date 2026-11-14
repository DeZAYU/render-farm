// lookhere / TrackedArrow: REF Dashcam Vol.2 E3 red arrow @0:07.88-0:09.70 and 0:20.6 (solid BLOCK arrow pointing DOWN at the subject, shaft
// 30 x ~180 px, head 66-75 x 55, total ~240 px (0.22 H), tilted ~2 deg, soft 2-3 px glow, rgb(230,1,2); appears IN PLACE (opacity steps over
// 0.10-0.17 s, no scale pop, no slide); POSITION TRACKED to the subject; out in 0.08-0.10 s; life 1.0-1.8 s; lands <= 0.1 s after its noun).
// `track` = the subject's top point (source px); the arrow tip sits `gap` px above it.
import React from "react";
import { useCurrentFrame } from "remotion";
import { linPush } from "../../core";
import { FootPlate, type TrackKey, scr, trackAt } from "../labels/kit";
import { BlockArrow } from "./shared";

export type TrackedArrowProps = { media: string; mediaStart?: number; push?: number; track: TrackKey[]; at: number; outAt?: number; gap?: number; size?: number; tilt?: number };
const IN = [0.6, 0.7, 0.8, 0.85, 1], OUT = [0.94, 0.78, 0.6, 0];
export const TrackedArrow: React.FC<TrackedArrowProps> = ({ media, mediaStart = 0, push = 0.045, track, at, outAt, gap = 24, size = 1, tilt = 2 }) => {
  const f = useCurrentFrame();
  const s = linPush(f, push);
  const p = scr(trackAt(track, f), s);
  const k = f - at;
  const o = k < 0 ? 0 : outAt !== undefined && f >= outAt ? OUT[Math.min(3, Math.floor(f - outAt))] : IN[Math.min(4, Math.floor(k))];
  return (
    <FootPlate src={media} startFrom={mediaStart} push={push}>
      {o > 0 ? <BlockArrow x={p.x} y={p.y - gap} scale={size} tilt={tilt} opacity={o} /> : null}
    </FootPlate>
  );
};
