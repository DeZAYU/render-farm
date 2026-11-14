// dash1 (Dashcam "INSTRUMENT") additions to the transition family. The lead merges `extra` into index.ts.
import type { VariantDef } from "../../core";
import { DoubleFlashSkip } from "./DoubleFlashSkip";

export const extra: VariantDef[] = [
  {
    family: "transition", name: "DoubleFlashSkip", component: DoubleFlashSkip, durationInFrames: 60, thumbFrame: 28, stripFrames: [23, 24, 25, 26, 27, 28, 29, 30],
    defaultProps: { a: "demo/clip_party.mp4", b: "demo/clip_park.mp4", cut: 30 },
    ref: "REFERENCE_SYNTHESIS §H12 / B5: Dashcam Vol.2 double-flash skip @7:34.7 (454.7 s), 8:11.2, 15:27.6, 16:30.1 (white 1.0 6 f -> 0.45 2 f -> 0.75 2 f -> 1.0 2 f -> cut = 0.2 s in 60p frames), on the VO return",
    when: "A time skip INSIDE one long dashcam take (the clip jumps ahead), placed on the VO's return. Not for case changes.",
    props: "a/b media or A/B nodes, cut (first incoming frame = VO return), push, unit (0.5 = measured 0.2 s at 30 fps; 1 = 6/2/2/2 f), tint (0.06), tail [] (optional decay), theme",
    twist: "second burst (0.75 -> 1.0) tinted 6 % with the theme accent; optional D3 flash whoosh at -16.3 LU (D2 itself has no SFX)",
    sfx: [],
    axes: { geometry: "full-frame white double burst", entry: "3 f white, 0.45 dip, 0.75 -> 1.0 second burst, cut", layout: "-", accent: "6 % accent-tinted second burst" },
  },
];
