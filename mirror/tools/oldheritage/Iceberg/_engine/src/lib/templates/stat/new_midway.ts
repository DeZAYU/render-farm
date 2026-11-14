// set "midway" (Amusement Park "MIDWAY AFTER DARK", 2026-10-18). Merged into index.ts by the lead.
import type { VariantDef } from "../../core";
import { StuckClock } from "./StuckClock";

export const extra: VariantDef[] = [
  {
    family: "stat", name: "StuckClock", component: StuckClock, durationInFrames: 150, thumbFrame: 70, stripFrames: [6, 10, 16, 23, 60, 100, 120, 121],
    defaultProps: {
      media: "demo/clip_park.mp4", track: [{ f: 0, x: 1180, y: 520 }, { f: 150, x: 1172, y: 516 }], at: 6, format: "h:mm",
      time: [{ f: 6, v: 1200 }, { f: 60, v: 1800 }, { f: 110, v: 7800 }], flipAt: 120, caption: "stranded", flipCaption: "rescued",
    },
    ref: "Farrell FA F3b counter @GoFundMe 4:08.2 (roll 17 f ease-out, hold, 1 f colour flip) + Dashcam Vol.1 E4 '40 minutes' @0:15.6; REFERENCE_SYNTHESIS §I3 / §I4 #4",
    when: "Stranded riders (stuck wheel / coaster car): the elapsed time runs on the car itself while the VO covers the hours; flips to the accent on 'rescued'.",
    props: "media, mediaStart, push, track (source px), dy, at, time [{f,v sec}] (jump-scale by key spacing), format mm:ss|h:mm|h:mm:ss, flipAt, caption, flipCaption, outAt, cell, theme, fire",
    twist: "LED dot-matrix readout (shared kit with LedMarquee) anchored to the tracked car with a leader; piecewise time keys compress hours into seconds",
    sfx: [],
    axes: { geometry: "tracked LED readout above an object", entry: "17 f roll-in, then running clock", layout: "over the car + leader + caption", accent: "neutral LED -> 1 f magenta flip" },
  },
];
