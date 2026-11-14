// lookhere / FreezeCircle: REF Dashcam Vol.3 E3 red circle on a freeze @0:51.77-0:52.63 (case 2: the black car; "freeze-and-circle at 51.8")
// + E3 geometry/draw (hand-drawn #E30A10 ring, no fill, brush-like, taper-ended, radius 0.10-0.43 H enclosing the subject with 15-30 % margin;
// draw clockwise from ~1 o'clock, peak ~70 deg/f at k4-5, closed in ~12 f; SCALE SETTLE r/r_end 1.23 -> 0.966 over k0-22 then +4 % over 1.3 s;
// NOT tracked; fade 12-20 f ease-in) + E10 freeze (one frame held 26-31 f, static under a circle; resume with a hard continue).
// Contrast with FreezePunch: no zoom, no flash, a brush ring and a short freeze. Draws on the noun naming the subject.
import React from "react";
import { useCurrentFrame } from "remotion";
import { EZ, clamp01 } from "../../core";
import { FootPlate } from "../labels/kit";
import { BrushRing, brushDraw } from "./shared";

export type FreezeCircleProps = { media: string; mediaStart?: number; push?: number; freezeAt: number; hold?: number; at?: number; x: number; y: number; r: number; fadeAt?: number; stroke?: number; seed?: number };
export const FreezeCircle: React.FC<FreezeCircleProps> = ({ media, mediaStart = 0, push = 0.045, freezeAt, hold = 30, at, x, y, r, fadeAt, stroke = 18, seed = 2 }) => {
  const f = useCurrentFrame();
  const a = at ?? freezeAt;
  const k = f - a;
  const resume = freezeAt + hold;
  const fa = fadeAt ?? resume + 6;
  // static camera on the freeze (D3: 0.08 %/s), the Dashcam push before and after (scale continuous)
  const t = f / 30, tf = freezeAt / 30, tr = resume / 30;
  const sc = f < freezeAt ? 1 + push * t : f < resume ? 1 + push * tf : 1 + push * (tf + (t - tr));
  const settle = k < 22 ? 1.23 + (0.966 - 1.23) * EZ.out2(k / 22) : 0.966 + 0.034 * EZ.out2((k - 22) / 39);
  const o = 1 - EZ.in2(clamp01((f - fa) / 15));
  return (
    <FootPlate src={media} startFrom={mediaStart} push={0} base={sc} freezeAt={freezeAt} resumeAt={resume}>
      {k >= 0 && o > 0 ? <BrushRing cx={x} cy={y} r={r * settle} p={brushDraw(k + 1)} stroke={stroke} seed={seed} opacity={o} /> : null}
    </FootPlate>
  );
};
