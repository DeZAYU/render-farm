// dash1 (Dashcam "INSTRUMENT") additions to the caseopener family. The lead merges `extra` into index.ts.
import type { VariantDef } from "../../core";
import { OsdLine } from "./OsdLine";

export const extra: VariantDef[] = [
  {
    family: "caseopener", name: "OsdLine", component: OsdLine, durationInFrames: 130, thumbFrame: 84, stripFrames: [0, 2, 4, 6, 14, 24, 50, 84],
    defaultProps: {
      number: "7", media: "demo/clip_park.mp4", numberAt: 0, numberOut: 54, lineOut: 118,
      dateWords: [{ text: "March", at: 14 }, { text: "3,", at: 26 }, { text: "2019", at: 32, red: true }],
      placeWords: [{ text: "Riverside", at: 50 }, { text: "Park,", at: 64 }, { text: "Ohio", at: 76, red: true }],
    },
    ref: "REFERENCE_SYNTHESIS §H2 Direction A 'OSD line': D1 corner numeral #7 @8:19.94 (top-left) + Dashcam Vol.2 E9 @8:23.4 (3-step in 0.2 s) + D1 #15 (out 20 f) + Dashcam Vol.1 E4 typed stamp @2:27.5 (2 f/char) + Abyssal E2 @0:42.62 (block cursor, blink 0.5 s)",
    when: "DROPPED 2026-10-19 (owner-rejected per-video look; TEMPLATE_UPGRADES verdict). Do NOT use in new videos. Was: Dashcam-video case opener: the number lands top-left while date + place type along the bottom OSD band like the camera's own readout, each word on its spoken word.",
    props: "number, dateWords/placeWords [{text,at,red=accent}], media, mediaStart, push, numberAt/numberOut, lineOut (or dateOut/placeOut), step, glyph (150), numX/numY, cap (>=40), x/y (baseline 0.90 H), sep, caps, osdDim [x,y,w,h] source px, blink, theme",
    twist: "one OSD-style line instead of a mid-frame label; accent block cursor; the source's own OSD dims to 50 % under ours (no double print, M-057); D-DIN Exp, no DD red",
    sfx: [{ event: "case_number_hit", at: 0, note: "first numeral step" }, { event: "typing_key", at: 14, note: "one key per character step (2 f) of every word" }],
    axes: { geometry: "top-left numeral + bottom-left OSD band", entry: "3-step numeral, 2 f/char typing with block cursor", layout: "single readout line under a corner numeral", accent: "accent block cursor + accent key words" },
  },
];
