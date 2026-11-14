// set "editorA" (Amusement Park 2026-10-19, EDITOR A siblings: VV continuous-camera motion + Farrell explanation, channel/Waterpark style).
// Merged into index.ts by tools/merge_extras.py.
import type { VariantDef } from "../../core";
import { DateCard_A } from "./DateCard_A";

export const extra: VariantDef[] = [
  {
    family: "title", name: "DateCard-A", component: DateCard_A, durationInFrames: 180, thumbFrame: 160, stripFrames: [0, 4, 40, 46, 52, 60, 110, 160],
    defaultProps: { media: "demo/clip_fire.mp4", kicker: "THE PROSECUTORS' CASE", kickerAt: 4, big: "IN THE PUBLIC INTEREST", bigAt: 40, cap: 120, sub: "THE FIRST TRIAL RESTARTED", subAt: 110 },
    ref: "ChapterCard / TypedDate / TitlePlace siblings; big line wipes in left-to-right behind a leading red bar that shrinks into an underline; footage trucks +18 px/s, block drifts -8 / -4 px/s. Used AP C18.",
    when: "A dated story beat or short chapter title (court date, reopening, verdict) over the case footage defocused 12 px at 36 % (never on black). Hold >= 3 s; at most ~5 Editor A devices per video, never in consecutive cases; Waterpark channel style.",
    props: "media, mediaStart, kicker, kickerAt, big, bigAt, sub, subAt, cap, x, y, redBig",
    twist: "kicker types on first, then the red bar leads the wipe and becomes the underline; sub rises under it",
    sfx: [],
    axes: { geometry: "left title block over defocused footage", entry: "red bar leads a left-to-right wipe", layout: "kicker / big line / sub stacked left", accent: "red bar shrinking into an underline" },
  },
];
