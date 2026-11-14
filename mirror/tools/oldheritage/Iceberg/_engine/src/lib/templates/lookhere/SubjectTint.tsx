// lookhere / SubjectTint: REF Dashcam Vol.2 E14 red subject tint @13:01-13:07 and 14:01-14:08 (a TRACKED MASK over the car filled with ADDITIVE
// red glow ~R+120; ramps in over ~1.0 s as the subject enters, then CUTS OFF IN 1 FRAME; it turns "that car" into the villain before the
// narration names it). OUR VERSION: a feathered elliptical mask (rx, ry in source px, scaled with the push) with additive red (plus-lighter),
// plus a faint red rim so the shape reads on bright footage. Use for a subject that is about to matter (no ring, no text).
import React from "react";
import { useCurrentFrame } from "remotion";
import { clamp01, linPush } from "../../core";
import { FootPlate, type TrackKey, scr, trackAt } from "../labels/kit";

export type SubjectTintProps = { media: string; mediaStart?: number; push?: number; track: TrackKey[]; at: number; ramp?: number; outAt?: number; rx?: number; ry?: number;
  /** additive strength: 120 = the measured D2 red (~R+120). With `colour`, gain scales its opacity (120 = full) */ gain?: number;
  /** tint colour: an RGB triple "r,g,b" or any CSS colour. Default = the D2 additive red. NEVER tint a PERSON red (reads as blood, M-rule):
   *  use a neutral/cool colour for people (e.g. "120,170,255"). */ colour?: string };
export const SubjectTint: React.FC<SubjectTintProps> = ({ media, mediaStart = 0, push = 0.045, track, at, ramp = 30, outAt, rx = 260, ry = 150, gain = 120, colour }) => {
  const f = useCurrentFrame();
  const s = linPush(f, push);
  const p = scr(trackAt(track, f), s);
  const on = f >= at && (outAt === undefined || f < outAt);
  const a = on ? clamp01((f - at + 1) / ramp) : 0;
  const RX = rx * s, RY = ry * s;
  const m = "radial-gradient(closest-side, #000 55%, rgba(0,0,0,.5) 80%, rgba(0,0,0,0) 100%)";
  return (
    <FootPlate src={media} startFrom={mediaStart} push={push}>
      {a > 0 ? (
        <div style={{ position: "absolute", left: p.x - RX, top: p.y - RY, width: 2 * RX, height: 2 * RY, background: colour === undefined ? `rgba(${gain},0,${Math.round(gain * 0.04)},${a.toFixed(3)})` : /^\s*\d+\s*,\s*\d+\s*,\s*\d+\s*$/.test(colour) ? `rgba(${colour},${(a * Math.min(2, gain / 120)).toFixed(3)})` : colour,
          opacity: colour !== undefined && !/^\s*\d+\s*,/.test(colour) ? a * Math.min(2, gain / 120) : undefined,
          mixBlendMode: "plus-lighter", WebkitMaskImage: m, maskImage: m }} />
      ) : null}
    </FootPlate>
  );
};
