// lookhere / WatchZone (set dash2, Dashcam "INSTRUMENT" H1): a live spotlight. REF Caving @29:47.6-29:54.4 (ring + the frame dims L 87 -> 44,
// x0.5, over 12 f, release 18 f) + Farrell FV PG7 CC @4:31.3-4:37.3 (the rest dims to x0.17 in 0.5 s around the block that matters) + Farrell
// FB F7 V5 @21:32.3 (soft iris, diameter 0.5 W, feather 0.15 W).
// Ours: on "keep your eye on the wheel / roofline" everything OUTSIDE a feathered zone dims to x0.45 over 12 f while the clip keeps playing at 1x
// (no freeze, no ring). The zone tracks the subject (keys in SOURCE px, the linear footage push applied) and releases in 18 f on `releaseAt`
// (the impact frame: the clip's own sound carries it, so the device is silent).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { EZ, clamp01, linPush, type Theme } from "../../core";
import { FootPlate, type TrackKey, scr, trackAt } from "../../core/kits/labels";

export type WatchZoneProps = {
  media: string; mediaStart?: number; push?: number;
  zone: TrackKey[]; // zone centre per frame (source px); r = lit radius (source px), default 0.25 W (FB F7 diameter 0.5 W)
  r?: number; // lit radius (source px) when the keys carry no r (FB F7: 0.25 W = 480)
  aspect?: number; // ry / rx of the zone ellipse (road shots: wider than tall)
  feather?: number; // feather width in source px (FB F7: 0.15 W = 288)
  at: number; // local frame of "keep your eye on..." (dim starts)
  dim?: number; // brightness outside the zone (CV x0.5 measured; ours x0.45)
  dimFrames?: number; // CV 12 f
  releaseAt?: number; // impact frame: the dim releases from here
  releaseFrames?: number; // CV 18 f
  theme?: Theme; // accepted for API symmetry (the device has no colour of its own)
};

export const WatchZone: React.FC<WatchZoneProps> = ({ media, mediaStart = 0, push = 0.045, zone, r = 480, aspect = 0.72, feather = 288, at, dim = 0.45, dimFrames = 12, releaseAt, releaseFrames = 18 }) => {
  const f = useCurrentFrame();
  const s = linPush(f, push);
  const z = trackAt(zone, f);
  const c = scr(z, s);
  const rx = (zone.some((q) => q.r !== undefined) ? z.r : r) * s, ry = rx * aspect, fe = feather * s;
  // in: eased 12 f; out: eased 18 f from the impact
  const inU = EZ.out2((f - at) / dimFrames);
  const outU = releaseAt === undefined ? 0 : EZ.inout((f - releaseAt) / releaseFrames);
  const amt = clamp01(inU * (1 - outU)) * (1 - dim); // black overlay alpha = 1 - brightness
  const innerPct = (100 * rx) / (rx + fe);
  return (
    <FootPlate src={media} startFrom={mediaStart} push={push}>
      {amt > 0.001 ? (
        <AbsoluteFill
          style={{
            pointerEvents: "none",
            background: `radial-gradient(ellipse ${(rx + fe).toFixed(1)}px ${(ry + fe * aspect).toFixed(1)}px at ${c.x.toFixed(1)}px ${c.y.toFixed(1)}px, rgba(0,0,0,0) 0%, rgba(0,0,0,0) ${innerPct.toFixed(2)}%, rgba(0,0,0,${(amt * 0.55).toFixed(4)}) ${((innerPct + 100) / 2).toFixed(2)}%, rgba(0,0,0,${amt.toFixed(4)}) 100%)`,
          }}
        />
      ) : null}
    </FootPlate>
  );
};
