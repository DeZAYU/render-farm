// set "midway" (Amusement Park "MIDWAY AFTER DARK", 2026-10-18). Merged into index.ts by the lead.
import type { VariantDef } from "../../core";
import { RideTrace } from "./RideTrace";

export const extra: VariantDef[] = [
  {
    family: "lookhere", name: "RideTrace", component: RideTrace, durationInFrames: 110, thumbFrame: 48, stripFrames: [10, 14, 18, 26, 44, 50, 56, 92],
    defaultProps: {
      media: "demo/clip_park.mp4", at: 12, failAt: 44, releaseAt: 90,
      outline: [
        { pts: [[520, 860], [700, 420], [880, 860]] },
        { pts: [[1040, 860], [1220, 420], [1400, 860]] },
        { pts: [[700, 420], [1220, 420]] },
      ],
      fail: { pts: [[1220, 420], [1310, 640], [1400, 860]] },
    },
    ref: "Visual Venture E14 @12:52 (line-art outline traced over dimmed footage) + Farrell FA evidence E1 @IG 2:47.5 (one element per noun) + VV §7 colour = meaning @19:26.4 + Dashcam Vol.3 E3 draw bez(0.45,0,0.35,1) + Dashcam Vol.1 E6 4 f flash release @3:03.0; REFERENCE_SYNTHESIS §I3 AP-1 / §I4 #1",
    when: "MIDWAY signature look-here on ride structure ('keep your eye on the pylons', the arm / cord / track that fails). Objects only, never people (M-058). One per big case.",
    props: "media, mediaStart, push, outline [{pts:[x,y][] source px, closed}], fail (segment), at, failAt, releaseAt, live, track, dim, stroke, drawDur, theme, fire",
    twist: "the ride's own geometry traced in the accent over the real frozen frame; the failing segment pulses white <-> accent twice on its word, then a 4 f flash back to live",
    sfx: [{ event: "white_flash_hit", at: 90, note: "release flash; the draw and pulse are silent like the refs" }],
    axes: { geometry: "polyline trace of the ride structure", entry: "freeze + 12 f staggered line draw", layout: "on the structure, source-px", accent: "magenta lines, white pulse on the failing part" },
  },
];
