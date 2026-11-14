// dash1 (Dashcam "INSTRUMENT") additions to the stat family. The lead merges `extra` into index.ts.
import type { VariantDef } from "../../core";
import { OsdLift } from "./OsdLift";

export const extra: VariantDef[] = [
  {
    family: "stat", name: "OsdLift", component: OsdLift, durationInFrames: 135, thumbFrame: 70, stripFrames: [8, 12, 16, 24, 30, 36, 48, 70],
    defaultProps: {
      media: "demo/clip_fire.mp4", src: [1480, 960, 320, 66], mode: "speed", unit: "km/h", from: 87, value: 112,
      at: 10, setAt: 30, rollAt: 40, flipAt: 64, outAt: 112,
    },
    ref: "REFERENCE_SYNTHESIS §H7: Dashcam Vol.3 OSD kept as evidence (70mai GPS/speed @16:24, @12:21) + Farrell F3b counter GoFundMe 4:08.2 (roll 17 f ease-out, 1 f colour flip) + D1 E6 punch bez(0.33,0,0.12,1) + Caving ring+dim @29:47.6 (dim 12 f, release 18 f)",
    when: "A speed or a clock time the VO states ('doing 112', 'at 10:32'): the dashcam's own readout lifts out of the frame, rolls to the spoken value and flips to the accent on the turn.",
    props: "media, mediaStart, push, src [x,y,w,h] source px, mode speed|clock, unit km/h|mph, from, value (number or 'hh:mm[:ss]'), seconds, at, liftDur (14), scale (2.6), to {x,y}, setAt, rollAt, rollDur (17), flipAt, outAt, dim (0.45), theme",
    twist: "the real OSD pixels lift first, then hand over to D-DIN Exp digits; a feathered blur patch hides the original underneath (no ghost, M-057)",
    sfx: [],
    axes: { geometry: "in-place crop of the source OSD", entry: "punch lift x2.6 + dim, then real-pixels -> re-set hand-over", layout: "readout + small unit", accent: "1 f flip to accent with glow" },
  },
];
